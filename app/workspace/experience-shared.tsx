"use client";
import { useEffect, useMemo, useState } from "react";
import { History, Plus, RotateCcw, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MeritConfigurationEditor, type CharacterSheet } from "../character-builder";
import { useHomebrews } from "../use-homebrews";
import { useLanguage, type Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { ATTRIBUTES, SKILLS, MTA_PATHS, normalizeChangelingFrailties, seemingDisplayName } from "@/lib/creation-rules";
import { getMeritsForLine, meritContextForSheet, meritPrerequisitesMet, meritRatingsFor, meritSelectionProblems, REPEATABLE_MERITS, type MeritDefinition } from "@/lib/merits";
import { isBuiltinHomebrew, isHomebrewActive } from "@/lib/homebrews";
import { CONTRACTS, findContract, type ContractDefinition } from "@/lib/contracts";
import { contractDisplayOptions, contractOutcomeSections, contractPresentation, contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import { availableForeignClauseCourtIds } from "@/lib/contract-clauses";
import { courtCanonicalId, courtDisplayName } from "@/lib/changeling-courts";
import { changelingContractExperienceCost } from "@/lib/changeling-regalia";
import { SPELLS } from "@/lib/spells";
import { meetsArcanaRequirements } from "@/lib/creation-eligibility";
import { powerResourceLimits, permanentClarityBonus, changePermanentClarity, normalizeClarityDamage } from "@/lib/resource-rules";
import { withPowerRating, refundPowerRating } from "@/lib/power-progression";
import { subtractDots, refundMeritDots, refundMageAdvancement, type MageAdvancementUndo } from "@/lib/experience-refunds";
import { addExperienceMeritDots } from "@/lib/merit-progression";
import { meritConfigurationTitle, normalizeMeritConfiguration, synchronizeMeritGrants } from "@/lib/merit-configurations";
import { ELEVENTH_QUESTION, normalizeLegacyState } from "@/lib/legacies";
import { alphabetical } from "@/lib/option-order";
import { RuleSelect } from "./rule-select";
import { stringList } from "./sheet-primitives";
import { workspaceTerm } from "./workspace-i18n";

const objectList=(value:unknown)=>Array.isArray(value)?value as Array<Record<string,unknown>>:[];
const boundedNumber=(value:unknown,maximum:number,fallback:number)=>Math.max(0,Math.min(maximum,Number.isFinite(Number(value))?Number(value):fallback));
export function BeatTrack({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const { tr } = useLanguage();
  return (
    <div className="beat-resource">
      <span>{label}</span>
      <div
        className="resource-track"
        role="group"
        aria-label={tr(`${label}: ${value} de 5`, `${label}: ${value} of 5`)}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index < value ? "filled" : ""}
            onClick={() => onChange(index < value ? index : index + 1)}
            aria-label={tr(`Definir ${label} como ${index < value ? index : index + 1}`, `Set ${label} to ${index < value ? index : index + 1}`)}
          />
        ))}
      </div>
    </div>
  );
}
export function MageExperienceRules() {
  const { locale, tr } = useLanguage();
  const beatsPt = [
    "Cumprir ou avançar uma Aspiração",
    "Resolver uma Condição",
    "Aceitar falha dramática",
    "Fim do capítulo",
  ];
  const beatsEn = ["Fulfill or advance an Aspiration", "Resolve a Condition", "Accept a dramatic failure", "End of the chapter"];
  const arcanePt = [
    "Cumprir ou avançar uma Obsessão",
    "Resolver Condição criada por magia, Paradoxo ou efeito mágico",
    "Falha dramática em conjuração",
    "Arriscar Ato de Hubris",
    "Tutoria de Legado",
    "Encontro novo e significativo com o sobrenatural",
  ];
  const arcaneEn = ["Fulfill or advance an Obsession", "Resolve a Condition created by magic, Paradox, or a magical effect", "Dramatic failure on spellcasting", "Risk an Act of Hubris", "Legacy tutoring", "A new and significant encounter with the supernatural"];
  const costsPt = [
    ["Atributo", "4/ponto, comum"],
    ["Perícia", "2/ponto, comum"],
    ["Mérito", "1/ponto, comum"],
    ["Arcano até o limite", "4/ponto, comum e/ou Arcana"],
    ["Arcano acima do limite", "5/ponto, somente comum + professor"],
    ["Gnose", "5/ponto, comum e/ou Arcana"],
    ["Rota", "1, comum"],
    ["Práxis", "1, somente Arcana"],
    ["Sabedoria", "2/ponto, somente Arcana"],
    ["Força de Vontade perdida", "1, comum"],
  ];
  const costsEn = [["Attribute", "4/dot, regular"], ["Skill", "2/dot, regular"], ["Merit", "1/dot, regular"], ["Arcanum up to the limit", "4/dot, regular and/or Arcane"], ["Arcanum above the limit", "5/dot, regular only + teacher"], ["Gnosis", "5/dot, regular and/or Arcane"], ["Rote", "1, regular"], ["Praxis", "1, Arcane only"], ["Wisdom", "2/dot, Arcane only"], ["Lost Willpower dot", "1, regular"]];
  const beats = locale === "en-US" ? beatsEn : beatsPt;
  const arcane = locale === "en-US" ? arcaneEn : arcanePt;
  const costs = locale === "en-US" ? costsEn : costsPt;
  return (
    <div className="experience-rule-menus">
      <details className="experience-rules"><summary>{tr("Formas de ganhar Beats", "Ways to earn Beats")}</summary><table>
        <tbody>
          {beats.map((x) => (
            <tr key={x}>
              <td>{x}</td>
              <td>1 Beat</td>
            </tr>
          ))}
          {arcane.map((x) => (
            <tr key={x}>
              <td>{x}</td>
              <td>{tr("1 Beat Arcano", "1 Arcane Beat")}</td>
            </tr>
          ))}
        </tbody>
      </table></details>
      <details className="experience-rules"><summary>{tr("Tabela de custos", "Cost table")}</summary><table>
        <tbody>
          {costs.map(([a, b]) => (
            <tr key={a}>
              <td>{a}</td>
              <td>{b}</td>
            </tr>
          ))}
        </tbody>
      </table></details>
    </div>
  );
}
type ExperienceCatalogItem = {
  id: string;
  name: string;
  category: string;
  secondaryCategory?: string;
  sortPriority?: number;
  description: string;
  meta: string;
};

