"use client";

import { useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { homebrewContentActive, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { localized, useLanguage } from "@/lib/i18n";
import { MERIT_HOMEBREW_SOURCES, meritHomebrewId, normalizeMeritHomebrew, saveMeritHomebrews, type MeritHomebrewLine } from "@/lib/merit-homebrews";
import type { Requirement } from "@/lib/merit-requirements";
import type { MeritDefinition, MeritLevel } from "@/lib/merits";
import { useHomebrewPreferences } from "./use-homebrew";
import { useMeritHomebrews } from "./use-merit-homebrews";

type RequirementKind = "attribute" | "skill" | "merit";
type RequirementRow = { kind: RequirementKind; name: string; minimum: number };

const traits = {
  attribute: Object.values(ATTRIBUTES).flat(),
  skill: Object.values(SKILLS).flat(),
};

function rowsFrom(requirement?: Requirement): { mode: "all" | "any"; rows: RequirementRow[] } {
  const mode = requirement && "any" in requirement ? "any" : "all";
  const entries = !requirement ? [] : "all" in requirement ? requirement.all : "any" in requirement ? requirement.any : [requirement];
  const rows: RequirementRow[] = [];
  for (const entry of entries) {
    if ("trait" in entry) rows.push({ kind: traits.attribute.includes(entry.trait as never) ? "attribute" : "skill", name: entry.trait, minimum: entry.minimum });
    if ("merit" in entry) rows.push({ kind: "merit", name: entry.merit, minimum: entry.minimum ?? 1 });
  }
  return { mode, rows };
}

function requirementFrom(mode: "all" | "any", rows: RequirementRow[]): Requirement | undefined {
  const entries: Requirement[] = rows.filter((row) => row.name).map((row) => row.kind === "merit" ? { merit: row.name, minimum: row.minimum } : { trait: row.name, minimum: row.minimum });
  return entries.length ? mode === "any" ? { any: entries } : { all: entries } : undefined;
}

const emptyMerit = (line: MeritHomebrewLine, category: string): MeritDefinition => ({
  id: meritHomebrewId(), name: "", ratings: [1], line, sourceId: MERIT_HOMEBREW_SOURCES[line].id,
  source: MERIT_HOMEBREW_SOURCES[line].name, category, priority: 999, translatedName: "", description: "", descriptionEn: "", page: 0, homebrew: true,
});

export function MeritHomebrewPanel({ line, catalog }: { line: MeritHomebrewLine; catalog: readonly MeritDefinition[] }) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const allItems = useMeritHomebrews(), items = allItems.filter((item) => item.line === line), preferences = useHomebrewPreferences();
  const source = MERIT_HOMEBREW_SOURCES[line], sourceActive = !preferences.disabledIds.includes(source.id);
  const categories = [...new Set(catalog.map((item) => item.category).filter((item) => item !== "Homebrew"))].sort((a, b) => a.localeCompare(b, locale));
  const [editing, setEditing] = useState<MeritDefinition | null>(null);
  const toggle = (id: string, enabled: boolean) => saveHomebrewPreferences(setHomebrewEnabled(preferences, id, enabled));
  const save = (definition: MeritDefinition) => {
    saveMeritHomebrews(allItems.some((item) => item.id === definition.id) ? allItems.map((item) => item.id === definition.id ? definition : item) : [...allItems, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, source.id, true), definition.id, true));
  };
  return <section className="homebrew-panel">
    <div className="panel-heading"><div><h3>{h("Méritos criados", "Player-created Merits")}</h3><p>{h("Crie Méritos para esta linha. Eles também aparecem no filtro Homebrew.", "Create Merits for this line. They also appear under the Homebrew filter.")}</p></div><Button type="button" size="sm" onClick={() => setEditing(emptyMerit(line, categories[0] ?? "General"))}><Plus/> {h("Criar Mérito", "Create Merit")}</Button></div>
    {items.length === 0 ? <p>{h("Nenhum Mérito criado pelo jogador.", "No player-created Merits yet.")}</p> : <div className="homebrew-source-list"><details className="panel homebrew-source" open><summary className="homebrew-source-summary"><div><Badge variant="outline">{h("Criado pelo jogador", "Player-created")}</Badge><strong>{source.name}</strong><span>{items.length} {h("itens", "items")}</span></div></summary><div className="homebrew-source-body"><div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{sourceActive ? h("Fonte ativa", "Source active") : h("Fonte desativada", "Source disabled")}</span><Switch checked={sourceActive} onCheckedChange={(checked) => toggle(source.id, checked)}/></label></div><div className="homebrew-grid">{[...items].sort((a, b) => a.name.localeCompare(b.name, locale)).map((item) => {
      const active = homebrewContentActive(preferences, item.id, item.sourceId);
      return <article className="homebrew-card" key={item.id}><div><h3>{item.name}</h3><p>{item.description}</p><small>{item.category} · {item.unbounded ? `${item.ratings[0]}+` : item.ratings.join(", ")}</small></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? h("Ativo", "Active") : h("Desativado", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label><Button type="button" size="sm" variant="outline" onClick={() => setEditing(item)}><Pencil/> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {h("Excluir", "Delete")}</Button>} title={h("Excluir Mérito?", "Delete Merit?")} description={h("Ele deixará de aparecer em novas escolhas; fichas existentes conservam o Mérito selecionado.", "It will disappear from new choices; existing sheets retain the selected Merit.")} action={h("Excluir", "Delete")} onConfirm={() => saveMeritHomebrews(allItems.filter((entry) => entry.id !== item.id))}/></div></article>;
    })}</div></div></details></div>}
    {editing && <MeritHomebrewEditor key={editing.id} initial={editing} categories={categories} meritCatalog={[...catalog, ...allItems.filter((item) => item.line === "Core" || item.line === line)]} onOpenChange={(open) => { if (!open) setEditing(null); }} onSave={save}/>}
  </section>;
}

