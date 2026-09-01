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
import { CONTRACTS } from "@/lib/contracts";
import { RAW_MERITS } from "@/lib/merits";
import { ARCANA, CTL_COURTS, CTL_SEEMINGS, REGALIA, SKILLS } from "@/lib/creation-rules";
import {
  formatNamedText,
  BUILTIN_HOMEBREW_SOURCES,
  homebrewId,
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
  category: "Geral", priority: 10, description: "", prerequisites: "",
  page: 0, homebrew: true, repeatable: false, hasLevelBenefits: false, levels: [],
});
const emptyKith = (): HomebrewKith => ({ id:homebrewId("kith"),name:"",skill:"",description:"",blessing:"",source:"Criação do jogador",page:0,homebrew:true });
const emptyCourt = (): HomebrewCourt => ({ id:homebrewId("court"),name:"",emotion:"",mantleBenefits:[],homebrew:true });
const emptyOrder = (): HomebrewOrder => ({ id:homebrewId("order"),name:"",description:"",roteSkills:[],homebrew:true });

export function HomebrewsPage({
  catalog,
}: {
  catalog: HomebrewCatalog;
}) {
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
  const courts = useMemo(()=>[...new Set([...CTL_COURTS.filter(item=>item!=="Sem Corte"),...catalog.courts.map(item=>item.name)])],[catalog.courts]);
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
        return setError("Informe nome, categoria e Loophole do Contrato.");
      if (contract.hasRoll && (!contract.dicePool?.trim() || !contract.success?.trim()))
        return setError("Contratos com jogada precisam de parada de dados e efeito de Sucesso.");
      const item = { ...contract, name: contract.name.trim(), originalName: contract.name.trim(), regalia: contract.categoryKind === "Independente" ? "Independente" : contract.regalia.trim(), cost: contract.costs.join(" + ") };
      commit({ ...catalog, contracts: upsert(catalog.contracts, item) });
    }
    if (editor === "spell") {
      if (!spell.name.trim() || Object.keys(spell.requirements).length !== 1 || !spell.practice.trim() || !spell.primaryFactor.trim() || spell.roteSkills.length !== 1)
        return setError("Informe nome, Arcano, Prática, Fator Primário e uma Perícia de Rota.");
      const item = { ...spell, name: spell.name.trim(), originalName: spell.name.trim() };
      commit({ ...catalog, spells: upsert(catalog.spells, item) });
    }
    if (editor === "merit") {
      if (!merit.translatedName.trim() || !merit.ratings.length || !merit.description.trim())
        return setError("Informe nome, níveis e descrição do Mérito.");
      const item = { ...merit, name: merit.translatedName.trim(), translatedName: merit.translatedName.trim(), ratings: [...new Set(merit.ratings)].sort((a,b) => a-b) };
      commit({ ...catalog, merits: upsert(catalog.merits, item) });
    }
    if (editor === "kith") {
      if (!kith.name.trim() || !kith.skill.trim() || !kith.blessing.trim()) return setError("Informe nome, Perícia e Bênção da Frátria.");
      commit({ ...catalog, kiths: upsert(catalog.kiths, {...kith,name:kith.name.trim()}) });
    }
    if (editor === "court") {
      if (!court.name.trim() || !court.emotion.trim() || court.mantleBenefits.length !== 5 || court.mantleBenefits.some(item=>!item.trim())) return setError("Informe nome, emoção e os cinco benefícios de Manto da Corte.");
      commit({ ...catalog, courts: upsert(catalog.courts, {...court,name:court.name.trim()}) });
    }
    if (editor === "order") {
      if (!order.name.trim() || order.roteSkills.length !== 3 || order.roteSkills.some(item=>!item) || new Set(order.roteSkills).size!==3) return setError("Informe nome e exatamente três Perícias de Rota distintas.");
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
  const card = (kind:Kind,item:any,title:string,meta:string,text:string) => <HomebrewCard key={item.id} title={title} meta={meta} text={text} active={!catalog.disabledIds.includes(item.id)} toggle={(checked)=>toggle(item.id,checked)} edit={()=>openEdit(kind,item)} remove={()=>setDeleteTarget({kind,id:item.id,name:title})}/>;
  return (
    <section className="homebrew-page">
      <div className="homebrew-hero">
        <div><Badge>CONTEÚDO DO JOGADOR</Badge><h2>Oficina de Homebrews</h2><p>Crie regras próprias e use-as imediatamente em fichas e compras de Experiência neste navegador.</p></div>
        <Sparkles aria-hidden="true" />
      </div>
      <section className="panel homebrew-settings"><div><h3>Usar Homebrews nas regras</h3><p>Desativar oculta todos os homebrews das escolhas sem apagar dados ou preferências individuais.</p></div><Switch checked={catalog.enabled} onCheckedChange={(enabled)=>commit({...catalog,enabled})} aria-label="Usar Homebrews nas regras" /></section>
      <section className="panel"><div className="panel-heading"><div><h3>Livros homebrew incluídos</h3><p>Conteúdo que acompanha a aplicação e pode ser ativado por livro.</p></div></div><div className="homebrew-grid">{BUILTIN_HOMEBREW_SOURCES.map(source=>{const contracts=CONTRACTS.filter(x=>x.sourceId===source.id);const merits=RAW_MERITS.filter(x=>x.sourceId===source.id);return <article className="homebrew-card" key={source.id}><div><Badge variant="outline">Incluído na aplicação</Badge><h3>{source.name}</h3><p>{contracts.length} Contrato(s) · {merits.length} Mérito(s)</p><details><summary>Ver conteúdo</summary>{contracts.length>0&&<p><strong>Contratos:</strong> {contracts.map(x=>x.name).join(", ")}</p>}{merits.length>0&&<p><strong>Méritos:</strong> {merits.map(x=>x.translatedName).join(", ")}</p>}</details></div><label className="homebrew-toggle"><span>{catalog.disabledIds.includes(source.id)?"Desativado":"Ativo"}</span><Switch checked={!catalog.disabledIds.includes(source.id)} onCheckedChange={checked=>toggle(source.id,checked)} /></label></article>})}</div></section>
      <Tabs defaultValue="contracts">
        <TabsList className="homebrew-tabs-list"><TabsTrigger value="contracts">Contratos ({catalog.contracts.length})</TabsTrigger><TabsTrigger value="spells">Magias ({catalog.spells.length})</TabsTrigger><TabsTrigger value="merits">Méritos ({catalog.merits.length})</TabsTrigger><TabsTrigger value="kiths">Frátrias ({catalog.kiths.length})</TabsTrigger><TabsTrigger value="courts">Cortes ({catalog.courts.length})</TabsTrigger><TabsTrigger value="orders">Ordens ({catalog.orders.length})</TabsTrigger></TabsList>
        <HomebrewTab value="contracts" title="Contratos personalizados" text="Regalias, Cortes e pactos independentes." add={() => openNew("contract")}>
          {catalog.contracts.map((item) => card("contract",item,item.name,`${item.type} · ${item.categoryKind}: ${item.regalia}`,item.description || item.success || "Sem descrição"))}
        </HomebrewTab>
        <HomebrewTab value="spells" title="Magias personalizadas" text="Feitiços disponíveis como Rotes e Práxis." add={() => openNew("spell")}>
          {catalog.spells.map((item) => card("spell",item,item.name,formatRequirements(item.requirements),item.description || "Sem descrição"))}
        </HomebrewTab>
        <HomebrewTab value="merits" title="Méritos personalizados" text="Méritos comuns, repetíveis e Estilos com manobras." add={() => openNew("merit")}>
          {catalog.merits.map((item) => card("merit",item,item.translatedName,`${item.line} · ${item.category} · ${item.ratings.join(", ")} ponto(s)`,item.description))}
        </HomebrewTab>
        <HomebrewTab value="kiths" title="Frátrias personalizadas" text="Frátrias migradas de fichas e criadas na oficina." add={()=>openNew("kith")}>{catalog.kiths.map(item=>card("kith",item,item.name,item.skill,item.blessing))}</HomebrewTab>
        <HomebrewTab value="courts" title="Cortes personalizadas" text="Cortes e seus benefícios de Manto." add={()=>openNew("court")}>{catalog.courts.map(item=>card("court",item,item.name,item.emotion,item.mantleBenefits.join(" · ")))}</HomebrewTab>
        <HomebrewTab value="orders" title="Ordens personalizadas" text="Ordens e suas Perícias de Rota." add={()=>openNew("order")}>{catalog.orders.map(item=>card("order",item,item.name,item.roteSkills.join(", "),item.description))}</HomebrewTab>
      </Tabs>
      <Dialog open={editor === "contract"} onOpenChange={(open) => !open && setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>Criar ou editar Contrato</DialogTitle><DialogDescription>Campos vazios opcionais não aparecerão na ficha.</DialogDescription></DialogHeader><ContractForm value={contract} onChange={setContract} knownRegalia={regalia} knownCourts={courts} /><EditorFooter error={error} save={save} cancel={() => setEditor(null)} /></DialogContent></Dialog>
      <Dialog open={editor === "spell"} onOpenChange={(open) => !open && setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>Criar ou editar Magia</DialogTitle><DialogDescription>Os requisitos de Arcana controlarão Rotes e Práxis disponíveis.</DialogDescription></DialogHeader><SpellForm value={spell} onChange={setSpell} /><EditorFooter error={error} save={save} cancel={() => setEditor(null)} /></DialogContent></Dialog>
      <Dialog open={editor === "merit"} onOpenChange={(open) => !open && setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>Criar ou editar Mérito</DialogTitle><DialogDescription>Estilos podem descrever individualmente cada nível adquirido.</DialogDescription></DialogHeader><MeritForm value={merit} onChange={setMerit} categories={meritCategories} /><EditorFooter error={error} save={save} cancel={() => setEditor(null)} /></DialogContent></Dialog>
      <Dialog open={editor === "kith"} onOpenChange={open=>!open&&setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>Criar ou editar Frátria</DialogTitle></DialogHeader><KithForm value={kith} onChange={setKith}/><EditorFooter error={error} save={save} cancel={()=>setEditor(null)}/></DialogContent></Dialog>
      <Dialog open={editor === "court"} onOpenChange={open=>!open&&setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>Criar ou editar Corte</DialogTitle></DialogHeader><CourtForm value={court} onChange={setCourt}/><EditorFooter error={error} save={save} cancel={()=>setEditor(null)}/></DialogContent></Dialog>
      <Dialog open={editor === "order"} onOpenChange={open=>!open&&setEditor(null)}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>Criar ou editar Ordem</DialogTitle></DialogHeader><OrderForm value={order} onChange={setOrder}/><EditorFooter error={error} save={save} cancel={()=>setEditor(null)}/></DialogContent></Dialog>
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir “{deleteTarget?.name}”?</AlertDialogTitle><AlertDialogDescription>O item deixará de aparecer em novas escolhas. Fichas que já o possuem preservam seus dados.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={remove}>Excluir</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </section>
  );
}

function HomebrewTab({value,title,text,add,children}:{value:string;title:string;text:string;add:()=>void;children:ReactNode}) { return <TabsContent value={value}><section className="panel homebrew-panel"><div className="panel-heading"><div><h3>{title}</h3><p>{text}</p></div><Button onClick={add}><Plus /> Criar</Button></div><div className="homebrew-grid">{children}<button className="homebrew-add-card" onClick={add}><Plus /><strong>Criar novo</strong></button></div></section></TabsContent>; }
function HomebrewCard({title,meta,text,edit,remove,active,toggle}:{title:string;meta:string;text:string;edit:()=>void;remove:()=>void;active:boolean;toggle:(checked:boolean)=>void}) { return <article className="homebrew-card"><div><Badge variant="outline">{meta}</Badge><h3>{title}</h3><p>{text}</p></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active?"Ativo":"Desativado"}</span><Switch checked={active} onCheckedChange={toggle}/></label><Button size="sm" variant="outline" onClick={edit}><Pencil /> Editar</Button><Button size="sm" variant="ghost" onClick={remove}><Trash2 /> Excluir</Button></div></article>; }
function EditorFooter({error,save,cancel}:{error:string;save:()=>void;cancel:()=>void}) { return <><>{error && <p className="homebrew-error" role="alert">{error}</p>}</><DialogFooter><Button variant="outline" onClick={cancel}>Cancelar</Button><Button onClick={save}>Salvar Homebrew</Button></DialogFooter></>; }
function Field({label,children,wide=false}:{label:string;children:ReactNode;wide?:boolean}) { return <label className={wide?"wide":""}><span>{label}</span>{children}</label>; }

function ContractForm({value,onChange,knownRegalia,knownCourts}:{value:HomebrewContract;onChange:(v:HomebrewContract)=>void;knownRegalia:string[];knownCourts:string[]}) {
  return <div className="homebrew-form">
    <Field label="Nome"><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field>
    <Field label="Tipo"><select value={value.type} onChange={e=>onChange({...value,type:e.target.value as "Comum"|"Real"})}><option>Comum</option><option>Real</option></select></Field><Field label="Categoria"><select value={value.categoryKind} onChange={e=>{const categoryKind=e.target.value as HomebrewContract["categoryKind"];onChange({...value,categoryKind,regalia:categoryKind==="Independente"?"Independente":""})}}><option>Regalia</option><option>Corte</option><option>Independente</option></select></Field>
    {value.categoryKind === "Regalia" && <CategoryPicker key={`${value.id}:regalia`} label="Regalia" value={value.regalia} options={knownRegalia} onChange={regalia=>onChange({...value,regalia})} allowCustom />}
    {value.categoryKind === "Corte" && <CategoryPicker key={`${value.id}:court`} label="Corte" value={value.regalia} options={knownCourts} onChange={regalia=>onChange({...value,regalia})} />}
    <Field label="Custos (um por linha)" wide><Textarea value={value.costs.join("\n")} onChange={e=>onChange({...value,costs:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})} placeholder={'1 Glamour\n1 Força de Vontade'}/></Field>
    <Field label="Possui jogada de dados"><select value={value.hasRoll?"sim":"nao"} onChange={e=>onChange({...value,hasRoll:e.target.value==="sim"})}><option value="sim">Sim</option><option value="nao">Não</option></select></Field>{value.hasRoll && <Field label="Parada de dados"><Input value={value.dicePool??""} onChange={e=>onChange({...value,dicePool:e.target.value})}/></Field>}
    {value.hasRoll ? <><Field label="Sucesso" wide><Textarea value={value.success??""} onChange={e=>onChange({...value,success:e.target.value,description:e.target.value})}/></Field><Field label="Sucesso Excepcional" wide><Textarea value={value.exceptionalSuccess??""} onChange={e=>onChange({...value,exceptionalSuccess:e.target.value})}/></Field></> : <Field label="Efeito" wide><Textarea value={value.description} onChange={e=>onChange({...value,description:e.target.value,success:undefined,exceptionalSuccess:undefined})}/></Field>}
    <Field label="Opções (uma por linha)" wide><Textarea value={(value.options??[]).join("\n")} onChange={e=>onChange({...value,options:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})}/></Field>
    {value.categoryKind !== "Corte" && <Field label="Benefícios de Feição (Feição: benefício)" wide><Textarea value={formatNamedText(value.seemingBenefits as Record<string,string>)} onChange={e=>onChange({...value,seemingBenefits:parseNamedText(e.target.value)})} placeholder={`${Object.keys(CTL_SEEMINGS)[0]}: benefício`}/></Field>}
    {value.categoryKind === "Corte" && <Field label="Benefícios de Corte (Corte: benefício)" wide><Textarea value={formatNamedText(value.courtBenefits)} onChange={e=>onChange({...value,courtBenefits:parseNamedText(e.target.value)})}/></Field>}
    <Field label="Loophole" wide><Textarea value={value.loophole??""} onChange={e=>onChange({...value,loophole:e.target.value})}/></Field>
  </div>;
}
const PRACTICES = [{name:"Conhecer",level:1},{name:"Revelar",level:1},{name:"Compelir",level:1},{name:"Governar",level:2},{name:"Proteger",level:2},{name:"Velar",level:2},{name:"Enfraquecer",level:3},{name:"Aperfeiçoar",level:3},{name:"Tecer",level:3},{name:"Padronizar",level:4},{name:"Desmantelar",level:4},{name:"Criar",level:5},{name:"Destruir",level:5}] as const;
const ARCANA_KEYS:Record<string,string>={Morte:"Death",Destino:"Fate","Forças":"Forces",Vida:"Life","Matéria":"Matter",Mente:"Mind","Primórdio":"Prime","Espaço":"Space","Espírito":"Spirit",Tempo:"Time"};
const ALL_SKILLS=Object.values(SKILLS).flat();
function SpellForm({value,onChange}:{value:HomebrewSpell;onChange:(v:HomebrewSpell)=>void}) { const arcana=Object.keys(value.requirements)[0]??""; return <div className="homebrew-form">
  <Field label="Nome"><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field>
  <Field label="Arcano"><select value={arcana} onChange={e=>{const level=PRACTICES.find(p=>p.name===value.practice)?.level??1;onChange({...value,requirements:e.target.value?{[e.target.value]:level}:{}})}}><option value="">Selecione</option>{ARCANA.map(name=><option key={name} value={ARCANA_KEYS[name]}>{name}</option>)}</select></Field>
  <Field label="Prática"><select value={value.practice} onChange={e=>{const practice=e.target.value;const level=PRACTICES.find(p=>p.name===practice)?.level??1;onChange({...value,practice,requirements:arcana?{[arcana]:level}:{}})}}>{PRACTICES.map(p=><option key={p.name} value={p.name}>{p.name} (Arcano {p.level})</option>)}</select></Field>
  <Field label="Fator Primário"><select value={value.primaryFactor} onChange={e=>onChange({...value,primaryFactor:e.target.value})}><option>Potência</option><option>Duração</option></select></Field>
  <Field label="Resistência"><select value={value.withstand} onChange={e=>onChange({...value,withstand:e.target.value})}><option value="">Nenhuma</option><option>Perseverança</option><option>Vigor</option><option>Autocontrole</option></select></Field>
  <Field label="Perícia de Rota"><select value={value.roteSkills[0]??""} onChange={e=>onChange({...value,roteSkills:e.target.value?[e.target.value]:[]})}><option value="">Selecione</option>{ALL_SKILLS.map(skill=><option key={skill}>{skill}</option>)}</select></Field>
  <Field label="Descrição / Efeito" wide><Textarea value={value.description??""} onChange={e=>onChange({...value,description:e.target.value})}/></Field>
  </div>; }
function MeritForm({value,onChange,categories}:{value:HomebrewMerit;onChange:(v:HomebrewMerit)=>void;categories:string[]}) { const contiguous=value.ratings.length>0&&value.ratings.every((rating,index)=>rating===index+1);const [ratingMode,setRatingMode]=useState<"range"|"custom">(contiguous?"range":"custom");useEffect(()=>setRatingMode(contiguous?"range":"custom"),[value.id]);const hasLevelBenefits=value.hasLevelBenefits??Boolean(value.levels?.length);const setRatings=(ratings:number[])=>onChange({...value,ratings,levels:(value.levels??[]).filter(level=>ratings.includes(level.rating))}); return <div className="homebrew-form">
  <Field label="Nome"><Input value={value.translatedName} onChange={e=>onChange({...value,translatedName:e.target.value})}/></Field><Field label="Disponível para"><select value={value.line} onChange={e=>onChange({...value,line:e.target.value as HomebrewMerit["line"]})}><option value="Core">Todos</option><option value="CtL">Changeling</option><option value="MtA">Mago</option></select></Field><CategoryPicker key={value.id} label="Categoria" value={value.category} options={categories} onChange={category=>onChange({...value,category})} allowCustom />
  <Field label="Formato dos níveis"><select value={ratingMode} onChange={e=>{const mode=e.target.value as "range"|"custom";setRatingMode(mode);if(mode==="range")setRatings(Array.from({length:Math.max(...value.ratings,1)},(_,index)=>index+1))}}><option value="range">De 1 até X</option><option value="custom">Níveis personalizados</option></select></Field>
  {ratingMode==="range"?<Field label="Nível máximo"><select value={Math.max(...value.ratings,1)} onChange={e=>setRatings(Array.from({length:Number(e.target.value)},(_,index)=>index+1))}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></Field>:<Field label="Níveis disponíveis" wide><div className="homebrew-checks">{[1,2,3,4,5].map(n=><label key={n}><input type="checkbox" checked={value.ratings.includes(n)} onChange={e=>setRatings(e.target.checked?[...value.ratings,n].sort():value.ratings.filter(x=>x!==n))}/>{n} •</label>)}</div></Field>}
  <Field label="Repetível"><select value={value.repeatable?"sim":"nao"} onChange={e=>onChange({...value,repeatable:e.target.value==="sim"})}><option value="nao">Não</option><option value="sim">Sim</option></select></Field>
  <Field label="Benefícios por nível"><label className="homebrew-inline-check"><input type="checkbox" checked={hasLevelBenefits} onChange={e=>onChange({...value,hasLevelBenefits:e.target.checked,levels:e.target.checked?value.levels:[]})}/><span>Descrever separadamente cada nível</span></label></Field>
  <Field label="Pré-requisitos" wide><Input value={value.prerequisites??""} onChange={e=>onChange({...value,prerequisites:e.target.value})}/></Field><Field label="Descrição" wide><Textarea value={value.description} onChange={e=>onChange({...value,description:e.target.value})}/></Field>
  {hasLevelBenefits&&<Field label="Benefícios por nível" wide><div className="homebrew-levels">{value.ratings.map(rating=>{const level=(value.levels??[]).find(x=>x.rating===rating)??{rating,name:"",description:""};const update=(patch:Partial<typeof level>)=>onChange({...value,hasLevelBenefits:true,levels:[...(value.levels??[]).filter(x=>x.rating!==rating),{...level,...patch}].sort((a,b)=>a.rating-b.rating)});return <section key={rating}><strong>{rating} •</strong><Input value={level.name} onChange={e=>update({name:e.target.value})} placeholder="Nome do benefício"/><Textarea value={level.description} onChange={e=>update({description:e.target.value})} placeholder="Efeito concedido neste nível"/></section>})}</div></Field>}
  </div>; }
function KithForm({value,onChange}:{value:HomebrewKith;onChange:(v:HomebrewKith)=>void}) { return <div className="homebrew-form"><Field label="Nome"><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field><Field label="Perícia"><select value={value.skill} onChange={e=>onChange({...value,skill:e.target.value})}><option value="">Selecione</option>{ALL_SKILLS.map(skill=><option key={skill}>{skill}</option>)}</select></Field><Field label="Descrição" wide><Textarea value={value.description} onChange={e=>onChange({...value,description:e.target.value})}/></Field><Field label="Bênção" wide><Textarea value={value.blessing} onChange={e=>onChange({...value,blessing:e.target.value})}/></Field></div> }
function CourtForm({value,onChange}:{value:HomebrewCourt;onChange:(v:HomebrewCourt)=>void}) { const benefits=Array.from({length:5},(_,index)=>value.mantleBenefits[index]??"");return <div className="homebrew-form"><Field label="Nome"><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field><Field label="Emoção"><Input value={value.emotion} onChange={e=>onChange({...value,emotion:e.target.value})}/></Field>{benefits.map((benefit,index)=><Field key={index} label={`Manto ${index+1}`} wide><Textarea value={benefit} onChange={e=>{const mantleBenefits=[...benefits];mantleBenefits[index]=e.target.value;onChange({...value,mantleBenefits})}}/></Field>)}</div> }
function OrderForm({value,onChange}:{value:HomebrewOrder;onChange:(v:HomebrewOrder)=>void}) { const skills=Array.from({length:3},(_,index)=>value.roteSkills[index]??"");return <div className="homebrew-form"><Field label="Nome"><Input value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></Field><Field label="Descrição" wide><Textarea value={value.description} onChange={e=>onChange({...value,description:e.target.value})}/></Field>{skills.map((skill,index)=><Field key={index} label={`Perícia de Ordem ${index+1}`}><select value={skill} onChange={e=>{const roteSkills=[...skills];roteSkills[index]=e.target.value;onChange({...value,roteSkills})}}><option value="">Selecione</option>{ALL_SKILLS.map(option=><option key={option} disabled={skills.some((selected,i)=>i!==index&&selected===option)}>{option}</option>)}</select></Field>)}</div> }
function CategoryPicker({ label, value, options, onChange, allowCustom = false }: {
  label: string; value: string; options: string[];
  onChange: (nextValue: string) => void; allowCustom?: boolean;
}) {
  const [custom, setCustom] = useState(Boolean(value && !options.includes(value)));
  return <Field label={label}>
    <select value={custom ? "__custom" : value} onChange={(event) => {
      if (event.target.value === "__custom") { setCustom(true); onChange(""); }
      else { setCustom(false); onChange(event.target.value); }
    }}>
      <option value="">Selecione</option>
      {options.map((option) => <option key={option}>{option}</option>)}
      {allowCustom && <option value="__custom">Criar nova…</option>}
    </select>
    {custom && <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={`Nome da nova ${label.toLocaleLowerCase("pt-BR")}`} />}
  </Field>;
}
function formatRequirements(value:Record<string,number>) { return Object.entries(value).map(([name,dots])=>`${name} ${dots}`).join(" + "); }
