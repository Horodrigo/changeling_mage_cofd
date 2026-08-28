"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Archive, BookOpen, ChevronRight, Cloud, Database, Download, FileJson, FileText,
  HardDrive, History, LayoutDashboard, Menu, Pencil, Plus, RotateCcw, Search, ShieldCheck, Sparkles,
  Trash2, Upload, UsersRound, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CharacterBuilder, type CharacterSheet } from "./character-builder";
import { ATTRIBUTES, CTL_SEEMINGS, CTL_SEEMING_LABELS, MTA_ORDER_LABELS, SKILLS, SOURCE_CATALOG } from "@/lib/creation-rules";
import { getMeritsForLine, type MeritDefinition } from "@/lib/merits";
import { findKith } from "@/lib/changeling-kiths";
import { CONTRACTS, findContract, type ContractDefinition } from "@/lib/contracts";
import { normalizeClarityDamage, normalizeDamage, powerResourceLimits, woundPenalty, type ClarityDamageLevel, type DamageLevel } from "@/lib/resource-rules";

type View = "inicio" | "personagens" | "fontes" | "regras";
type CatalogRule = {
  id: string; originalName: string; gameLine: string; sourceId: string | null;
  sourcePage: number | null; structuredData: string; reviewStatus: string;
};

const nav = [
  ["inicio", "Visão geral", LayoutDashboard],
  ["personagens", "Personagens", UsersRound],
  ["regras", "Regras compartilhadas", BookOpen],
  ["fontes", "Fontes", Archive],
] as const;

export function Workspace({ displayName, userKey }: { displayName: string; userKey: string }) {
  const [view, setView] = useState<View>("inicio");
  const [characters, setCharacters] = useState<CharacterSheet[]>([]);
  const [catalog, setCatalog] = useState<CatalogRule[]>([]);
  const [selected, setSelected] = useState<CharacterSheet | null>(null);
  const [editing, setEditing] = useState<CharacterSheet | null | "new">(null);
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const storageKey = useMemo(() => `arquivo-das-trevas:v2:${userKey}`, [userKey]);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && !cancelled) setCharacters(parsed);
        } else {
          const legacy = await fetch("/api/characters", { cache: "no-store" });
          if (legacy.ok) {
            const data = await legacy.json();
            const migrated = (data.characters ?? []).map((item: any) => migrateLegacy(item, displayName));
            if (migrated.length && !cancelled) {
              setCharacters(migrated);
              localStorage.setItem(storageKey, JSON.stringify(migrated));
              setNotice(`${migrated.length} ficha(s) antiga(s) foram transferidas para este navegador.`);
            }
          }
        }
      } catch { setNotice("Não foi possível ler o armazenamento local deste navegador."); }
      try {
        const response = await fetch("/api/catalog", { method: "POST" });
        const data = await response.json();
        if (response.ok && !cancelled) setCatalog(data.rules);
      } catch { setNotice("As fichas locais funcionam, mas o catálogo compartilhado não pôde ser atualizado."); }
      if (!cancelled) setReady(true);
    }
    void start();
    return () => { cancelled = true; };
  }, [storageKey, displayName]);

  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify(characters));
  }, [characters, ready, storageKey]);

  function navigate(next: View) {
    setView(next); setSelected(null); setEditing(null); setMobileOpen(false);
  }

  function saveCharacter(sheet: CharacterSheet) {
    setCharacters((current) => {
      const exists = current.some((item) => item.id === sheet.id);
      return exists ? current.map((item) => item.id === sheet.id ? sheet : item) : [sheet, ...current];
    });
    setEditing(null); setSelected(sheet); setView("personagens");
    setNotice("Ficha salva localmente neste navegador. Exporte o JSON para manter uma cópia independente.");
  }

  function updateCharacterState(character: CharacterSheet, currentState: Record<string, unknown>) {
    const sheet = { ...character, current_state: currentState, updated_at: new Date().toISOString() };
    setCharacters((current) => current.map((item) => item.id === sheet.id ? sheet : item));
    setSelected(sheet);
  }

  function updateCharacter(sheet: CharacterSheet) {
    const updated={...sheet,updated_at:new Date().toISOString()};
    setCharacters((current)=>current.map((item)=>item.id===updated.id?updated:item));
    setSelected(updated);
  }

  function deleteCharacter(character: CharacterSheet) {
    setCharacters((current)=>current.filter((item)=>item.id!==character.id));
    setSelected(null); setView("personagens");
    setNotice(`“${character.character.name}” foi excluído deste navegador.`);
  }

  function exportCharacter(character: CharacterSheet) {
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${character.character.name.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.json`;
    anchor.click(); URL.revokeObjectURL(url);
  }

  async function importCharacter(file: File) {
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed.system !== "chronicles-of-darkness" || !["CtL", "MtA"].includes(parsed.game_line)) throw new Error("O JSON não pertence a uma ficha CtL ou MtA compatível.");
      const sheet = parsed.schema_version === 2 ? parsed as CharacterSheet : migrateJsonV1(parsed, displayName);
      setCharacters((current) => [sheet, ...current.filter((item) => item.id !== sheet.id)]);
      setView("personagens"); setSelected(sheet);
      setNotice(`“${sheet.character.name}” foi importado para este navegador.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "JSON inválido."); }
  }

  const title = nav.find(([id]) => id === view)?.[1] ?? "Arquivo";
  if (editing) return <CharacterBuilder player={displayName} initial={editing === "new" ? null : editing} onCancel={() => setEditing(null)} onSave={saveCharacter} />;

  return <main className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Sparkles /></div><div><strong>Arquivo</strong><span>das Trevas</span></div><button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X /></button></div>
      <nav aria-label="Navegação principal">{nav.map(([id,label,Icon]) => <button key={id} className={view === id ? "nav-item active" : "nav-item"} onClick={() => navigate(id)}><Icon /><span>{label}</span>{view === id && <ChevronRight className="nav-chevron" />}</button>)}</nav>
      <div className="storage-card"><HardDrive /><div><strong>Fichas locais</strong><span>Seus personagens ficam neste navegador. As regras são compartilhadas pelo sistema.</span></div></div>
      <div className="profile"><div className="avatar">{displayName.slice(0,1).toUpperCase()}</div><div><strong>{displayName}</strong><span>{characters.length} ficha(s) neste dispositivo</span></div></div>
    </aside>
    <section className="content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu /></button><div><p>Chronicles of Darkness</p><h1>{title}</h1></div><div className="top-actions"><input ref={fileRef} hidden type="file" accept=".json,application/json" onChange={(event) => { const file=event.target.files?.[0]; if(file) void importCharacter(file); event.target.value=""; }} /><Button variant="outline" onClick={() => fileRef.current?.click()}><Upload /> Importar JSON</Button><Button onClick={() => setEditing("new")}><Plus /> Criar ficha</Button></div></header>
      {notice && <div className="notice" role="status"><ShieldCheck /><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Fechar aviso"><X /></button></div>}
      {selected ? <CharacterView character={selected} back={() => setSelected(null)} edit={() => setEditing(selected)} exportSheet={() => exportCharacter(selected)} updateState={(state) => updateCharacterState(selected, state)} updateSheet={updateCharacter} remove={() => deleteCharacter(selected)} /> : view === "inicio" ? <Dashboard characters={characters} catalog={catalog} create={() => setEditing("new")} openCharacters={() => navigate("personagens")} /> : view === "personagens" ? <Characters characters={characters} ready={ready} open={setSelected} create={() => setEditing("new")} /> : view === "regras" ? <RulesCatalog catalog={catalog} /> : <Sources />}
    </section>
    {mobileOpen && <button className="overlay" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />}
  </main>;
}

