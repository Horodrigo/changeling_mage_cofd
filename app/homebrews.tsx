"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { alphabetical } from "@/lib/option-order";
import { CONTRACTS } from "@/lib/catalog/contract-catalog";
import { RAW_MERITS } from "@/lib/merits";
import { ARCANA, CTL_NEEDLE_DEFINITIONS, CTL_SEEMINGS, CTL_THREAD_DEFINITIONS, REGALIA, SKILLS } from "@/lib/creation-rules";
import { KITHS } from "@/lib/changeling-kiths";
import type { EntitlementDefinition } from "@/lib/entitlements";
import { courtDisplayName } from "@/lib/changeling-courts";
import { localized, localizedCount, useLanguage, type Locale } from "@/lib/i18n";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useHomebrews } from "./use-homebrews";
import {
  formatNamedText,
  BUILTIN_HOMEBREW_SOURCES,
  homebrewId,
  migrateCharacterHomebrews,
  parseNamedText,
  saveHomebrews,
  type HomebrewCatalog,
  type HomebrewContract,
  type HomebrewCourt,
  type HomebrewKith,
  type HomebrewMerit,
  type HomebrewOrder,
  type HomebrewSpell,
} from "@/lib/homebrews";

type Kind = "kith" | "court" | "order" | "contract" | "spell" | "merit";
type HomebrewItem = HomebrewContract | HomebrewSpell | HomebrewMerit | HomebrewKith | HomebrewCourt | HomebrewOrder;
type DeleteTarget = { kind: Kind; id: string; name: string } | null;

const emptyContract = (): HomebrewContract => ({
  id: homebrewId("contract"), name: "", originalName: "", type: "Comum",
  regalia: "Independente", description: "", costs: ["1 Glamour"],
  categoryKind: "Independente", hasRoll: true, dicePool: "", loophole: "",
  seemingBenefits: {}, courtBenefits: {}, options: [], sourceId: "homebrew",
  source: "Criação do jogador", page: 0, homebrew: true,
});
const emptySpell = (): HomebrewSpell => ({
  id: homebrewId("spell"), name: "", originalName: "", requirements: {},
  practice: "Conhecer", primaryFactor: "Potência", withstand: "", roteSkills: [],
  description: "", sourceId: "homebrew", source: "Criação do jogador",
  page: 0, homebrew: true,
});
const emptyMerit = (): HomebrewMerit => ({
  id: homebrewId("merit"), name: "", translatedName: "", ratings: [1],
  line: "Core", sourceId: "homebrew", source: "Criação do jogador",
  category: "Geral", priority: 10, description: "", descriptionEn: "", prerequisites: "",
  page: 0, homebrew: true, repeatable: false, hasLevelBenefits: false, levels: [],
});
const emptyKith = (): HomebrewKith => ({ id:homebrewId("kith"),name:"",skill:"",description:"",blessing:"",source:"Criação do jogador",page:0,homebrew:true });
const emptyCourt = (): HomebrewCourt => ({ id:homebrewId("court"),name:"",emotion:"",mantleBenefits:[],homebrew:true });
const emptyOrder = (): HomebrewOrder => ({ id:homebrewId("order"),name:"",description:"",roteSkills:[],homebrew:true });

export function HomebrewsScreen({ characters }: { characters: CharacterSheet[] }) {
  const catalog = useHomebrews();
  useEffect(() => {
    const migrated = migrateCharacterHomebrews(catalog, characters);
    if (
      migrated.kiths.length !== catalog.kiths.length ||
      migrated.courts.length !== catalog.courts.length ||
      migrated.orders.length !== catalog.orders.length
    )
      saveHomebrews(migrated);
  }, [catalog, characters]);
  return <HomebrewsPage catalog={catalog} />;
}

