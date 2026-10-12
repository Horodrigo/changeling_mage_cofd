"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import { werewolfLodgeHomebrewId, normalizeWerewolfLodgeHomebrew } from "./lodge-homebrews";
import type { WerewolfLodgeDefinition } from "./catalogs/lodges";

const emptyLodge = (): WerewolfLodgeDefinition => ({
  id: werewolfLodgeHomebrewId(), name: "", summary: "", description: "",
  sourceId: "", source: "", page: 0, homebrew: true,
});

export function WerewolfLodgeHomebrewEditor({ open, onOpenChange, initial, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: WerewolfLodgeDefinition | null;
  onSave: (definition: WerewolfLodgeDefinition) => void;
}) {
  const { t } = useLanguage();
  const [value, setValue] = useState(() => initial ? structuredClone(initial) : emptyLodge());
  const [error, setError] = useState("");
  const set = (key: keyof WerewolfLodgeDefinition, next: unknown) => setValue(current => ({ ...current, [key]: next }));
  const commit = () => {
    const normalized = normalizeWerewolfLodgeHomebrew(value);
    if (!normalized) { setError(t("werewolf.lodgeRequiredFields")); return; }
    onSave(normalized);
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="homebrew-dialog wtf-lodge-homebrew-editor">
      <DialogHeader>
        <DialogTitle>{initial ? t("werewolf.lodgeEdit") : t("werewolf.lodgeCreate")}</DialogTitle>
      </DialogHeader>
      <div className="homebrew-form">
        <Field label={t("werewolf.lodgeName")}><Input value={value.name} onChange={event => set("name", event.target.value)} /></Field>
        <Field label={t("werewolf.lodgeSummary")}><Textarea value={value.summary} onChange={event => set("summary", event.target.value)} /></Field>
        <Field label={t("werewolf.lodgeDescription")}><Textarea value={value.description} onChange={event => set("description", event.target.value)} /></Field>
        {([
          ["admission", t("werewolf.lodgeAdmission")],
          ["recruitment", t("werewolf.lodgeRecruitment")],
          ["totem", t("werewolf.lodgeTotem")],
          ["blessing", t("werewolf.lodgeBlessing")],
          ["aspiration", t("werewolf.lodgeAspiration")],
          ["ban", t("werewolf.lodgeBan")],
          ["sacredHunt", t("werewolf.lodgeSacredHunt")],
        ] as const).map(([key, label]) => <div className="wtf-lodge-editor-pair" key={key}>
          <Field label={label}><Textarea value={value[key] ?? ""} onChange={event => set(key, event.target.value)} /></Field>
        </div>)}
        <Field label={t("werewolf.lodgeAccess")}><Textarea value={(value.access ?? []).join("\n")} onChange={event => set("access", event.target.value.split("\n"))} /></Field>
      </div>
      {error && <p className="homebrew-error" role="alert">{error}</p>}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
        <Button type="button" onClick={commit}>{t("werewolf.lodgeSave")}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="wide"><span>{label}</span>{children}</label>;
}