function Dashboard({ characters, catalog, create, openCharacters }: { characters: CharacterSheet[]; catalog: CatalogRule[]; create: () => void; openCharacters: () => void }) {
  return <div className="page-grid">
    <section className="welcome-panel"><div><Badge className="eyebrow">CRIAÇÃO GUIADA ATIVA</Badge><h2>Crie a ficha agora. Corrija exceções depois.</h2><p>As distribuições e fórmulas são aplicadas automaticamente pelas fontes principais de cada linha.</p><div className="welcome-actions"><Button onClick={create}><Plus /> Nova ficha guiada</Button><Button variant="outline" onClick={openCharacters}>Ver personagens</Button></div></div><div className="sigil" aria-hidden="true"><span>CoD</span></div></section>
    <section className="metrics"><Metric value={String(characters.length)} label="fichas locais" accent="violet" /><Metric value={String(catalog.length)} label="regras compartilhadas" accent="green" /><Metric value="2" label="linhas completas" accent="amber" /><Metric value="13" label="fontes conectadas" accent="blue" /></section>
    <section className="panel wide"><div className="panel-heading"><div><span className="kicker">ARQUITETURA</span><h3>Separação de dados</h3></div></div><div className="storage-split"><div><HardDrive /><strong>Personagens</strong><p>JSON local por navegador e usuário, com importação e exportação.</p></div><div><Database /><strong>Regras</strong><p>Catálogo único no banco, utilizado por todos os usuários do site.</p></div><div><Cloud /><strong>Fontes</strong><p>Core como base, CtL e MtA como livros principais, demais como adjacentes.</p></div></div></section>
  </div>;
}
function Metric({ value,label,accent }: any) { return <div className={`metric ${accent}`}><strong>{value}</strong><span>{label}</span></div>; }

function Characters({ characters, ready, open, create }: { characters: CharacterSheet[]; ready: boolean; open:(item:CharacterSheet)=>void; create:()=>void }) {
  return <section className="panel"><div className="panel-heading"><div><span className="kicker">ARMAZENAMENTO LOCAL</span><h3>Personagens neste navegador</h3><p>Use Exportar JSON para transportar uma ficha para outro dispositivo.</p></div><Button onClick={create}><Plus /> Nova ficha</Button></div>{!ready ? <div className="loading-card">Carregando fichas locais…</div> : characters.length ? <div className="character-grid">{characters.map((character)=><button className="character-card" key={character.id} onClick={()=>open(character)}><div className="character-monogram">{character.character.name.slice(0,1)}</div><div><Badge variant="outline">{character.game_line}</Badge><h3>{character.character.name}</h3><p>{character.character.concept}</p><small>{character.game_line === "CtL" ? String(character.line_data.seeming ?? "Changeling") : String(character.line_data.path ?? "Mage")} · JSON v{character.schema_version}</small></div><ChevronRight /></button>)}</div> : <Empty title="Nenhuma ficha neste navegador" text="Crie um Changeling ou Mago com o assistente de regras." action={create} />}</section>;
}

function CharacterView({ character, back, edit, exportSheet, updateState, updateSheet, remove }: { character: CharacterSheet; back:()=>void; edit:()=>void; exportSheet:()=>void; updateState:(state:Record<string,unknown>)=>void; updateSheet:(sheet:CharacterSheet)=>void; remove:()=>void }) {
  return <section className="sheet-editor"><div className="sheet-toolbar"><Button variant="ghost" onClick={back}>← Personagens</Button><div><Badge>{character.game_line}</Badge><span>Alterações nos marcadores são salvas automaticamente</span></div><div><Button variant="outline" onClick={edit}><Pencil /> Editar</Button><Button variant="outline" onClick={exportSheet}><Download /> Exportar JSON</Button><DeleteCharacterButton name={character.character.name} onDelete={remove}/></div></div><CharacterPaper character={character} updateState={updateState} updateSheet={updateSheet} /></section>;
}

