"use client";

import { useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Choice } from "@/app/builder/common-controls";
import type { StructuredMeritEditorProps } from "@/app/builder/merit-configuration-editor";
import type { MeritSelection } from "@/lib/core/character/character-types";
import type { MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { EntitlementDefinition } from "@/lib/entitlements";
import { useLanguage } from "@/lib/i18n";
import { createRandomId } from "@/lib/random-id";

type TokenKind = "token" | "trifle" | "bauble";
type TokenConfigurationItem = { id: string; kind: TokenKind; name: string; rating: number; cost: string; effect: string; description: string; crux: string; catch: string; drawback: string };
type HedgespunBenefit = "extraordinary" | "alacrity" | "durability";
function encodeConfiguredRows<T>(items: T[]) { return items.map((item) => JSON.stringify(item)); }
function decodeConfiguredRows<T>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => { try { const parsed = JSON.parse(String(row)); return parsed && typeof parsed === "object" ? [parsed as T] : []; } catch { return []; } });
}
function decodeHedgespunConfiguration(configuration: MeritConfiguration) {
  const benefits = (Array.isArray(configuration.benefits) ? configuration.benefits : []).map((item): HedgespunBenefit | "" => ["extraordinary", "alacrity", "durability"].includes(item) ? item as HedgespunBenefit : "");
  return { name: String(configuration.name ?? ""), description: String(configuration.description ?? ""), extraordinaryDetail: String(configuration.extraordinary_detail ?? ""), benefits };
}

export function renderChangelingStructuredMeritEditor(
  props: StructuredMeritEditorProps,
  entitlementCatalog: readonly EntitlementDefinition[],
): ReactNode {
  const { merit } = props;
  if (merit.name === "Token") return <TokenMeritEditor {...props} />;
  if (merit.name === "Hedgespun Item") return <HedgespunItemEditor {...props} />;
  if (merit.name === "Entitlement") return <EntitlementMeritEditor configuration={props.configuration} onChange={props.onChange} compact={props.compact} entitlementCatalog={entitlementCatalog} />;
  if (merit.name === "Hollow") return <HollowEditor {...props} />;
  if (merit.name === "Shared Bastion") return <SharedBastionEditor {...props} />;
  if (merit.name === "Stable Trod") return <StableTrodEditor configuration={props.configuration} onChange={props.onChange} compact={props.compact} />;
  if (merit.name === "Workshop") return <WorkshopEditor {...props} />;
  if (merit.name === "Warded Dreams" || merit.name === "Dream Bastion") return <DreamBastionEditor {...props} />;
  return null;
}

function DreamBastionEditor({ merit, configuration, onChange, compact }: StructuredMeritEditorProps) {
  const { tr } = useLanguage();
  return <details className={`merit-configuration structured${compact ? " compact" : ""}`} open={!compact}><summary>{tr("Configurar Bastião dos Sonhos", "Configure Dream Bastion")}</summary><div><label>{tr("Descrição e aparência do Bastião", "Bastion description and appearance")}<textarea value={String(configuration.description ?? "")} onChange={(event) => onChange({ ...configuration, description: event.target.value })} /></label><p className="structured-rule">{tr("Este Mérito acrescenta", "This Merit adds")} +{merit.dots} {tr("à Fortificação do Bastião.", "to Bastion Fortification.")}</p></div></details>;
}

