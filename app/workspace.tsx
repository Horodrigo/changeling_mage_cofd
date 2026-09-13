"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Download,
  FileJson,
  LayoutDashboard,
  MoreHorizontal,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { seemingDisplayName } from "@/lib/seeming-presentation";
import { getDeviceValue, setDeviceValue, stageDeviceValue } from "@/lib/device-storage";
import { localeFlag, useLanguage, type Locale } from "@/lib/i18n";
import { CatalogBoundary } from "./catalog-boundary";
import { getGameLineRegistration, normalizeGameLineCharacter } from "@/game-lines/registry/game-line-registry";

const NewCharacterBuilder = lazy(() =>
  import("./character-builder").then((module) => ({ default: module.CharacterBuilder })),
);
const GameLineBuilder = lazy(() =>
  import("./game-line-builder").then((module) => ({ default: module.GameLineBuilder })),
);
const GameLineSheet = lazy(() =>
  import("./workspace/game-line-sheet").then((module) => ({ default: module.GameLineSheet })),
);
const DeleteCharacterDialog = lazy(() => import("./delete-character-dialog"));

type View = "inicio" | "personagens";
type CatalogRule = {
  id: string;
  originalName: string;
  gameLine: string;
  sourceId: string | null;
  sourcePage: number | null;
  structuredData: string;
  reviewStatus: string;
};

const nav = [
  ["inicio", "home", LayoutDashboard],
  ["personagens", "characters", UsersRound],
] as const;

