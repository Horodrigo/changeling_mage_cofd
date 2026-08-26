"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive, BookOpen, CheckCircle2, ChevronRight, CircleHelp, Download, FileJson,
  FileText, Languages, LayoutDashboard, Menu, Plus, Search, Settings2, ShieldCheck,
  Sparkles, Upload, UserRound, UsersRound, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type View = "inicio" | "personagens" | "fontes" | "regras" | "rulesets" | "traducoes";
type Character = {
  id: string; name: string; concept: string; gameLine: "CtL" | "MtA"; rulesetId: string;
  rulesetVersion: number; schemaVersion: number; characterData: string; updatedAt: string;
};

const sourceFiles = [
  ["Chronicles of Darkness", "Core", "2ª", "OFFICIAL"],
  ["Changeling the Lost", "CtL", "2ª", "OFFICIAL"],
  ["Kith and Kin", "CtL", "2ª", "OFFICIAL"],
  ["Oak Ash and Thorn", "CtL", "2ª", "OFFICIAL"],
  ["The Hedge", "CtL", "2ª", "OFFICIAL"],
  ["Dark Eras Changeling", "CtL", "2ª", "OFFICIAL"],
  ["Mage the Awakening", "MtA", "2ª", "OFFICIAL"],
  ["Signs of Sorcery", "MtA", "2ª", "OFFICIAL"],
  ["Tome of the Pentacle", "MtA", "2ª", "OFFICIAL"],
  ["Nameless and Accursed", "NH", "2ª", "OFFICIAL"],
  ["Beyond the Hedge", "CtL", "—", "HOMEBREW"],
  ["Book of Courts", "CtL", "—", "HOMEBREW"],
  ["Book of Seemings", "CtL", "—", "HOMEBREW"],
] as const;

const nav = [
  ["inicio", "Visão geral", LayoutDashboard],
  ["personagens", "Personagens", UsersRound],
  ["fontes", "Fontes", Archive],
  ["regras", "Regras", BookOpen],
  ["rulesets", "Rulesets", Settings2],
  ["traducoes", "Traduções", Languages],
] as const;