function DeleteCharacterButton({name,onDelete}:{name:string;onDelete:()=>void}) { return <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive"><Trash2/> Excluir</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir “{name}”?</AlertDialogTitle><AlertDialogDescription>A ficha será removida do armazenamento deste navegador. Exporte o JSON antes se quiser conservar uma cópia.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={onDelete}>Excluir definitivamente</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>; }

function CharacterPaper({ character, updateState, updateSheet }: { character: CharacterSheet; updateState:(state:Record<string,unknown>)=>void; updateSheet:(sheet:CharacterSheet)=>void }) {
  const isCtl=character.game_line==="CtL";
  const data=character.line_data;
  const specialties=character.specializations.map((item)=>typeof item==="string"?{skill:"",name:item}:item);
  const aspirations=stringList(data.aspirations);
  const contracts=[...objectList(data.contracts),...objectList(data.learned_contracts)];
  const rotes=objectList(data.rotes);
  const praxes=objectList(data.praxes);
  const arcana=(data.arcana && typeof data.arcana==="object" ? data.arcana : {}) as Record<string,number>;
  const gnosis=Number(data.gnosis??1);
  const powerRating=isCtl?Number(data.wyrd??1):gnosis;
  const resource=powerResourceLimits(powerRating);
  const health=Math.max(1,Number(character.derived.Vitalidade??5));
  const baseWillpower=Math.max(1,Number(character.derived.ForçaDeVontade??1));
  const lostWillpower=isCtl?boundedNumber(character.current_state?.willpower_lost_dots,baseWillpower-1,0):0;
  const willpower=Math.max(1,baseWillpower-lostWillpower);
  const damage=normalizeDamage(character.current_state?.health_damage,health);
  const clarityMaximum=Math.max(1,Number(character.derived.LucidezMaxima??character.derived.ClarezaMaxima??1));
  const clarityDamage=normalizeClarityDamage(character.current_state?.clarity_damage,clarityMaximum);
  const currentWillpower=boundedNumber(character.current_state?.willpower_current,willpower,willpower);
  const resourceKey=isCtl?"glamour_current":"mana_current";
  const currentResource=boundedNumber(character.current_state?.[resourceKey],resource.maximum,resource.maximum);
  const goblinDebt=boundedNumber(character.current_state?.goblin_debt,9,0);
  const expandedMerits=character.merits.filter((item)=>isExpandedMerit(item.name));
  const principalMerits=character.merits.filter((item)=>!isExpandedMerit(item.name));
  const setState=(key:string,value:unknown)=>updateState({...character.current_state,[key]:value});
  return <article className={`cod-sheet ${isCtl?"ctl-sheet":"mta-sheet"}`}>
    <header className="cod-sheet-title"><div><span>{isCtl?"CHANGELING":"MAGO"}</span><strong>{isCtl?"OS PERDIDOS":"O DESPERTAR"}</strong></div><p>CRÔNICAS DAS TREVAS</p></header>
    {isCtl?<Tabs defaultValue="principal" className="ctl-sheet-tabs"><TabsList className="ctl-sheet-tab-list" aria-label="Páginas da ficha"><TabsTrigger value="principal">Principal</TabsTrigger><TabsTrigger value="poderes">Poderes</TabsTrigger></TabsList><TabsContent value="principal" className="ctl-sheet-page">
    <section className="sheet-identity-grid">
      <SheetField label="Nome" value={character.character.name}/><SheetField label="Agulha" value={data.needle}/><SheetField label="Feição" value={CTL_SEEMING_LABELS[String(data.seeming)]??data.seeming}/><SheetField label="Jogador" value={character.character.player}/><SheetField label="Fio" value={data.thread}/><SheetField label="Fratria" value={data.kith}/><SheetField label="Crônica" value=""/><SheetField label="Conceito" value={character.character.concept}/><SheetField label="Corte" value={data.court}/>
    </section>
    <SheetHeading>Atributos</SheetHeading>
    <div className="official-trait-grid">{Object.entries(ATTRIBUTES).map(([category,names])=><TraitBlock key={category} title={category} names={names} values={character.attributes}/>)}</div>
    <div className="official-sheet-body">
      <div className="sheet-skills-column"><SheetHeading>Perícias</SheetHeading>{Object.entries(SKILLS).map(([category,names])=><TraitBlock key={category} title={category} names={names} values={character.skills} specialties={specialties}/>)}</div>
      <div className="sheet-center-column">
        <SheetHeading>Méritos</SheetHeading><MeritSheetList merits={principalMerits} line={character.game_line}/>
        <SheetHeading>Regalias Favorecidas</SheetHeading><LineList items={[String(data.primary_regalia??""),String(data.second_regalia??"")]}/>
        <SheetHeading>Fragilidades</SheetHeading><div className="blank-lines">{Array.from({length:3},(_,index)=><i key={index}/>)}</div>
        <SheetHeading>Aspirações</SheetHeading><LineList items={aspirations}/>
        <SheetHeading>Lucidez</SheetHeading><ClarityTrack maximum={clarityMaximum} damage={clarityDamage} onChange={(value)=>setState("clarity_damage",value)}/>
        <SheetHeading>Pedras de Contato</SheetHeading><LineList items={[String(data.touchstone??"")]}/>
      </div>
      <div className="sheet-right-column">
        <SheetHeading>Vitalidade</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value)=>setState("health_damage",value)}/>
        <SheetHeading>Força de Vontade</SheetHeading><ResourceTrack label="Força de Vontade" current={currentWillpower} maximum={willpower} onChange={(value)=>setState("willpower_current",value)}/>
        <SheetHeading>Características da Linha</SheetHeading>
        <PowerResource name="Fado" rating={powerRating} resourceName="Glamour" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value)=>setState(resourceKey,value)}/>
        <SheetHeading>Outras Características</SheetHeading><CompactValues values={{...character.derived,ForçaDeVontade:willpower}}/>
        <ExperiencePanel character={character} updateSheet={updateSheet}/>
      </div>
    </div>
    <div className="sheet-bottom-grid"><section><SheetHeading>Condições de Lucidez</SheetHeading><div className="blank-lines">{Array.from({length:6},(_,index)=><i key={index}/>)}</div></section><section><SheetHeading>Condições e Anotações</SheetHeading><div className="blank-lines">{Array.from({length:6},(_,index)=><i key={index}/>)}</div></section></div>
    </TabsContent><TabsContent value="poderes" className="ctl-sheet-page powers-page"><SheetHeading>Contratos</SheetHeading><ContractPowerList contracts={contracts} seeming={String(data.seeming??"")} extraBenefits={objectList(data.extra_contract_benefits)}/><div className="powers-sheet-grid"><section><SheetHeading>Outras Características</SheetHeading><SeemingLore seeming={String(data.seeming??"")}/><KithLore data={data}/><GoblinDebtTrack value={goblinDebt} onChange={(value)=>setState("goblin_debt",value)}/></section><section><SheetHeading>Juramentos</SheetHeading><div className="blank-lines">{Array.from({length:8},(_,index)=><i key={index}/>)}</div><SheetHeading>Méritos Expandidos</SheetHeading><MeritSheetList merits={expandedMerits} line="CtL"/></section></div><div className="combat-summary"><SheetHeading>Combate</SheetHeading><CompactValues values={{Vitalidade:health,"Força de Vontade":willpower,Defesa:Number(character.derived.Defesa??0),Iniciativa:Number(character.derived.Iniciativa??0),Deslocamento:Number(character.derived.Deslocamento??0),Tamanho:Number(character.derived.Tamanho??5)}}/></div></TabsContent></Tabs>:
    <><section className="sheet-identity-grid"><SheetField label="Nome" value={character.character.name}/><SheetField label="Caminho" value={data.path}/><SheetField label="Ferramenta dedicada" value={data.dedicated_tool}/><SheetField label="Jogador" value={character.character.player}/><SheetField label="Ordem" value={MTA_ORDER_LABELS[String(data.order)]??data.order}/><SheetField label="Nimbus" value={data.nimbus}/><SheetField label="Vício" value={data.vice}/><SheetField label="Virtude" value={data.virtue}/><SheetField label="Conceito" value={character.character.concept}/></section><SheetHeading>Atributos</SheetHeading><div className="official-trait-grid">{Object.entries(ATTRIBUTES).map(([category,names])=><TraitBlock key={category} title={category} names={names} values={character.attributes}/>)}</div><div className="official-sheet-body"><div className="sheet-skills-column"><SheetHeading>Perícias</SheetHeading>{Object.entries(SKILLS).map(([category,names])=><TraitBlock key={category} title={category} names={names} values={character.skills} specialties={specialties}/>)}</div><div className="sheet-center-column"><SheetHeading>Arcanos</SheetHeading><div className="arcana-sheet-list">{Object.entries(arcana).map(([name,value])=><TraitLine key={name} name={name} value={Number(value)}/>)}</div><SheetHeading>Rotas e Práxis</SheetHeading><SpellSheetList rotes={rotes} praxes={praxes}/><SheetHeading>Méritos</SheetHeading><MeritSheetList merits={character.merits} line={character.game_line}/></div><div className="sheet-right-column"><SheetHeading>Vitalidade</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value)=>setState("health_damage",value)}/><SheetHeading>Força de Vontade</SheetHeading><ResourceTrack label="Força de Vontade" current={currentWillpower} maximum={willpower} onChange={(value)=>setState("willpower_current",value)}/><SheetHeading>Características da Linha</SheetHeading><PowerResource name="Gnose" rating={powerRating} resourceName="Mana" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value)=>setState(resourceKey,value)}/><CompactValues values={{Sabedoria:Number(data.wisdom??7)}}/><SheetHeading>Outras Características</SheetHeading><CompactValues values={character.derived}/></div></div><div className="sheet-bottom-grid"><section><SheetHeading>Aspirações</SheetHeading><LineList items={aspirations}/></section><section><SheetHeading>Condições e Anotações</SheetHeading><div className="blank-lines">{Array.from({length:6},(_,index)=><i key={index}/>)}</div></section></div></>}
  </article>;
}

