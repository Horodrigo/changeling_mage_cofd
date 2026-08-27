"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Save, Search, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ARCANA, ATTRIBUTES, CTL_COURTS, CTL_NEEDLES, CTL_SEEMINGS, CTL_SEEMING_LABELS, CTL_THREADS,
  MTA_ORDERS, MTA_ORDER_LABELS, MTA_PATHS, REGALIA, SKILLS
} from "@/lib/creation-rules";
import { getMeritsForLine, type MeritDefinition } from "@/lib/merits";
import { CONTRACTS, type ContractDefinition } from "@/lib/contracts";

export type Specialty = { skill: string; name: string };
export type MeritSelection = { name: string; dots: number; sourceId?: string; source?: string };
export type ContractSelection = Pick<ContractDefinition, "id" | "name" | "originalName" | "type" | "regalia" | "description" | "dicePool" | "sourceId" | "source" | "page">;

export type CharacterSheet = {
  id: string;
  schema_version: 2;
  system: "chronicles-of-darkness";
  game_line: "CtL" | "MtA";
  ruleset: { id: string; version: number };
  character: { name: string; concept: string; player: string };
  attributes: Record<string, number>;
  skills: Record<string, number>;
  specializations: Specialty[];
  merits: MeritSelection[];
  line_data: Record<string, unknown>;
  derived: Record<string, number>;
  current_state: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

const attributeCategories = Object.keys(ATTRIBUTES) as Array<keyof typeof ATTRIBUTES>;
const skillCategories = Object.keys(SKILLS) as Array<keyof typeof SKILLS>;

function initialDots(groups: Record<string, readonly string[]>, base: number) {
  return Object.values(groups).flat().reduce<Record<string, number>>((acc, name) => ({ ...acc, [name]: base }), {});
}

function editableAttributes(initial?: CharacterSheet | null) {
  const values = initial?.attributes ? { ...initial.attributes } : initialDots(ATTRIBUTES, 1);
  if (!initial) return values;
  const bonus = String(initial.game_line === "CtL" ? initial.line_data.favored_attribute ?? "" : initial.line_data.resistance_bonus ?? "");
  if (bonus && values[bonus] > 1) values[bonus] -= 1;
  return values;
}

function inferredPriority(values: Record<string, number>, groups: Record<string, readonly string[]>, base: number) {
  return Object.keys(groups).sort((left, right) => spent(values, groups[right], base) - spent(values, groups[left], base));
}

export function CharacterBuilder({ player, initial, onCancel, onSave }: {
  player: string;
  initial?: CharacterSheet | null;
  onCancel: () => void;
  onSave: (sheet: CharacterSheet) => void;
}) {
  const startingAttributes = editableAttributes(initial);
  const startingSkills = initial?.skills ?? initialDots(SKILLS, 0);
  const [step, setStep] = useState(1);
  const [line, setLine] = useState<"CtL" | "MtA">(initial?.game_line ?? "CtL");
  const [name, setName] = useState(initial?.character.name ?? "");
  const [concept, setConcept] = useState(initial?.character.concept ?? "");
  const [attributes, setAttributes] = useState<Record<string, number>>(startingAttributes);
  const [skills, setSkills] = useState<Record<string, number>>(startingSkills);
  const [attributePriority, setAttributePriority] = useState<string[]>(() => initial ? inferredPriority(startingAttributes, ATTRIBUTES, 1) : ["Mental", "Físicos", "Sociais"]);
  const [skillPriority, setSkillPriority] = useState<string[]>(() => initial ? inferredPriority(startingSkills, SKILLS, 0) : ["Mentais", "Físicas", "Sociais"]);
  const [specialties, setSpecialties] = useState<Specialty[]>(normalizeSpecialties(initial?.specializations));
  const [aspirations, setAspirations] = useState<string[]>(readArray(initial, "aspirations", ["", "", ""]));
  const [merits, setMerits] = useState<MeritSelection[]>(initial?.merits ?? []);

  const [seeming, setSeeming] = useState(String(initial?.line_data.seeming ?? "Beast"));
  const [kith, setKith] = useState(String(initial?.line_data.kith ?? ""));
  const [court, setCourt] = useState(translateCourt(String(initial?.line_data.court ?? "Sem Corte")));
  const [needle, setNeedle] = useState(translateNeedle(String(initial?.line_data.needle ?? "Mestre de Xadrez")));
  const [thread, setThread] = useState(translateThread(String(initial?.line_data.thread ?? "Aceitação")));
  const [touchstone, setTouchstone] = useState(String(initial?.line_data.touchstone ?? ""));
  const [wyrd, setWyrd] = useState(Number(initial?.line_data.wyrd ?? 1));
  const [secondRegalia, setSecondRegalia] = useState(translateRegalia(String(initial?.line_data.second_regalia ?? "Coroa")));
  const [favoredAttribute, setFavoredAttribute] = useState(String(initial?.line_data.favored_attribute ?? "Perseverança"));
  const [contracts, setContracts] = useState<ContractSelection[]>(readContracts(initial));

  const [path, setPath] = useState(String(initial?.line_data.path ?? "Acanthus"));
  const [order, setOrder] = useState(String(initial?.line_data.order ?? "Mysterium"));
  const [virtue, setVirtue] = useState(String(initial?.line_data.virtue ?? ""));
  const [vice, setVice] = useState(String(initial?.line_data.vice ?? ""));
  const [nimbus, setNimbus] = useState(String(initial?.line_data.nimbus ?? ""));
  const [tool, setTool] = useState(String(initial?.line_data.dedicated_tool ?? ""));
  const [resistanceBonus, setResistanceBonus] = useState(String(initial?.line_data.resistance_bonus ?? "Perseverança"));
  const [gnosis, setGnosis] = useState(Number(initial?.line_data.gnosis ?? 1));
  const [arcana, setArcana] = useState<Record<string, number>>(
    normalizeArcana(initial?.line_data.arcana)
  );
  const [rotes, setRotes] = useState<string[]>(readArray(initial, "rotes", ["", "", ""]));
  const [praxes, setPraxes] = useState<string[]>(readArray(initial, "praxes", ["", "", ""]));
  const [error, setError] = useState("");

  const meritBudget = 10 - (line === "CtL" ? (wyrd - 1) * 5 : (gnosis - 1) * 5);
  const meritCatalog = useMemo(() => getMeritsForLine(line), [line]);
  const meritSpent = merits.reduce((sum, item) => sum + item.dots, 0);
  const pathData = MTA_PATHS[path as keyof typeof MTA_PATHS] ?? MTA_PATHS.Acanthus;

  function validate(nextStep: number) {
    setError("");
    const fail = (message: string) => setError(message);
    if (step === 1 && (!name.trim() || !concept.trim())) return fail("Informe o nome e o conceito do personagem.");
    if (step === 2) {
      if (new Set(attributePriority).size !== 3 || new Set(skillPriority).size !== 3) return fail("Cada prioridade deve usar categorias diferentes.");
      const attributeOk = attributePriority.every((category, index) => spent(attributes, ATTRIBUTES[category as keyof typeof ATTRIBUTES], 1) === [5, 4, 3][index]);
      const skillOk = skillPriority.every((category, index) => spent(skills, SKILLS[category as keyof typeof SKILLS], 0) === [11, 7, 4][index]);
      if (!attributeOk) return fail("Distribua exatamente 5/4/3 pontos nas categorias de Atributos.");
      if (!skillOk) return fail("Distribua exatamente 11/7/4 pontos nas categorias de Perícias.");
      if (specialties.some((item) => !item.skill || !item.name.trim())) return fail("Selecione a Perícia e informe o nome das três Especializações.");
    }
    if (step === 3) {
      if (aspirations.some((item) => !item.trim())) return fail("Preencha as três Aspirações.");
      if (meritSpent > meritBudget) return fail(`Os Méritos excedem o limite de ${meritBudget} pontos.`);
      if (merits.some((item) => !meritCatalog.some((definition) => definition.name === item.name && definition.ratings.includes(item.dots)))) return fail("Escolha Méritos e níveis válidos para esta linha de jogo.");
      if (line === "CtL") {
        const favoredSet = favoredChoices(CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS].favored);
        if (!favoredSet.includes(favoredAttribute)) return fail("Escolha um Atributo favorecido compatível com a Aparência.");
        if (attributes[favoredAttribute] >= 5) return fail("O ponto favorecido não pode elevar um Atributo acima de 5.");
        if (!kith.trim() || !touchstone.trim()) return fail("Informe Kith e Pedra de Toque.");
        if (contracts.length !== 6 || contracts.some((item) => !item.name.trim()) || contracts.slice(0, 4).some((item) => item.type !== "Comum") || contracts.slice(4).some((item) => item.type !== "Real")) return fail("Selecione quatro Contratos Comuns e dois Reais.");
        const primaryRegalia = CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS].regalia;
        if (secondRegalia === primaryRegalia) return fail("A segunda Regalia favorecida deve ser diferente da Regalia da Aparência.");
        if (contracts.slice(0, 4).filter((item) => item.regalia === primaryRegalia || item.regalia === secondRegalia).length < 2) return fail("Ao menos dois Contratos Comuns devem pertencer às Regalias favorecidas.");
      } else {
        if (!virtue.trim() || !vice.trim() || !nimbus.trim() || !tool.trim()) return fail("Preencha Virtude, Vício, Nimbus e Ferramenta Mágica.");
        if (attributes[resistanceBonus] >= 5) return fail("O ponto de Resistência não pode elevar o Atributo acima de 5.");
        const total = Object.values(arcana).reduce((sum, value) => sum + value, 0);
        const rulingTotal = pathData.ruling.reduce((sum, item) => sum + (arcana[item] ?? 0), 0);
        if (total !== 6) return fail("Distribua exatamente seis pontos de Arcanos.");
        if ((arcana[pathData.inferior] ?? 0) !== 0) return fail("O Arcanum inferior não pode receber pontos na criação.");
        if (pathData.ruling.some((item) => (arcana[item] ?? 0) < 1) || rulingTotal < 3 || rulingTotal > 5) return fail("Os Arcanos Regentes precisam de ao menos um ponto cada e de três a cinco pontos no total.");
        if (Object.values(arcana).filter((value) => value === 3).length > 1 || Object.values(arcana).some((value) => value > 3)) return fail("Somente um Arcanum pode começar em 3; nenhum pode exceder 3.");
        if (rotes.some((item) => !item.trim())) return fail("Preencha as três Rotas iniciais.");
        if (praxes.slice(0, gnosis).some((item) => !item?.trim())) return fail(`Preencha ${gnosis} Práxis.`);
      }
    }
    setStep(nextStep);
  }

  function finish() {
    const finalAttributes = { ...attributes };
    if (line === "CtL") finalAttributes[favoredAttribute] += 1;
    else finalAttributes[resistanceBonus] += 1;
    const derived = {
      Tamanho: 5,
      Vitalidade: 5 + finalAttributes["Vigor"],
      Deslocamento: 5 + finalAttributes["Força"] + finalAttributes["Destreza"],
      ForçaDeVontade: finalAttributes["Perseverança"] + finalAttributes["Autocontrole"],
      Iniciativa: finalAttributes["Destreza"] + finalAttributes["Autocontrole"],
      Defesa: Math.min(finalAttributes["Destreza"], finalAttributes["Raciocínio"]) + skills["Esportes"],
      ...(line === "CtL" ? { ClarezaMaxima: finalAttributes["Raciocínio"] + finalAttributes["Autocontrole"] } : { Sabedoria: 7 }),
    };
    const now = new Date().toISOString();
    const lineData = line === "CtL" ? {
      seeming, kith, court, needle, thread, touchstone, wyrd,
      primary_regalia: CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS].regalia,
      second_regalia: secondRegalia, favored_attribute: favoredAttribute, aspirations, contracts,
    } : {
      path, order, virtue, vice, nimbus, dedicated_tool: tool, resistance_bonus: resistanceBonus,
      gnosis, wisdom: 7, aspirations, arcana, rotes, praxes: praxes.slice(0, gnosis),
      ruling_arcana: pathData.ruling, inferior_arcanum: pathData.inferior,
      rote_skills: MTA_ORDERS[order as keyof typeof MTA_ORDERS] ?? [],
    };
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      schema_version: 2,
      system: "chronicles-of-darkness",
      game_line: line,
      ruleset: { id: line === "CtL" ? "ctl-2ed-embedded" : "mta-2ed-embedded", version: 1 },
      character: { name: name.trim(), concept: concept.trim(), player },
      attributes: finalAttributes,
      skills,
      specializations: specialties.map((item) => ({ skill: item.skill, name: item.name.trim() })),
      merits: merits.map((item) => { const definition=meritCatalog.find((entry)=>entry.name===item.name); return { ...item, sourceId: definition?.sourceId, source: definition?.source }; }),
      line_data: lineData,
      derived,
      current_state: initial?.current_state ?? {},
      created_at: initial?.created_at ?? now,
      updated_at: now,
    });
  }

  return <section className="builder">
    <div className="builder-head">
      <Button variant="ghost" onClick={onCancel}><ArrowLeft /> Voltar</Button>
      <div><Badge variant="outline">{line}</Badge><span>Criação guiada · regras compartilhadas v1</span></div>
    </div>
    <div className="stepper">{["Identidade", "Características", line === "CtL" ? "Modelo dos Perdidos" : "Modelo dos Despertos", "Conferência"].map((label, index) => <div key={label} className={step === index + 1 ? "step active" : step > index + 1 ? "step done" : "step"}><span>{step > index + 1 ? <Check /> : index + 1}</span><strong>{label}</strong></div>)}</div>
    {error && <div className="builder-error">{error}</div>}
    <div className="builder-body">
      {step === 1 && <IdentityStep line={line} setLine={setLine} name={name} setName={setName} concept={concept} setConcept={setConcept} player={player} />}
      {step === 2 && <TraitsStep attributes={attributes} setAttributes={setAttributes} skills={skills} setSkills={setSkills} attributePriority={attributePriority} setAttributePriority={setAttributePriority} skillPriority={skillPriority} setSkillPriority={setSkillPriority} specialties={specialties} setSpecialties={setSpecialties} />}
      {step === 3 && (line === "CtL" ? <CtlStep {...{ seeming, setSeeming, kith, setKith, court, setCourt, needle, setNeedle, thread, setThread, touchstone, setTouchstone, wyrd, setWyrd, secondRegalia, setSecondRegalia, favoredAttribute, setFavoredAttribute, contracts, setContracts, aspirations, setAspirations, merits, setMerits, meritCatalog, meritBudget, meritSpent }} /> : <MtaStep {...{ path, setPath, order, setOrder, virtue, setVirtue, vice, setVice, nimbus, setNimbus, tool, setTool, resistanceBonus, setResistanceBonus, gnosis, setGnosis, arcana, setArcana, rotes, setRotes, praxes, setPraxes, aspirations, setAspirations, merits, setMerits, meritCatalog, meritBudget, meritSpent }} />)}
      {step === 4 && <ReviewStep line={line} name={name} concept={concept} attributes={attributes} skills={skills} merits={merits} lineData={line === "CtL" ? { seeming, kith, court, needle, thread, wyrd } : { path, order, gnosis }} />}
    </div>
    <div className="builder-actions">
      {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}><ArrowLeft /> Anterior</Button>}
      <span />
      {step < 4 ? <Button onClick={() => validate(step + 1)}>Continuar <ArrowRight /></Button> : <Button onClick={finish}><Save /> Salvar ficha localmente</Button>}
    </div>
  </section>;
}

