"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive, Ban, BookOpen, CheckCircle2, ChevronRight, CircleHelp, Download, FileJson,
  FileText, Languages, LayoutDashboard, Loader2, Menu, Plus, Save, Search, Settings2,
  ShieldCheck, Sparkles, Upload, UsersRound, X
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
type RuleRecord = {
  id: string; originalName: string; translatedName: string | null; category: string;
  gameLine: string; sourceId: string | null; sourcePage: number | null; sourceSection: string | null;
  sourceType: string; translatedText: string | null; structuredData: string;
  reviewStatus: "PENDING" | "APPROVED" | "REJECTED"; needsReview: boolean;
  reviewNotes: string; reviewerId: string | null; reviewedAt: string | null;
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
  const [ruleCounts, setRuleCounts] = useState({ pending: 0, approved: 0 });
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

  async function loadRuleCounts() {
    try {
      const [pendingResponse, approvedResponse] = await Promise.all([
        fetch("/api/rules?status=PENDING", { cache: "no-store" }),
        fetch("/api/rules?status=APPROVED", { cache: "no-store" }),
      ]);
      if (!pendingResponse.ok || !approvedResponse.ok) return;
      const [pending, approved] = await Promise.all([pendingResponse.json(), approvedResponse.json()]);
      setRuleCounts({ pending: pending.rules.length, approved: approved.rules.length });
    } catch { /* Counts are informative; the review screen handles errors explicitly. */ }
  }

  useEffect(() => { void loadCharacters(); void loadRuleCounts(); }, []);

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
          <Dashboard characters={characters} loading={loading} ruleCounts={ruleCounts} openCharacters={() => navigate("personagens")} newCharacter={() => setDialogOpen(true)} />
        ) : view === "personagens" ? (
          <Characters characters={characters} loading={loading} open={setSelected} create={() => setDialogOpen(true)} />
        ) : view === "fontes" ? <Sources notify={setNotice} onProcessed={loadRuleCounts} /> : view === "regras" ? <Rules notify={setNotice} onChanged={loadRuleCounts} /> : view === "rulesets" ? <Rulesets /> : <Translations />}
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