function SheetHeading({children}:{children:ReactNode}) { return <h3 className="official-heading"><span>{children}</span></h3>; }
function SheetField({label,value}:{label:string;value:unknown}) { return <div className="official-field"><span>{label}</span><strong>{String(value??"")}</strong></div>; }
function TraitBlock({title,names,values,specialties=[]}:{title:string;names:readonly string[];values:Record<string,number>;specialties?:Array<{skill:string;name:string}>}) { return <section className="official-trait-block"><h4>{title}</h4>{names.map((name)=><TraitLine key={name} name={name} value={values[name]??0} note={specialties.filter((item)=>item.skill===name).map((item)=>item.name).join(", ")}/>)}</section>; }
function TraitLine({name,value,note}:{name:string;value:number;note?:string}) { return <div className="official-trait-line"><span>{name}{note&&<small>{note}</small>}</span><DotValue value={value}/></div>; }
function DotValue({value,max=5}:{value:number;max?:number}) { return <span className="official-dots" aria-label={`${value} pontos`}>{Array.from({length:max},(_,index)=><i key={index} className={index<value?"on":""}/>)}</span>; }
function CompactValues({values}:{values:Record<string,number>}) { return <div className="compact-values">{Object.entries(values).map(([name,value])=><div key={name}><span>{pretty(name)}</span><strong>{value}</strong></div>)}</div>; }
function HealthTrack({health,damage,onChange}:{health:number;damage:DamageLevel[];onChange:(value:DamageLevel[])=>void}) {
  const penalty=woundPenalty(damage,health);
  const cycle=(index:number)=>{
    const slots=Array.from({length:health},(_,slot)=>damage[slot]);
    const current=slots[index];
    slots[index]=current==="bashing"?"lethal":current==="lethal"?"aggravated":current==="aggravated"?undefined:"bashing";
    onChange(normalizeDamage(slots,health));
  };
  return <div className="tracker-block"><div className="health-track" role="group" aria-label={`Vitalidade: ${damage.length} de ${health} caixas marcadas`}>{Array.from({length:health},(_,index)=>{const level=damage[index];return <button type="button" key={index} className={`health-box ${level??"empty"}`} onClick={()=>cycle(index)} aria-label={`Caixa ${index+1}: ${damageLabel(level)}. Clique para alterar.`}><span aria-hidden="true"/></button>;})}</div><div className="tracker-meta"><span>{damage.length}/{health} marcadas</span><strong className={penalty<0?"penalty":""}>Penalidade {penalty||"—"}</strong></div><p className="tracker-help"><span className="legend-mark bashing"/>Contusão <span className="legend-mark lethal"/>Letal <span className="legend-mark aggravated"/>Agravado · clique para alternar</p></div>;
}
function ClarityTrack({maximum,damage,onChange}:{maximum:number;damage:ClarityDamageLevel[];onChange:(value:ClarityDamageLevel[])=>void}) {
  const current=Math.max(0,maximum-damage.length);
  const cycle=(index:number)=>{const slots=Array.from({length:maximum},(_,slot)=>damage[slot]);const level=slots[index];slots[index]=level==="mild"?"severe":level==="severe"?undefined:"mild";onChange(normalizeClarityDamage(slots,maximum));};
  return <div className="tracker-block clarity-block"><div className="health-track clarity-track" role="group" aria-label={`Lucidez atual ${current} de ${maximum}`}>{Array.from({length:maximum},(_,index)=>{const level=damage[index];return <button type="button" key={index} className={`health-box clarity-box ${level??"empty"}`} onClick={()=>cycle(index)} aria-label={`Caixa ${index+1}: ${level==="mild"?"dano leve":level==="severe"?"dano grave":"vazia"}. Clique para alterar.`}><span aria-hidden="true"/></button>;})}</div><div className="clarity-numbers" aria-hidden="true">{Array.from({length:maximum},(_,index)=><span key={index}>{index+1}</span>)}</div><div className="tracker-meta"><span>Lucidez atual</span><strong>{current} / {maximum}</strong></div><p className="tracker-help"><span className="legend-mark mild"/>Leve <span className="legend-mark severe"/>Grave · as três caixas à direita podem gerar Condições de Lucidez</p></div>;
}
type ExperienceUndo=
  | {kind:"trait";group:"attributes"|"skills";name:string;previous:number}
  | {kind:"merit";name:string;previousDots:number|null}
  | {kind:"specialty";skill:string;name:string}
  | {kind:"contract";id:string}
  | {kind:"benefit";contractId:string;seeming:string}
  | {kind:"wyrd";previous:number}
  | {kind:"willpower";previousLost:number};
type ExperienceEntry={id:string;kind:"spend";description:string;experience:number;createdAt:string;undo?:ExperienceUndo};
const PURCHASE_TYPES=["Atributo","Perícia","Mérito","Especialização","Contrato","Benefício de Contrato","Fado","Ponto perdido de Força de Vontade"];