function IdentityStep({ line, setLine, name, setName, concept, setConcept, player }: any) {
  return <div className="builder-section"><span className="kicker">PASSO 1</span><h2>Quem atravessou a escuridão?</h2><p>Escolha a linha principal. Ela determina todas as próximas opções.</p><div className="line-choice"><button className={line === "CtL" ? "selected" : ""} onClick={() => setLine("CtL")}><Badge>CtL</Badge><strong>Changeling the Lost</strong><small>Fonte principal: Changeling the Lost 2e</small></button><button className={line === "MtA" ? "selected" : ""} onClick={() => setLine("MtA")}><Badge>MtA</Badge><strong>Mage the Awakening</strong><small>Fonte principal: Mage the Awakening 2e</small></button></div><div className="form-grid"><label>Nome<Input value={name} onChange={(e) => setName(e.target.value)} /></label><label>Jogador<Input value={player} readOnly /></label><label className="full">Conceito<Input value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Uma frase curta" /></label></div></div>;
}

function TraitsStep(props: any) {
  const allSkills = Object.values(SKILLS).flat();
  return <div className="builder-section"><span className="kicker">PASSO 2</span><h2>Atributos e Perícias</h2><p>Defina a prioridade das categorias e distribua exatamente os pontos indicados.</p><PriorityRow labels={attributeCategories} values={props.attributePriority} setValues={props.setAttributePriority} budgets={[5,4,3]} /><DotGroups groups={ATTRIBUTES} values={props.attributes} setValues={props.setAttributes} base={1} max={5} priority={props.attributePriority} budgets={[5,4,3]} /><div className="section-divider" /><PriorityRow labels={skillCategories} values={props.skillPriority} setValues={props.setSkillPriority} budgets={[11,7,4]} /><DotGroups groups={SKILLS} values={props.skills} setValues={props.setSkills} base={0} max={5} priority={props.skillPriority} budgets={[11,7,4]} /><div className="section-divider" /><h3>Especializações</h3><p>Escolha uma Perícia e escreva a área específica. A mesma Perícia pode ser escolhida mais de uma vez.</p><div className="specialty-grid">{props.specialties.map((value: Specialty, index: number) => <div className="specialty-row" key={index}><Choice label={`Perícia ${index + 1}`} value={value.skill} setValue={(skill) => updateArray(props.setSpecialties, props.specialties, index, { ...value, skill })} options={allSkills} /><label>Especialização<Input value={value.name} onChange={(e) => updateArray(props.setSpecialties, props.specialties, index, { ...value, name: e.target.value })} placeholder="Ex.: Prestidigitação" /></label></div>)}</div></div>;
}