function EntitlementMeritEditor({configuration,onChange,compact,entitlementCatalog}:{configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean;entitlementCatalog:readonly EntitlementDefinition[]}){
  const {tr}=useLanguage();const selectedDefinition=entitlementCatalog.find((item)=>item.id===String(configuration.definitionId??""));
  const availableEntitlements=entitlementCatalog;
  const definition=selectedDefinition&&availableEntitlements.some((item)=>item.id===selectedDefinition.id)?selectedDefinition:undefined;
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Título Feérico","Configure Entitlement")}</summary><div>
      <label>{tr("Título","Title")}<Select value={definition?.id} onValueChange={(definitionId)=>onChange({...configuration,definitionId,roleId:""})}><SelectTrigger><SelectValue placeholder={tr("Selecione um Título","Select an Entitlement")}/></SelectTrigger><SelectContent>{availableEntitlements.map((item)=><SelectItem key={item.id} value={item.id}>{item.name} · {item.meritName}</SelectItem>)}</SelectContent></Select></label>
      {definition?.roles&&<label>{tr("Papel","Role")}<Select value={String(configuration.roleId??"")||undefined} onValueChange={(roleId)=>onChange({...configuration,roleId})}><SelectTrigger><SelectValue placeholder={tr("Selecione um papel","Select a role")}/></SelectTrigger><SelectContent>{definition.roles.map((role)=><SelectItem key={role.id} value={role.id}>{role.name} · {role.prerequisites}</SelectItem>)}</SelectContent></Select></label>}
      {definition&&<p className="structured-rule"><strong>{tr("Pré-requisitos","Prerequisites")}:</strong> {definition.prerequisites}<br/><strong>{tr("Fonte","Source")}:</strong> {definition.source} · p. {definition.page}</p>}
    </div>
  </details>;
}