function Dashboard({ characters, loading, ruleCounts, openCharacters, newCharacter }: { characters: Character[]; loading: boolean; ruleCounts: { pending: number; approved: number }; openCharacters: () => void; newCharacter: () => void }) {
  return <div className="page-grid">
    <section className="welcome-panel">
      <div><Badge className="eyebrow">FUNDAÇÃO • ETAPA 1</Badge><h2>Suas crônicas, com cada regra no lugar certo.</h2><p>Crie fichas portáveis e mantenha livros, traduções e decisões de campanha rastreáveis.</p></div>
      <div className="sigil" aria-hidden="true"><span>CoD</span></div>
    </section>
    <section className="metrics">
      <Metric value={loading ? "—" : String(characters.length)} label="personagens" accent="violet" />
      <Metric value="13" label="fontes catalogadas" accent="green" />
      <Metric value={String(ruleCounts.approved)} label="regras aprovadas" accent="amber" />
      <Metric value="2" label="linhas preparadas" accent="blue" />
    </section>
    <section className="panel wide">
      <div className="panel-heading"><div><span className="kicker">ACESSO RÁPIDO</span><h3>Personagens recentes</h3></div><Button variant="ghost" onClick={openCharacters}>Ver todos <ChevronRight /></Button></div>
      {characters.length ? <div className="character-strip">{characters.slice(0, 3).map((character) => <div className="mini-character" key={character.id}><span>{character.gameLine}</span><strong>{character.name}</strong><small>{character.concept || "Sem conceito"}</small></div>)}</div> : <Empty title="Nenhum personagem ainda" text="Crie a primeira ficha para iniciar sua crônica." action={newCharacter} />}
    </section>
    <section className="panel review-card"><span className="kicker">PIPELINE SEGURA</span><h3>Fila de revisão</h3><p>{ruleCounts.pending ? `${ruleCounts.pending} candidatos do Core aguardam sua conferência.` : "Processe o livro Core para criar a primeira fila de revisão."}</p><div className="progress-line"><span style={{ width: ruleCounts.pending ? "45%" : "8%" }} /></div><small>{ruleCounts.approved} regras aprovadas</small></section>
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

function Sources({ notify, onProcessed }: { notify: (message: string) => void; onProcessed: () => Promise<void> }) {
  const [query, setQuery] = useState("");
  const [processing, setProcessing] = useState(false);
  const filtered = sourceFiles.filter((source) => source.join(" ").toLowerCase().includes(query.toLowerCase()));
  async function processCore() {
    setProcessing(true);
    try {
      const response = await fetch("/api/ingestion/core", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await onProcessed();
      notify(`${data.imported} candidatos do Core foram enviados para a fila de revisão.`);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível processar o Core.");
    } finally {
      setProcessing(false);
    }
  }
  return <section className="panel">
    <div className="panel-heading"><div><span className="kicker">13 DOCUMENTOS</span><h3>Catálogo de fontes</h3><p>Metadados interpretados pela nomenclatura fornecida.</p></div><div className="searchbox"><Search /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar fonte…" /></div></div>
    <div className="table-wrap"><Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Linha</TableHead><TableHead>Edição</TableHead><TableHead>Tipo</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ação</TableHead></TableRow></TableHeader><TableBody>{filtered.map((source) => <TableRow key={source[0]}><TableCell><div className="source-title"><FileText />{source[0]}</div></TableCell><TableCell>{source[1]}</TableCell><TableCell>{source[2]}</TableCell><TableCell><Badge variant={source[3] === "HOMEBREW" ? "secondary" : "outline"}>{source[3]}</Badge></TableCell><TableCell><Badge className={source[0] === "Chronicles of Darkness" ? "review-badge" : "pending-badge"}>{source[0] === "Chronicles of Darkness" ? "PRONTO PARA INDEXAR" : "PENDING"}</Badge></TableCell><TableCell className="text-right">{source[0] === "Chronicles of Darkness" ? <Button size="sm" onClick={processCore} disabled={processing}>{processing ? <Loader2 className="spin" /> : <Archive />} {processing ? "Processando…" : "Processar este livro"}</Button> : <Button size="sm" variant="ghost" disabled>Aguardar Core</Button>}</TableCell></TableRow>)}</TableBody></Table></div>
  </section>;
}

function Rules({ notify, onChanged }: { notify: (message: string) => void; onChanged: () => Promise<void> }) {
  const [status, setStatus] = useState("PENDING");
  const [items, setItems] = useState<RuleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState<RuleRecord | null>(null);

  async function load(nextStatus = status) {
    setLoading(true);
    try {
      const response = await fetch(`/api/rules?status=${nextStatus}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setItems(data.rules);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível carregar as regras.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void load(status); }, [status]);

  async function review(rule: RuleRecord, form: HTMLFormElement, reviewStatus: RuleRecord["reviewStatus"]) {
    const fd = new FormData(form);
    let structuredData: object;
    try { structuredData = JSON.parse(String(fd.get("structuredData") || "{}")); }
    catch { notify("Os dados estruturados precisam ser um JSON válido."); return; }
    const response = await fetch(`/api/rules/${rule.id}`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        translated_name: fd.get("translatedName"), summary: fd.get("summary"),
        category: fd.get("category"), source_page: Number(fd.get("sourcePage")),
        source_section: fd.get("sourceSection"), structured_data: structuredData,
        review_notes: fd.get("reviewNotes"), review_status: reviewStatus,
      }),
    });
    const data = await response.json();
    if (!response.ok) { notify(data.error ?? "Não foi possível salvar a revisão."); return; }
    setSelectedRule(null);
    await Promise.all([load(status), onChanged()]);
    notify(reviewStatus === "APPROVED" ? `“${rule.originalName}” foi aprovada.` : reviewStatus === "REJECTED" ? `“${rule.originalName}” foi rejeitada.` : "Revisão salva como pendente.");
  }

  return <section className="panel rules-panel">
    <div className="panel-heading"><div><span className="kicker">BANCO DE REGRAS</span><h3>Fila de revisão do Core</h3><p>Confira cada candidato contra a página indicada antes de aprovar.</p></div><div className="rule-filters"><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PENDING">Pendentes</SelectItem><SelectItem value="APPROVED">Aprovadas</SelectItem><SelectItem value="REJECTED">Rejeitadas</SelectItem><SelectItem value="ALL">Todas</SelectItem></SelectContent></Select></div></div>
    {loading ? <div className="loading-card"><Loader2 className="spin" /> Carregando fila…</div> : items.length ? <div className="review-list">{items.map((rule) => <button className="review-row" key={rule.id} onClick={() => setSelectedRule(rule)}><div className="review-icon"><BookOpen /></div><div><div className="review-name"><strong>{rule.translatedName || rule.originalName}</strong>{rule.translatedName && <span>{rule.originalName}</span>}</div><p>{rule.category} · Chronicles of Darkness · página {rule.sourcePage}</p></div><StatusBadge status={rule.reviewStatus} /><ChevronRight /></button>)}</div> : <Empty icon={<BookOpen />} title={status === "PENDING" ? "Nenhuma regra pendente" : "Nenhum item neste status"} text={status === "PENDING" ? "Em Fontes, processe primeiro o livro Chronicles of Darkness." : "Altere o filtro para consultar outra etapa da revisão."} />}
    <RuleReviewDialog rule={selectedRule} close={() => setSelectedRule(null)} review={review} />
  </section>;
}

function RuleReviewDialog({ rule, close, review }: { rule: RuleRecord | null; close: () => void; review: (rule: RuleRecord, form: HTMLFormElement, status: RuleRecord["reviewStatus"]) => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  if (!rule) return null;
  async function submit(form: HTMLFormElement, status: RuleRecord["reviewStatus"]) {
    setSaving(true);
    try { await review(rule, form, status); } finally { setSaving(false); }
  }
  return <Dialog open={Boolean(rule)} onOpenChange={(open) => { if (!open) close(); }}>
    <DialogContent className="dialog-surface review-dialog">
      <DialogHeader><DialogTitle>Revisar: {rule.originalName}</DialogTitle><DialogDescription>Compare estes metadados com sua cópia do livro. O texto integral não é armazenado automaticamente.</DialogDescription></DialogHeader>
      <form className="review-form" onSubmit={(event) => { event.preventDefault(); void submit(event.currentTarget, "PENDING"); }}>
        <div className="source-reference"><ShieldCheck /><div><span>FONTE CONFIRMADA</span><strong>Chronicles of Darkness · 2ª edição · página {rule.sourcePage}</strong><small>OFFICIAL · Core · seção “{rule.sourceSection}”</small></div></div>
        <div className="review-form-grid">
          <label>Nome original<Input value={rule.originalName} readOnly /></label>
          <label>Nome em português<Input name="translatedName" defaultValue={rule.translatedName ?? ""} placeholder="Tradução aprovada" /></label>
          <label>Categoria<Input name="category" defaultValue={rule.category} required /></label>
          <label>Página<Input name="sourcePage" type="number" min="1" defaultValue={rule.sourcePage ?? ""} required /></label>
          <label className="full">Seção<Input name="sourceSection" defaultValue={rule.sourceSection ?? ""} required /></label>
          <label className="full">Resumo em português<Textarea name="summary" defaultValue={rule.translatedText ?? ""} placeholder="Escreva um resumo próprio depois de conferir a regra…" /></label>
          <label className="full">Dados estruturados (JSON)<Textarea name="structuredData" className="json-editor compact" defaultValue={formatJson(rule.structuredData)} spellCheck={false} /></label>
          <label className="full">Notas da revisão<Textarea name="reviewNotes" defaultValue={rule.reviewNotes ?? ""} placeholder="Dúvidas, conflitos ou decisões de tradução…" /></label>
        </div>
        <div className="copyright-note"><CircleHelp /><span>Use o PDF adquirido para conferência. Registre aqui somente seu resumo, estrutura e decisões de revisão.</span></div>
        <div className="review-actions">
          <Button type="button" variant="ghost" onClick={close}>Cancelar</Button>
          <Button type="submit" variant="outline" disabled={saving}><Save /> Manter pendente</Button>
          <Button type="button" variant="destructive" disabled={saving} onClick={(event) => { const form = event.currentTarget.form; if (form) void submit(form, "REJECTED"); }}><Ban /> Rejeitar</Button>
          <Button type="button" disabled={saving} onClick={(event) => { const form = event.currentTarget.form; if (form) void submit(form, "APPROVED"); }}><CheckCircle2 /> Aprovar</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>;
}

function StatusBadge({ status }: { status: RuleRecord["reviewStatus"] }) {
  return <Badge className={status === "APPROVED" ? "approved-badge" : status === "REJECTED" ? "rejected-badge" : "pending-badge"}>{status === "APPROVED" ? "APROVADA" : status === "REJECTED" ? "REJEITADA" : "PENDENTE"}</Badge>;
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
