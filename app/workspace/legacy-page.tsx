"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { CharacterSheet } from "../character-builder";
import { useLanguage } from "@/lib/i18n";
import { ELEVENTH_QUESTION, eleventhQuestionPrerequisites, legacyArcanumRating, legacySkillRating, normalizeLegacyState } from "@/lib/legacies";
import type { MageAdvancementUndo } from "@/lib/experience-refunds";
import { RuleSelect } from "./rule-select";

type MageXpEntry={undo?:MageAdvancementUndo;id:string;description:string;regular:number;arcane:number;createdAt:string;before:{attributes:Record<string,number>;skills:Record<string,number>;merits:CharacterSheet["merits"];specializations:CharacterSheet["specializations"];line_data:Record<string,unknown>};previousLostWillpower?:number};
export function LegacyPage({character,updateSheet,onDiscard}:{character:CharacterSheet;updateSheet:(sheet:CharacterSheet)=>void;onDiscard:()=>void}){
  const {tr}=useLanguage();
  const definition=ELEVENTH_QUESTION, state=normalizeLegacyState(character.line_data.legacy_state), checks=eleventhQuestionPrerequisites(character);
  const [method,setMethod]=useState<"tutelage"|"daimonomikon"|"soul-study">("tutelage");
  const [pool,setPool]=useState<"regular"|"arcane">("regular");
  const [attainmentTraining,setAttainmentTraining]=useState<"tutor"|"self">("tutor");
  const [feedback,setFeedback]=useState("");
  const [discardOpen,setDiscardOpen]=useState(false);
  const regular=Number(character.current_state.mage_experience_available??0),arcane=Number(character.current_state.arcane_experience_available??0);
  const gnosis=Number(character.line_data.gnosis??1),arcana=(character.line_data.arcana??{}) as Record<string,number>;
  const history=Array.isArray(character.current_state.mage_experience_history)?character.current_state.mage_experience_history as MageXpEntry[]:[];
  const savePurchase=(next:CharacterSheet,description:string,regularCost:number,arcaneCost:number,undo:MageAdvancementUndo,credits:{regular?:number;arcane?:number;beats?:number}={})=>{
    const creditedRegular=credits.regular??0,creditedArcane=credits.arcane??0,creditedArcaneBeats=credits.beats??0;
    const finalUndo={...undo,creditedRegular,creditedArcane,creditedArcaneBeats} as MageAdvancementUndo;
    const entry:MageXpEntry={id:crypto.randomUUID(),description,regular:regularCost,arcane:arcaneCost,createdAt:new Date().toISOString(),undo:finalUndo,before:{attributes:structuredClone(character.attributes),skills:structuredClone(character.skills),merits:structuredClone(character.merits),specializations:structuredClone(character.specializations),line_data:structuredClone(character.line_data)}};
    next.current_state={...next.current_state,mage_experience_available:regular-regularCost+creditedRegular,arcane_experience_available:arcane-arcaneCost+creditedArcane,mage_experience_spent:Number(next.current_state.mage_experience_spent??0)+regularCost,arcane_experience_spent:Number(next.current_state.arcane_experience_spent??0)+arcaneCost,arcane_experience_beats:Number(next.current_state.arcane_experience_beats??0)+creditedArcaneBeats,mage_experience_history:[entry,...history].slice(0,100)};
    updateSheet(next);
  };
  const findPraxis=(name:string)=>{
    for(const key of ["praxes","learned_praxes"] as const){const list=Array.isArray(character.line_data[key])?character.line_data[key] as Record<string,unknown>[]:[];const index=list.findIndex(item=>String(item.originalName??item.name)===name);if(index>=0)return {key,index,item:list[index]};}
  };
  const removePraxis=(next:CharacterSheet,praxis:ReturnType<typeof findPraxis>)=>{if(!praxis)return;const list=[...(next.line_data[praxis.key] as Record<string,unknown>[])];list.splice(praxis.index,1);next.line_data[praxis.key]=list;};
  const join=()=>{
    if(!checks.met)return setFeedback(tr("Os pré-requisitos da Legacy ainda não foram atendidos.","The Legacy prerequisites are not yet met."));
    const regularCost=method==="tutelage"&&pool==="regular"?1:0,arcaneCost=regularCost?0:1;
    if(regular<regularCost||arcane<arcaneCost)return setFeedback(tr("Experiência insuficiente.","Insufficient Experience."));
    const praxis=findPraxis("Perfect Timing"),alternative=!checks.parentage&&checks.praxis;
    const credits=praxis?{regular:alternative?1:0,arcane:alternative?0:1,beats:1+(method==="tutelage"?1:0)}:{beats:method==="tutelage"?1:0};
    const next=structuredClone(character);removePraxis(next,praxis);next.line_data.legacy_state={definitionId:definition.id,joined:true,attainmentRanks:[1],initiationMethod:method};
    savePurchase(next,`${definition.name} · Initiation`,regularCost,arcaneCost,{kind:"legacyInitiation",previousState:character.line_data.legacy_state,removedPraxis:praxis,creditedRegular:0,creditedArcane:0,creditedArcaneBeats:0},credits);
  };
  const nextRank=Math.max(1,...state.attainmentRanks)+1;
  const attainment=definition.attainments.find(item=>item.rank===nextRank);
  const qualifyingSkills=["Academics","Larceny","Medicine","Occult","Science"].map(skill=>legacySkillRating(character.skills,skill)).sort((a,b)=>b-a);
  const additionalSkillMet=!attainment||attainment.rank<3?true:attainment.rank<5?(qualifyingSkills[0]>=3||qualifyingSkills[1]>=2):(qualifyingSkills[0]>=4||qualifyingSkills[1]>=3||qualifyingSkills[2]>=2);
  const rankPrerequisites=attainment?legacyArcanumRating(arcana,"Time")>=attainment.rulingArcanum&&gnosis>=attainment.orthodoxGnosis&&legacySkillRating(character.skills,"Investigation")>=(attainment.rank>=4?4:attainment.rank>=2?3:2)&&additionalSkillMet:false;
  const buyAttainment=()=>{
    if(!attainment||!rankPrerequisites)return setFeedback(tr("Os pré-requisitos do próximo Attainment ainda não foram atendidos.","The next Attainment's prerequisites are not yet met."));
    const effectivePool=attainmentTraining==="self"?"arcane":pool,regularCost=effectivePool==="regular"?1:0,arcaneCost=effectivePool==="arcane"?1:0;if(regular<regularCost||arcane<arcaneCost)return setFeedback(tr("Experiência insuficiente.","Insufficient Experience."));
    const spellNames:Record<number,string>={2:"Postcognition",3:"Divination",4:"Prophecy"},praxis=findPraxis(spellNames[attainment.rank]??"");
    const next=structuredClone(character);removePraxis(next,praxis);next.line_data.legacy_state={...state,attainmentRanks:[...state.attainmentRanks,attainment.rank]};
    savePurchase(next,`${definition.name} · ${attainment.name}`,regularCost,arcaneCost,{kind:"legacyAttainment",rank:attainment.rank,removedPraxis:praxis,creditedRegular:0,creditedArcane:0,creditedArcaneBeats:0},praxis?{arcane:1,beats:1}:{});
  };
  const discard=()=>{const next=structuredClone(character);delete next.line_data.legacy_state;updateSheet(next);onDiscard();};
  return <div className="entitlement-page legacy-page">
    <header className="entitlement-title legacy-title"><div><h2>{definition.name}</h2><p>{definition.source} · p. {definition.page}–202 · {tr("Arcano Regente","Ruling Arcanum")}: {definition.rulingArcanum}</p></div>{state.joined?<Button type="button" size="sm" variant="destructive" onClick={()=>setDiscardOpen(true)}>{tr("Descartar Legacy","Discard Legacy")}</Button>:<Button type="button" size="sm" className="builder-add-action legacy-join-button" disabled={!checks.met} onClick={join}>{tr("Entrar na Legacy","Join Legacy")}</Button>}</header>
    {(!state.joined||attainment)&&<p className={`entitlement-prerequisites ${state.joined?(rankPrerequisites?"met":"unmet"):(checks.met?"met":"unmet")}`}><strong>{tr("Pré-requisitos","Prerequisites")}:</strong> {state.joined?attainment?.prerequisites:definition.prerequisites}</p>}
    <section className="legacy-reference"><h3>{tr("Informações de Legacy","Legacy Information")}</h3><ul><li>{tr("Tutor e aluno possuem vínculo simpático Strong.","Tutor and student have a Strong sympathetic link.")}</li><li>{tr("Após uma cena de interação mística, emocional ou íntima significativa, tutor e aluno recebem um Arcane Beat, no máximo uma vez por capítulo.","After a significant mystical, emotional, or intimate interaction scene, tutor and student earn one Arcane Beat, at most once per chapter.")}</li><li>{tr("Membros, Daimonomika e Soul Stones da mesma Legacy são Yantras simpáticos de +2 para seus membros.","Members, Daimonomika, and Soul Stones of the same Legacy are +2 sympathetic Yantras for its members.")}</li></ul><small>{tr("Estas informações não são controladas automaticamente pela ficha.","The sheet does not track these rules automatically.")}</small></section>
    {!state.joined&&<section className="legacy-join"><div className="legacy-requirement-list">{[[checks.gnosis,"Gnosis 2"],[checks.time,"Time 2"],[checks.investigation,"Investigation 2"],[checks.qualifying,"Qualifying Skill 2"],[checks.parentage||checks.praxis,"Moros, Guardian/Mysterium, or Perfect Timing Praxis"]].map(([met,label])=><span className={met?"met":"unmet"} key={String(label)}>{met?"✓":"×"} {label}</span>)}</div><div className="legacy-join-controls"><label>{tr("Método de iniciação","Initiation method")}<RuleSelect value={method} onChange={(value)=>{const next=value as typeof method;setMethod(next);if(next!=="tutelage")setPool("arcane");}} options={[{value:"tutelage",label:"Tutelage"},{value:"daimonomikon",label:"Daimonomikon"},{value:"soul-study",label:"Soul or Soul Stone Study"}]}/></label><label>{tr("Pagamento","Payment")}<RuleSelect value={method==="tutelage"?pool:"arcane"} onChange={(value)=>setPool(value as typeof pool)} options={method==="tutelage"?[{value:"regular",label:"1 Experience"},{value:"arcane",label:"1 Arcane Experience"}]:[{value:"arcane",label:"1 Arcane Experience"}]}/></label></div>{gnosis>=3&&<details className="experience-rules"><summary>{tr("Criar uma Legacy","Create a Legacy")}</summary><p>{tr("Gnosis 3 permite fundar uma Legacy por 1 Arcane Experience. A criação das definições personalizadas será adicionada em uma etapa posterior.","Gnosis 3 permits founding a Legacy for 1 Arcane Experience. Authoring custom Legacy definitions will be added in a later phase.")}</p></details>}</section>}
    {state.joined&&attainment&&<section className="legacy-join legacy-next-attainment"><div className="legacy-attainment-purchase"><p><strong>{tr("Próximo Attainment","Next Attainment")}:</strong> {attainment.name} · 1 Experience</p><RuleSelect value={attainmentTraining} onChange={(value)=>{const training=value as typeof attainmentTraining;setAttainmentTraining(training);if(training==="self")setPool("arcane");}} options={[{value:"tutor",label:tr("Aprender com tutor","Learn from a tutor")},{value:"self",label:tr("Desenvolver sem tutor","Develop without a tutor")}]}/>{attainmentTraining==="tutor"&&<RuleSelect value={pool} onChange={(value)=>setPool(value as typeof pool)} options={[{value:"regular",label:"1 Experience"},{value:"arcane",label:"1 Arcane Experience"}]}/>}<Button type="button" size="sm" disabled={!rankPrerequisites} onClick={buyAttainment}>{tr("Comprar Attainment","Purchase Attainment")}</Button></div></section>}
    <div className="entitlement-overview">{!state.joined&&<section><h3>{tr("Iniciação","Initiation")}</h3><p>{definition.initiation}</p></section>}<section><h3>{tr("Organização","Organization")}</h3><p>{definition.organization}</p></section><section><h3>{tr("Teoria","Theory")}</h3><p>{definition.theory}</p></section></div>
    <div className="entitlement-overview"><section><h3>Yantras</h3><ul>{definition.yantras.map(item=><li key={item}>{item}</li>)}</ul></section><section><h3>Oblations</h3><ul>{definition.oblations.map(item=><li key={item}>{item}</li>)}</ul></section></div>
    <section><h3>Attainments</h3><div className="entitlement-blessings legacy-attainments">{definition.attainments.map(item=>{const acquired=state.attainmentRanks.includes(item.rank);return <details key={item.rank} className={acquired?"active":""}><summary><strong>{item.rank}. {item.name}</strong><span>{acquired?tr("Adquirido","Acquired"):item.prerequisites}</span></summary><p>{item.description}</p>{item.optional&&<p><strong>Optional:</strong> {item.optional}</p>}</details>})}</div></section>
    {feedback&&<p className="experience-feedback">{feedback}</p>}
    <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{tr("Descartar The Eleventh Question?","Discard The Eleventh Question?")}</AlertDialogTitle><AlertDialogDescription>{tr("A Legacy e todos os Attainments adquiridos serão removidos da ficha.","The Legacy and all acquired Attainments will be removed from the character sheet.")}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{tr("Cancelar","Cancel")}</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={discard}>{tr("Descartar Legacy","Discard Legacy")}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}

