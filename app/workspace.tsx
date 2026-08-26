"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive, BookOpen, ChevronRight, Cloud, Database, Download, FileJson, FileText,
  HardDrive, LayoutDashboard, Menu, Pencil, Plus, Search, ShieldCheck, Sparkles,
  Upload, UsersRound, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CharacterBuilder, type CharacterSheet } from "./character-builder";
import { ATTRIBUTES, SKILLS, SOURCE_CATALOG } from "@/lib/creation-rules";

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
      {selected ? <CharacterView character={selected} back={() => setSelected(null)} edit={() => setEditing(selected)} exportSheet={() => exportCharacter(selected)} /> : view === "inicio" ? <Dashboard characters={characters} catalog={catalog} create={() => setEditing("new")} openCharacters={() => navigate("personagens")} /> : view === "personagens" ? <Characters characters={characters} ready={ready} open={setSelected} create={() => setEditing("new")} /> : view === "regras" ? <RulesCatalog catalog={catalog} /> : <Sources />}
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

function CharacterView({ character, back, edit, exportSheet }: { character: CharacterSheet; back:()=>void; edit:()=>void; exportSheet:()=>void }) {
  return <section className="sheet-editor"><div className="sheet-toolbar"><Button variant="ghost" onClick={back}>← Personagens</Button><div><Badge>{character.game_line}</Badge><span>Salva localmente</span></div><div><Button variant="outline" onClick={edit}><Pencil /> Editar</Button><Button variant="outline" onClick={exportSheet}><Download /> Exportar JSON</Button></div></div><article className="ready-sheet"><header><span className="kicker">FICHA DE PERSONAGEM</span><h2>{character.character.name}</h2><p>{character.character.concept}</p></header><div className="sheet-data-grid"><TraitPanel title="Atributos" values={character.attributes} /><TraitPanel title="Perícias" values={character.skills} /><TraitPanel title="Vantagens" values={character.derived} /><section><h3>{character.game_line === "CtL" ? "Changeling" : "Mage"}</h3>{Object.entries(character.line_data).filter(([,value])=>typeof value!=="object").map(([key,value])=><div className="sheet-row" key={key}><span>{pretty(key)}</span><strong>{String(value)}</strong></div>)}</section></div><section className="sheet-lists"><div><h3>Especializações</h3>{character.specializations.map((item)=><Badge key={item} variant="secondary">{item}</Badge>)}</div><div><h3>Méritos</h3>{character.merits.map((item)=><Badge key={item.name} variant="outline">{item.name} · {item.dots}</Badge>)}</div></section></article></section>;
}
function TraitPanel({ title, values }: { title:string; values:Record<string,number> }) { return <section><h3>{title}</h3>{Object.entries(values).map(([name,value])=><div className="sheet-row" key={name}><span>{pretty(name)}</span><strong>{value}</strong></div>)}</section>; }

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
  return { id:crypto.randomUUID(),schema_version:2,system:"chronicles-of-darkness",game_line:value.game_line,ruleset:value.ruleset??{id:"imported-v1",version:1},character:{name:value.character?.name??"Sem nome",concept:value.character?.concept??"",player},attributes:value.attributes??{},skills:value.skills??{},specializations:value.specializations??[],merits:value.merits??[],line_data:value.line_data??{},derived:{},current_state:value.current_state??{},created_at:now,updated_at:now };
}
function safeJson(value:string) { try{return JSON.parse(value||"{}");}catch{return{};} }
function pretty(value:string) { return value.replace(/([A-Z])/g," $1").replace(/_/g," ").trim(); }
function summarizeRule(rule:CatalogRule) { try { const data=JSON.parse(rule.structuredData); return `${Object.keys(data).length} blocos mecânicos estruturados e aplicados pelo criador de fichas.`; } catch { return "Regra compartilhada ativa."; } }