function CtlStep(props: any) {
  const seemingData = CTL_SEEMINGS[props.seeming as keyof typeof CTL_SEEMINGS];
  const favored = favoredChoices(seemingData.favored);
  return <div className="builder-section"><span className="kicker">PASSO 3 · CHANGELING</span><h2>Modelo dos Perdidos</h2><p>As escolhas e limites abaixo vêm de Changeling the Lost.</p><div className="form-grid thirds"><Choice label="Aparência" value={props.seeming} setValue={props.setSeeming} options={Object.keys(CTL_SEEMINGS)} /><label>Kith<Input value={props.kith} onChange={(e) => props.setKith(e.target.value)} placeholder="Nome do Kith" /></label><Choice label="Corte" value={props.court} setValue={props.setCourt} options={CTL_COURTS} /><Choice label="Agulha" value={props.needle} setValue={props.setNeedle} options={CTL_NEEDLES} /><Choice label="Fio" value={props.thread} setValue={props.setThread} options={CTL_THREADS} /><label>Pedra de Toque<Input value={props.touchstone} onChange={(e) => props.setTouchstone(e.target.value)} /></label><Choice label="Atributo favorecido (+1)" value={props.favoredAttribute} setValue={props.setFavoredAttribute} options={favored} /><Choice label="Segunda Regalia favorecida" value={props.secondRegalia} setValue={props.setSecondRegalia} options={REGALIA.filter((item) => item !== seemingData.regalia)} /><Choice label="Wyrd" value={String(props.wyrd)} setValue={(value) => props.setWyrd(Number(value))} options={["1","2","3"]} /></div><p className="rule-callout"><ShieldCheck /> Regalia da Aparência: <strong>{seemingData.regalia}</strong> · Méritos disponíveis: <strong>{props.meritBudget}</strong></p><Aspirations values={props.aspirations} setValues={props.setAspirations} /><ContractSelector contracts={props.contracts} setContracts={props.setContracts} /><Merits merits={props.merits} setMerits={props.setMerits} catalog={props.meritCatalog} spent={props.meritSpent} budget={props.meritBudget} /></div>;
}