export function Workspace({ displayName }: { displayName: string }) {
  const [view, setView] = useState<View>("inicio");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadCharacters() {
    setLoading(true);
    try {
      const response = await fetch("/api/characters", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCharacters(data.characters);
    } catch {
      setNotice("O banco está sendo preparado. Tente novamente após a publicação concluir.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadCharacters(); }, []);

  function navigate(next: View) {
    setView(next); setSelected(null); setMobileOpen(false);
  }

  async function createCharacter(form: HTMLFormElement) {
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"), concept: fd.get("concept"), game_line: fd.get("gameLine"),
      ruleset_id: `${String(fd.get("gameLine")).toLowerCase()}-base`,
      ruleset_version: 1, character_data: {},
    };
    const response = await fetch("/api/characters", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error ?? "Não foi possível criar a ficha."); return; }
    setCharacters((current) => [data.character, ...current]);
    setDialogOpen(false); setSelected(data.character); setView("personagens");
  }

  async function saveCharacter(character: Character, form: HTMLFormElement) {
    const fd = new FormData(form);
    let characterData: object = {};
    try { characterData = JSON.parse(String(fd.get("characterData") || "{}")); }
    catch { setNotice("Os dados modulares precisam ser um JSON válido."); return; }
    const response = await fetch(`/api/characters/${character.id}`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), concept: fd.get("concept"), character_data: characterData }),
    });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error ?? "Não foi possível salvar."); return; }
    setCharacters((current) => current.map((item) => item.id === data.character.id ? data.character : item));
    setSelected(data.character); setNotice("Ficha salva com rastreabilidade de schema e ruleset.");
  }

  function exportCharacter(character: Character) {
    const payload = {
      schema_version: character.schemaVersion,
      system: "chronicles-of-darkness",
      game_line: character.gameLine,
      ruleset: { id: character.rulesetId, version: character.rulesetVersion },
      character: { name: character.name, concept: character.concept },
      attributes: {}, skills: {}, specializations: [], merits: [],
      line_data: JSON.parse(character.characterData || "{}"),
      current_state: {},
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `${character.name.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.json`; anchor.click();
    URL.revokeObjectURL(url);
  }

  async function importCharacter(file: File) {
    try {
      const payload = JSON.parse(await file.text());
      if (payload.schema_version !== 1 || payload.system !== "chronicles-of-darkness" || !["CtL", "MtA"].includes(payload.game_line)) {
        throw new Error("Arquivo incompatível: confira schema_version, system e game_line.");
      }
      if (!payload.character?.name || typeof payload.character.name !== "string") throw new Error("O personagem importado não possui nome válido.");
      const response = await fetch("/api/characters", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: payload.character.name, concept: payload.character.concept ?? "", game_line: payload.game_line,
          ruleset_id: payload.ruleset?.id ?? `${payload.game_line.toLowerCase()}-base`,
          ruleset_version: Number(payload.ruleset?.version) || 1, character_data: payload.line_data ?? {},
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCharacters((current) => [data.character, ...current]); setView("personagens"); setSelected(data.character);
      setNotice(`“${data.character.name}” foi importado com sucesso.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "JSON inválido.");
    }
  }

  const title = useMemo(() => nav.find(([id]) => id === view)?.[1] ?? "Arquivo", [view]);

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles /></div>
          <div><strong>Arquivo</strong><span>das Trevas</span></div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X /></button>
        </div>
        <nav aria-label="Navegação principal">
          {nav.map(([id, label, Icon]) => (
            <button key={id} className={view === id ? "nav-item active" : "nav-item"} onClick={() => navigate(id)}>
              <Icon /> <span>{label}</span>{view === id && <ChevronRight className="nav-chevron" />}
            </button>
          ))}
        </nav>
        <div className="source-promise">
          <ShieldCheck />
          <div><strong>Fontes primeiro</strong><span>Nenhuma regra é confirmada sem livro e página.</span></div>
        </div>
        <div className="profile"><div className="avatar">{displayName.slice(0, 1).toUpperCase()}</div><div><strong>{displayName}</strong><span>Workspace privado</span></div></div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu /></button>
          <div><p>Chronicles of Darkness</p><h1>{title}</h1></div>
          <div className="top-actions">
            <input ref={fileRef} hidden type="file" accept=".json,application/json" onChange={(event) => {
              const file = event.target.files?.[0]; if (file) void importCharacter(file); event.target.value = "";
            }} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload /> Importar JSON</Button>
            <CreateDialog open={dialogOpen} setOpen={setDialogOpen} onCreate={createCharacter} />
          </div>
        </header>

        {notice && <div className="notice" role="status"><CircleHelp /><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Fechar aviso"><X /></button></div>}

        {selected ? (
          <CharacterEditor character={selected} onBack={() => setSelected(null)} onSave={saveCharacter} onExport={exportCharacter} />
        ) : view === "inicio" ? (
          <Dashboard characters={characters} loading={loading} openCharacters={() => navigate("personagens")} newCharacter={() => setDialogOpen(true)} />
        ) : view === "personagens" ? (
          <Characters characters={characters} loading={loading} open={setSelected} create={() => setDialogOpen(true)} />
        ) : view === "fontes" ? <Sources /> : view === "regras" ? <Rules /> : view === "rulesets" ? <Rulesets /> : <Translations />}
      </section>
      {mobileOpen && <button className="overlay" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />}
    </main>
  );
}

function CreateDialog({ open, setOpen, onCreate }: { open: boolean; setOpen: (value: boolean) => void; onCreate: (form: HTMLFormElement) => void }) {
  const [line, setLine] = useState("CtL");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus /> Novo personagem</Button></DialogTrigger>
      <DialogContent className="dialog-surface">
        <DialogHeader><DialogTitle>Criar personagem</DialogTitle><DialogDescription>Comece pela identidade. Campos mecânicos serão adicionados somente após revisão das fontes.</DialogDescription></DialogHeader>
        <form className="form-stack" onSubmit={(event) => { event.preventDefault(); onCreate(event.currentTarget); }}>
          <label>Nome<Input name="name" placeholder="Nome do personagem" required /></label>
          <label>Conceito<Input name="concept" placeholder="Descrição curta" /></label>
          <label>Linha de jogo
            <input type="hidden" name="gameLine" value={line} />
            <Select value={line} onValueChange={setLine}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="CtL">Changeling: The Lost</SelectItem><SelectItem value="MtA">Mage: The Awakening</SelectItem></SelectContent></Select>
          </label>
          <div className="dialog-actions"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit">Criar ficha</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Dashboard({ characters, loading, openCharacters, newCharacter }: { characters: Character[]; loading: boolean; openCharacters: () => void; newCharacter: () => void }) {
  return <div className="page-grid">
    <section className="welcome-panel">
      <div><Badge className="eyebrow">FUNDAÇÃO • ETAPA 1</Badge><h2>Suas crônicas, com cada regra no lugar certo.</h2><p>Crie fichas portáveis e mantenha livros, traduções e decisões de campanha rastreáveis.</p></div>
      <div className="sigil" aria-hidden="true"><span>CoD</span></div>
    </section>
    <section className="metrics">
      <Metric value={loading ? "—" : String(characters.length)} label="personagens" accent="violet" />
      <Metric value="13" label="fontes catalogadas" accent="green" />
      <Metric value="0" label="regras aprovadas" accent="amber" />
      <Metric value="2" label="linhas preparadas" accent="blue" />
    </section>
    <section className="panel wide">
      <div className="panel-heading"><div><span className="kicker">ACESSO RÁPIDO</span><h3>Personagens recentes</h3></div><Button variant="ghost" onClick={openCharacters}>Ver todos <ChevronRight /></Button></div>
      {characters.length ? <div className="character-strip">{characters.slice(0, 3).map((character) => <div className="mini-character" key={character.id}><span>{character.gameLine}</span><strong>{character.name}</strong><small>{character.concept || "Sem conceito"}</small></div>)}</div> : <Empty title="Nenhum personagem ainda" text="Crie a primeira ficha para iniciar sua crônica." action={newCharacter} />}
    </section>
    <section className="panel review-card"><span className="kicker">PIPELINE SEGURA</span><h3>Livros aguardando revisão</h3><p>Os documentos já estão catalogados, mas nenhuma regra foi extraída ou aprovada automaticamente.</p><div className="progress-line"><span style={{ width: "8%" }} /></div><small>1 etapa de 4 preparada</small></section>
    <section className="panel principles"><span className="kicker">PRINCÍPIO CENTRAL</span><blockquote>“Qual é a fonte desta informação?”</blockquote><p>Conteúdo sem livro, página e revisão permanece suspeito e não entra nas fichas.</p></section>
  </div>;
}

function Metric({ value, label, accent }: { value: string; label: string; accent: string }) {
  return <div className={`metric ${accent}`}><strong>{value}</strong><span>{label}</span></div>;
}

function Characters({ characters, loading, open, create }: { characters: Character[]; loading: boolean; open: (item: Character) => void; create: () => void }) {
  if (loading) return <div className="loading-card">Carregando fichas…</div>;
  return <section className="panel">
    <div className="panel-heading"><div><span className="kicker">FICHAS SALVAS</span><h3>Personagens</h3></div><Button onClick={create}><Plus /> Criar personagem</Button></div>
    {characters.length ? <div className="character-grid">{characters.map((character) => <button className="character-card" key={character.id} onClick={() => open(character)}><div className="character-monogram">{character.name.slice(0, 1)}</div><div><Badge variant="outline">{character.gameLine}</Badge><h3>{character.name}</h3><p>{character.concept || "Conceito não informado"}</p><small>Ruleset v{character.rulesetVersion} · Schema v{character.schemaVersion}</small></div><ChevronRight /></button>)}</div> : <Empty title="Sua estante está vazia" text="Uma ficha começa com nome, conceito, linha e ruleset." action={create} />}
  </section>;
}

function CharacterEditor({ character, onBack, onSave, onExport }: { character: Character; onBack: () => void; onSave: (item: Character, form: HTMLFormElement) => void; onExport: (item: Character) => void }) {
  return <section className="sheet-editor">
    <div className="sheet-toolbar"><Button variant="ghost" onClick={onBack}>← Personagens</Button><div><Badge variant="outline">{character.gameLine}</Badge><span>Ruleset v{character.rulesetVersion}</span></div><Button variant="outline" onClick={() => onExport(character)}><Download /> Exportar JSON</Button></div>
    <form onSubmit={(event) => { event.preventDefault(); onSave(character, event.currentTarget); }}>
      <div className="sheet-identity"><div><span className="kicker">FICHA MODULAR</span><Input name="name" defaultValue={character.name} className="name-input" /></div><label>Conceito<Input name="concept" defaultValue={character.concept} placeholder="Conceito do personagem" /></label><Button type="submit">Salvar alterações</Button></div>
      <div className="sheet-columns">
        <div className="sheet-main">
          <section className="sheet-section"><div className="section-title"><h3>Dados base</h3><Badge variant="secondary">Aguardando Core</Badge></div><PendingBlock /></section>
          <section className="sheet-section"><div className="section-title"><h3>Módulo {character.gameLine}</h3><Badge variant="secondary">Aguardando revisão</Badge></div><PendingBlock /></section>
          <section className="sheet-section"><div className="section-title"><h3>Dados modulares</h3><Badge variant="outline">JSON estruturado</Badge></div><p className="helper">Área técnica temporária para dados já aprovados pelo administrador.</p><Textarea name="characterData" defaultValue={formatJson(character.characterData)} className="json-editor" spellCheck={false} /></section>
        </div>
        <aside className="trace-panel"><ShieldCheck /><span className="kicker">RASTREABILIDADE</span><h3>Ficha protegida</h3><p>Nenhuma fórmula, Mérito, poder ou campo mecânico foi inventado.</p><dl><div><dt>Sistema</dt><dd>chronicles-of-darkness</dd></div><div><dt>Schema</dt><dd>v{character.schemaVersion}</dd></div><div><dt>Ruleset</dt><dd>{character.rulesetId}</dd></div><div><dt>Linha</dt><dd>{character.gameLine}</dd></div></dl></aside>
      </div>
    </form>
  </section>;
}

function Sources() {
  const [query, setQuery] = useState("");
  const filtered = sourceFiles.filter((source) => source.join(" ").toLowerCase().includes(query.toLowerCase()));
  return <section className="panel">
    <div className="panel-heading"><div><span className="kicker">13 DOCUMENTOS</span><h3>Catálogo de fontes</h3><p>Metadados interpretados pela nomenclatura fornecida.</p></div><div className="searchbox"><Search /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar fonte…" /></div></div>
    <div className="table-wrap"><Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Linha</TableHead><TableHead>Edição</TableHead><TableHead>Tipo</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{filtered.map((source) => <TableRow key={source[0]}><TableCell><div className="source-title"><FileText />{source[0]}</div></TableCell><TableCell>{source[1]}</TableCell><TableCell>{source[2]}</TableCell><TableCell><Badge variant={source[3] === "HOMEBREW" ? "secondary" : "outline"}>{source[3]}</Badge></TableCell><TableCell><Badge className="pending-badge">PENDING</Badge></TableCell></TableRow>)}</TableBody></Table></div>
  </section>;
}

function Rules() {
  return <section className="panel"><div className="panel-heading"><div><span className="kicker">BANCO DE REGRAS</span><h3>Regras rastreáveis</h3></div><Button disabled><Plus /> Nova regra CUSTOM</Button></div><Empty icon={<BookOpen />} title="Nenhuma regra processada" text="Escolha e revise primeiro o livro Core. Informações não confirmadas terão needs_review: true." /></section>;
}

function Rulesets() {
  return <div className="two-columns"><section className="panel"><span className="kicker">CONFIGURAÇÕES DE CAMPANHA</span><h3>Rulesets preparados</h3><div className="ruleset-card"><div><Badge>CtL</Badge><h4>Base Changeling</h4><p>Core + linha CtL. Fontes ainda desabilitadas até revisão.</p></div><span>v1</span></div><div className="ruleset-card"><div><Badge>MtA</Badge><h4>Base Mage</h4><p>Core + linha MtA. Fontes ainda desabilitadas até revisão.</p></div><span>v1</span></div></section><section className="panel principles"><ShieldCheck /><h3>Precedência explícita</h3><p>Conflitos entre fontes nunca são resolvidos silenciosamente. Cada decisão cria uma nova versão do ruleset.</p></section></div>;
}

function Translations() {
  return <section className="panel"><div className="panel-heading"><div><span className="kicker">GLOSSÁRIO CENTRAL</span><h3>Traduções</h3></div><Button disabled><Plus /> Adicionar termo</Button></div><Empty icon={<Languages />} title="Glossário aguardando revisão" text="Termos originais e traduções aprovadas serão preservados separadamente." /></section>;
}

function Empty({ title, text, action, icon }: { title: string; text: string; action?: () => void; icon?: React.ReactNode }) {
  return <div className="empty-state">{icon ?? <FileJson />}<h3>{title}</h3><p>{text}</p>{action && <Button onClick={action}><Plus /> Começar agora</Button>}</div>;
}

function PendingBlock() {
  return <div className="pending-block"><CircleHelp /><div><strong>Informação não encontrada ou não confirmada nas fontes fornecidas.</strong><span>needs_review: true</span></div></div>;
}

function formatJson(value: string) {
  try { return JSON.stringify(JSON.parse(value || "{}"), null, 2); } catch { return "{}"; }
}