export function ExperiencePowerPicker({
  kind,
  items,
  selectedId,
  onSelect,
  compact = false,
}: {
  kind: "Contrato" | "Rota" | "Práxis" | "Feitiço" | "Benefício de Contrato";
  items: ExperienceCatalogItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  const {locale,tr}=useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [secondary, setSecondary] = useState("Todos");
  const normalized = search.trim().toLocaleLowerCase("pt-BR");
  const selected = items.find((item) => item.id === selectedId);
  const categories = ["Todas", ...new Set(items.map((item) => item.category))];
  const secondaryCategories = [
    "Todos",
    ...new Set(items.map((item) => item.secondaryCategory).filter(Boolean)),
  ] as string[];
  const visible = alphabetical(items, item => item.name,locale)
    .sort((left, right) => (left.sortPriority ?? 0) - (right.sortPriority ?? 0))
    .filter(
    (item) =>
      (category === "Todas" || item.category === category) &&
      (secondary === "Todos" || item.secondaryCategory === secondary) &&
      (!normalized ||
        `${item.name} ${item.category} ${item.secondaryCategory ?? ""} ${item.description} ${item.meta}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalized)),
    );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size={compact ? "sm" : undefined} className={compact ? "builder-add-action" : "experience-merit-trigger"}>
          <span>{selected?.name ?? `${tr("Selecionar","Select")} ${workspaceTerm(kind,locale)}`}</span>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="merit-dialog experience-merit-dialog">
        <DialogHeader>
          <DialogTitle>{tr("Comprar","Purchase")} {workspaceTerm(kind,locale)}</DialogTitle>
          <DialogDescription>
            {tr("O catálogo mostra somente opções disponíveis para este personagem.","The catalog only shows options available to this character.")}
          </DialogDescription>
        </DialogHeader>
        <div className="catalog-filters">
          <label className="merit-search">
            <Search />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`${tr("Buscar","Search")} ${workspaceTerm(kind,locale).toLocaleLowerCase(locale)}, ${tr("fonte ou descrição","source, or description")}`}
            />
          </label>
          <RuleSelect
            value={category}
            onChange={setCategory}
            options={categories.map((value) => ({ value, label: value }))}
          />
          {secondaryCategories.length > 2 && (
            <RuleSelect
              value={secondary}
              onChange={setSecondary}
              options={secondaryCategories.map((value) => ({ value, label: value }))}
            />
          )}
        </div>
        <div className="experience-merit-catalog">
          {visible.map((item) => (
            <article key={item.id} className={selectedId === item.id ? "selected" : ""}>
              <div>
                <strong>{item.name}</strong>
                <small>{item.meta}</small>
                <p>{item.description}</p>
              </div>
              <div className="experience-merit-choice">
                <DialogClose asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant={selectedId === item.id ? "default" : "outline"}
                    onClick={() => onSelect(item.id)}
                  >
                    {tr("Selecionar","Select")}
                  </Button>
                </DialogClose>
              </div>
            </article>
          ))}
          {!visible.length && <em>{tr("Nenhuma opção corresponde aos filtros.","No options match the filters.")}</em>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">{tr("Cancelar","Cancel")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function canAdvanceGrantedMerit(
  line: "CtL" | "MtA",
  merit: CharacterSheet["merits"][number],
) {
  return (
    (line === "CtL" && merit.name === "Mantle" && merit.grantedBy === "Corte") ||
    (line === "MtA" && merit.name === "Awakened Status" && merit.grantedBy === "Ordem") ||
    (line === "MtA" && merit.name === "Mystery Cult Initiation" && merit.grantedBy === "Nameless Order")
  );
}

export function ExperienceMeritPicker({
  line,
  character,
  selectedId,
  targetDots,
  onSelect,
}: {
  line: "CtL" | "MtA";
  character: CharacterSheet;
  selectedId: string;
  targetDots: number;
  onSelect: (id: string, dots: number, instanceIndex: number) => void;
}) {
  const {locale,tr}=useLanguage();
  const homebrews = useHomebrews();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [meritDrafts, setMeritDrafts] = useState<Record<string,{newInstance:boolean;instanceIndex:number;dots:number}>>({});
  const meritName=(item:MeritDefinition)=>locale==="en-US"?item.name:item.translatedName;
  const context=meritContextForSheet(character);
  const catalog = alphabetical([
      ...getMeritsForLine(line).filter(item=>!isBuiltinHomebrew(item.sourceId)||isHomebrewActive(homebrews,item.sourceId)),
      ...homebrews.merits.filter(
        (item) => (item.line === "Core" || item.line === line) && isHomebrewActive(homebrews,item.id),
      ),
    ], meritName,locale),
    selected = catalog.find((item) => item.id === selectedId),
    normalized = search.toLocaleLowerCase("pt-BR"),
    categories = ["Todas", ...new Set(catalog.map((item) => item.category))];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="experience-merit-trigger"
        >
          <span>
            {selected
              ? `${meritName(selected)} ${targetDots}`
              : tr("Selecionar Mérito e pontos","Select Merit and dots")}
          </span>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="merit-dialog experience-merit-dialog">
        <DialogHeader>
          <DialogTitle>{tr("Comprar Mérito","Purchase Merit")}</DialogTitle>
          <DialogDescription>
            {tr("Escolha o Mérito e a quantidade de pontos. Nos Méritos repetíveis, escolha entre aumentar uma instância existente ou criar outra.","Choose the Merit and number of dots. For repeatable Merits, choose whether to improve an existing instance or create another.")}
          </DialogDescription>
        </DialogHeader>
        <div className="catalog-filters">
          <label className="merit-search">
            <Search />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={tr("Buscar por nome, descrição, requisito ou fonte","Search by name, description, prerequisite, or source")}
            />
          </label>
          <RuleSelect
            value={category}
            onChange={setCategory}
            options={categories.map((value) => ({ value, label: value }))}
          />
        </div>
        <div className="experience-merit-catalog">
          {catalog
            .filter(
              (item) =>
                (category === "Todas" || item.category === category) &&
                `${item.translatedName} ${item.name} ${item.description} ${item.prerequisites ?? ""} ${item.source}`
                  .toLocaleLowerCase("pt-BR")
                  .includes(normalized),
            )
            .map((item) => {
              const instances = character.merits
                  .map((owned, index) => ({ owned, index }))
                  .filter(
                    ({ owned }) =>
                      owned.name === item.name &&
                      (!owned.grantedBy || canAdvanceGrantedMerit(line, owned)),
                  ),
                repeatable = isRepeatableDefinition(item),
                ratings = meritRatingsFor(item,Math.max(1,...instances.map(({owned})=>owned.dots+1))),
                draft = meritDrafts[item.id] ?? {newInstance:repeatable&&!instances.length,instanceIndex:instances[0]?.index??-1,dots:instances[0]?.owned.dots??ratings[0]??1},
                activeInstance = instances.find(({index})=>index===draft.instanceIndex) ?? instances[0],
                buyingNew = repeatable && draft.newInstance,
                allowedRatings = ratings.filter((dot)=>
                  (buyingNew || !activeInstance || dot > activeInstance.owned.dots) &&
                  meritPrerequisitesMet(item,{...context,selectedDots:dot,configuration:buyingNew?undefined:activeInstance?.owned.configuration}),
                ),
                intendedDots = allowedRatings.includes(draft.dots) ? draft.dots : allowedRatings[0],
                prerequisitesMet = meritPrerequisitesMet(item,context);
              if (item.name === "Mantle" && !instances.length) return null;
              if(!repeatable&&character.merits.some(owned=>owned.name===item.name&&owned.grantedBy&&!canAdvanceGrantedMerit(line,owned)))return null;
              if (
                !repeatable &&
                instances.length &&
                ratings.every((dot) => dot <= instances[0].owned.dots)
              )
                return null;
              return (
                <article
                  key={item.id}
                  className={selectedId === item.id ? "selected" : ""}
                >
                  <div>
                    <strong>{meritName(item)}</strong>
                    <small>
                      {item.source} · p. {item.page || "—"}
                      {repeatable ? tr(" · pode ser comprado várias vezes"," · may be purchased multiple times") : ""}
                    </small>
                    {item.prerequisites && (
                      <p className={prerequisitesMet ? "" : "merit-prerequisites-missing"}>
                        <b>{tr("Pré-requisitos","Prerequisites")}:</b> {item.prerequisites}
                      </p>
                    )}
                    <p>{item.description}</p>
                  </div>
                  <div className="experience-merit-choice">
                    {repeatable && item.name !== "Mantle" && <label className="merit-instance-toggle"><input type="checkbox" checked={buyingNew} onChange={(event)=>setMeritDrafts(current=>({...current,[item.id]:{...draft,newInstance:event.target.checked,instanceIndex:event.target.checked?-1:(instances[0]?.index??-1),dots:event.target.checked?(ratings[0]??1):(instances[0]?.owned.dots??1)}}))}/><span>{tr("Nova instância","New Instance")}</span></label>}
                    {!buyingNew && instances.length > 1 && <label><span>{tr("Instância","Instance")}</span><select value={activeInstance?.index??instances[0].index} onChange={(event)=>{const instanceIndex=Number(event.target.value), owned=instances.find(entry=>entry.index===instanceIndex)?.owned;setMeritDrafts(current=>({...current,[item.id]:{...draft,newInstance:false,instanceIndex,dots:owned?.dots??1}}));}}>{instances.map(({owned,index})=><option key={index} value={index}>{meritConfigurationTitle(owned.configuration,locale)||`${meritName(item)} ${index+1}`}</option>)}</select></label>}
                    <span className="merit-current-rating"><b>{tr("Atual","Current")}:</b> {buyingNew?0:(activeInstance?.owned.dots??0)}</span>
                    <label><span>{tr("Pretendido","Intended")}</span><select value={intendedDots??""} disabled={!allowedRatings.length} onChange={(event)=>setMeritDrafts(current=>({...current,[item.id]:{...draft,dots:Number(event.target.value)}}))}>{allowedRatings.map(dot=><option key={dot} value={dot}>{dot}</option>)}</select></label>
                    <DialogClose asChild><Button type="button" size="sm" disabled={!intendedDots} variant={selectedId===item.id&&targetDots===intendedDots?"default":"outline"} onClick={()=>intendedDots&&onSelect(item.id,intendedDots,buyingNew?-1:(activeInstance?.index??-1))}>{tr("Selecionar","Select")}</Button></DialogClose>
                  </div>
                </article>
              );
            })}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {tr("Cancelar","Cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function isRepeatableDefinition(definition: MeritDefinition) {
  return (
    REPEATABLE_MERITS.has(definition.name) ||
    Boolean((definition as MeritDefinition & { repeatable?: boolean }).repeatable)
  );
}
export function formatSpellRequirements(requirements: Record<string, number>) {
  return Object.entries(requirements)
    .map(([arcanum, dots]) => `${arcanum} ${dots}`)
    .join(" + ");
}
export function contractExperienceCost(
  contract: ContractDefinition,
  character: CharacterSheet,
) {
  return changelingContractExperienceCost(contract, character.line_data);
}
export function purchasePreview(input: {
  locale: Locale;
  purchaseType: string;
  character: CharacterSheet;
  attribute: string;
  skill: string;
  selectedMerit?: MeritDefinition;
  nextMeritRating?: number;
  ownedMerit?: CharacterSheet["merits"][number];
  selectedContract?: ContractDefinition;
  specialtySkill: string;
  specialtyName: string;
  benefitKey?: string;
  wyrd: number;
  lostWillpower: number;
}) {
  const { purchaseType, character, locale } = input;
  if (purchaseType === "Atributo") {
    const target = Number(character.attributes[input.attribute] ?? 1) + 1;
    return { label: `${systemTerm(input.attribute,locale)} ${target}`, cost: 4 };
  }
  if (purchaseType === "Perícia") {
    const target = Number(character.skills[input.skill] ?? 0) + 1;
    return { label: `${systemTerm(input.skill,locale)} ${target}`, cost: 2 };
  }
  if (purchaseType === "Mérito")
    return {
      label: input.nextMeritRating
        ? `${locale==="en-US"?input.selectedMerit?.name:input.selectedMerit?.translatedName} ${input.nextMeritRating}`
        : locale==="en-US"?"No additional rating":"Sem nível adicional",
      cost: input.nextMeritRating
        ? input.nextMeritRating - (input.ownedMerit?.dots ?? 0)
        : 0,
    };
  if (purchaseType === "Especialização")
    return {
      label: `${systemTerm(input.specialtySkill,locale)}: ${input.specialtyName || (locale==="en-US"?"new Specialty":"nova Especialização")}`,
      cost: 1,
    };
  if (purchaseType === "Contrato")
    return {
      label: (locale==="en-US"?input.selectedContract?.originalName:input.selectedContract?.name) ?? (locale==="en-US"?"No Contract available":"Nenhum Contrato disponível"),
      cost: input.selectedContract
        ? contractExperienceCost(input.selectedContract, character)
        : 0,
    };
  if (purchaseType === "Benefício de Contrato")
    return {
      label: input.benefitKey
        ? locale==="en-US"?"Benefit from another Seeming":"Benefício de outra Feição"
        : locale==="en-US"?"No Benefit available":"Nenhum Benefício disponível",
      cost: input.benefitKey ? 1 : 0,
    };
  if (purchaseType === "Fado")
    return {
      label: input.wyrd < 10 ? `${locale==="en-US"?"Wyrd":"Fado"} ${input.wyrd + 1}` : locale==="en-US"?"Maximum Wyrd":"Fado máximo",
      cost: input.wyrd < 10 ? 5 : 0,
    };
  return {
    label: input.lostWillpower
      ? locale==="en-US"?"Recover a lost Willpower dot":"Recuperar ponto perdido de Força de Vontade"
      : locale==="en-US"?"No lost dots":"Nenhum ponto perdido",
    cost: input.lostWillpower ? 1 : 0,
  };
}
export function recalculateCtlDerived(sheet: CharacterSheet) {
  const a = sheet.attributes,
    s = sheet.skills;
  sheet.derived = {
    ...sheet.derived,
    Tamanho: 5,
    Vitalidade: 5 + Number(a.Vigor ?? 1),
    Deslocamento: 5 + Number(a.Força ?? 1) + Number(a.Destreza ?? 1),
    ForçaDeVontade: Number(a.Perseverança ?? 1) + Number(a.Compostura ?? 1),
    Iniciativa: Number(a.Destreza ?? 1) + Number(a.Compostura ?? 1),
    Defesa:
      Math.min(Number(a.Destreza ?? 1), Number(a.Raciocínio ?? 1)) +
      Number(s.Atletismo ?? 0),
    LucidezMaxima: Number(a.Raciocínio ?? 1) + Number(a.Compostura ?? 1),
  };
}
export function derivedWithPermanentMerits(character: CharacterSheet) {
  const derived = { ...character.derived };
  if (character.game_line === "CtL")
    derived.LucidezMaxima = Number(derived.LucidezMaxima ?? derived.ClarezaMaxima ?? 1) + permanentClarityBonus(character.current_state);
  const grantedSkills = (
    character.line_data.merit_granted_skill_bonuses &&
    typeof character.line_data.merit_granted_skill_bonuses === "object"
      ? character.line_data.merit_granted_skill_bonuses
      : {}
  ) as Record<string, number>;
  derived.Defesa =
    Number(derived.Defesa ?? 0) + (Number(grantedSkills.Atletismo) || 0);
  const merit = (name: string) =>
    character.merits.find((item) => item.name === name);
  const fastReflexes = merit("Fast Reflexes");
  const fleetOfFoot = merit("Fleet of Foot");
  if (fastReflexes)
    derived.Iniciativa = Number(derived.Iniciativa ?? 0) + fastReflexes.dots;
  if (fleetOfFoot)
    derived.Deslocamento = Number(derived.Deslocamento ?? 0) + fleetOfFoot.dots;
  if (
    character.game_line === "CtL" &&
    character.line_data.seeming === "Beast"
  ) {
    derived.Iniciativa = Number(derived.Iniciativa ?? 0) + 3;
    derived.Deslocamento = Number(derived.Deslocamento ?? 0) + 3;
  }
  const currentSize = Number(derived.Tamanho ?? 5);
  const targetSize = merit("Giant")
    ? 6
    : merit("Small-Framed")
      ? 4
      : currentSize;
  if (targetSize !== currentSize) {
    derived.Tamanho = targetSize;
    derived.Vitalidade = Math.max(
      1,
      Number(derived.Vitalidade ?? currentSize) + targetSize - currentSize,
    );
  }
  return derived;
}
export function ExperienceRules() {
  const { locale, tr } = useLanguage();
  const beatRowsPt = [
    "Cumprir uma Aspiração",
    "Resolver uma Condição",
    "Aceitar uma falha dramática",
    "Render-se em combate",
    "Sofrer dano nas caixas finais de Vitalidade",
    "Encerrar uma sessão",
    "Sofrer dano de Lucidez",
    "Liberar Desvario involuntariamente",
  ];
  const beatRowsEn = ["Fulfill an Aspiration", "Resolve a Condition", "Accept a dramatic failure", "Surrender in combat", "Take damage in the final Health boxes", "End a session", "Take Clarity damage", "Release Bedlam involuntarily"];
  const costRowsPt = [
    ["Atributo", "4 por ponto"],
    ["Perícia", "2 por ponto"],
    ["Mérito", "1 por ponto"],
    ["Especialização", "1"],
    ["Contrato favorecido", "Comum 2 · Real 3"],
    ["Contrato não favorecido", "Comum 3 · Real 4"],
    ["Contrato Goblin", "2"],
    ["Benefício de outra Feição", "1"],
    ["Fado", "5 por ponto"],
    ["Ponto perdido de Força de Vontade", "1"],
  ];
  const costRowsEn = [["Attribute", "4 per dot"], ["Skill", "2 per dot"], ["Merit", "1 per dot"], ["Specialty", "1"], ["Favored Contract", "Common 2 · Royal 3"], ["Non-favored Contract", "Common 3 · Royal 4"], ["Goblin Contract", "2"], ["Benefit of another Seeming", "1"], ["Wyrd", "5 per dot"], ["Lost Willpower dot", "1"]];
  const beatRows = locale === "en-US" ? beatRowsEn : beatRowsPt;
  const costRows = locale === "en-US" ? costRowsEn : costRowsPt;
  return (
    <div className="experience-rule-menus">
      <details className="experience-rules"><summary>{tr("Formas de ganhar Beats", "Ways to earn Beats")}</summary><table>
        <tbody>
          {beatRows.map((label) => (
            <tr key={label}>
              <td>{label}</td>
              <td>1 Beat</td>
            </tr>
          ))}
        </tbody>
      </table></details>
      <details className="experience-rules"><summary>{tr("Tabela de custos", "Cost table")}</summary><table>
        <thead>
          <tr>
            <th>{tr("Característica", "Trait")}</th>
            <th>{tr("EXP", "XP")}</th>
          </tr>
        </thead>
        <tbody>
          {costRows.map(([label, cost]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{cost}</td>
            </tr>
          ))}
        </tbody>
      </table></details>
    </div>
  );
}