function ContractSelector({ contracts, setContracts }: { contracts: ContractSelection[]; setContracts: (value: ContractSelection[]) => void }) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const contractGroups = [...REGALIA, ...CONTRACTS.map((item) => item.regalia).filter((item) => !REGALIA.includes(item))];
  const groups = [...new Set(contractGroups)].map((regalia) => ({ regalia, items: CONTRACTS.filter((item) => item.regalia === regalia && (!normalizedSearch || `${item.name} ${item.originalName} ${item.source} ${item.description} ${item.dicePool}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch))) })).filter((group) => group.items.length);
  function addContract(contract: ContractDefinition) {
    if (contracts.some((item) => item.id === contract.id || item.originalName === contract.originalName)) return;
    const start = contract.type === "Comum" ? 0 : 4;
    const end = contract.type === "Comum" ? 4 : 6;
    const slot = contracts.findIndex((item, index) => index >= start && index < end && !item.name);
    if (slot < 0) return;
    const next = [...contracts]; next[slot] = { ...contract }; setContracts(next);
  }
  function removeContract(index: number) {
    const next = [...contracts]; next[index] = emptyContract(index < 4 ? "Comum" : "Real"); setContracts(next);
  }
  return <><div className="merit-heading"><div><h3>Contratos iniciais</h3><p>Selecione quatro Contratos Comuns e dois Reais. Passe o mouse sobre uma escolha para rever sua descrição.</p></div><Badge variant="outline">{contracts.filter((item) => item.name).length}/6 selecionados</Badge></div><div className="contract-grid">{contracts.map((item,index)=><div key={index} title={contractTooltip(item)}><Badge variant={index<4?"secondary":"outline"}>{index<4?"Comum":"Real"}</Badge><div><strong>{item.name || "Vaga disponível"}</strong><small>{item.name ? `${item.regalia} · ${item.source} · p. ${item.page || "—"}` : "Escolha no catálogo"}</small></div>{item.name?<Button type="button" variant="ghost" size="icon" aria-label={`Remover ${item.name}`} onClick={()=>removeContract(index)}><Trash2 /></Button>:<span/>}</div>)}</div><Dialog><DialogTrigger asChild><Button type="button" variant="outline"><Plus /> Selecionar contratos</Button></DialogTrigger><DialogContent className="merit-dialog"><DialogHeader><DialogTitle>Selecionar contratos</DialogTitle><DialogDescription>Os contratos estão separados por Regalia e identificados como Comuns ou Reais.</DialogDescription></DialogHeader><label className="merit-search"><Search aria-hidden="true"/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Buscar contrato, Regalia ou fonte…"/></label><div className="merit-catalog">{groups.map(({regalia,items})=><section className="merit-category" key={regalia}><h3>{regalia} <Badge variant="outline">{items.length}</Badge></h3><div>{items.map((contract)=>{const selected=contracts.some((item)=>item.id===contract.id||item.originalName===contract.originalName);const full=contract.type==="Comum"?contracts.slice(0,4).every((item)=>item.name):contracts.slice(4).every((item)=>item.name);return <article className={selected?"merit-option selected":"merit-option"} key={contract.id}><div><strong>{contract.name}</strong><small>{contract.type} · {contract.source} · p. {contract.page||"—"}</small><p>{contract.description}</p><p className="rule-detail"><strong>Parada de dados:</strong> {contract.dicePool}</p></div><Button type="button" size="sm" variant={selected?"secondary":"outline"} disabled={selected||full} onClick={()=>addContract(contract)}>{selected?<><Check/>Selecionado</>:full?"Vagas preenchidas":<><Plus/>Adicionar</>}</Button></article>})}</div></section>)}</div><DialogFooter><DialogClose asChild><Button type="button">Concluir</Button></DialogClose></DialogFooter></DialogContent></Dialog></>;
}

function MtaStep(props: any) {
  const pathData = MTA_PATHS[props.path as keyof typeof MTA_PATHS];
  const neededPraxes = props.gnosis;
  return <div className="builder-section"><span className="kicker">PASSO 3 · MAGO</span><h2>Modelo dos Despertos</h2><p>As escolhas e limites abaixo vêm de Mage the Awakening.</p><div className="form-grid thirds"><Choice label="Caminho" value={props.path} setValue={props.setPath} options={Object.keys(MTA_PATHS)} /><Choice label="Ordem" value={props.order} setValue={props.setOrder} options={Object.keys(MTA_ORDERS)} /><Choice label="Gnose" value={String(props.gnosis)} setValue={(value) => props.setGnosis(Number(value))} options={["1","2","3"]} /><label>Virtude<Input value={props.virtue} onChange={(e) => props.setVirtue(e.target.value)} /></label><label>Vício<Input value={props.vice} onChange={(e) => props.setVice(e.target.value)} /></label><Choice label="Atributo de Resistência (+1)" value={props.resistanceBonus} setValue={props.setResistanceBonus} options={["Perseverança","Vigor","Autocontrole"]} /><label className="full">Nimbus<Input value={props.nimbus} onChange={(e) => props.setNimbus(e.target.value)} /></label><label className="full">Ferramenta Mágica Dedicada<Input value={props.tool} onChange={(e) => props.setTool(e.target.value)} /></label></div><p className="rule-callout"><ShieldCheck /> Regentes: <strong>{pathData.ruling.join(" e ")}</strong> · Inferior: <strong>{pathData.inferior}</strong> · Méritos disponíveis: <strong>{props.meritBudget}</strong></p><Aspirations values={props.aspirations} setValues={props.setAspirations} /><h3>Arcanos · 6 pontos</h3><div className="arcana-grid">{ARCANA.map((item) => <DotRow key={item} name={item} value={props.arcana[item]} setValue={(value) => props.setArcana({ ...props.arcana, [item]: value })} min={0} max={3} tag={pathData.ruling.includes(item as any) ? "Regente" : pathData.inferior === item ? "Inferior" : undefined} />)}</div><h3>Rotas iniciais</h3><div className="three-inputs">{props.rotes.map((value: string, index: number) => <Input key={index} value={value} onChange={(e) => updateArray(props.setRotes, props.rotes, index, e.target.value)} placeholder={`Rota ${index + 1}`} />)}</div><h3>Práxis · {neededPraxes}</h3><div className="three-inputs">{props.praxes.slice(0, neededPraxes).map((value: string, index: number) => <Input key={index} value={value} onChange={(e) => updateArray(props.setPraxes, props.praxes, index, e.target.value)} placeholder={`Práxis ${index + 1}`} />)}</div><Merits merits={props.merits} setMerits={props.setMerits} catalog={props.meritCatalog} spent={props.meritSpent} budget={props.meritBudget} /></div>;
}

function ReviewStep({ line, name, concept, attributes, skills, merits, lineData }: any) {
  return <div className="builder-section"><span className="kicker">PASSO 4</span><h2>Ficha pronta para salvar</h2><p>Ela ficará neste navegador e poderá ser exportada como JSON.</p><div className="review-summary"><div><Badge>{line}</Badge><h3>{name}</h3><p>{concept}</p></div><div><strong>{Object.values(attributes).reduce((a: number,b: any)=>a+Number(b),0)}</strong><span>pontos de Atributos</span></div><div><strong>{Object.values(skills).reduce((a: number,b: any)=>a+Number(b),0)}</strong><span>pontos de Perícias</span></div><div><strong>{merits.length}</strong><span>Méritos</span></div></div><div className="line-review">{Object.entries(lineData).map(([key,value]) => <div key={key}><span>{key}</span><strong>{String(value)}</strong></div>)}</div></div>;
}

function PriorityRow({ labels, values, setValues, budgets }: any) {
  return <div className="priority-row">{values.map((value: string, index: number) => <Choice key={index} label={["Primária","Secundária","Terciária"][index] + ` · ${budgets[index]} pontos`} value={value} setValue={(next) => updateArray(setValues, values, index, next)} options={labels} />)}</div>;
}
function DotGroups({ groups, values, setValues, base, max, priority, budgets }: any) {
  return <div className="dot-groups">{Object.entries(groups).map(([category,names]) => { const budget = budgets[priority.indexOf(category)]; const used = spent(values, names as string[], base); return <section key={category}><div><h3>{category}</h3><Badge variant={used === budget ? "secondary" : "outline"}>{used}/{budget}</Badge></div>{(names as string[]).map((name) => <DotRow key={name} name={name} value={values[name]} setValue={(value) => setValues({ ...values, [name]: value })} min={base} max={max} />)}</section>; })}</div>;
}
function DotRow({ name, value, setValue, min, max, tag }: any) {
  return <div className="dot-row"><span>{name}{tag && <small>{tag}</small>}</span><div><Button type="button" variant="ghost" size="icon-xs" onClick={() => setValue(Math.max(min,value-1))}><Minus /></Button><div className="dots">{Array.from({length:max},(_,i)=><i key={i} className={i<value ? "filled" : ""} />)}</div><Button type="button" variant="ghost" size="icon-xs" onClick={() => setValue(Math.min(max,value+1))}><Plus /></Button></div></div>;
}
function Choice({ label, value, setValue, options, optionLabels = { ...CTL_SEEMING_LABELS, ...MTA_ORDER_LABELS } }: { label?: string; value: string; setValue: (value:string)=>void; options: readonly string[]; optionLabels?: Record<string,string> }) {
  return <label className="choice-label">{label}<Select value={value} onValueChange={setValue}><SelectTrigger className="w-full"><SelectValue>{optionLabels[value] ?? value}</SelectValue></SelectTrigger><SelectContent>{options.map((option)=><SelectItem key={option} value={option}>{optionLabels[option] ?? option}</SelectItem>)}</SelectContent></Select></label>;
}
function Aspirations({ values, setValues }: any) { return <><h3>Aspirações</h3><div className="three-inputs">{values.map((value:string,index:number)=><Input key={index} value={value} onChange={(e)=>updateArray(setValues,values,index,e.target.value)} placeholder={`Aspiração ${index+1}`} />)}</div></>; }
function Merits({ merits, setMerits, catalog, spent, budget }: { merits: MeritSelection[]; setMerits: (value: MeritSelection[]) => void; catalog: MeritDefinition[]; spent: number; budget: number }) {
  const [search, setSearch] = useState("");
  const categories = [...new Set(catalog.map((merit) => merit.category))].sort((a,b) => meritCategoryRank(a) - meritCategoryRank(b) || a.localeCompare(b));
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  function addMerit(definition: MeritDefinition) {
    if (merits.some((merit) => merit.name === definition.name)) return;
    setMerits([...merits, { name: definition.name, dots: definition.ratings[0], sourceId: definition.sourceId, source: definition.source }]);
  }
  return <><div className="merit-heading"><div><h3>Méritos</h3><p>Core + livros da linha, reunidos por categoria. Você pode guardar pontos sem gastá-los.</p></div><Badge variant={spent>budget ? "destructive" : "outline"}>{spent}/{budget} pontos usados</Badge></div><div className="merit-picker">{merits.map((selection,index) => { const definition = catalog.find((item) => item.name === selection.name); return <div className="merit-row" key={`${index}-${selection.name}`} title={definition ? meritTooltip(definition) : undefined}><div><strong>{definition?.translatedName ?? selection.name}</strong><small>{definition ? `${meritCategoryLabel(definition.category)} · ${definition.source} · p. ${definition.page || "—"}` : selection.source}</small></div><Choice label="Pontos" value={String(selection.dots)} setValue={(value) => { const next=[...merits]; next[index]={...selection,dots:Number(value)}; setMerits(next); }} options={(definition?.ratings ?? [1]).map(String)} /><Button type="button" variant="ghost" size="icon" aria-label={`Remover ${definition?.translatedName ?? selection.name}`} onClick={() => setMerits(merits.filter((_,itemIndex) => itemIndex !== index))}><Trash2 /></Button></div>; })}</div><Dialog><DialogTrigger asChild><Button type="button" variant="outline"><Plus /> Selecionar méritos</Button></DialogTrigger><DialogContent className="merit-dialog"><DialogHeader><DialogTitle>Selecionar méritos</DialogTitle><DialogDescription>Procure por nome ou navegue pelas categorias. Méritos já escolhidos ficam marcados.</DialogDescription></DialogHeader><label className="merit-search"><Search aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar mérito por nome, pré-requisito ou fonte…" /></label><div className="merit-catalog">{categories.map((category) => { const items = catalog.filter((item) => item.category === category && (!normalizedSearch || `${item.translatedName} ${item.name} ${item.source} ${item.prerequisites ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch))); if (!items.length) return null; return <section className="merit-category" key={category}><h3>{meritCategoryLabel(category)} <Badge variant="outline">{items.length}</Badge></h3><div>{items.map((definition) => { const selected = merits.some((merit) => merit.name === definition.name); return <article className={selected ? "merit-option selected" : "merit-option"} key={definition.id}><div><strong>{definition.translatedName}</strong><small>{definition.source} · p. {definition.page || "—"} · {formatRatings(definition.ratings)}</small><p>{definition.description}</p>{definition.prerequisites&&<p className="rule-detail"><strong>Pré-requisitos:</strong> {definition.prerequisites}</p>}</div><Button type="button" size="sm" variant={selected ? "secondary" : "outline"} disabled={selected} onClick={() => addMerit(definition)}>{selected ? <><Check /> Selecionado</> : <><Plus /> Adicionar</>}</Button></article>; })}</div></section>; })}</div><DialogFooter><DialogClose asChild><Button type="button">Concluir</Button></DialogClose></DialogFooter></DialogContent></Dialog></>;
}

