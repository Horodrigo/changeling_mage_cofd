"use client";

import { useId, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RuleSelect } from "@/app/workspace/rule-select";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { FacetRules } from "./creation-gifts";
import { facetDefinition, facetPurchaseTerms, renownGrantProblem, renownGrants, type RenownGrant } from "./gift-progression";
import { allocateWerewolfRenownGrant, WerewolfAdvancementError, type WerewolfAdvancementCatalogs } from "./experience-rules";
import "./styles/sheet.css";

type Props = { character: CharacterSheet; catalogs: WerewolfAdvancementCatalogs; selectedId: string; onSelect: (id: string) => void; grant?: RenownGrant };

export function FacetExperienceCatalog({ character, catalogs, selectedId, onSelect, grant }: Props) {
  const { locale, t } = useLanguage(), listId = useId();
  const [search, setSearch] = useState(""), [kind, setKind] = useState("all"), [affinity, setAffinity] = useState("all");
  const { reference, gifts } = catalogs;
  const auspice = reference.auspices.find(item => item.id === character.line_data.auspice_id), tribe = reference.tribes.find(item => item.id === character.line_data.tribe_id);
  const favored = [...(auspice?.giftIds ?? []), ...(tribe?.giftIds ?? [])];
  const name = (item: { id: string; name: string }) => locale === "pt-BR" ? gifts.presentation[item.id]?.name ?? item.name : item.name;
  const query = search.trim().toLocaleLowerCase(locale);
  const visible = gifts.gifts.filter(gift => (kind === "all" || gift.kind === kind) && (affinity === "all" || gift.kind === "shadow" && favored.includes(gift.id) === (affinity === "favored")))
    .flatMap(gift => gift.facets.map(facet => ({ gift, facet })))
    .filter(({ gift, facet }) => `${name(gift)} ${name(facet)} ${facet.name} ${facet.source} ${locale === "pt-BR" ? gifts.presentation[facet.id]?.description ?? facet.description : facet.description}`.toLocaleLowerCase(locale).includes(query))
    .sort((a, b) => name(a.gift).localeCompare(name(b.gift), locale) || (a.gift.kind === "moon" ? (a.facet.level ?? 0) - (b.facet.level ?? 0) : name(a.facet).localeCompare(name(b.facet), locale)));
  return <section className="wtf-rite-experience-catalog">
    <div className="catalog-filters"><Input value={search} onChange={event => setSearch(event.target.value)} placeholder={t("werewolf.searchFacets")} aria-label={t("werewolf.searchFacets")}/>
      <RuleSelect value={kind} onChange={setKind} options={[
        { value: "all", label: t("werewolf.gifts"), localized: true }, ...(["moon", "shadow", "wolf"] as const).map(value => ({ value, label: t(`werewolf.${value}Gift`), localized: true })),
      ]}/>
      <RuleSelect value={affinity} onChange={setAffinity} options={[
        { value: "all", label: t("werewolf.allAffinities"), localized: true }, { value: "favored", label: t("werewolf.favoredGifts"), localized: true }, { value: "unfavored", label: t("werewolf.unfavoredGifts"), localized: true },
      ]}/></div>
    {visible.length ? visible.map(({ gift, facet }) => {
      // Narrative confirmations belong to the purchase form, not catalog membership.
      const terms = facetPurchaseTerms(character, facet.id, reference, gifts, "preview", "preview");
      const problem = grant ? renownGrantProblem(character, grant, facet.id, gifts) : terms.problem;
      return <div className="wtf-rite-experience-row" key={facet.id}>
        <details className="wtf-rule-disclosure"><summary>{name(gift)} — {name(facet)} · {t(`werewolf.renownNames.${facet.renown}`)}{facet.level ? ` ${facet.level}` : ""}</summary><FacetRules facet={facet} gifts={gifts}/></details>
        <div><Button type="button" size="sm" variant={selectedId === facet.id ? "default" : "outline"} className="catalog-selection-action" disabled={Boolean(problem)} aria-describedby={problem ? `${listId}-${facet.id}` : undefined} aria-label={t("werewolf.selectFacet", { name: name(facet) })} onClick={() => onSelect(facet.id)}>{t("ui.select")}</Button></div>
        {problem ? <p id={`${listId}-${facet.id}`} className="wtf-rite-reason">{t(`werewolf.experienceProblem.${problem}`)}</p>
          : <small className="wtf-rite-reason">{grant ? t("werewolf.freeRenownFacet") : `${reference.experienceCosts[terms.costKey!]} ${t("ui.xp")}`}{!grant && gift.kind === "shadow" && terms.unlock ? ` · ${t("werewolf.unlockIncludesFacet")}` : ""}</small>}
      </div>;
    }) : <p>{t("werewolf.noMatchingFacets")}</p>}
  </section>;
}

export function FacetExperiencePicker(props: Props) {
  const { locale, t } = useLanguage(), selected = facetDefinition(props.selectedId, props.catalogs.gifts);
  const name = selected ? locale === "pt-BR" ? props.catalogs.gifts.presentation[selected.facet.id]?.name ?? selected.facet.name : selected.facet.name : t("werewolf.selectFacetPrompt");
  return <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline" className="catalog-selection-action"><span>{name}</span><Search/></Button></DialogTrigger>
    <DialogContent className="experience-dialog"><DialogHeader><DialogTitle>{t("werewolf.facets")}</DialogTitle><DialogDescription>{t(props.grant ? "werewolf.renownGrantNote" : "werewolf.giftLearningNote")}</DialogDescription></DialogHeader>
      <FacetExperienceCatalog {...props}/><DialogFooter><DialogClose asChild><Button type="button" size="sm" variant="outline" className="catalog-dialog-done">{t("ui.close")}</Button></DialogClose></DialogFooter>
    </DialogContent></Dialog>;
}

export function RenownGrantsPanel({ character, catalogs, updateSheet }: { character: CharacterSheet; catalogs: WerewolfAdvancementCatalogs; updateSheet: (sheet: CharacterSheet) => void }) {
  const { locale, t } = useLanguage(), [feedback, setFeedback] = useState("");
  const grants = renownGrants(character);
  const allocate = (id: string, facetId: string | null) => {
    try { updateSheet(allocateWerewolfRenownGrant(character, id, facetId, catalogs)); setFeedback(""); }
    catch (error) { if (error instanceof WerewolfAdvancementError) setFeedback(t(`werewolf.experienceProblem.${error.problem}`)); else throw error; }
  };
  return grants.length ? <details className="experience-history"><summary>{t("werewolf.renownGrants")} ({grants.filter(grant => !grant.facetId).length} {t("werewolf.pendingCredits")})</summary>
    <p>{t("werewolf.renownGrantNote")}</p>{grants.map(grant => {
      const selected = grant.facetId ? facetDefinition(grant.facetId, catalogs.gifts)?.facet : undefined;
      return <div className="wtf-renown-grant" key={grant.id}><strong>{t(`werewolf.renownNames.${grant.renown}`)}</strong>
        {grant.facetId ? <><span>{selected ? locale === "pt-BR" ? catalogs.gifts.presentation[selected.id]?.name ?? selected.name : selected.name : grant.facetId}</span>
          <Button type="button" size="sm" variant="outline" className="catalog-selection-action" onClick={() => allocate(grant.id, null)}>{t("werewolf.releaseGrant")}</Button></>
          : <FacetExperiencePicker character={character} catalogs={catalogs} selectedId="" grant={grant} onSelect={id => allocate(grant.id, id)}/>}
      </div>;
    })}{feedback && <p role="status">{feedback}</p>}</details> : null;
}