function MeritHomebrewEditor({ initial, categories, meritCatalog, onOpenChange, onSave }: { initial: MeritDefinition; categories: string[]; meritCatalog: readonly MeritDefinition[]; onOpenChange: (open: boolean) => void; onSave: (definition: MeritDefinition) => void }) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const [value, setValue] = useState(() => structuredClone(initial));
  const initialRequirements = rowsFrom(initial.requirements);
  const [mode, setMode] = useState(initialRequirements.mode), [rows, setRows] = useState(initialRequirements.rows), [expanded, setExpanded] = useState(Boolean(initial.levels?.length)), [error, setError] = useState("");
  const set = (key: keyof MeritDefinition, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const toggleRating = (rating: number) => setValue((current) => ({ ...current, ratings: current.ratings.includes(rating) ? current.ratings.filter((item) => item !== rating) : [...current.ratings, rating].sort((a, b) => a - b) }));
  const updateLevel = (rating: number, next: Partial<MeritLevel>) => setValue((current) => ({ ...current, levels: current.ratings.map((item) => ({ rating: item, name: current.levels?.find((level) => level.rating === item)?.name ?? current.name, description: current.levels?.find((level) => level.rating === item)?.description ?? "", ...(item === rating ? next : {}) })) }));
  const updateRow = (index: number, next: Partial<RequirementRow>) => setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, ...next } : row));
  const commit = () => {
    const normalized = normalizeMeritHomebrew({ ...value, levels: expanded ? value.levels : undefined, requirements: requirementFrom(mode, rows) });
    if (!normalized) return setError(h("Preencha nome, categoria, pelo menos um rating e a descrição correspondente.", "Complete the name, category, at least one rating, and its description."));
    onSave(normalized); onOpenChange(false);
  };
  return <Dialog open onOpenChange={onOpenChange}><DialogContent className="homebrew-dialog merit-homebrew-editor"><DialogHeader><DialogTitle>{initial.name ? h("Editar Mérito", "Edit Merit") : h("Criar novo Mérito", "Create New Merit")}</DialogTitle><DialogDescription>{h("Pré-requisitos selecionados são validados; o texto adicional é apenas descritivo.", "Selected prerequisites are enforced; additional text is descriptive only.")}</DialogDescription></DialogHeader><div className="homebrew-form">
    <Section title={h("Definição", "Definition")}><Field label={h("Nome *", "Name *")}><Input value={value.name} onChange={(event) => { set("name", event.target.value); set("translatedName", event.target.value); }}/></Field><Field label={h("Categoria *", "Category *")}><select value={value.category} onChange={(event) => set("category", event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></Field><Field wide label={h("Ratings permitidos *", "Allowed ratings *")}><span className="homebrew-rating-list">{Array.from({ length: 10 }, (_, index) => index + 1).map((rating) => <label key={rating} className="homebrew-inline-check"><input type="checkbox" checked={value.ratings.includes(rating)} onChange={() => toggleRating(rating)}/><span>{rating}</span></label>)}</span></Field><label className="homebrew-inline-check"><input type="checkbox" checked={value.unbounded === true} onChange={(event) => set("unbounded", event.target.checked || undefined)}/><span>{h("Sem limite a partir do menor rating", "Unbounded from the lowest rating")}</span></label><label className="homebrew-inline-check"><input type="checkbox" checked={expanded} onChange={(event) => setExpanded(event.target.checked)}/><span>{h("Descrição por rank (estilo/expandido)", "Description per rank (style/expanded)")}</span></label>{expanded ? <div className="wide homebrew-levels">{value.ratings.map((rating) => <section key={rating}><strong>{rating}</strong><Input value={value.levels?.find((level) => level.rating === rating)?.name ?? value.name} onChange={(event) => updateLevel(rating, { name: event.target.value })}/><Textarea value={value.levels?.find((level) => level.rating === rating)?.description ?? ""} onChange={(event) => updateLevel(rating, { description: event.target.value })}/></section>)}</div> : <Field wide label={h("Descrição *", "Description *")}><Textarea value={value.description} onChange={(event) => set("description", event.target.value)}/></Field>}</Section>
    <Section title={h("Pré-requisitos", "Prerequisites")}><Field label={h("Combinação", "Combination")}><select value={mode} onChange={(event) => setMode(event.target.value as "all" | "any")}><option value="all">{h("Todos", "All")}</option><option value="any">{h("Qualquer um", "Any")}</option></select></Field><div className="wide"><Button type="button" size="sm" variant="outline" onClick={() => setRows((current) => [...current, { kind: "attribute", name: traits.attribute[0], minimum: 1 }])}><Plus/> {h("Adicionar requisito", "Add prerequisite")}</Button></div>{rows.map((row, index) => { const options = row.kind === "merit" ? meritCatalog.filter((item) => item.id !== value.id).map((item) => item.name) : traits[row.kind]; return <div className="homebrew-repeat" key={index}><Field label={h("Tipo", "Type")}><select value={row.kind} onChange={(event) => { const kind = event.target.value as RequirementKind; updateRow(index, { kind, name: kind === "merit" ? meritCatalog.find((item) => item.id !== value.id)?.name ?? "" : traits[kind][0] }); }}><option value="attribute">{h("Atributo", "Attribute")}</option><option value="skill">{h("Perícia", "Skill")}</option><option value="merit">{h("Mérito", "Merit")}</option></select></Field><Field label={h("Valor", "Value")}><select value={row.name} onChange={(event) => updateRow(index, { name: event.target.value })}>{[...new Set(options)].sort().map((option) => <option key={option}>{option}</option>)}</select></Field><Field label={h("Mínimo", "Minimum")}><Input type="number" min={1} max={10} value={row.minimum} onChange={(event) => updateRow(index, { minimum: Number(event.target.value) })}/></Field><Button type="button" size="sm" variant="ghost" onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))}><Trash2/> {h("Remover", "Remove")}</Button></div>;})}<Field wide label={h("Outros pré-requisitos (apenas descritivos)", "Other prerequisites (descriptive only)")}><Textarea value={value.narrativePrerequisites ?? ""} onChange={(event) => set("narrativePrerequisites", event.target.value)}/></Field></Section>
  </div>{error && <p className="homebrew-error" role="alert">{error}</p>}<DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{h("Cancelar", "Cancel")}</Button><Button type="button" onClick={commit}>{h("Salvar Mérito", "Save Merit")}</Button></DialogFooter></DialogContent></Dialog>;
}

function Section({ title, children }: { title: string; children: ReactNode }) { return <fieldset className="wide homebrew-section"><legend><span>{title}</span></legend><div>{children}</div></fieldset>; }
function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) { return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>; }