function meritTooltip(definition: MeritDefinition) { return definition.prerequisites ? `${definition.description}\nPré-requisitos: ${definition.prerequisites}` : definition.description; }
function contractTooltip(contract: Pick<ContractDefinition,"description"|"dicePool">) { return contract.description ? `${contract.description}\nParada de dados: ${contract.dicePool ?? "Não informada"}` : ""; }

function meritCategoryRank(category:string) { const order=["Mental","Physical","Social","Supernatural","Fighting Style","Changeling","Awakened","Entitlement","Court","Seeming","Historical","Order","Mystery Cult"]; const rank=order.indexOf(category); return rank < 0 ? 99 : rank; }
function meritCategoryLabel(category:string) { return ({ Mental:"Mentais",Physical:"Físicos",Social:"Sociais",Supernatural:"Sobrenaturais","Fighting Style":"Estilos de Combate",Changeling:"Perdidos",Awakened:"Despertos",Entitlement:"Títulos Feéricos",Court:"Cortes",Seeming:"Aparências",Historical:"Históricos",Order:"Ordens","Mystery Cult":"Cultos de Mistério" } as Record<string,string>)[category] ?? category; }
function formatRatings(ratings:number[]) { return ratings.length === 1 ? `${ratings[0]} ponto${ratings[0] === 1 ? "" : "s"}` : `${ratings.join(", ")} pontos`; }