export function HomebrewsPage({
  catalog,
}: {
  catalog: HomebrewCatalog;
}) {
  const { locale } = useLanguage();
  const h = (pt: string, en: string) => localized(locale, pt, en);
  const [editor, setEditor] = useState<Kind | null>(null);
  const [contract, setContract] = useState<HomebrewContract>(emptyContract);
  const [spell, setSpell] = useState<HomebrewSpell>(emptySpell);
  const [merit, setMerit] = useState<HomebrewMerit>(emptyMerit);
  const [kith, setKith] = useState<HomebrewKith>(emptyKith);
  const [court, setCourt] = useState<HomebrewCourt>(emptyCourt);
  const [order, setOrder] = useState<HomebrewOrder>(emptyOrder);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [error, setError] = useState("");
  const regalia = useMemo(
    () => [...new Set([...REGALIA, ...catalog.contracts.filter(item=>item.categoryKind==="Regalia").map((item) => item.regalia).filter(Boolean)])],
    [catalog.contracts],
  );
  const courts = useMemo(()=>[...new Set(catalog.courts.map(item=>item.name))],[catalog.courts]);
  const meritCategories = useMemo(()=>[...new Set([...RAW_MERITS.map(item=>item.category),...catalog.merits.map(item=>item.category)])].sort((a,b)=>a.localeCompare(b,"pt-BR")),[catalog.merits]);
  const commit = (next: HomebrewCatalog) => {
    saveHomebrews(next);
  };
  const openNew = (kind: Kind) => {
    setError("");
    if (kind === "contract") setContract(emptyContract());
    if (kind === "spell") setSpell(emptySpell());
    if (kind === "merit") setMerit(emptyMerit());
    if (kind === "kith") setKith(emptyKith());
    if (kind === "court") setCourt(emptyCourt());
    if (kind === "order") setOrder(emptyOrder());
    setEditor(kind);
  };
  const openEdit = (kind: Kind, item: HomebrewContract | HomebrewSpell | HomebrewMerit | HomebrewKith | HomebrewCourt | HomebrewOrder) => {
    setError("");
    if (kind === "contract") setContract(structuredClone(item as HomebrewContract));
    if (kind === "spell") setSpell(structuredClone(item as HomebrewSpell));
    if (kind === "merit") setMerit(structuredClone(item as HomebrewMerit));
    if (kind === "kith") setKith(structuredClone(item as HomebrewKith));
    if (kind === "court") setCourt(structuredClone(item as HomebrewCourt));
    if (kind === "order") setOrder(structuredClone(item as HomebrewOrder));
    setEditor(kind);
  };
  const upsert = <T extends { id: string }>(items: T[], item: T) =>
    items.some((entry) => entry.id === item.id)
      ? items.map((entry) => (entry.id === item.id ? item : entry))
      : [item, ...items];
  const save = () => {
    setError("");
    if (editor === "contract") {
      if (!contract.name.trim() || !contract.regalia.trim() || !(contract.loophole ?? "").trim())
        return setError(h("Informe nome, categoria e Brecha do Contrato.", "Enter the Contract's name, category, and Loophole."));
      if (contract.hasRoll && (!contract.dicePool?.trim() || !contract.success?.trim()))
        return setError(h("Contratos com jogada precisam de parada de dados e efeito de Sucesso.", "Contracts with a roll require a dice pool and a Success effect."));
      const item = { ...contract, name: contract.name.trim(), originalName: contract.name.trim(), regalia: contract.categoryKind === "Independente" ? "Independente" : contract.regalia.trim(), cost: contract.costs.join(" + "), ...(!contract.hasRoll ? {dicePool:"Nenhum",success:undefined,exceptionalSuccess:undefined,failure:undefined,dramaticFailure:undefined} : {}) };
      commit({ ...catalog, contracts: upsert(catalog.contracts, item) });
    }
    if (editor === "spell") {
      if (!spell.name.trim() || Object.keys(spell.requirements).length !== 1 || !spell.practice.trim() || !spell.primaryFactor.trim() || spell.roteSkills.length !== 1)
        return setError(h("Informe nome, Arcano, Prática, Fator Primário e uma Perícia de Rota.", "Enter the name, Arcanum, Practice, Primary Factor, and one Rote Skill."));
      const item = { ...spell, name: spell.name.trim(), originalName: spell.name.trim() };
      commit({ ...catalog, spells: upsert(catalog.spells, item) });
    }
    if (editor === "merit") {
      if (!merit.translatedName.trim() || !merit.ratings.length || !merit.description.trim())
        return setError(h("Informe nome, níveis e descrição do Mérito.", "Enter the Merit's name, ratings, and description."));
      const item = { ...merit, name: merit.translatedName.trim(), translatedName: merit.translatedName.trim(), ratings: [...new Set(merit.ratings)].sort((a,b) => a-b) };
      commit({ ...catalog, merits: upsert(catalog.merits, item) });
    }
    if (editor === "kith") {
      if (!kith.name.trim() || !kith.skill.trim() || !kith.blessing.trim()) return setError(h("Informe nome, Perícia e Bênção da Frátria.", "Enter the Kith's name, Skill, and Blessing."));
      commit({ ...catalog, kiths: upsert(catalog.kiths, {...kith,name:kith.name.trim()}) });
    }
    if (editor === "court") {
      if (!court.name.trim() || !court.emotion.trim() || court.mantleBenefits.length !== 5 || court.mantleBenefits.some(item=>!item.trim())) return setError(h("Informe nome, emoção e os cinco benefícios de Manto da Corte.", "Enter the Court's name, emotion, and all five Mantle benefits."));
      commit({ ...catalog, courts: upsert(catalog.courts, {...court,name:court.name.trim()}) });
    }
    if (editor === "order") {
      if (!order.name.trim() || order.roteSkills.length !== 3 || order.roteSkills.some(item=>!item) || new Set(order.roteSkills).size!==3) return setError(h("Informe nome e exatamente três Perícias de Rota distintas.", "Enter the Order's name and exactly three distinct Rote Skills."));
      commit({ ...catalog, orders: upsert(catalog.orders, {...order,name:order.name.trim()}) });
    }
    setEditor(null);
  };
  const remove = () => {
    if (!deleteTarget) return;
    const plural = ({kith:"kiths",court:"courts",order:"orders",contract:"contracts",spell:"spells",merit:"merits"} as const)[deleteTarget.kind];
    commit({ ...catalog, [plural]: catalog[plural].filter((item) => item.id !== deleteTarget.id) });
    setDeleteTarget(null);
  };
  const toggle = (id:string, checked:boolean) => commit({...catalog,disabledIds:checked?catalog.disabledIds.filter(item=>item!==id):[...new Set([...catalog.disabledIds,id])]});
  const card = (kind:Kind,item:HomebrewItem,title:string,meta:string,text:string) => <HomebrewCard key={item.id} title={title} meta={meta} text={text} active={!catalog.disabledIds.includes(item.id)} toggle={(checked)=>toggle(item.id,checked)} edit={()=>openEdit(kind,item)} remove={()=>setDeleteTarget({kind,id:item.id,name:title})}/>;
  return (
    <section className="homebrew-page">
      <div className="homebrew-hero">
        <div><Badge>HOMEBREW</Badge><h2>{h("Conteúdo Homebrew", "Homebrew Content")}</h2><p>{h("Ative ou desative os livros homebrew consolidados incluídos na aplicação.", "Enable or disable the consolidated homebrew books included with the application.")}</p></div>
        <Sparkles aria-hidden="true" />
      </div>
      <section className="panel homebrew-settings"><div><h3>{h("Usar Homebrews nas regras", "Use Homebrews in the rules")}</h3><p>{h("Desativar oculta todos os homebrews das escolhas sem apagar dados ou preferências individuais.", "Turning this off hides all homebrews from selections without deleting data or individual preferences.")}</p></div><Switch checked={catalog.enabled} onCheckedChange={(enabled)=>commit({...catalog,enabled})} aria-label={h("Usar Homebrews nas regras", "Use Homebrews in the rules")} /></section>
      <section className="panel"><div className="panel-heading"><div><h3>{h("Livros homebrew incluídos", "Included homebrew books")}</h3><p>{h("Conteúdo que acompanha a aplicação e pode ser ativado por livro.", "Content bundled with the application that can be enabled per book.")}</p></div></div><div className="homebrew-grid">{BUILTIN_HOMEBREW_SOURCES.map(source=>{const contracts=CONTRACTS.filter(x=>x.sourceId===source.id);const merits=RAW_MERITS.filter(x=>x.sourceId===source.id);const kiths=KITHS.filter(x=>x.sourceId===source.id);const entitlements:EntitlementDefinition[]=[];const needles=CTL_NEEDLE_DEFINITIONS.filter(x=>x.sourceId===source.id);const threads=CTL_THREAD_DEFINITIONS.filter(x=>x.sourceId===source.id);const seemings=Object.entries(CTL_SEEMINGS).filter(([,item])=>"sourceId" in item&&item.sourceId===source.id).map(([name])=>name);return <article className="homebrew-card" key={source.id}><div><Badge variant="outline">{h("Incluído na aplicação", "Included with the application")}</Badge><h3>{source.name}</h3><p>{localizedCount(locale,contracts.length,"Contrato","Contratos","Contract","Contracts")} · {localizedCount(locale,merits.length,"Mérito","Méritos","Merit","Merits")} · {localizedCount(locale,kiths.length,"Frátria","Frátrias","Kith","Kiths")} · {localizedCount(locale,entitlements.length,"Título","Títulos","Entitlement","Entitlements")}</p><details><summary>{h("Ver conteúdo", "View content")}</summary>{seemings.length>0&&<p><strong>Seemings:</strong> {seemings.join(", ")}</p>}{kiths.length>0&&<p><strong>{h("Frátrias:","Kiths:")}</strong> {kiths.map(x=>locale==="pt-BR"?x.translatedName:x.name).join(", ")}</p>}{entitlements.length>0&&<p><strong>Entitlements:</strong> {entitlements.map(x=>x.name).join(", ")}</p>}{needles.length>0&&<p><strong>Needles:</strong> {needles.map(x=>x.name).join(", ")}</p>}{threads.length>0&&<p><strong>Threads:</strong> {threads.map(x=>x.name).join(", ")}</p>}{contracts.length>0&&<p><strong>{h("Contratos:", "Contracts:")}</strong> {contracts.map(x=>locale==="pt-BR"?x.name:x.originalName).join(", ")}</p>}{merits.length>0&&<p><strong>{h("Méritos:", "Merits:")}</strong> {merits.map(x=>locale==="pt-BR"?x.translatedName:x.name).join(", ")}</p>}</details></div><label className="homebrew-toggle"><span>{catalog.disabledIds.includes(source.id)?h("Desativado","Disabled"):h("Ativo","Active")}</span><Switch aria-label={`${source.name}: ${catalog.disabledIds.includes(source.id)?h("desativado","disabled"):h("ativo","active")}`} checked={!catalog.disabledIds.includes(source.id)} onCheckedChange={checked=>toggle(source.id,checked)} /></label></article>})}</div></section>
      <div hidden>
      <Tabs defaultValue="contracts">
        <TabsList className="homebrew-tabs-list"><TabsTrigger value="contracts">{h("Contratos", "Contracts")} ({catalog.contracts.length})</TabsTrigger><TabsTrigger value="spells">{h("Magias", "Spells")} ({catalog.spells.length})</TabsTrigger><TabsTrigger value="merits">{h("Méritos", "Merits")} ({catalog.merits.length})</TabsTrigger><TabsTrigger value="kiths">{h("Frátrias", "Kiths")} ({catalog.kiths.length})</TabsTrigger><TabsTrigger value="courts">{h("Cortes", "Courts")} ({catalog.courts.length})</TabsTrigger><TabsTrigger value="orders">{h("Ordens", "Orders")} ({catalog.orders.length})</TabsTrigger></TabsList>
        <HomebrewTab value="contracts" title={h("Contratos personalizados", "Custom Contracts")} text={h("Regalias, Cortes e pactos independentes.", "Regalia, Courts, and independent pacts.")} add={() => openNew("contract")}>
          {catalog.contracts.map((item) => card("contract",item,item.name,`${contractTypeLabel(item.type,locale)} · ${contractCategoryLabel(item.categoryKind,locale)}: ${localizedRuleLabel(item.regalia,locale)}`,item.description || item.success || h("Sem descrição", "No description")))}
        </HomebrewTab>
        <HomebrewTab value="spells" title={h("Magias personalizadas", "Custom Spells")} text={h("Feitiços disponíveis como Rotes e Práxis.", "Spells available as Rotes and Praxes.")} add={() => openNew("spell")}>
          {catalog.spells.map((item) => card("spell",item,item.name,formatRequirements(item.requirements,locale),item.description || h("Sem descrição", "No description")))}
        </HomebrewTab>
        <HomebrewTab value="merits" title={h("Méritos personalizados", "Custom Merits")} text={h("Méritos comuns, repetíveis e Estilos com manobras.", "Standard and repeatable Merits, including Styles with maneuvers.")} add={() => openNew("merit")}>
          {catalog.merits.map((item) => card("merit",item,item.translatedName,`${lineLabel(item.line,locale)} · ${localizedRuleLabel(item.category,locale)} · ${item.ratings.join(", ")} ${h("ponto(s)", "dot(s)")}`,item.description))}
        </HomebrewTab>
        <HomebrewTab value="kiths" title={h("Frátrias personalizadas", "Custom Kiths")} text={h("Frátrias migradas de fichas e criadas na oficina.", "Kiths migrated from character sheets and created in the workshop.")} add={()=>openNew("kith")}>{catalog.kiths.map(item=>card("kith",item,item.name,localizedRuleLabel(item.skill,locale),item.blessing))}</HomebrewTab>
        <HomebrewTab value="courts" title={h("Cortes personalizadas", "Custom Courts")} text={h("Cortes e seus benefícios de Manto.", "Courts and their Mantle benefits.")} add={()=>openNew("court")}>{catalog.courts.map(item=>card("court",item,item.name,item.emotion,item.mantleBenefits.join(" · ")))}</HomebrewTab>
        <HomebrewTab value="orders" title={h("Ordens personalizadas", "Custom Orders")} text={h("Ordens e suas Perícias de Rota.", "Orders and their Rote Skills.")} add={()=>openNew("order")}>{catalog.orders.map(item=>card("order",item,item.name,item.roteSkills.map(skill=>localizedRuleLabel(skill,locale)).join(", "),item.description))}</HomebrewTab>
      </Tabs>
      <Dialog open={editor === "contract"} onOpenChange={(open) => !open && setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>{h("Criar ou editar Contrato", "Create or edit Contract")}</DialogTitle><DialogDescription>{h("Campos vazios opcionais não aparecerão na ficha.", "Optional empty fields will not appear on the character sheet.")}</DialogDescription></DialogHeader><ContractForm value={contract} onChange={setContract} knownRegalia={regalia} knownCourts={courts} /><EditorFooter error={error} save={save} cancel={() => setEditor(null)} /></DialogContent></Dialog>
      <Dialog open={editor === "spell"} onOpenChange={(open) => !open && setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>{h("Criar ou editar Magia", "Create or edit Spell")}</DialogTitle><DialogDescription>{h("Os requisitos de Arcana controlarão Rotes e Práxis disponíveis.", "Arcana requirements determine the available Rotes and Praxes.")}</DialogDescription></DialogHeader><SpellForm value={spell} onChange={setSpell} /><EditorFooter error={error} save={save} cancel={() => setEditor(null)} /></DialogContent></Dialog>
      <Dialog open={editor === "merit"} onOpenChange={(open) => !open && setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>{h("Criar ou editar Mérito", "Create or edit Merit")}</DialogTitle><DialogDescription>{h("Méritos podem descrever individualmente cada nível adquirido.", "Merits may describe each purchased rating individually.")}</DialogDescription></DialogHeader><MeritForm key={merit.id} value={merit} onChange={setMerit} categories={meritCategories} /><EditorFooter error={error} save={save} cancel={() => setEditor(null)} /></DialogContent></Dialog>
      <Dialog open={editor === "kith"} onOpenChange={open=>!open&&setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>{h("Criar ou editar Frátria", "Create or edit Kith")}</DialogTitle></DialogHeader><KithForm value={kith} onChange={setKith}/><EditorFooter error={error} save={save} cancel={()=>setEditor(null)}/></DialogContent></Dialog>
      <Dialog open={editor === "court"} onOpenChange={open=>!open&&setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>{h("Criar ou editar Corte", "Create or edit Court")}</DialogTitle></DialogHeader><CourtForm value={court} onChange={setCourt}/><EditorFooter error={error} save={save} cancel={()=>setEditor(null)}/></DialogContent></Dialog>
      <Dialog open={editor === "order"} onOpenChange={open=>!open&&setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>{h("Criar ou editar Ordem", "Create or edit Order")}</DialogTitle></DialogHeader><OrderForm value={order} onChange={setOrder}/><EditorFooter error={error} save={save} cancel={()=>setEditor(null)}/></DialogContent></Dialog>
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{h("Excluir", "Delete")} “{deleteTarget?.name}”?</AlertDialogTitle><AlertDialogDescription>{h("O item deixará de aparecer em novas escolhas. Fichas que já o possuem preservam seus dados.", "The item will no longer appear in new selections. Character sheets that already include it will preserve their data.")}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{h("Cancelar", "Cancel")}</AlertDialogCancel><AlertDialogAction onClick={remove}>{h("Excluir", "Delete")}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      </div>
    </section>
  );
}

function HomebrewTab({value,title,text,add,children}:{value:string;title:string;text:string;add:()=>void;children:ReactNode}) { const {locale}=useLanguage();return <TabsContent value={value}><section className="panel homebrew-panel"><div className="panel-heading"><div><h3>{title}</h3><p>{text}</p></div><Button onClick={add}><Plus /> {localized(locale,"Criar","Create")}</Button></div><div className="homebrew-grid">{children}<button className="homebrew-add-card" onClick={add}><Plus /><strong>{localized(locale,"Criar novo","Create new")}</strong></button></div></section></TabsContent>; }
function HomebrewCard({title,meta,text,edit,remove,active,toggle}:{title:string;meta:string;text:string;edit:()=>void;remove:()=>void;active:boolean;toggle:(checked:boolean)=>void}) { const {locale}=useLanguage();return <article className="homebrew-card"><div><Badge variant="outline">{meta}</Badge><h3>{title}</h3><p>{text}</p></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active?localized(locale,"Ativo","Active"):localized(locale,"Desativado","Disabled")}</span><Switch aria-label={localized(locale,"Ativar ou desativar item","Enable or disable item")} checked={active} onCheckedChange={toggle}/></label><Button size="sm" variant="outline" onClick={edit}><Pencil /> {localized(locale,"Editar","Edit")}</Button><Button size="sm" variant="ghost" onClick={remove}><Trash2 /> {localized(locale,"Excluir","Delete")}</Button></div></article>; }
function EditorFooter({error,save,cancel}:{error:string;save:()=>void;cancel:()=>void}) { const {locale}=useLanguage();return <><>{error && <p className="homebrew-error" role="alert">{error}</p>}</><DialogFooter><Button variant="outline" onClick={cancel}>{localized(locale,"Cancelar","Cancel")}</Button><Button onClick={save}>{localized(locale,"Salvar Homebrew","Save Homebrew")}</Button></DialogFooter></>; }
function Field({label,children,wide=false}:{label:string;children:ReactNode;wide?:boolean}) { return <label className={wide?"wide":""}><span>{label}</span>{children}</label>; }

const RULE_LABELS_EN: Record<string,string> = {
  Comum:"Common", Real:"Royal", Corte:"Court", Independente:"Independent", Regalia:"Regalia",
  Morte:"Death", Destino:"Fate", Forças:"Forces", Vida:"Life", Matéria:"Matter", Mente:"Mind", Primórdio:"Prime", Espaço:"Space", Espírito:"Spirit", Tempo:"Time",
  Conhecer:"Knowing", Revelar:"Unveiling", Compelir:"Compelling", Governar:"Ruling", Proteger:"Shielding", Velar:"Veiling", Enfraquecer:"Fraying", Aperfeiçoar:"Perfecting", Tecer:"Weaving", Padronizar:"Patterning", Desmantelar:"Unraveling", Criar:"Making", Destruir:"Unmaking",
  Duração:"Duration", Potência:"Potency", Perseverança:"Resolve", Vigor:"Stamina", Compostura:"Composure",
  Inteligência:"Intelligence", Raciocínio:"Wits", Força:"Strength", Destreza:"Dexterity", Presença:"Presence", Manipulação:"Manipulation",
  Erudição:"Academics", Computação:"Computer", Ofícios:"Crafts", Investigação:"Investigation", Medicina:"Medicine", Ocultismo:"Occult", Política:"Politics", Ciência:"Science",
  Atletismo:"Athletics", Briga:"Brawl", Condução:"Drive", "Armas de Fogo":"Firearms", Furto:"Larceny", "Armas Brancas":"Weaponry", Furtividade:"Stealth", Sobrevivência:"Survival",
  "Empatia com Animais":"Animal Ken", Empatia:"Empathy", Expressão:"Expression", Intimidação:"Intimidation", Persuasão:"Persuasion", Socialização:"Socialize", Manha:"Streetwise", Subterfúgio:"Subterfuge",
  Coroa:"Crown", Joias:"Jewels", Espelho:"Mirror", Escudo:"Shield", Corcel:"Steed", Espada:"Sword", Cálice:"Chalice", Moeda:"Coin", Cetro:"Scepter", Estrelas:"Stars", Espinho:"Thorn",
  Primavera:"Spring", Verão:"Summer", Outono:"Autumn", Inverno:"Winter", Geral:"General", Mental:"Mental", Físico:"Physical", Physical:"Physical", Social:"Social", Sobrenatural:"Supernatural",
};
const localizedRuleLabel=(value:string,locale:Locale)=>locale==="en-US"?(RULE_LABELS_EN[value]??courtDisplayName(value,locale)):value;
const contractTypeLabel=(value:string,locale:Locale)=>localizedRuleLabel(value,locale);
const contractCategoryLabel=(value:string,locale:Locale)=>localizedRuleLabel(value,locale);
const lineLabel=(value:string,locale:Locale)=>value==="Core"?localized(locale,"Todos","All"):value==="MtA"?localized(locale,"Mago","Mage"):"Changeling";

function ContractForm({value,onChange,knownRegalia,knownCourts}:{value:HomebrewContract;onChange:(v:HomebrewContract)=>void;knownRegalia:string[];knownCourts:string[]}) {
  const {locale}=useLanguage();const h=(pt:string,en:string)=>localized(locale,pt,en);
  return <div className="homebrew-form">
    <Field label={h("Nome","Name")}><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field>
    <Field label={h("Tipo","Type")}><select value={value.type} onChange={e=>onChange({...value,type:e.target.value as "Comum"|"Real"})}><option value="Comum">{contractTypeLabel("Comum",locale)}</option><option value="Real">{contractTypeLabel("Real",locale)}</option></select></Field><Field label={h("Categoria","Category")}><select value={value.categoryKind} onChange={e=>{const categoryKind=e.target.value as HomebrewContract["categoryKind"];onChange({...value,categoryKind,regalia:categoryKind==="Independente"?"Independente":""})}}><option value="Corte">{contractCategoryLabel("Corte",locale)}</option><option value="Independente">{contractCategoryLabel("Independente",locale)}</option><option value="Regalia">Regalia</option></select></Field>
    {value.categoryKind === "Regalia" && <CategoryPicker key={`${value.id}:regalia`} label="Regalia" value={value.regalia} options={knownRegalia} onChange={regalia=>onChange({...value,regalia})} allowCustom />}
    {value.categoryKind === "Corte" && <CategoryPicker key={`${value.id}:court`} label={h("Corte","Court")} value={value.regalia} options={knownCourts} onChange={regalia=>onChange({...value,regalia})} />}
    <Field label={h("Custos (um por linha)","Costs (one per line)")} wide><Textarea value={value.costs.join("\n")} onChange={e=>onChange({...value,costs:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})} placeholder={h('1 Glamour\n1 Força de Vontade','1 Glamour\n1 Willpower')}/></Field>
    <Field label={h("Possui jogada de dados","Has a dice roll")}><select value={value.hasRoll?"sim":"nao"} onChange={e=>onChange({...value,hasRoll:e.target.value==="sim"})}><option value="nao">{h("Não","No")}</option><option value="sim">{h("Sim","Yes")}</option></select></Field>{value.hasRoll && <Field label={h("Parada de dados","Dice pool")}><Input value={value.dicePool??""} onChange={e=>onChange({...value,dicePool:e.target.value})}/></Field>}
    {value.hasRoll ? <>
      <Field label={h("Sucesso","Success")} wide><Textarea value={value.success??""} onChange={e=>onChange({...value,success:e.target.value,description:e.target.value})}/></Field>
      <Field label={h("Sucesso Excepcional","Exceptional Success")} wide><Textarea value={value.exceptionalSuccess??""} onChange={e=>onChange({...value,exceptionalSuccess:e.target.value})}/></Field>
      <Field label={h("Falha","Failure")} wide><Textarea value={value.failure??""} onChange={e=>onChange({...value,failure:e.target.value})}/></Field>
      <Field label={h("Falha Dramática","Dramatic Failure")} wide><Textarea value={value.dramaticFailure??""} onChange={e=>onChange({...value,dramaticFailure:e.target.value})}/></Field>
    </> : <Field label={h("Efeito","Effect")} wide><Textarea value={value.description} onChange={e=>onChange({...value,description:e.target.value,success:undefined,exceptionalSuccess:undefined,failure:undefined,dramaticFailure:undefined})}/></Field>}
    <Field label={h("Opções (uma por linha)","Options (one per line)")} wide><Textarea value={(value.options??[]).join("\n")} onChange={e=>onChange({...value,options:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})}/></Field>
    {value.categoryKind !== "Corte" && <Field label={h("Benefícios de Feição (Feição: benefício)","Seeming Benefits (Seeming: benefit)")} wide><Textarea value={formatNamedText(value.seemingBenefits as Record<string,string>)} onChange={e=>onChange({...value,seemingBenefits:parseNamedText(e.target.value)})} placeholder={`${Object.keys(CTL_SEEMINGS)[0]}: ${h("benefício","benefit")}`}/></Field>}
    {value.categoryKind === "Corte" && <Field label={h("Benefícios de Corte (Corte: benefício)","Court Benefits (Court: benefit)")} wide><Textarea value={formatNamedText(value.courtBenefits)} onChange={e=>onChange({...value,courtBenefits:parseNamedText(e.target.value)})}/></Field>}
    <Field label={h("Brecha","Loophole")} wide><Textarea value={value.loophole??""} onChange={e=>onChange({...value,loophole:e.target.value})}/></Field>
  </div>;
}
const PRACTICES = [{name:"Conhecer",level:1},{name:"Revelar",level:1},{name:"Compelir",level:1},{name:"Governar",level:2},{name:"Proteger",level:2},{name:"Velar",level:2},{name:"Enfraquecer",level:3},{name:"Aperfeiçoar",level:3},{name:"Tecer",level:3},{name:"Padronizar",level:4},{name:"Desmantelar",level:4},{name:"Criar",level:5},{name:"Destruir",level:5}] as const;
const ARCANA_KEYS:Record<string,string>={Morte:"Death",Destino:"Fate","Forças":"Forces",Vida:"Life","Matéria":"Matter",Mente:"Mind","Primórdio":"Prime","Espaço":"Space","Espírito":"Spirit",Tempo:"Time"};
const ALL_SKILLS=Object.values(SKILLS).flat();
function SpellForm({value,onChange}:{value:HomebrewSpell;onChange:(v:HomebrewSpell)=>void}) { const {locale}=useLanguage();const h=(pt:string,en:string)=>localized(locale,pt,en);const arcana=Object.keys(value.requirements)[0]??""; return <div className="homebrew-form">
  <Field label={h("Nome","Name")}><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field>
  <Field label={h("Arcano","Arcanum")}><select value={arcana} onChange={e=>{const level=PRACTICES.find(p=>p.name===value.practice)?.level??1;onChange({...value,requirements:e.target.value?{[e.target.value]:level}:{}})}}><option value="">{h("Selecione","Select")}</option>{alphabetical(ARCANA, name=>localizedRuleLabel(name,locale),locale).map(name=><option key={name} value={ARCANA_KEYS[name]}>{localizedRuleLabel(name,locale)}</option>)}</select></Field>
  <Field label={h("Prática","Practice")}><select value={value.practice} onChange={e=>{const practice=e.target.value;const level=PRACTICES.find(p=>p.name===practice)?.level??1;onChange({...value,practice,requirements:arcana?{[arcana]:level}:{}})}}>{alphabetical(PRACTICES, p=>localizedRuleLabel(p.name,locale),locale).map(p=><option key={p.name} value={p.name}>{localizedRuleLabel(p.name,locale)} ({h("Arcano","Arcanum")} {p.level})</option>)}</select></Field>
  <Field label={h("Fator Primário","Primary Factor")}><select value={value.primaryFactor} onChange={e=>onChange({...value,primaryFactor:e.target.value})}><option value="Duração">{localizedRuleLabel("Duração",locale)}</option><option value="Potência">{localizedRuleLabel("Potência",locale)}</option></select></Field>
  <Field label={h("Resistência","Withstand")}><select value={value.withstand} onChange={e=>onChange({...value,withstand:e.target.value})}><option value="">{h("Nenhuma","None")}</option>{["Perseverança","Vigor","Compostura"].map(attribute=><option key={attribute} value={attribute}>{localizedRuleLabel(attribute,locale)}</option>)}</select></Field>
  <Field label={h("Perícia de Rota","Rote Skill")}><select value={value.roteSkills[0]??""} onChange={e=>onChange({...value,roteSkills:e.target.value?[e.target.value]:[]})}><option value="">{h("Selecione","Select")}</option>{ALL_SKILLS.map(skill=><option key={skill} value={skill}>{localizedRuleLabel(skill,locale)}</option>)}</select></Field>
  <Field label={h("Descrição / Efeito","Description / Effect")} wide><Textarea value={value.description??""} onChange={e=>onChange({...value,description:e.target.value})}/></Field>
  </div>; }
function MeritForm({value,onChange,categories}:{value:HomebrewMerit;onChange:(v:HomebrewMerit)=>void;categories:string[]}) { const {locale}=useLanguage();const h=(pt:string,en:string)=>localized(locale,pt,en);const contiguous=value.ratings.length>0&&value.ratings.every((rating,index)=>rating===index+1);const [ratingMode,setRatingMode]=useState<"range"|"custom">(contiguous?"range":"custom");const hasLevelBenefits=value.hasLevelBenefits??Boolean(value.levels?.length);const setRatings=(ratings:number[])=>onChange({...value,ratings,levels:(value.levels??[]).filter(level=>ratings.includes(level.rating))}); return <div className="homebrew-form">
  <Field label={h("Nome","Name")}><Input value={value.translatedName} onChange={e=>onChange({...value,translatedName:e.target.value})}/></Field><Field label={h("Disponível para","Available to")}><select value={value.line} onChange={e=>onChange({...value,line:e.target.value as HomebrewMerit["line"]})}><option value="CtL">Changeling</option><option value="MtA">{h("Mago","Mage")}</option><option value="Core">{h("Todos","All")}</option></select></Field><CategoryPicker key={value.id} label={h("Categoria","Category")} value={value.category} options={categories} onChange={category=>onChange({...value,category})} allowCustom />
  <Field label={h("Formato dos níveis","Rating format")}><select value={ratingMode} onChange={e=>{const mode=e.target.value as "range"|"custom";setRatingMode(mode);if(mode==="range")setRatings(Array.from({length:Math.max(...value.ratings,1)},(_,index)=>index+1))}}><option value="range">{h("De 1 até X","From 1 to X")}</option><option value="custom">{h("Níveis personalizados","Custom ratings")}</option></select></Field>
  {ratingMode==="range"?<Field label={h("Nível máximo","Maximum rating")}><select value={Math.max(...value.ratings,1)} onChange={e=>setRatings(Array.from({length:Number(e.target.value)},(_,index)=>index+1))}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></Field>:<Field label={h("Níveis disponíveis","Available ratings")} wide><div className="homebrew-checks">{[1,2,3,4,5].map(n=><label key={n}><input type="checkbox" checked={value.ratings.includes(n)} onChange={e=>setRatings(e.target.checked?[...value.ratings,n].sort():value.ratings.filter(x=>x!==n))}/>{n} •</label>)}</div></Field>}
  <Field label={h("Repetível","Repeatable")}><select value={value.repeatable?"sim":"nao"} onChange={e=>onChange({...value,repeatable:e.target.value==="sim"})}><option value="nao">{h("Não","No")}</option><option value="sim">{h("Sim","Yes")}</option></select></Field>
  <Field label={h("Benefícios por nível","Benefits by rating")}><label className="homebrew-inline-check"><input type="checkbox" checked={hasLevelBenefits} onChange={e=>onChange({...value,hasLevelBenefits:e.target.checked,levels:e.target.checked?value.levels:[]})}/><span>{h("Descrever separadamente cada nível","Describe each rating separately")}</span></label></Field>
  <Field label={h("Pré-requisitos","Prerequisites")} wide><Input value={value.prerequisites??""} onChange={e=>onChange({...value,prerequisites:e.target.value})}/></Field><Field label={h("Descrição","Description")} wide><Textarea value={value.description} onChange={e=>onChange({...value,description:e.target.value})}/></Field>
  {hasLevelBenefits&&<Field label={h("Benefícios por nível","Benefits by rating")} wide><div className="homebrew-levels">{value.ratings.map(rating=>{const level=(value.levels??[]).find(x=>x.rating===rating)??{rating,name:"",description:""};const update=(patch:Partial<typeof level>)=>onChange({...value,hasLevelBenefits:true,levels:[...(value.levels??[]).filter(x=>x.rating!==rating),{...level,...patch}].sort((a,b)=>a.rating-b.rating)});return <section key={rating}><strong>{rating} •</strong><Input value={level.name} onChange={e=>update({name:e.target.value})} placeholder={h("Nome do benefício","Benefit name")}/><Textarea value={level.description} onChange={e=>update({description:e.target.value})} placeholder={h("Efeito concedido neste nível","Effect granted at this rating")}/></section>})}</div></Field>}
  </div>; }
function KithForm({value,onChange}:{value:HomebrewKith;onChange:(v:HomebrewKith)=>void}) { const {locale}=useLanguage();const h=(pt:string,en:string)=>localized(locale,pt,en);return <div className="homebrew-form"><Field label={h("Nome","Name")}><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field><Field label={h("Perícia","Skill")}><select value={value.skill} onChange={e=>onChange({...value,skill:e.target.value})}><option value="">{h("Selecione","Select")}</option>{ALL_SKILLS.map(skill=><option key={skill} value={skill}>{localizedRuleLabel(skill,locale)}</option>)}</select></Field><Field label={h("Descrição","Description")} wide><Textarea value={value.description} onChange={e=>onChange({...value,description:e.target.value})}/></Field><Field label={h("Bênção","Blessing")} wide><Textarea value={value.blessing} onChange={e=>onChange({...value,blessing:e.target.value})}/></Field></div> }
function CourtForm({value,onChange}:{value:HomebrewCourt;onChange:(v:HomebrewCourt)=>void}) { const {locale}=useLanguage();const h=(pt:string,en:string)=>localized(locale,pt,en);const benefits=Array.from({length:5},(_,index)=>value.mantleBenefits[index]??"");return <div className="homebrew-form"><Field label={h("Nome","Name")}><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field><Field label={h("Emoção","Emotion")}><Input value={value.emotion} onChange={e=>onChange({...value,emotion:e.target.value})}/></Field>{benefits.map((benefit,index)=><Field key={index} label={`${h("Manto","Mantle")} ${index+1}`} wide><Textarea value={benefit} onChange={e=>{const mantleBenefits=[...benefits];mantleBenefits[index]=e.target.value;onChange({...value,mantleBenefits})}}/></Field>)}</div> }
function OrderForm({value,onChange}:{value:HomebrewOrder;onChange:(v:HomebrewOrder)=>void}) { const {locale}=useLanguage();const h=(pt:string,en:string)=>localized(locale,pt,en);const skills=Array.from({length:3},(_,index)=>value.roteSkills[index]??"");return <div className="homebrew-form"><Field label={h("Nome","Name")}><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field><Field label={h("Descrição","Description")} wide><Textarea value={value.description} onChange={e=>onChange({...value,description:e.target.value})}/></Field>{skills.map((skill,index)=><Field key={index} label={`${h("Perícia de Ordem","Order Rote Skill")} ${index+1}`}><select value={skill} onChange={e=>{const roteSkills=[...skills];roteSkills[index]=e.target.value;onChange({...value,roteSkills})}}><option value="">{h("Selecione","Select")}</option>{ALL_SKILLS.map(option=><option key={option} value={option} disabled={skills.some((selected,i)=>i!==index&&selected===option)}>{localizedRuleLabel(option,locale)}</option>)}</select></Field>)}</div> }
function CategoryPicker({ label, value, options, onChange, allowCustom = false }: {
  label: string; value: string; options: string[];
  onChange: (nextValue: string) => void; allowCustom?: boolean;
}) {
  const {locale}=useLanguage();const h=(pt:string,en:string)=>localized(locale,pt,en);
  const [custom, setCustom] = useState(Boolean(value && !options.includes(value)));
  return <Field label={label}>
    <select value={custom ? "__custom" : value} onChange={(event) => {
      if (event.target.value === "__custom") { setCustom(true); onChange(""); }
      else { setCustom(false); onChange(event.target.value); }
    }}>
      <option value="">{h("Selecione","Select")}</option>
      {alphabetical(options, option=>localizedRuleLabel(option,locale),locale).map((option) => <option key={option} value={option}>{localizedRuleLabel(option,locale)}</option>)}
      {allowCustom && <option value="__custom">{h("Criar nova…","Create new…")}</option>}
    </select>
    {custom && <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={h(`Nome da nova ${label.toLocaleLowerCase("pt-BR")}`,`New ${label.toLocaleLowerCase("en-US")} name`)} />}
  </Field>;
}
function formatRequirements(value:Record<string,number>,locale:Locale) { return Object.entries(value).map(([name,dots])=>`${localizedRuleLabel(name,locale)} ${dots}`).join(" + "); }