function ExperiencePanel({character,updateSheet}:{character:CharacterSheet;updateSheet:(sheet:CharacterSheet)=>void}) {
  const state=character.current_state??{};
  const beats=boundedNumber(state.experience_beats,5,0);
  const legacyTotal=Math.max(0,Math.trunc(Number(state.experience_total??0)||0));
  const spentXp=Math.max(0,Math.trunc(Number(state.experience_spent??0)||0));
  const available=Math.max(0,Math.trunc(Number(state.experience_available??Math.max(0,legacyTotal-spentXp))||0));
  const total=available+spentXp;
  const history=(Array.isArray(state.experience_history)?state.experience_history as ExperienceEntry[]:[]).filter((entry)=>entry.kind==="spend");
  const [experienceInput,setExperienceInput]=useState(String(available));
  const [purchaseType,setPurchaseType]=useState(PURCHASE_TYPES[0]);
  const [attribute,setAttribute]=useState(Object.values(ATTRIBUTES).flat()[0]);
  const [skill,setSkill]=useState(Object.values(SKILLS).flat()[0]);
  const [meritId,setMeritId]=useState("");
  const [specialtySkill,setSpecialtySkill]=useState(Object.values(SKILLS).flat()[0]);
  const [specialtyName,setSpecialtyName]=useState("");
  const [contractId,setContractId]=useState("");
  const [benefitKey,setBenefitKey]=useState("");
  const [feedback,setFeedback]=useState("");
  const merits=getMeritsForLine("CtL");
  const ownedContracts=[...objectList(character.line_data.contracts),...objectList(character.line_data.learned_contracts)];
  const ownedContractIds=new Set(ownedContracts.map((item)=>String(item.id??"")));
  const contractOptions=CONTRACTS.filter((item)=>!ownedContractIds.has(item.id));
  const extraBenefits=objectList(character.line_data.extra_contract_benefits);
  const extraKeys=new Set(extraBenefits.map((item)=>`${String(item.contractId)}::${String(item.seeming)}`));
  const benefitOptions=ownedContracts.flatMap((saved)=>{const definition=findContract(String(saved.id??saved.name??""));return definition?Object.keys(definition.seemingBenefits??{}).filter((seeming)=>seeming!==String(character.line_data.seeming) && !extraKeys.has(`${definition.id}::${seeming}`)).map((seeming)=>({value:`${definition.id}::${seeming}`,label:`${definition.name} · ${CTL_SEEMING_LABELS[seeming]??seeming}`})):[];});
  const selectedMerit=merits.find((item)=>item.id===meritId)??merits[0];
  const ownedMerit=selectedMerit?character.merits.find((item)=>item.name===selectedMerit.name):undefined;
  const nextMeritRating=selectedMerit?.ratings.find((rating)=>rating>(ownedMerit?.dots??0));
  const selectedContract=CONTRACTS.find((item)=>item.id===contractId)??contractOptions[0];
  const wyrd=Math.max(1,Number(character.line_data.wyrd??1));
  const traitMaximum=Math.max(5,wyrd);
  const lostWillpower=boundedNumber(state.willpower_lost_dots,Math.max(0,Number(character.derived.ForçaDeVontade??1)-1),0);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>setExperienceInput(String(available)),[available]);
  function setBeats(value:number) { const next=structuredClone(character);next.current_state={...next.current_state,experience_beats:value,experience_history:history};updateSheet(next); }
  function commitAvailableExperience() { const value=Math.max(0,Math.trunc(Number(experienceInput)||0));setExperienceInput(String(value));const next=structuredClone(character);next.current_state={...next.current_state,experience_available:value,experience_spent:spentXp,experience_total:value+spentXp,experience_history:history};updateSheet(next);setFeedback("Experiência disponível atualizada."); }
  function append(entry:ExperienceEntry,nextState:Record<string,unknown>) { nextState.experience_history=[entry,...history].slice(0,100); }
  function markWillpowerLoss() { const maximum=Math.max(0,Number(character.derived.ForçaDeVontade??1)-1);if(lostWillpower>=maximum)return;const next=structuredClone(character);next.current_state={...next.current_state,willpower_lost_dots:lostWillpower+1,experience_history:history};updateSheet(next);setFeedback("Perda permanente de Força de Vontade registrada."); }
  function spend(cost:number,description:string,undo:ExperienceUndo,apply:(next:CharacterSheet)=>void) { if(cost<1||available<cost){setFeedback("Experiência disponível insuficiente para esta compra.");return;}const next=structuredClone(character);apply(next);const nextAvailable=available-cost;const nextSpent=spentXp+cost;const nextState={...next.current_state,experience_available:nextAvailable,experience_spent:nextSpent,experience_total:nextAvailable+nextSpent};append({id:crypto.randomUUID(),kind:"spend",description,experience:-cost,createdAt:new Date().toISOString(),undo},nextState);next.current_state=nextState;updateSheet(next);setFeedback(`${description} adquirido por ${cost} Experiência${cost===1?"":"s"}.`); }
  function revertPurchase(entry:ExperienceEntry) { if(!entry.undo)return setFeedback("Esta compra antiga não contém dados suficientes para ser revertida.");const next=structuredClone(character);const undo=entry.undo;if(undo.kind==="trait")next[undo.group][undo.name]=undo.previous;else if(undo.kind==="merit"){const index=next.merits.findIndex((item)=>item.name===undo.name);if(undo.previousDots===null){if(index>=0)next.merits.splice(index,1);}else if(index>=0)next.merits[index].dots=undo.previousDots;}else if(undo.kind==="specialty"){const index=next.specializations.map((item)=>`${item.skill}::${item.name}`).lastIndexOf(`${undo.skill}::${undo.name}`);if(index>=0)next.specializations.splice(index,1);}else if(undo.kind==="contract")next.line_data={...next.line_data,learned_contracts:objectList(next.line_data.learned_contracts).filter((item)=>String(item.id)!==undo.id)};else if(undo.kind==="benefit")next.line_data={...next.line_data,extra_contract_benefits:objectList(next.line_data.extra_contract_benefits).filter((item)=>!(String(item.contractId)===undo.contractId&&String(item.seeming)===undo.seeming))};else if(undo.kind==="wyrd")next.line_data={...next.line_data,wyrd:undo.previous};else next.current_state={...next.current_state,willpower_lost_dots:undo.previousLost};const refund=Math.abs(entry.experience);const nextAvailable=available+refund;const nextSpent=Math.max(0,spentXp-refund);next.current_state={...next.current_state,experience_available:nextAvailable,experience_spent:nextSpent,experience_total:nextAvailable+nextSpent,experience_history:history.filter((item)=>item.id!==entry.id)};recalculateCtlDerived(next);updateSheet(next);setFeedback(`${entry.description} foi revertido; ${refund} EXP devolvida.`); }
  function buy() {
    if(purchaseType==="Atributo") { const current=Number(character.attributes[attribute]??1); if(current>=traitMaximum)return setFeedback("Este Atributo já atingiu o máximo permitido pelo Fado."); const target=current+1; spend(4,`${attribute} ${target}`,{kind:"trait",group:"attributes",name:attribute,previous:current},next=>{next.attributes[attribute]=target;recalculateCtlDerived(next);}); return; }
    if(purchaseType==="Perícia") { const current=Number(character.skills[skill]??0); if(current>=traitMaximum)return setFeedback("Esta Perícia já atingiu o máximo permitido pelo Fado."); const target=current+1; spend(2,`${skill} ${target}`,{kind:"trait",group:"skills",name:skill,previous:current},next=>{next.skills[skill]=target;recalculateCtlDerived(next);}); return; }
    if(purchaseType==="Mérito") { if(!selectedMerit||!nextMeritRating)return setFeedback("Este Mérito não possui outro nível disponível."); const current=ownedMerit?.dots??0; const cost=nextMeritRating-current; spend(cost,`${selectedMerit.translatedName} ${nextMeritRating}`,{kind:"merit",name:selectedMerit.name,previousDots:ownedMerit?.dots??null},next=>{const found=next.merits.find((item)=>item.name===selectedMerit.name);if(found)found.dots=nextMeritRating;else next.merits.push({name:selectedMerit.name,dots:nextMeritRating,sourceId:selectedMerit.sourceId,source:selectedMerit.source});}); return; }
    if(purchaseType==="Especialização") { if(!specialtyName.trim())return setFeedback("Informe o nome da Especialização."); const name=specialtyName.trim();spend(1,`Especialização ${specialtySkill}: ${name}`,{kind:"specialty",skill:specialtySkill,name},next=>next.specializations.push({skill:specialtySkill,name})); setSpecialtyName(""); return; }
    if(purchaseType==="Contrato") { if(!selectedContract)return setFeedback("Não há Contrato disponível para esta compra."); const cost=contractExperienceCost(selectedContract,character); spend(cost,`Contrato ${selectedContract.name}`,{kind:"contract",id:selectedContract.id},next=>{const learned=objectList(next.line_data.learned_contracts);next.line_data={...next.line_data,learned_contracts:[...learned,{...selectedContract}]};}); return; }
    if(purchaseType==="Benefício de Contrato") { const value=benefitKey||benefitOptions[0]?.value;if(!value)return setFeedback("Não há Benefício de outra Feição disponível.");const [chosenContract,seeming]=value.split("::");const definition=findContract(chosenContract);spend(1,`Benefício de ${CTL_SEEMING_LABELS[seeming]??seeming} · ${definition?.name??"Contrato"}`,{kind:"benefit",contractId:chosenContract,seeming},next=>{const existing=objectList(next.line_data.extra_contract_benefits);next.line_data={...next.line_data,extra_contract_benefits:[...existing,{contractId:chosenContract,seeming}]};});return; }
    if(purchaseType==="Fado") { if(wyrd>=10)return setFeedback("Fado já atingiu 10."); spend(5,`Fado ${wyrd+1}`,{kind:"wyrd",previous:wyrd},next=>{next.line_data={...next.line_data,wyrd:wyrd+1};});return; }
    if(!lostWillpower)return setFeedback("O personagem não possui pontos permanentes de Força de Vontade perdidos."); spend(1,"Recuperação de um ponto perdido de Força de Vontade",{kind:"willpower",previousLost:lostWillpower},next=>{next.current_state={...next.current_state,willpower_lost_dots:lostWillpower-1};});
  }
  const preview=purchasePreview({purchaseType,character,attribute,skill,selectedMerit,nextMeritRating,ownedMerit,selectedContract,specialtySkill,specialtyName,benefitKey:benefitKey||benefitOptions[0]?.value,wyrd,lostWillpower});
  return <section className="experience-panel"><div className="experience-title"><div><span>Beats e Experiência</span><small>Beats são marcados separadamente da Experiência</small></div><Badge variant="outline">{available} EXP disponível</Badge></div><div className="experience-totals"><label className="experience-input"><Input type="number" min={0} step={1} inputMode="numeric" value={experienceInput} onChange={(event)=>setExperienceInput(event.target.value)} onBlur={commitAvailableExperience} onKeyDown={(event)=>{if(event.key==="Enter")event.currentTarget.blur();}} aria-label="Experiência disponível"/><span>EXP disponível</span></label><div><strong>{total}</strong><span>EXP total</span></div><div><strong>{spentXp}</strong><span>EXP gasta</span></div></div><fieldset className="beat-controls"><legend>Beats</legend>{Array.from({length:5},(_,index)=>{const value=index+1;return <label key={value} title={`${value} Beat${value===1?"":"s"}`}><input type="radio" name={`beats-${character.id}`} checked={beats===value} onChange={()=>setBeats(value)}/><span>{value}</span></label>;})}<Button type="button" size="sm" variant="ghost" disabled={!beats} onClick={()=>setBeats(0)}>Limpar</Button></fieldset><div className="experience-actions"><Dialog><DialogTrigger asChild><Button type="button" variant="outline"><Sparkles/> Comprar característica</Button></DialogTrigger><DialogContent className="experience-dialog"><DialogHeader><DialogTitle>Gastar Experiência</DialogTitle><DialogDescription>Custos de Changeling the Lost, p. 94. Cada compra registra automaticamente a despesa e atualiza a ficha.</DialogDescription></DialogHeader><div className="experience-purchase-form"><label>Tipo<RuleSelect value={purchaseType} onChange={(value)=>{setPurchaseType(value);setFeedback("");}} options={PURCHASE_TYPES.map((value)=>({value,label:value}))}/></label>{purchaseType==="Atributo"&&<label>Atributo<RuleSelect value={attribute} onChange={setAttribute} options={Object.values(ATTRIBUTES).flat().map((value)=>({value,label:value}))}/></label>}{purchaseType==="Perícia"&&<label>Perícia<RuleSelect value={skill} onChange={setSkill} options={Object.values(SKILLS).flat().map((value)=>({value,label:value}))}/></label>}{purchaseType==="Mérito"&&<label>Mérito<RuleSelect value={meritId||merits[0]?.id||""} onChange={setMeritId} options={merits.map((item)=>({value:item.id,label:`${item.translatedName} · ${item.source}`}))}/></label>}{purchaseType==="Especialização"&&<><label>Perícia<RuleSelect value={specialtySkill} onChange={setSpecialtySkill} options={Object.values(SKILLS).flat().map((value)=>({value,label:value}))}/></label><label>Especialização<Input value={specialtyName} onChange={(event)=>setSpecialtyName(event.target.value)} maxLength={80}/></label></>}{purchaseType==="Contrato"&&<label>Contrato<RuleSelect value={contractId||contractOptions[0]?.id||""} onChange={setContractId} options={contractOptions.map((item)=>({value:item.id,label:`${item.name} · ${item.type} · ${item.regalia}`}))}/></label>}{purchaseType==="Benefício de Contrato"&&<label>Benefício<RuleSelect value={benefitKey||benefitOptions[0]?.value||""} onChange={setBenefitKey} options={benefitOptions}/></label>}</div><div className="purchase-preview"><strong>{preview.label}</strong><span>{preview.cost} Experiência{preview.cost===1?"":"s"}</span></div>{feedback&&<p className="experience-feedback">{feedback}</p>}<details className="experience-rules"><summary>Tabela completa e formas de ganhar Beats</summary><ExperienceRules/></details><DialogFooter><DialogClose asChild><Button variant="outline">Fechar</Button></DialogClose><Button type="button" disabled={preview.cost<1||available<preview.cost} onClick={buy}>Comprar por {preview.cost} EXP</Button></DialogFooter></DialogContent></Dialog><Button type="button" variant="ghost" size="sm" onClick={markWillpowerLoss}>Registrar perda permanente de FV</Button></div>{feedback&&<p className="experience-feedback compact">{feedback}</p>}<details className="experience-history"><summary><History/> Gastos de Experiência ({history.length})</summary><div>{history.length?history.slice(0,12).map((entry)=><p key={entry.id}><span>{entry.description}</span><strong>{Math.abs(entry.experience)} EXP</strong><small>{new Date(entry.createdAt).toLocaleDateString("pt-BR")}</small><Button type="button" size="sm" variant="ghost" disabled={!entry.undo} onClick={()=>revertPurchase(entry)}><RotateCcw/> Reverter</Button></p>):<em>Nenhum gasto registrado.</em>}</div></details></section>;
}