const EMPTY_TOKEN:TokenConfigurationItem={id:"",kind:"token",name:"",rating:1,cost:"1 Glamour",effect:"",description:"",crux:"",catch:"",drawback:""};
function TokenMeritEditor({merit,configuration,onChange,compact}:{merit:MeritSelection;configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}){
  const {tr}=useLanguage();
  const [newKind,setNewKind]=useState<TokenKind>("token");
  const items=decodeConfiguredRows<TokenConfigurationItem>(configuration.items).map((item)=>({...EMPTY_TOKEN,...item,kind:["token","trifle","bauble"].includes(item.kind)?item.kind:"token",rating:item.kind==="trifle"?1:Math.max(1,Math.min(5,Number(item.rating)||1))}));
  const used=items.reduce((sum,item)=>sum+item.rating,0), remaining=merit.dots-used;
  const save=(next:TokenConfigurationItem[])=>onChange({...configuration,items:encodeConfiguredRows(next)});
  const update=(index:number,patch:Partial<TokenConfigurationItem>)=>save(items.map((item,itemIndex)=>itemIndex===index?{...item,...patch}:item));
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Tokens","Configure Tokens")}</summary>
    <div className="token-merit-editor">
      <div className="token-allocation-header">
        <Select value={newKind} onValueChange={(value)=>setNewKind(value as TokenKind)}><SelectTrigger className="token-kind-trigger"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="token">Token</SelectItem><SelectItem value="trifle">Trifle</SelectItem><SelectItem value="bauble">Bauble</SelectItem></SelectContent></Select>
        <Button className="token-add-button" type="button" size="sm" variant="outline" disabled={remaining<1} onClick={()=>save([...items,{...EMPTY_TOKEN,id:createRandomId(),kind:newKind}])}><Plus/>{tr("Adicionar","Add")} {newKind==="trifle"?"Trifle":newKind==="bauble"?"Bauble":"Token"}</Button>
        <p className={remaining===0?"structured-rule":"structured-rule warning"}>{tr("Pontos distribuídos","Allocated dots")}: {used}/{merit.dots}{remaining>0?` · ${remaining} ${tr("restantes","remaining")}`:remaining<0?` · ${Math.abs(remaining)} ${tr("acima do limite","over the limit")}`:""}</p>
      </div>
      {items.map((item,index)=>{const maximum=Math.max(1,Math.min(5,item.rating+remaining)),kindLabel=item.kind==="trifle"?"Trifle":item.kind==="bauble"?"Bauble":"Token";return <fieldset key={index}>
        <legend>{kindLabel} {index+1} · {item.kind==="trifle"?tr("lote de 3","batch of 3"):"•".repeat(item.rating)}</legend>
        <div className="structured-choice-row token-heading-row"><label>{tr("Tipo","Type")}<Select value={item.kind} onValueChange={(kind)=>update(index,{kind:kind as TokenKind,rating:kind==="trifle"?1:item.rating})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="token">Token</SelectItem><SelectItem value="trifle">Trifle</SelectItem><SelectItem value="bauble">Bauble</SelectItem></SelectContent></Select></label><label>{tr("Nome","Name")}<Input value={item.name} onChange={(event)=>update(index,{name:event.target.value})}/></label>{item.kind!=="trifle"&&<label>{tr("Pontos","Dots")}<Select value={String(item.rating)} onValueChange={(next)=>update(index,{rating:Number(next)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Array.from({length:maximum},(_,dot)=><SelectItem key={dot+1} value={String(dot+1)}>{dot+1}</SelectItem>)}</SelectContent></Select></label>}<Button className="token-remove-button" type="button" size="sm" variant="ghost" onClick={()=>{if(window.confirm(tr(`Remover este ${kindLabel}?`,`Remove this ${kindLabel}?`))) save(items.filter((_,itemIndex)=>itemIndex!==index));}}><Trash2/>{tr("Remover","Remove")}</Button></div>
        {item.kind==="token"&&<><label>{tr("Custo","Cost")}<Input value={item.cost} onChange={(event)=>update(index,{cost:event.target.value})} placeholder="1 Glamour"/></label><label>{tr("Efeito","Effect")}<textarea value={item.effect} onChange={(event)=>update(index,{effect:event.target.value})}/></label><label>Catch<textarea value={item.catch} onChange={(event)=>update(index,{catch:event.target.value})}/></label><label>Drawback<textarea value={item.drawback} onChange={(event)=>update(index,{drawback:event.target.value})}/></label></>}
        {item.kind==="trifle"&&<><label>{tr("Efeito","Effect")}<textarea value={item.effect} onChange={(event)=>update(index,{effect:event.target.value})}/></label><p className="structured-rule">{tr("Um ponto do Mérito concede três Bagatelas de função idêntica. Cada uma custa 1 Glamour, não possui Catch ou Drawback e é destruída após o uso.","One Merit dot grants three identically functioning Trifles. Each costs 1 Glamour, has no Catch or Drawback, and is destroyed after use.")}</p></>}
        {item.kind==="bauble"&&<><label>{tr("Descrição","Description")}<textarea value={item.description} onChange={(event)=>update(index,{description:event.target.value})}/></label><label>Crux<textarea value={item.crux} onChange={(event)=>update(index,{crux:event.target.value})}/></label><label>Catch<textarea value={item.catch} onChange={(event)=>update(index,{catch:event.target.value})}/></label><p className="structured-rule">{tr("Sempre é um Token roubado. Ativar custa 1 Glamour, salvo quando a Catch é cumprida.","Always a stolen token. Activation costs 1 Glamour unless its Catch is fulfilled.")}</p></>}
      </fieldset>;})}
    </div>
  </details>;
}

const HEDGESPUN_BENEFITS:Array<{value:HedgespunBenefit;label:string;labelPt:string;effect:string}>=[
  {value:"extraordinary",label:"Extraordinary Equipment",labelPt:"Equipamento Extraordinário",effect:"+1 equipment bonus, armor rating, or weapon damage modifier"},
  {value:"alacrity",label:"Improved Alacrity",labelPt:"Alacridade Aprimorada",effect:"+2 Initiative and Speed"},
  {value:"durability",label:"Increased Durability",labelPt:"Durabilidade Aumentada",effect:"+1 Durability"},
];
function HedgespunItemEditor({merit,configuration,onChange,compact}:{merit:MeritSelection;configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}){
  const {locale,tr}=useLanguage();const item=decodeHedgespunConfiguration(configuration);
  const set=(patch:Partial<typeof item>)=>onChange({...configuration,name:patch.name??item.name,description:patch.description??item.description,extraordinary_detail:patch.extraordinaryDetail??item.extraordinaryDetail,benefits:patch.benefits??item.benefits});
  const choose=(index:number,next:HedgespunBenefit)=>{const benefits=Array.from({length:merit.dots},(_,itemIndex)=>item.benefits[itemIndex]??"");benefits[index]=next;set({benefits});};
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Item Fiado na Sebe","Configure Hedgespun Item")}</summary><div>
      <label>{tr("Nome do item","Item name")}<Input value={item.name} onChange={(event)=>set({name:event.target.value})}/></label>
      <label>{tr("Máscara e semblante feérico","Mask and mien")}<textarea value={item.description} onChange={(event)=>set({description:event.target.value})}/></label>
      <fieldset><legend>{tr("Benefícios","Benefits")} · {item.benefits.filter(Boolean).length}/{merit.dots}</legend>
        {Array.from({length:merit.dots},(_,index)=>{const current=item.benefits[index]??"";return <label key={index}>{tr("Ponto","Dot")} {index+1}<Select value={current||undefined} onValueChange={(next)=>choose(index,next as HedgespunBenefit)}><SelectTrigger><SelectValue placeholder={tr("Selecione um benefício","Select a benefit")}/></SelectTrigger><SelectContent>{HEDGESPUN_BENEFITS.filter((benefit)=>benefit.value===current||item.benefits.filter((entry)=>entry===benefit.value).length<3).map((benefit)=><SelectItem key={benefit.value} value={benefit.value}>{locale==="en-US"?benefit.label:benefit.labelPt} · {benefit.effect}</SelectItem>)}</SelectContent></Select></label>;})}
      </fieldset>
      {item.benefits.includes("extraordinary")&&<label>{tr("Bônus, armadura ou dano escolhido","Chosen bonus, armor, or damage")}<Input value={item.extraordinaryDetail} onChange={(event)=>set({extraordinaryDetail:event.target.value})} placeholder={tr("Ex.: +2 armadura geral","E.g.: +2 general armor")}/></label>}
      <p className="structured-rule">{tr("Sempre ativo; não possui custo de Glamour nem Catch.","Always active; has no Glamour cost or Catch.")}</p>
    </div>
  </details>;
}

const HOLLOW_OPTIONS = [
  {name:"Hob Alarm",cost:1,description:"Friendly hobgoblins prevent loss of Defense from surprise and add Hollow dots to actions during the first turn of an action scene. Requires Hob Kin and incurs 1 Goblin Debt each story."},
  {name:"Luxury Goods",cost:1,description:"Once per chapter, roll Hollow dots to produce one temporary mundane or Hedgespun item with Availability or rating no higher than successes."},
  {name:"Shadow Garden",cost:1,description:"Consumed goblin fruit reappears after one hour as a sensory-perfect but powerless shadow fruit; hunger it satisfies returns one hour later."},
  {name:"Phantom Phone Booth",cost:1,description:"Call any publicly listed mundane phone from the Hollow without knowing its number; traces falsely identify the recipient's own line."},
  {name:"Route Zero",cost:1,description:"A one-dot looping trod crosses the Hollow. A traveler who navigates it safely returns to the start and regains 1 Willpower, once per day."},
  {name:"Size Matters 1",cost:1,group:"size-matters",description:"The Hollow comfortably houses a motley of five or six changelings."},
  {name:"Size Matters 2",cost:2,group:"size-matters",description:"The Hollow becomes a vast estate or small town."},
  {name:"Escape Route 1",cost:1,group:"escape-route",description:"Adds a secure stationary one-way emergency exit usable by owners and permitted guests."},
  {name:"Escape Route 2",cost:2,group:"escape-route",description:"The one-way emergency exit may appear reflexively anywhere inside the Hollow."},
  {name:"Hidden Entry",cost:2,description:"The entrance vanishes while all contributing owners are inside; finding or forcing it while visible suffers a two-die penalty."},
  {name:"Easy Access",cost:3,description:"The Hollow has no fixed entrance; spend 1 Glamour to enter through any unlocked mundane door and exit where you entered."},
  {name:"Home Turf",cost:3,description:"The owner adds Hollow dots to Initiative and Defense against intruders inside the Hollow."},
] as const;
function HollowEditor({
  merit,
  configuration,
  onChange,
  compact,
}: {
  merit: MeritSelection;
  configuration: MeritConfiguration;
  onChange: (value: MeritConfiguration) => void;
  compact: boolean;
}) {
  const { tr } = useLanguage();
  const selected = Array.isArray(configuration.features)
    ? configuration.features
    : [];
  const used = selected.reduce(
    (sum, item) => sum + (Number(String(item).split("|")[1]) || 0),
    0,
  );
  const set = (key: string, value: string | string[]) =>
    onChange({ ...configuration, [key]: value });
  return (
    <details
      className={`merit-configuration structured${compact ? " compact" : ""}`}
      open={!compact}
    >
      <summary>{tr("Configurar Recanto", "Configure Hollow")}</summary>
      <div>
        <label>
          {tr("Nome", "Name")}
          <Input
            value={String(configuration.name ?? "")}
            onChange={(event) => set("name", event.target.value)}
          />
        </label>
        <label>
          {tr("Localização e aparência", "Location and appearance")}
          <textarea
            value={String(configuration.location ?? "")}
            onChange={(event) => set("location", event.target.value)}
          />
        </label>
        <fieldset>
          <legend>
            {tr("Melhorias", "Enhancements")} ({used}/{merit.dots} {tr("pontos", "dots")})
          </legend>
          <div className="structured-option-grid">
            {HOLLOW_OPTIONS.filter((option) => {
              const key=`${option.name}|${option.cost}`;
              if(selected.includes(key)) return true;
              const replacedCost="group" in option?selected.reduce((sum,item)=>{
                const selectedOption=HOLLOW_OPTIONS.find((candidate)=>`${candidate.name}|${candidate.cost}`===item);
                return sum+(selectedOption&&"group" in selectedOption&&selectedOption.group===option.group?selectedOption.cost:0);
              },0):0;
              return option.cost<=merit.dots-used+replacedCost;
            }).map((option) => {
              const {name, cost, description}=option;
              const key = `${name}|${cost}`,
                active = selected.includes(key);
              const alternatives="group" in option?HOLLOW_OPTIONS.filter((item)=>"group" in item&&item.group===option.group).map((item)=>`${item.name}|${item.cost}`):[];
              const withoutAlternatives=selected.filter((item)=>!alternatives.includes(item));
              return (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={active}
                    disabled={!active && used + cost > merit.dots}
                    onChange={() =>
                      set(
                        "features",
                        active
                          ? selected.filter((item) => item !== key)
                          : [...withoutAlternatives, key],
                      )
                    }
                  />
                  <span>
                    <strong>{name}</strong>
                    <small>
                      {cost} {cost === 1 ? tr("ponto", "dot") : tr("pontos", "dots")}
                    </small>
                    <small>{description}</small>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <p className="structured-rule">
          {tr("A soma das melhorias não pode exceder os pontos de Recanto. Alarme de Hob exige Parentesco Hob.", "The total enhancement cost cannot exceed the Hollow dots. Hob Alarm requires Hob Kin.")}
        </p>
      </div>
    </details>
  );
}

const SHARED_BASTION_OPTIONS = [
  {name:"Buttressed Dreaming",cost:1,description:"Penalizes an opponent's Clash of Wills to force entry by the Shared Bastion rating."},
  {name:"Fixed Doorway",cost:3,description:"Requires Hollow. Creates a permanent Gate of Horn between that Hollow and the Bastion; each traveler spends 1 Glamour in each direction and may bring a passenger for +1 Glamour."},
  {name:"Guardian Eidolon",cost:1,description:"Spend 1 Willpower to wake the guardian for a scene. Owners cannot lose Defense to surprise and add Bastion dots to first-turn actions."},
  {name:"Illusory Armory",cost:2,description:"Once per chapter, spend Glamour to summon an unimportant prop with equipment rating twice Glamour spent, maximum +5; add 1 Willpower for an important prop."},
  {name:"Permanent Armory",cost:1,description:"Physical equipment remains safely stored in the Bastion. Each non-mundane item requires 1 Willpower per chapter or the Bastion absorbs it."},
  {name:"Raised Defenses",cost:1,description:"While an owner is inside, double the Bastion rating's defensive bonuses, to a maximum of +5."},
  {name:"Subtle Speech",cost:2,description:"Fixed eidolons relay private messages of up to five words from the Bastion to waking motley members."},
] as const;

function SharedBastionEditor({merit,configuration,onChange,compact}:{merit:MeritSelection;configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}) {
  const {tr}=useLanguage();
  const selected=Array.isArray(configuration.features)?configuration.features:[];
  const used=selected.reduce((sum,item)=>sum+(Number(String(item).split("|")[1])||0),0);
  const set=(key:string,value:string|string[])=>onChange({...configuration,[key]:value});
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Bastião Compartilhado","Configure Shared Bastion")}</summary>
    <div>
      <label>{tr("Nome","Name")}<Input value={String(configuration.name??"")} onChange={(event)=>set("name",event.target.value)}/></label>
      <label>{tr("Localização e aparência","Location and appearance")}<textarea value={String(configuration.location??"")} onChange={(event)=>set("location",event.target.value)}/></label>
      <fieldset><legend>{tr("Características","Features")} ({used}/{merit.dots} {tr("pontos","dots")})</legend><div className="structured-option-grid">
        {SHARED_BASTION_OPTIONS.filter(({name,cost})=>selected.includes(`${name}|${cost}`)||cost<=merit.dots-used).map(({name,cost,description})=>{const key=`${name}|${cost}`,active=selected.includes(key);return <label key={key}><input type="checkbox" checked={active} onChange={()=>set("features",active?selected.filter((item)=>item!==key):[...selected,key])}/><span><strong>{name}</strong><small>{cost} {cost===1?tr("ponto","dot"):tr("pontos","dots")}</small><small>{description}</small></span></label>;})}
      </div></fieldset>
    </div>
  </details>;
}

function StableTrodEditor({configuration,onChange,compact}:{configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}) {
  const {tr}=useLanguage();
  const set=(key:string,value:string|string[])=>onChange({...configuration,[key]:value});
  const oneDotOptions=HOLLOW_OPTIONS.filter((item)=>item.cost===1).map((item)=>item.name);
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Trilha Estável","Configure Stable Trod")}</summary><div>
      <label>{tr("Nome ou descrição da Trilha","Trod name or description")}<Input value={String(configuration.name??"")} onChange={(event)=>set("name",event.target.value)}/></label>
      <Choice label={tr("Melhoria de Recanto compartilhada","Shared Hollow enhancement")} value={String(configuration.enhancement??"")} setValue={(value)=>set("enhancement",value)} options={oneDotOptions}/>
    </div>
  </details>;
}

function WorkshopEditor({merit,configuration,onChange,compact}:{merit:MeritSelection;configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}) {
  const {tr}=useLanguage();
  const specialties=Array.isArray(configuration.specialties)?configuration.specialties:[];
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Oficina","Configure Workshop")}</summary><div><fieldset><legend>{tr("Especializações de Ofícios","Craft Specialties")}</legend>
      <div className="merit-config-list">{Array.from({length:merit.dots},(_,index)=><Input key={index} value={specialties[index]??""} placeholder={`${tr("Especialização","Specialty")} ${index+1}`} onChange={(event)=>{const next=Array.from({length:merit.dots},(_,item)=>specialties[item]??"");next[index]=event.target.value;onChange({...configuration,specialties:next});}}/>)}</div>
    </fieldset></div>
  </details>;
}