export function Workspace({
  displayName,
  userKey,
}: {
  displayName: string;
  userKey: string;
}) {
  const {locale,setLocale,t,tr}=useLanguage();
  const [view, setView] = useState<View>("inicio");
  const [characters, setCharacters] = useState<CharacterSheet[]>([]);
  const [selected, setSelected] = useState<CharacterSheet | null>(null);
  const [editing, setEditing] = useState<CharacterSheet | null | "new">(null);
  const [ready, setReady] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const storageKey = useMemo(
    () => `arquivo-das-trevas:v2:${userKey}`,
    [userKey],
  );

  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stored = await getDeviceValue<CharacterSheet[]>(storageKey);
        if (Array.isArray(stored) && !cancelled) setCharacters(stored);
      } catch {
        setNotice(
          tr("Não foi possível ler o armazenamento local deste navegador.","The local storage for this browser could not be read."),
        );
      }
      if (!cancelled) setReady(true);
    }
    void start();
    return () => {
      cancelled = true;
    };
  }, [storageKey, displayName]);

  useEffect(() => {
    if (!ready) return;
    stageDeviceValue(storageKey, characters);
    const timer = window.setTimeout(() => {
      void setDeviceValue(storageKey, characters);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [characters, ready, storageKey]);

  function commitCharacters(
    change: (current: CharacterSheet[]) => CharacterSheet[],
  ) {
    setCharacters((current) => {
      const next = change(current);
      return next;
    });
  }

  function navigate(next: View) {
    setView(next);
    setSelected(null);
    setEditing(null);
  }

  async function openCharacter(sheet: CharacterSheet) {
    try {
      await hydrateCharacterCatalogs(sheet.game_line);
      const { normalizeStoredSheet } = await import("@/lib/character-persistence");
      setSelected(await normalizeGameLineCharacter(normalizeStoredSheet(sheet)));
    } catch {
      setSelected(sheet);
    }
  }

  function saveCharacter(sheet: CharacterSheet) {
    commitCharacters((current) => {
      const exists = current.some((item) => item.id === sheet.id);
      return exists
        ? current.map((item) => (item.id === sheet.id ? sheet : item))
        : [sheet, ...current];
    });
    setEditing(null);
    setSelected(sheet);
    setView("personagens");
    setNotice(
      tr("Ficha salva localmente neste navegador. Exporte o JSON para manter uma cópia independente.","Character saved locally in this browser. Export the JSON to keep an independent copy."),
    );
  }

  function updateCharacterState(
    character: CharacterSheet,
    currentState: Record<string, unknown>,
  ) {
    const sheet = {
      ...character,
      current_state: currentState,
      updated_at: new Date().toISOString(),
    };
    commitCharacters((current) =>
      current.map((item) => (item.id === sheet.id ? sheet : item)),
    );
    setSelected(sheet);
  }

  function updateCharacter(sheet: CharacterSheet) {
    const updated = { ...sheet, updated_at: new Date().toISOString() };
    commitCharacters((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
    setSelected(updated);
  }

  function deleteCharacter(character: CharacterSheet) {
    commitCharacters((current) =>
      current.filter((item) => item.id !== character.id),
    );
    setSelected(null);
    setView("personagens");
    setNotice(tr(`“${character.character.name}” foi excluído deste navegador.`,`“${character.character.name}” was deleted from this browser.`));
  }

  function exportCharacter(character: CharacterSheet) {
    const blob = new Blob([JSON.stringify(character, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${character.character.name.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function importCharacter(file: File) {
    try {
      const parsed = JSON.parse(await file.text());
      const { normalizeStoredSheet, validateCurrentCharacter } = await import("@/lib/character-persistence");
      const validation = validateCurrentCharacter(parsed);
      if (validation === "unsupported-schema")
        throw new Error(tr("Versão de schema de personagem não suportada.", "Unsupported character schema version."));
      if (validation !== "valid")
        throw new Error(
          tr("O JSON não representa uma ficha CtL ou MtA atual válida.","The JSON is not a valid current CtL or MtA character sheet."),
        );
      await hydrateCharacterCatalogs(parsed.game_line);
      const sheet = await normalizeGameLineCharacter(normalizeStoredSheet(parsed as CharacterSheet));
      commitCharacters((current) => [
        sheet,
        ...current.filter((item) => item.id !== sheet.id),
      ]);
      setView("personagens");
      setSelected(sheet);
      setNotice(tr(`“${sheet.character.name}” foi importado para este navegador.`,`“${sheet.character.name}” was imported into this browser.`));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : tr("JSON inválido.","Invalid JSON."));
    }
  }

  const titleKey = nav.find(([id]) => id === view)?.[1];
  const title = titleKey ? t(titleKey) : "Characters of the Darkness";
  if (editing)
    return (
      <CatalogBoundary
        groups={
          editing === "new"
            ? []
            : getGameLineRegistration(editing.game_line).catalogGroups.builder
        }
      >
        <Suspense fallback={<WorkspaceLoading />}>
          {editing === "new" ? (
            <NewCharacterBuilder player={displayName} initial={null} onCancel={() => setEditing(null)} onSave={saveCharacter} />
          ) : (
            <GameLineBuilder gameLine={editing.game_line} player={displayName} initial={editing} onCancel={() => setEditing(null)} onSave={saveCharacter} />
          )}
        </Suspense>
      </CatalogBoundary>
    );

  return (
    <main className="app-shell">
      <section className="content">
        <header className="topbar">
          <button className="top-brand" onClick={() => navigate("inicio")}>
            <img src="/cod-emblem-256.webp" alt="" aria-hidden="true" />
          <div>
            <strong>Characters of the Darkness</strong>
            <span>Chronicles of Darkness</span>
          </div>
          </button>
          <nav className="top-navigation" aria-label={t("mainNavigation")}>
          {nav.map(([id, labelKey, Icon]) => {
            const label=t(labelKey);
            return (
            <button
              key={id}
              aria-label={label}
              title={label}
              className={view === id && !selected ? "active" : ""}
              onClick={() => navigate(id)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          )})}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="language-trigger" aria-label={`${t("language")}: ${locale === "pt-BR" ? t("portuguese") : t("english")}`} title={t("language")}>
                <span aria-hidden="true">{localeFlag(locale)}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(["pt-BR","en-US"] as Locale[]).map(option=><DropdownMenuItem key={option} onSelect={()=>setLocale(option)}>
                <span aria-hidden="true">{localeFlag(option)}</span> {option === "pt-BR" ? t("portuguese") : t("english")}
              </DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
          </nav>
          <div className="top-panel">
            <input
              ref={fileRef}
              hidden
              type="file"
              accept=".json,application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importCharacter(file);
                event.target.value = "";
              }}
            />
            <div className="top-profile">
              <strong>{displayName}</strong>
              <span>{locale === "pt-BR" ? `${characters.length} personagem(ns)` : `${characters.length} character${characters.length===1?"":"s"}`}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="sheet-actions-trigger">
                  <MoreHorizontal /> {t("sheetActions")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="sheet-actions-menu">
                <DropdownMenuLabel>{t("manageSheets")}</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setEditing("new")}>
                  <Plus /> {t("createSheet")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => fileRef.current?.click()}>
                  <Upload /> {t("importJson")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={!selected}
                  onSelect={() => selected && exportCharacter(selected)}
                >
                  <Download /> {t("saveJson")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={!selected}
                  onSelect={(event) => {
                    event.preventDefault();
                    if (selected) setDeleteOpen(true);
                  }}
                >
                  <Trash2 /> {t("deleteSheet")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="view-heading">
          <p>Chronicles of Darkness</p>
          <h1>{selected ? selected.character.name : title}</h1>
        </div>
        {notice && (
          <div className="notice" role="status">
            <ShieldCheck />
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label={t("closeNotice")}>
              <X />
            </button>
          </div>
        )}
        {selected ? (
          <CharacterView
            character={selected}
            back={() => setSelected(null)}
            edit={() => setEditing(selected)}
            updateState={(state) => updateCharacterState(selected, state)}
            updateSheet={updateCharacter}
          />
        ) : view === "inicio" ? (
          <Dashboard
            characters={characters}
            openCharacters={() => navigate("personagens")}
            openCharacter={(sheet) => { void openCharacter(sheet); }}
          />
        ) : (
          <Characters
            characters={characters}
            ready={ready}
            open={(sheet) => { void openCharacter(sheet); }}
          />
        )}
      </section>
      {deleteOpen && (
        <Suspense fallback={null}>
          <DeleteCharacterDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            name={selected?.character.name ?? "esta ficha"}
            onDelete={() => {
              if (selected) deleteCharacter(selected);
              setDeleteOpen(false);
            }}
          />
        </Suspense>
      )}
    </main>
  );
}

async function hydrateCharacterCatalogs(gameLine: CharacterSheet["game_line"]) {
  const { loadCatalogGroups } = await import("@/game-lines/registry/catalog-group-registry");
  await loadCatalogGroups(getGameLineRegistration(gameLine).catalogGroups.sheet);
}

function Dashboard({
  characters,
  openCharacters,
  openCharacter,
}: {
  characters: CharacterSheet[];
  openCharacters: () => void;
  openCharacter: (item: CharacterSheet) => void;
}) {
  const {locale,tr}=useLanguage();
  const changelings = characters.filter(
    (item) => item.game_line === "CtL",
  ).length;
  const mages = characters.filter((item) => item.game_line === "MtA").length;
  const recent = [...characters]
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
    .slice(0, 4);
  return (
    <div className="page-grid">
      <section className="welcome-panel practical-welcome">
        <div>
          <Badge className="eyebrow">CHARACTERS OF THE DARKNESS</Badge>
          <h2>{tr("Catálogo de Fichas","Character Catalog")}</h2>
          <p>
            {tr("Quem você será desta vez?","Who will you be this time?")}
          </p>
          <div className="welcome-actions">
            <Button variant="outline" onClick={openCharacters}>
              {tr("Todos os personagens","All characters")}
            </Button>
          </div>
        </div>
        <div className="sigil" aria-hidden="true">
          <img src="/cod-emblem-256.webp" alt="" />
        </div>
      </section>
      <section className="line-summary wide">
        <span><strong>{characters.length}</strong> {tr("personagens","characters")}</span>
        <span className="ctl-summary"><strong>{changelings}</strong> Changelings</span>
        <span className="mta-summary"><strong>{mages}</strong> {tr("Magos","Mages")}</span>
      </section>
      <section className="panel wide recent-panel">
        <div className="panel-heading">
          <div>
            <span className="kicker">{tr("CONTINUAR","CONTINUE")}</span>
            <h3>{tr("Personagens recentes","Recent characters")}</h3>
            <p>{tr("Acesse rapidamente as fichas usadas por último.","Quickly open your most recently used characters.")}</p>
          </div>
          {characters.length > 4 && (
            <Button variant="ghost" onClick={openCharacters}>
              {tr("Ver todos","View all")}
            </Button>
          )}
        </div>
        {recent.length ? (
          <div className="character-grid compact-character-grid">
            {recent.map((character) => (
              <button
                className={`character-card ${character.game_line === "CtL" ? "ctl-card" : "mta-card"}`}
                key={character.id}
                onClick={() => openCharacter(character)}
              >
                <CharacterLineIcon line={character.game_line} />
                <div>
                  <Badge variant="outline">
                    {character.game_line === "CtL" ? "Changeling" : tr("Mago","Mage")}
                  </Badge>
                  <h3>{character.character.name}</h3>
                  <p>
                    {character.character.concept || tr("Conceito não informado","No concept provided")}
                  </p>
                  <small>
                    {character.game_line === "CtL"
                      ? String(
                          seemingDisplayName(character.line_data.seeming,locale) || tr("Feição não definida","No Seeming selected"),
                        )
                      : String(
                          character.line_data.path ?? tr("Caminho não definido","No Path selected"),
                        )}
                  </small>
                </div>
                <ChevronRight />
              </button>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <Sparkles />
            <div>
              <strong>{tr("Comece uma nova crônica","Begin a new chronicle")}</strong>
              <p>{tr("Use “Ações da ficha” no painel superior para criar seu primeiro personagem.","Use “Character actions” in the top panel to create your first character.")}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
function Characters({
  characters,
  ready,
  open,
}: {
  characters: CharacterSheet[];
  ready: boolean;
  open: (item: CharacterSheet) => void;
}) {
  const {locale,tr}=useLanguage();
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="kicker">{tr("PERSONAGENS","CHARACTERS")}</span>
          <h3>{tr("Suas fichas","Your characters")}</h3>
          <p>
            {tr("Abra uma ficha para jogar, atualizar características ou exportar uma cópia.","Open a character to play, update traits, or export a copy.")}
          </p>
        </div>
      </div>
      {!ready ? (
        <div className="loading-card">{tr("Carregando personagens…","Loading characters…")}</div>
      ) : characters.length ? (
        <div className="character-grid">
          {characters.map((character) => (
            <button
              className={`character-card ${character.game_line === "CtL" ? "ctl-card" : "mta-card"}`}
              key={character.id}
              onClick={() => open(character)}
            >
              <CharacterLineIcon line={character.game_line} />
              <div>
                <Badge variant="outline">
                  {character.game_line === "CtL" ? "Changeling" : tr("Mago","Mage")}
                </Badge>
                <h3>{character.character.name}</h3>
                <p>{character.character.concept}</p>
                <small>
                  {character.game_line === "CtL"
                    ? String(seemingDisplayName(character.line_data.seeming,locale) || "Changeling")
                    : String(character.line_data.path ?? "Mage")}
                </small>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
      ) : (
        <Empty
          title={tr("Nenhum personagem criado","No characters created")}
          text={tr("Use “Ações da ficha” no painel superior para criar um Changeling ou Mago.","Use “Character actions” in the top panel to create a Changeling or Mage.")}
        />
      )}
    </section>
  );
}
function CharacterLineIcon({ line }: { line: "CtL" | "MtA" }) {
  return (
    <div className="character-line-icon">
      <img
        src={line === "CtL" ? "/changeling-skull.png" : "/mage-skull.png"}
        alt=""
        aria-hidden="true"
      />
    </div>
  );
}

function CharacterView({
  character,
  back,
  edit,
  updateState,
  updateSheet,
}: {
  character: CharacterSheet;
  back: () => void;
  edit: () => void;
  updateState: (state: Record<string, unknown>) => void;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const {tr}=useLanguage();
  return (
    <section className="sheet-editor">
      <div className="sheet-toolbar">
        <Button variant="ghost" onClick={back}>
          ← {tr("Personagens","Characters")}
        </Button>
        <div>
          <Badge>{character.game_line}</Badge>
          <span>{tr("Alterações nos marcadores são salvas automaticamente","Changes to tracks are saved automatically")}</span>
        </div>
        <div className="sheet-toolbar-actions">
          <Button variant="outline" onClick={edit}>
            <Pencil /> {tr("Editar","Edit")}
          </Button>
        </div>
      </div>
      <CatalogBoundary
        groups={getGameLineRegistration(character.game_line).catalogGroups.sheet}
      >
        <Suspense fallback={<WorkspaceLoading />}>
          <GameLineSheet
            character={character}
            updateState={updateState}
            updateSheet={updateSheet}
          />
        </Suspense>
      </CatalogBoundary>
    </section>
  );
}

function WorkspaceLoading() {
  const { tr } = useLanguage();
  return <div className="loading-card">{tr("Carregando…", "Loading…")}</div>;
}

function RulesCatalog({ catalog }: { catalog: CatalogRule[] }) {
  const { tr } = useLanguage();
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="kicker">{tr("BANCO COMPARTILHADO", "SHARED LIBRARY")}</span>
          <h3>{tr("Regras ativas para todos", "Rules active for everyone")}</h3>
          <p>{tr("Não há fila de aprovação. Ajustes posteriores substituem a versão compartilhada.", "There is no approval queue. Later edits replace the shared version.")}</p>
        </div>
        <Badge className="approved-badge">{tr("ATIVAS", "ACTIVE")}</Badge>
      </div>
      <div className="rule-cards">
        {catalog.map((rule) => (
          <article key={rule.id}>
            <div>
              <Badge>{rule.gameLine}</Badge>
              <Badge variant="outline">p. {rule.sourcePage}</Badge>
            </div>
            <h3>{rule.originalName}</h3>
            <p>{summarizeRule(rule)}</p>
            <small>
              {tr("Fonte", "Source")}: {rule.sourceId} · {rule.reviewStatus}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}

function Empty({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: () => void;
}) {
  return (
    <div className="empty-state">
      <FileJson />
      <h3>{title}</h3>
      <p>{text}</p>
      {action && (
        <Button onClick={action}>
          <Plus /> Criar ficha
        </Button>
      )}
    </div>
  );
}

function summarizeRule(rule: CatalogRule) {
  try {
    const data = JSON.parse(rule.structuredData);
    return `${Object.keys(data).length} blocos mecânicos estruturados e aplicados pelo criador de fichas.`;
  } catch {
    return "Regra compartilhada ativa.";
  }
}