function RuleSelect({value,onChange,options}:{value:string;onChange:(value:string)=>void;options:Array<{value:string;label:string}>}) { const safe=options.length?value||options[0].value:"__none"; return <Select value={safe} onValueChange={onChange} disabled={!options.length}><SelectTrigger><SelectValue>{options.find((item)=>item.value===safe)?.label??"Nenhuma opção disponível"}</SelectValue></SelectTrigger><SelectContent>{options.length?options.map((item)=><SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>):<SelectItem value="__none" disabled>Nenhuma opção disponível</SelectItem>}</SelectContent></Select>; }
function contractExperienceCost(contract:ContractDefinition,character:CharacterSheet) { if(contract.goblin)return 2;const favored=[String(character.line_data.primary_regalia??""),String(character.line_data.second_regalia??"")].includes(contract.regalia);return contract.type==="Comum"?(favored?2:3):(favored?3:4); }
function purchasePreview(input:{purchaseType:string;character:CharacterSheet;attribute:string;skill:string;selectedMerit?:MeritDefinition;nextMeritRating?:number;ownedMerit?:CharacterSheet["merits"][number];selectedContract?:ContractDefinition;specialtySkill:string;specialtyName:string;benefitKey?:string;wyrd:number;lostWillpower:number}) { const {purchaseType,character}=input;if(purchaseType==="Atributo"){const target=Number(character.attributes[input.attribute]??1)+1;return{label:`${input.attribute} ${target}`,cost:4};}if(purchaseType==="Perícia"){const target=Number(character.skills[input.skill]??0)+1;return{label:`${input.skill} ${target}`,cost:2};}if(purchaseType==="Mérito")return{label:input.nextMeritRating?`${input.selectedMerit?.translatedName} ${input.nextMeritRating}`:"Sem nível adicional",cost:input.nextMeritRating?input.nextMeritRating-(input.ownedMerit?.dots??0):0};if(purchaseType==="Especialização")return{label:`${input.specialtySkill}: ${input.specialtyName||"nova Especialização"}`,cost:1};if(purchaseType==="Contrato")return{label:input.selectedContract?.name??"Nenhum Contrato disponível",cost:input.selectedContract?contractExperienceCost(input.selectedContract,character):0};if(purchaseType==="Benefício de Contrato")return{label:input.benefitKey?"Benefício de outra Feição":"Nenhum Benefício disponível",cost:input.benefitKey?1:0};if(purchaseType==="Fado")return{label:input.wyrd<10?`Fado ${input.wyrd+1}`:"Fado máximo",cost:input.wyrd<10?5:0};return{label:input.lostWillpower?"Recuperar ponto perdido de Força de Vontade":"Nenhum ponto perdido",cost:input.lostWillpower?1:0}; }
function recalculateCtlDerived(sheet:CharacterSheet) { const a=sheet.attributes,s=sheet.skills;sheet.derived={...sheet.derived,Tamanho:5,Vitalidade:5+Number(a.Vigor??1),Deslocamento:5+Number(a.Força??1)+Number(a.Destreza??1),ForçaDeVontade:Number(a.Perseverança??1)+Number(a.Autocontrole??1),Iniciativa:Number(a.Destreza??1)+Number(a.Autocontrole??1),Defesa:Math.min(Number(a.Destreza??1),Number(a.Raciocínio??1))+Number(s.Esportes??0),LucidezMaxima:Number(a.Raciocínio??1)+Number(a.Autocontrole??1)}; }
function ExperienceRules() { const beatRows=["Cumprir uma Aspiração","Resolver uma Condição","Aceitar uma falha dramática","Render-se em combate","Sofrer dano nas caixas finais de Vitalidade","Encerrar uma sessão","Sofrer dano de Lucidez","Liberar Desvario involuntariamente"];const costRows=[["Atributo","4 por ponto"],["Perícia","2 por ponto"],["Mérito","1 por ponto"],["Especialização","1"],["Contrato favorecido","Comum 2 · Real 3"],["Contrato não favorecido","Comum 3 · Real 4"],["Contrato Goblin","2"],["Benefício de outra Feição","1"],["Fado","5 por ponto"],["Ponto perdido de Força de Vontade","1"]];return <div className="experience-rules-grid"><table><caption>Formas de ganhar Beats</caption><tbody>{beatRows.map((label)=><tr key={label}><td>{label}</td><td>1 Beat</td></tr>)}</tbody></table><table><caption>Tabela de custos</caption><thead><tr><th>Característica</th><th>EXP</th></tr></thead><tbody>{costRows.map(([label,cost])=><tr key={label}><td>{label}</td><td>{cost}</td></tr>)}</tbody></table></div>; }
function GoblinDebtTrack({value,onChange}:{value:number;onChange:(value:number)=>void}) { return <div className="goblin-debt-block"><h4>Débito Goblin</h4><div className="goblin-debt-track" role="group" aria-label={`Débito Goblin: ${value} de 9`}>{Array.from({length:9},(_,index)=><button type="button" key={index} className={index<value?"filled":""} onClick={()=>onChange(index<value?index:index+1)} aria-label={`Definir Débito Goblin como ${index<value?index:index+1}`}/>)}</div><p>{value}/9 · ao receber o décimo ponto, o personagem adquire a Condição Habitante da Sebe.</p></div>; }
function ResourceTrack({label,current,maximum,onChange}:{label:string;current:number;maximum:number;onChange:(value:number)=>void}) { return <div className="tracker-block"><div className="resource-track" role="group" aria-label={`${label}: ${current} de ${maximum}`}>{Array.from({length:maximum},(_,index)=><button type="button" key={index} className={index<current?"filled":""} onClick={()=>onChange(index<current?index:index+1)} aria-label={`Definir ${label} como ${index<current?index:index+1}`}/>)}</div><div className="tracker-meta"><span>Atual</span><strong>{current} / {maximum}</strong></div></div>; }
function PowerResource({name,rating,resourceName,current,maximum,perTurn,onChange}:{name:string;rating:number;resourceName:string;current:number;maximum:number;perTurn:number;onChange:(value:number)=>void}) { return <div className="power-resource"><div className="power-rating"><span>{name}</span><DotValue value={rating} max={10}/></div><ResourceTrack label={resourceName} current={current} maximum={maximum} onChange={onChange}/><p className="tracker-help">{resourceName} máximo: <strong>{maximum}</strong> · gasto por turno: <strong>{perTurn}</strong></p></div>; }
function damageLabel(value:DamageLevel|undefined) { return value==="bashing"?"dano de contusão":value==="lethal"?"dano letal":value==="aggravated"?"dano agravado":"vazia"; }
function boundedNumber(value:unknown,maximum:number,fallback:number) { const number=Number(value); return Number.isFinite(number)?Math.max(0,Math.min(maximum,Math.trunc(number))):fallback; }
function LineList({items}:{items:string[]}) { return <div className="official-lines">{items.filter(Boolean).map((item,index)=><div key={`${item}-${index}`}>{item}</div>)}{!items.filter(Boolean).length&&<div>&nbsp;</div>}</div>; }
function MeritSheetList({merits,line}:{merits:CharacterSheet["merits"];line:"CtL"|"MtA"}) { const catalog=getMeritsForLine(line); return <div className="sheet-merits single-column">{merits.length?merits.map((item,index)=>{ const definition=catalog.find((entry)=>entry.name===item.name); const tooltip=definition ? `${definition.description}${definition.prerequisites?`\nPré-requisitos: ${definition.prerequisites}`:""}` : item.source; return <div key={`${item.name}-${index}`} title={tooltip}><span>{definition?.translatedName??item.name}</span><DotValue value={item.dots} max={Math.max(5,item.dots)}/></div>; }):<em>Nenhum Mérito selecionado</em>}</div>; }
function ContractSheetList({contracts,seeming}:{contracts:Array<Record<string,unknown>>;seeming:string}) { return <div className="official-lines">{contracts.filter((item)=>item.name).map((item,index)=>{ const definition=findContract(String(item.id??item.name??"")); const description=definition?.description??String(item.description??""); const dicePool=definition?.dicePool??String(item.dicePool??"Não informada");const benefit=definition?.seemingBenefits?.[seeming as keyof typeof definition.seemingBenefits]; return <div key={`${String(item.name)}-${index}`} title={`${description}\nParada de dados: ${dicePool}\nBrecha: ${definition?.loophole??"Não informada"}${benefit?`\nBenefício de ${CTL_SEEMING_LABELS[seeming]??seeming}: ${benefit}`:""}`}><span>{definition?.name??String(item.name)}</span><small>{definition?.regalia??String(item.regalia??"")} · {definition?.type??String(item.type??(index<4?"Comum":"Real"))}</small></div>; })}{!contracts.some((item)=>item.name)&&<div>&nbsp;</div>}</div>; }
function ContractPowerList({contracts,seeming,extraBenefits=[]}:{contracts:Array<Record<string,unknown>>;seeming:string;extraBenefits?:Array<Record<string,unknown>>}) { return <div className="contract-power-list">{contracts.filter((item)=>item.name).map((item,index)=>{const definition=findContract(String(item.id??item.name??""));if(!definition)return null;const benefits=[seeming,...extraBenefits.filter((extra)=>String(extra.contractId)===definition.id).map((extra)=>String(extra.seeming))].filter((value,item,array)=>value&&array.indexOf(value)===item).map((key)=>({key,text:definition.seemingBenefits?.[key as keyof typeof definition.seemingBenefits]})).filter((item)=>item.text);return <article key={`${definition.id}-${index}`}><div className="contract-power-title"><strong>{definition.name}</strong><Badge variant={definition.goblin?"default":"outline"}>{definition.goblin?"Goblin · Comum":definition.type}</Badge></div><small>{definition.regalia} · {definition.source} · p. {definition.page}</small><p>{definition.description}</p><dl><div><dt>Custo</dt><dd>{definition.cost??"Conforme descrição"}</dd></div><div><dt>Parada de dados</dt><dd>{definition.dicePool}</dd></div><div><dt>Ação / Duração</dt><dd>{definition.action??"Conforme descrição"} · {definition.duration??"Conforme descrição"}</dd></div><div><dt>Brecha</dt><dd>{definition.loophole}</dd></div>{benefits.map((benefit)=><div key={benefit.key}><dt>Benefício de {CTL_SEEMING_LABELS[benefit.key]??benefit.key}</dt><dd>{benefit.text}</dd></div>)}{definition.goblin&&<div className="goblin-debt-row"><dt>Débito Goblin</dt><dd>{definition.goblinDebt}</dd></div>}</dl></article>;})}</div>; }
function SeemingLore({seeming}:{seeming:string}) { const definition=CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS]; if(!definition)return <LorePanel title="Feição" text="Nenhuma Feição selecionada."/>; const page=({Beast:22,Darkling:24,Elemental:26,Fairest:28,Ogre:30,Wizened:32} as Record<string,number>)[seeming]; return <><LorePanel title={`Bênção de ${definition.translated}`} text={definition.blessing} source={`Changeling the Lost · p. ${page}`}/><LorePanel title={`Maldição de ${definition.translated}`} text={definition.curse} source={`Changeling the Lost · p. ${page}`}/></>; }
function KithLore({data}:{data:Record<string,unknown>}) { const definition=findKith(data.kith); const name=String(data.kith??""); const skill=String(data.kith_skill??definition?.skill??""); const description=String(data.kith_description??definition?.description??""); const blessing=String(data.kith_blessing??definition?.blessing??""); const source=String(data.kith_source??definition?.source??""); const page=Number(data.kith_page??definition?.page??0); if(!name)return <LorePanel title="Bênção da Fratria" text="Nenhuma Fratria selecionada."/>; return <LorePanel title={`Bênção de ${name}`} intro={data.kith_custom?undefined:description} text={`${skill?`${skill}. `:""}${blessing||description}`} source={source?`${source}${page?` · p. ${page}`:""}`:undefined}/>; }
function LorePanel({title,intro,text,source}:{title:string;intro?:string;text:string;source?:string}) { return <article className="lore-panel"><h4>{title}</h4>{intro&&intro!==text&&<p className="lore-intro">{intro}</p>}<p>{text}</p>{source&&<small>{source}</small>}</article>; }
function LabeledBlank({title,lines}:{title:string;lines:number}) { return <div className="labeled-blank"><h4>{title}</h4><div className="blank-lines">{Array.from({length:lines},(_,index)=><i key={index}/>)}</div></div>; }
function SpellSheetList({rotes,praxes}:{rotes:Array<Record<string,unknown>>;praxes:Array<Record<string,unknown>>}) { const rows=[...rotes.map(item=>({kind:"Rota",item})),...praxes.map(item=>({kind:"Práxis",item}))];return <div className="official-lines">{rows.map(({kind,item},index)=><div key={`${kind}-${String(item.id??item.name)}-${index}`} title={`${String(item.description??"")}\nPrática: ${String(item.practice??"")} · Fator Primário: ${String(item.primaryFactor??"")}${item.withstand?` · Resistência: ${String(item.withstand)}`:""}`}><span>{kind} · {String(item.name??item.originalName??"")}</span><small>{kind==="Rota"&&item.roteSkill?`Perícia: ${String(item.roteSkill)} · `:""}{String(item.source??"")} · p. {String(item.page??"—")}</small></div>)}</div>; }
function stringList(value:unknown) { return Array.isArray(value)?value.map(String):[]; }
function objectList(value:unknown) { return Array.isArray(value)?value as Array<Record<string,unknown>>:[]; }
function isExpandedMerit(name:string) { return ["Fae Mount","Hollow","Mantle","Token"].includes(name); }