function spent(values: Record<string,number>, names: readonly string[], base: number) { return names.reduce((sum,name)=>sum+values[name]-base,0); }
function favoredChoices(type: string) { return type === "Power" ? ["Inteligência","Força","Presença"] : type === "Finesse" ? ["Raciocínio","Destreza","Manipulação"] : ["Perseverança","Vigor","Autocontrole"]; }
function updateArray(setter: any, values: any[], index: number, value: any) { const next=[...values]; next[index]=value; setter(next); }
function normalizeSpecialties(value: unknown): Specialty[] {
  if (!Array.isArray(value) || value.length === 0) return Array.from({ length: 3 }, () => ({ skill: "", name: "" }));
  const normalized = value.slice(0,3).map((item) => { const record=item as Record<string,unknown>; return typeof item === "string" ? { skill: "", name: item } : { skill: String(record?.skill ?? ""), name: String(record?.name ?? "") }; });
  while (normalized.length < 3) normalized.push({ skill: "", name: "" });
  return normalized;
}
function readArray(initial: CharacterSheet | null | undefined, key:string, fallback:string[]) { const value=initial?.line_data[key]; return Array.isArray(value)?value.map(String):fallback; }
function emptyContract(type: "Comum" | "Real"): ContractSelection { return { id: "", name: "", originalName: "", type, regalia: "", description: "", dicePool: "", sourceId: "", source: "", page: 0 }; }
function readContracts(initial: CharacterSheet | null | undefined) {
  const value=initial?.line_data.contracts;
  const saved=Array.isArray(value)?value as Array<Record<string,unknown>>:[];
  return Array.from({length:6},(_,index)=>{ const raw=saved[index]; if(!raw) return emptyContract(index<4?"Comum":"Real"); const found=CONTRACTS.find((item)=>item.id===raw.id||item.name===raw.name||item.originalName===raw.name); return found?{...found}:{...emptyContract(index<4?"Comum":"Real"),name:String(raw.name??""),originalName:String(raw.name??""),regalia:translateRegalia(String(raw.regalia??""))}; });
}
function translateRegalia(value:string) { return ({Crown:"Coroa",Jewels:"Joias",Mirror:"Espelho",Shield:"Escudo",Steed:"Corcel",Sword:"Espada",Chalice:"Cálice",Coin:"Moeda",Scepter:"Cetro",Stars:"Estrelas",Thorn:"Espinho"} as Record<string,string>)[value]??value; }
function translateCourt(value:string) { return ({Courtless:"Sem Corte",Spring:"Primavera",Summer:"Verão",Autumn:"Outono",Winter:"Inverno"} as Record<string,string>)[value]??value; }
function translateNeedle(value:string) { return ({"Chess Master":"Mestre de Xadrez",Commander:"Comandante",Composer:"Compositor",Counselor:"Conselheiro",Daredevil:"Audacioso",Dynamo:"Dínamo",Protector:"Protetor",Provider:"Provedor",Scholar:"Erudito",Storyteller:"Contador de Histórias",Teacher:"Professor",Traditionalist:"Tradicionalista",Visionary:"Visionário"} as Record<string,string>)[value]??value; }
function translateThread(value:string) { return ({Acceptance:"Aceitação",Anger:"Raiva",Family:"Família",Friendship:"Amizade",Hate:"Ódio",Honor:"Honra",Joy:"Alegria",Love:"Amor",Memory:"Memória",Revenge:"Vingança"} as Record<string,string>)[value]??value; }
function normalizeArcana(value:unknown) { const source=value&&typeof value==="object"?value as Record<string,number>:{}; const legacy:Record<string,string>={Morte:"Death",Destino:"Fate",Forças:"Forces",Vida:"Life",Matéria:"Matter",Mente:"Mind",Primórdio:"Prime",Espaço:"Space",Espírito:"Spirit",Tempo:"Time"}; return Object.fromEntries(ARCANA.map((item)=>[item,Number(source[item]??source[legacy[item]]??0)])); }
