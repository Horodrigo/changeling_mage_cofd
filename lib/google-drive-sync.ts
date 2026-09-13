// INTEGRAÇÃO DESATIVADA: preservada apenas como referência para uma possível
// retomada futura. Nenhum componente da aplicação importa este módulo; portanto,
// ele não é carregado no cliente, não solicita OAuth e não acessa o Google Drive.
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { readHomebrews, saveHomebrews, type HomebrewCatalog } from "./homebrews";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const SNAPSHOT_NAME = "arquivo-das-trevas.json";
export const GOOGLE_DRIVE_SYNC_ENABLED = false;

declare global {
  interface Window {
    google?: { accounts: { oauth2: { initTokenClient(config: {client_id:string;scope:string;callback:(response:{access_token?:string;error?:string})=>void}): {requestAccessToken(options?:{prompt?:string}):void}; revoke(token:string,done:()=>void):void } } };
  }
}

export type DriveSnapshot = {
  schemaVersion: 1;
  exportedAt: string;
  characters: CharacterSheet[];
  homebrews: HomebrewCatalog;
};

let identityPromise: Promise<void> | null = null;
function loadGoogleIdentity() {
  if (window.google) return Promise.resolve();
  if (identityPromise) return identityPromise;
  identityPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Não foi possível carregar a conexão do Google."));
    document.head.appendChild(script);
  });
  return identityPromise;
}

export async function requestDriveToken(clientId: string) {
  if (!GOOGLE_DRIVE_SYNC_ENABLED) throw new Error("A sincronização com Google Drive está desativada.");
  await loadGoogleIdentity();
  return new Promise<string>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      callback: (response) => response.access_token ? resolve(response.access_token) : reject(new Error(response.error || "A conexão com o Google foi cancelada.")),
    });
    client.requestAccessToken({prompt:"consent"});
  });
}

async function driveRequest(token:string, url:string, init:RequestInit={}) {
  const response = await fetch(url, {...init,headers:{Authorization:`Bearer ${token}`,...init.headers}});
  if (!response.ok) throw new Error(response.status===401?"A sessão do Google expirou. Conecte novamente.":"O Google Drive não respondeu corretamente.");
  return response;
}

async function findSnapshot(token:string) {
  const query = encodeURIComponent(`name='${SNAPSHOT_NAME}' and 'appDataFolder' in parents and trashed=false`);
  const response = await driveRequest(token,`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,modifiedTime)&orderBy=modifiedTime desc`);
  const data = await response.json() as {files?:Array<{id:string;modifiedTime:string}>};
  return data.files?.[0] ?? null;
}

async function downloadSnapshot(token:string,id:string):Promise<DriveSnapshot> {
  const response = await driveRequest(token,`https://www.googleapis.com/drive/v3/files/${id}?alt=media`);
  return response.json();
}

async function uploadSnapshot(token:string,snapshot:DriveSnapshot,id?:string) {
  if (id) {
    await driveRequest(token,`https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=media`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(snapshot)});
    return id;
  }
  const boundary=`archive-${crypto.randomUUID()}`;
  const body=`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({name:SNAPSHOT_NAME,parents:["appDataFolder"]})}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(snapshot)}\r\n--${boundary}--`;
  const response=await driveRequest(token,"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",{method:"POST",headers:{"Content-Type":`multipart/related; boundary=${boundary}`},body});
  return ((await response.json()) as {id:string}).id;
}

function mergeById<T extends {id:string}>(remote:T[],local:T[],newer?:(item:T)=>string) {
  const merged=new Map(remote.map(item=>[item.id,item]));
  for(const item of local){const old=merged.get(item.id);if(!old||!newer||newer(item)>=newer(old))merged.set(item.id,item)}
  return [...merged.values()];
}

function mergeHomebrews(remote:HomebrewCatalog,local:HomebrewCatalog):HomebrewCatalog {
  return {...remote,...local,disabledIds:[...new Set([...remote.disabledIds,...local.disabledIds])],kiths:mergeById(remote.kiths,local.kiths),courts:mergeById(remote.courts,local.courts),orders:mergeById(remote.orders,local.orders),contracts:mergeById(remote.contracts,local.contracts),spells:mergeById(remote.spells,local.spells),merits:mergeById(remote.merits,local.merits)};
}

export async function synchronizeDrive(token:string,characters:CharacterSheet[]) {
  if (!GOOGLE_DRIVE_SYNC_ENABLED) throw new Error("A sincronização com Google Drive está desativada.");
  const file=await findSnapshot(token);
  const localHomebrews=readHomebrews();
  const remote=file?await downloadSnapshot(token,file.id):null;
  const mergedCharacters=remote?mergeById(remote.characters,characters,item=>item.updated_at):characters;
  const mergedHomebrews=remote?mergeHomebrews(remote.homebrews,localHomebrews):localHomebrews;
  const snapshot:DriveSnapshot={schemaVersion:1,exportedAt:new Date().toISOString(),characters:mergedCharacters,homebrews:mergedHomebrews};
  await uploadSnapshot(token,snapshot,file?.id);
  saveHomebrews(mergedHomebrews);
  return snapshot;
}