function RulesCatalog({ catalog }: { catalog: CatalogRule[] }) {
  return <section className="panel"><div className="panel-heading"><div><span className="kicker">BANCO COMPARTILHADO</span><h3>Regras ativas para todos</h3><p>Não há fila de aprovação. Ajustes posteriores substituem a versão compartilhada.</p></div><Badge className="approved-badge">ATIVAS</Badge></div><div className="rule-cards">{catalog.map((rule)=><article key={rule.id}><div><Badge>{rule.gameLine}</Badge><Badge variant="outline">p. {rule.sourcePage}</Badge></div><h3>{rule.originalName}</h3><p>{summarizeRule(rule)}</p><small>Fonte: {rule.sourceId} · {rule.reviewStatus}</small></article>)}</div></section>;
}

function Sources() {
  const [query,setQuery]=useState("");
  const filtered=SOURCE_CATALOG.filter((source)=>Object.values(source).join(" ").toLowerCase().includes(query.toLowerCase()));
  return <section className="panel"><div className="panel-heading"><div><span className="kicker">HIERARQUIA DE FONTES</span><h3>Livros conectados</h3><p>Os livros principais comandam a criação; os adjacentes ampliam opções.</p></div><div className="searchbox"><Search /><Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar fonte…" /></div></div><div className="table-wrap"><Table><TableHeader><TableRow><TableHead>Livro</TableHead><TableHead>Linha</TableHead><TableHead>Tipo</TableHead><TableHead>Papel</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{filtered.map((source)=><TableRow key={source.id}><TableCell><div className="source-title"><FileText />{source.title}</div></TableCell><TableCell>{source.gameLine}</TableCell><TableCell>{source.type}</TableCell><TableCell><Badge variant={source.role==="PRIMARY"?"default":"outline"}>{source.role==="PRIMARY"?"PRINCIPAL":source.role==="BASE"?"BASE":"ADJACENTE"}</Badge></TableCell><TableCell><Badge className="approved-badge">ATIVO</Badge></TableCell></TableRow>)}</TableBody></Table></div></section>;
}
function Empty({title,text,action}:{title:string;text:string;action:()=>void}) { return <div className="empty-state"><FileJson /><h3>{title}</h3><p>{text}</p><Button onClick={action}><Plus /> Criar ficha</Button></div>; }

