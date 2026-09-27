"use client";

import { useRef, useState } from "react";
import { Download, FileJson, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { isCurrentStoredCharacter, type StoredCharacter } from "@/lib/stored-character";
import { HomebrewTransfer } from "./homebrew-transfer";
import { downloadJson, TransferAction } from "./data-transfer-shared";

export type CharacterImportResult = { ok: boolean; message: string; characterId?: string };

export function DataTransferPanel({
  open,
  onOpenChange,
  characters,
  selected,
  importCharacter,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characters: readonly StoredCharacter[];
  selected: CharacterSheet | null;
  importCharacter: (file: File) => Promise<CharacterImportResult>;
}) {
  const { t } = useLanguage();
  const currentCharacters = characters.filter(isCurrentStoredCharacter);
  const [characterId, setCharacterId] = useState(selected?.id ?? currentCharacters[0]?.id ?? "");
  const [feedback, setFeedback] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const character = currentCharacters.find((item) => item.id === characterId) ?? null;

  function exportCharacter() {
    if (!character) return;
    downloadJson(character, `${slug(character.character.name) || "character"}.json`);
    setFeedback(t("workspace.characterExported", { name: character.character.name }));
  }

  async function importFile(file: File) {
    const result = await importCharacter(file);
    setFeedback(result.message);
    if (result.ok && result.characterId) setCharacterId(result.characterId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="data-transfer-dialog">
        <DialogHeader>
          <DialogTitle>{t("workspace.dataTransferTitle")}</DialogTitle>
          <DialogDescription>{t("workspace.dataTransferDescription")}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="characters" className="data-transfer-tabs">
          <TabsList>
            <TabsTrigger value="characters">{t("workspace.characterTransferTab")}</TabsTrigger>
            <TabsTrigger value="homebrews">{t("workspace.homebrewTransferTab")}</TabsTrigger>
          </TabsList>
          <TabsContent value="characters" className="data-transfer-content">
            <TransferIntroduction
              title={t("workspace.characterTransferTitle")}
              description={t("workspace.characterTransferDescription")}
            />
            <div className="data-transfer-actions">
              <TransferAction
                icon={<Upload aria-hidden="true" />}
                title={t("workspace.characterImportTitle")}
                description={t("workspace.characterImportDescription")}
              >
                <Button type="button" size="sm" onClick={() => input.current?.click()}>
                  <Upload /> {t("workspace.characterImportAction")}
                </Button>
                <input
                  ref={input}
                  hidden
                  type="file"
                  accept=".json,application/json"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) void importFile(file);
                    event.currentTarget.value = "";
                  }}
                />
              </TransferAction>
              <TransferAction
                icon={<Download aria-hidden="true" />}
                title={t("workspace.characterExportTitle")}
                description={t("workspace.characterExportDescription")}
              >
                {currentCharacters.length > 0 ? (
                  <Select value={characterId} onValueChange={setCharacterId}>
                    <SelectTrigger aria-label={t("workspace.selectCharacter")}>
                      <SelectValue placeholder={t("workspace.selectCharacter")} />
                    </SelectTrigger>
                    <SelectContent>
                      {currentCharacters.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.character.name} · {item.game_line}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="data-transfer-empty">{t("workspace.noExportableCharacters")}</p>
                )}
                <Button type="button" size="sm" variant="outline" disabled={!character} onClick={exportCharacter}>
                  <Download /> {t("workspace.characterExportAction")}
                </Button>
              </TransferAction>
            </div>
            {feedback && <p className="data-transfer-feedback" role="status">{feedback}</p>}
          </TabsContent>
          <TabsContent value="homebrews" className="data-transfer-content">
            <TransferIntroduction
              title={t("workspace.homebrewTransferTitle")}
              description={t("workspace.homebrewTransferDescription")}
            />
            <HomebrewTransfer />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function TransferIntroduction({ title, description }: { title: string; description: string }) {
  return <div className="data-transfer-introduction"><FileJson aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div></div>;
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