function migrateLegacy(item:any, player:string): CharacterSheet {
  const attributes=Object.values(ATTRIBUTES).flat().reduce<Record<string,number>>((acc,name)=>({...acc,[name]:1}),{});
  const skills=Object.values(SKILLS).flat().reduce<Record<string,number>>((acc,name)=>({...acc,[name]:0}),{});
  const now=new Date().toISOString();
  return { id:item.id??crypto.randomUUID(),schema_version:2,system:"chronicles-of-darkness",game_line:item.gameLine==="MtA"?"MtA":"CtL",ruleset:{id:item.rulesetId??"legacy",version:item.rulesetVersion??1},character:{name:item.name??"Sem nome",concept:item.concept??"",player},attributes,skills,specializations:[],merits:[],line_data:safeJson(item.characterData),derived:{},current_state:{legacy:true},created_at:item.createdAt??now,updated_at:now };
}
function migrateJsonV1(value:any, player:string): CharacterSheet {
  const now=new Date().toISOString();
  const specializations=Array.isArray(value.specializations)?value.specializations.map((item:any)=>typeof item==="string"?{skill:"",name:item}:{skill:String(item.skill??""),name:String(item.name??"")}):[];
  return { id:crypto.randomUUID(),schema_version:2,system:"chronicles-of-darkness",game_line:value.game_line,ruleset:value.ruleset??{id:"imported-v1",version:1},character:{name:value.character?.name??"Sem nome",concept:value.character?.concept??"",player},attributes:value.attributes??{},skills:value.skills??{},specializations,merits:value.merits??[],line_data:value.line_data??{},derived:{},current_state:value.current_state??{},created_at:now,updated_at:now };
}
function safeJson(value:string) { try{return JSON.parse(value||"{}");}catch{return{};} }
function pretty(value:string) { return value.replace(/([A-Z])/g," $1").replace(/_/g," ").trim(); }
function summarizeRule(rule:CatalogRule) { try { const data=JSON.parse(rule.structuredData); return `${Object.keys(data).length} blocos mecânicos estruturados e aplicados pelo criador de fichas.`; } catch { return "Regra compartilhada ativa."; } }
