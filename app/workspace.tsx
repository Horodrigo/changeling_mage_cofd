"use client";

import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDownUp,
  ChevronRight,
  Download,
  FileJson,
  FlaskConical,
  LayoutDashboard,
  Pencil,
  Plus,
  Printer,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UsersRound,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import { localeFlag, useLanguage, type Locale } from "@/lib/i18n";
import {
  isCurrentStoredCharacter,
  storedCharacterId,
  summarizeStoredCharacter,
  type StoredCharacter,
} from "@/lib/stored-character";
import { CatalogBoundary } from "./catalog-boundary";
import { getGameLineRegistration, listGameLineRegistrations } from "@/game-lines/registry/game-line-registry";
import { useIsMobile } from "@/hooks/use-mobile";
import { maximumSheetZoom, parseStoredSheetZoom, SHEET_BASE_WIDTH, SHEET_ZOOM_STORAGE_KEY, stepSheetZoom } from "./workspace/sheet-zoom";
import {
  CharacterLifecycleError,
  importCharacterFile,
  prepareCharacterForOpen,
  prepareCharacterForSave,
  prepareCharacterForUpdate,
  updateCharacterState as applyCharacterState,
} from "./workspace/character-lifecycle";
import { useCharacterRepository } from "./workspace/character-repository";
import { blankPrintCharacter } from "./workspace/blank-print-character";

const NewCharacterBuilder = lazy(() =>
  import("./new-character-builder").then((module) => ({ default: module.NewCharacterBuilder })),
);
const GameLineBuilder = lazy(() =>
  import("./game-line-builder").then((module) => ({ default: module.GameLineBuilder })),
);
const GameLineSheet = lazy(() =>
  import("./workspace/game-line-sheet").then((module) => ({ default: module.GameLineSheet })),
);
const DeleteCharacterDialog = lazy(() => import("./delete-character-dialog"));
const CharacterPrintDialog = lazy(() =>
  import("./workspace/character-print-dialog").then((module) => ({ default: module.CharacterPrintDialog })),
);
const Homebrews = lazy(() => import("./homebrews"));

type View = "inicio" | "personagens" | "homebrew";

const nav = [
  ["inicio", "workspace.home", LayoutDashboard],
  ["personagens", "workspace.characters", UsersRound],
  ["homebrew", "workspace.homebrew", FlaskConical],
] as const;

export function Workspace({
  displayName,
  userKey,
}: {
  displayName: string;
  userKey: string;
}) {
  const { locale, setLocale, t } = useLanguage();

  const [view, setView] = useState<View>("inicio");
  const [selected, setSelected] = useState<CharacterSheet | null>(null);
  const [editing, setEditing] = useState<CharacterSheet | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<StoredCharacter | null>(null);
  const [notice, setNotice] = useState("");

  const {
    characters,
    ready,
    readFailed,
    upsertCharacter,
    replaceCharacter,
    removeCharacter,
  } = useCharacterRepository(userKey);

  const storageReadFailedMessage = t("workspace.storageReadFailed");

  const effectiveNotice = readFailed
    ? storageReadFailedMessage
    : notice;

  const [sheetZoom, setSheetZoom] = useState(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(max-width: 767px)").matches
    ) {
      return 1;
    }

    try {
      return parseStoredSheetZoom(
        window.localStorage.getItem(SHEET_ZOOM_STORAGE_KEY),
      );
    } catch {
      return 1;
    }
  });

  const [maximumZoom, setMaximumZoom] = useState(1);
  const [printOpen, setPrintOpen] = useState(false);
  const [blankPrintLine, setBlankPrintLine] = useState<PersistedGameLineId | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    try { window.localStorage.setItem(SHEET_ZOOM_STORAGE_KEY, String(sheetZoom)); } catch { /* Zoom persistence is optional; interaction remains available. */ }
  }, [sheetZoom]);

  function navigate(next: View) {
    setView(next);
    setSelected(null);
    setEditing(null);
    setMaximumZoom(1);
    setPrintOpen(false);
    setBlankPrintLine(null);
  }

  async function openCharacter(sheet: CharacterSheet) {
    setMaximumZoom(1);
    setPrintOpen(false);
    try {
      setSelected(await prepareCharacterForOpen(sheet));
    } catch {
      setSelected(null);
      setNotice(t("workspace.invalidCharacterJson"));
    }
  }

  async function saveCharacter(sheet: CharacterSheet) {
    try {
      const normalized = await prepareCharacterForSave(sheet);
      upsertCharacter(normalized);
      setEditing(null);
      setSelected(normalized);
      setView("personagens");
      setNotice(t("workspace.characterSaved"));
    } catch {
      setNotice(t("workspace.invalidCharacterJson"));
    }
  }

  function updateCharacterState(
    character: CharacterSheet,
    currentState: Record<string, unknown>,
  ) {
    const updated = applyCharacterState(character, currentState);
    replaceCharacter(updated);
    setSelected(updated);
  }

  async function updateCharacter(sheet: CharacterSheet) {
    try {
      const normalized = await prepareCharacterForUpdate(sheet);
      replaceCharacter(normalized);
      setSelected(normalized);
    } catch {
      setNotice(t("workspace.invalidCharacterJson"));
    }
  }

  function deleteCharacter(character: StoredCharacter) {
    const summary = summarizeStoredCharacter(character);
    removeCharacter(character);
    setSelected(null);
    setView("personagens");
    setNotice(t("workspace.characterDeleted", { name: summary.name }));
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
      const sheet = await importCharacterFile(file);
      upsertCharacter(sheet);
      setView("personagens");
      setSelected(sheet);
      setNotice(t("workspace.characterImported", { name: sheet.character.name }));
    } catch (error) {
      if (error instanceof CharacterLifecycleError) {
        const messageKey =
          error.code === "unsupported-schema"
            ? "workspace.unsupportedSchema"
            : error.code === "invalid-json"
              ? "workspace.invalidJson"
              : "workspace.invalidCharacterJson";
        setNotice(t(messageKey));
        return;
      }
      setNotice(error instanceof Error ? error.message : t("workspace.invalidJson"));
    }
  }

  const titleKey = nav.find(([id]) => id === view)?.[1];
  const title = t(titleKey ?? "workspace.charactersOfTheDarkness");
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
            <NewCharacterBuilder player={displayName} onCancel={() => setEditing(null)} onSave={(sheet) => { void saveCharacter(sheet); }} />
          ) : (
            <GameLineBuilder gameLine={editing.game_line} player={displayName} initial={editing} onCancel={() => setEditing(null)} onSave={(sheet) => { void saveCharacter(sheet); }} />
          )}
        </Suspense>
      </CatalogBoundary>
    );

  const lineThemeClass = selected ? `line-theme-${selected.game_line.toLowerCase()}` : "";
  const selectedRegistration = selected ? getGameLineRegistration(selected.game_line) : null;
  return (
    <main className={`app-shell${lineThemeClass ? ` ${lineThemeClass}` : ""}`}>
      <section className="content">
        <header className="topbar">
          <button className="top-brand" onClick={() => navigate("inicio")}>
            <Image src="/cod-emblem-256.webp" alt="" aria-hidden="true" width={52} height={52} unoptimized />
          <div>
            <strong>{t("workspace.charactersOfTheDarkness")}</strong>
            <span>{t("workspace.chroniclesOfDarkness")}</span>
          </div>
          </button>
          <nav className="top-navigation" aria-label={t("workspace.mainNavigation")}>
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
              <button className="language-trigger" aria-label={t("workspace.languageCurrent", { language: locale === "pt-BR" ? t("workspace.portuguese") : t("workspace.english") })} title={t("workspace.language")}>
                <span aria-hidden="true">{localeFlag(locale)}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={lineThemeClass}>
              {(["en-US","pt-BR"] as Locale[]).map(option=><DropdownMenuItem key={option} onSelect={()=>setLocale(option)}>
                <span aria-hidden="true">{localeFlag(option)}</span> {option === "pt-BR" ? t("workspace.portuguese") : t("workspace.english")}
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
            </div>
            {selected && <div className="top-sheet-tools">
              {selectedRegistration?.loadPrintSheet && <Button type="button" size="sm" className="top-sheet-print" onClick={()=>setPrintOpen(true)} title={t("workspace.printSheet")}>
                <Printer /><span>{t("workspace.print")}</span>
              </Button>}
              <div className="sheet-zoom-control" role="group" aria-label={t("workspace.sheetZoom")}>
                <Button type="button" variant="ghost" size="icon-xs" disabled={sheetZoom<=1} onClick={()=>setSheetZoom(stepSheetZoom(sheetZoom,"out",maximumZoom))} aria-label={t("workspace.zoomOut")} title={t("workspace.zoomOut")}><ZoomOut /></Button>
                <button type="button" className="sheet-zoom-value" onClick={()=>setSheetZoom(1)} title={t("workspace.resetSize")} aria-label={t("workspace.resetZoom", { percent: Math.round(sheetZoom * 100) })}>{t("workspace.zoomPercent", { percent: Math.round(sheetZoom * 100) })}</button>
                <Button type="button" variant="ghost" size="icon-xs" disabled={sheetZoom>=maximumZoom-0.001} onClick={()=>setSheetZoom(stepSheetZoom(sheetZoom,"in",maximumZoom))} aria-label={t("workspace.zoomIn")} title={t("workspace.zoomIn")}><ZoomIn /></Button>
              </div>
              <Button type="button" size="sm" className="top-sheet-edit" onClick={()=>setEditing(selected)} title={t("workspace.edit")}>
                <Pencil /><span>{t("workspace.edit")}</span>
              </Button>
            </div>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="sheet-actions-trigger" aria-label={t("workspace.sheetActions")} title={t("workspace.sheetActions")}>
                  <ArrowDownUp /> <span>{t("workspace.sheetActions")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`sheet-actions-menu${lineThemeClass ? ` ${lineThemeClass}` : ""}`}>
                <DropdownMenuItem onSelect={() => fileRef.current?.click()}>
                  <Upload /> {t("workspace.importJson")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!selected}
                  onSelect={() => selected && exportCharacter(selected)}
                >
                  <Download /> {t("workspace.saveJson")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {!selected && <div className="view-heading">
          <p>{t("workspace.chroniclesOfDarkness")}</p>
          <h1>{title}</h1>
        </div>}
        {effectiveNotice && (
          <div className="notice" role="status">
            <ShieldCheck />
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label={t("workspace.closeNotice")}>
              <X />
            </button>
          </div>
        )}
        {selected ? (
          <CharacterView
            character={selected}
            zoom={sheetZoom}
            setZoom={setSheetZoom}
            setMaximumZoom={setMaximumZoom}
            printOpen={printOpen}
            setPrintOpen={setPrintOpen}
            updateState={(state) => updateCharacterState(selected, state)}
            updateSheet={(sheet) => { void updateCharacter(sheet); }}
          />
        ) : view === "inicio" ? (
          <Dashboard
            characters={characters}
            openCharacters={() => navigate("personagens")}
            createCharacter={() => setEditing("new")}
            printBlankSheet={setBlankPrintLine}
            openCharacter={(sheet) => { void openCharacter(sheet); }}
            deleteCharacter={setDeleteTarget}
          />
        ) : view === "personagens" ? (
          <Characters
            characters={characters}
            ready={ready}
            createCharacter={() => setEditing("new")}
            open={(sheet) => { void openCharacter(sheet); }}
            deleteCharacter={setDeleteTarget}
          />
        ) : (
          <Suspense fallback={<WorkspaceLoading/>}><Homebrews/></Suspense>
        )}
      </section>
      {deleteTarget !== null && (
        <Suspense fallback={null}>
          <DeleteCharacterDialog
            open
            onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
            name={summarizeStoredCharacter(deleteTarget).name}
            onDelete={() => {
              deleteCharacter(deleteTarget);
              setDeleteTarget(null);
            }}
          />
        </Suspense>
      )}
      {blankPrintLine && <CatalogBoundary groups={getGameLineRegistration(blankPrintLine).catalogGroups.print ?? getGameLineRegistration(blankPrintLine).catalogGroups.sheet}>
        <Suspense fallback={<WorkspaceLoading />}><CharacterPrintDialog character={blankPrintCharacter(blankPrintLine)} open onOpenChange={(open) => { if (!open) setBlankPrintLine(null); }}/></Suspense>
      </CatalogBoundary>}
    </main>
  );
}

function Dashboard({
  characters,
  openCharacters,
  createCharacter,
  printBlankSheet,
  openCharacter,
  deleteCharacter,
}: {
  characters: StoredCharacter[];
  openCharacters: () => void;
  createCharacter: () => void;
  printBlankSheet: (line: PersistedGameLineId) => void;
  openCharacter: (item: CharacterSheet) => void;
  deleteCharacter: (item: StoredCharacter) => void;
}) {
  const {t}=useLanguage();
  const lineCounts = listGameLineRegistrations().map((registration) => ({
    registration,
    count: characters.filter((item) => summarizeStoredCharacter(item).gameLine === registration.id).length,
  }));
  const recent = [...characters]
    .sort((a, b) => summarizeStoredCharacter(b).updatedAt.localeCompare(summarizeStoredCharacter(a).updatedAt))
    .slice(0, 4);
  return (
    <div className="page-grid">
      <section className="welcome-panel practical-welcome">
        <div>
          <Badge className="eyebrow">{t("workspace.charactersOfTheDarkness")}</Badge>
          <h2>{t("workspace.characterCatalog")}</h2>
          <p>
            {t("workspace.whoWillYouBe")}
          </p>
          <div className="welcome-actions">
            <Button variant="outline" onClick={openCharacters}>
              {t("workspace.seeCharacters")}
            </Button>
            <Button onClick={createCharacter}>
              <Plus /> {t("workspace.newCharacter")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline"><Printer /> {t("workspace.printBlankSheet")}</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {listGameLineRegistrations().filter((registration) => registration.loadPrintSheet).map((registration) => <DropdownMenuItem key={registration.id} onSelect={() => printBlankSheet(registration.id)}>
                  <Printer /> {registration.label}
                </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="sigil" aria-hidden="true">
          <Image src="/cod-emblem-256.webp" alt="" width={152} height={152} unoptimized />
        </div>
      </section>
      {lineCounts.some(({ count }) => count > 0) && (
        <section className="line-summary wide" aria-label={t("workspace.charactersByLine")}>
          {lineCounts.filter(({ count }) => count > 0).map(({ registration, count }) => (
            <span
              className={`line-summary-item ${registration.summaryClass}`}
              key={registration.id}
              aria-label={t("workspace.lineCount", { count, line: registration.label })}
              title={t("workspace.lineCount", { count, line: registration.label })}
            >
              <strong>{count}</strong>
              <Image src={registration.iconSrc} alt="" aria-hidden="true" width={40} height={40} unoptimized />
            </span>
          ))}
        </section>
      )}
      <section className="panel wide recent-panel">
        <div className="panel-heading">
          <div>
            <span className="kicker">{t("workspace.continue")}</span>
            <h3>{t("workspace.recentCharacters")}</h3>
            <p>{t("workspace.recentCharactersDescription")}</p>
          </div>
          {characters.length > 4 && (
            <Button variant="ghost" onClick={openCharacters}>
              {t("workspace.viewAll")}
            </Button>
          )}
        </div>
        {recent.length ? (
          <div className="character-grid compact-character-grid">
            {recent.map((character, index) => (
              <StoredCharacterCard
                character={character}
                key={`${storedCharacterId(character) ?? "legacy"}-${index}`}
                openCharacter={openCharacter}
                deleteCharacter={deleteCharacter}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <Sparkles />
            <div>
              <strong>{t("workspace.beginChronicle")}</strong>
              <p>{t("workspace.beginChronicleDescription")}</p>
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
  createCharacter,
  open,
  deleteCharacter,
}: {
  characters: StoredCharacter[];
  ready: boolean;
  createCharacter: () => void;
  open: (item: CharacterSheet) => void;
  deleteCharacter: (item: StoredCharacter) => void;
}) {
  const {t}=useLanguage();
  return (
    <section className="panel">
      <div className="panel-heading characters-panel-heading">
        <div>
          <span className="kicker">{t("workspace.characters")}</span>
          <h3>{t("workspace.yourCharacters")}</h3>
          <p>
            {t("workspace.yourCharactersDescription")}
          </p>
        </div>
        <Button className="characters-create-button" onClick={createCharacter}>
          <Plus /> {t("workspace.createCharacter")}
        </Button>
      </div>
      {!ready ? (
        <div className="loading-card">{t("workspace.loadingCharacters")}</div>
      ) : characters.length ? (
        <div className="character-grid">
          {characters.map((character, index) => (
            <StoredCharacterCard
              character={character}
              key={`${storedCharacterId(character) ?? "legacy"}-${index}`}
              openCharacter={open}
              deleteCharacter={deleteCharacter}
            />
          ))}
        </div>
      ) : (
        <Empty
          title={t("workspace.noCharacters")}
          text={t("workspace.noCharactersDescription")}
        />
      )}
    </section>
  );
}

function StoredCharacterCard({
  character,
  openCharacter,
  deleteCharacter,
}: {
  character: StoredCharacter;
  openCharacter: (item: CharacterSheet) => void;
  deleteCharacter: (item: StoredCharacter) => void;
}) {
  const {t}=useLanguage();
  const summary = summarizeStoredCharacter(character);
  const registration = summary.gameLine ? getGameLineRegistration(summary.gameLine) : null;
  const title = summary.isCurrent
    ? registration?.label ?? ""
    : t("workspace.unsupportedCharacter");
  const concept = summary.concept || t("workspace.noConcept");
  return (
    <article className={`character-card ${registration?.cardClass ?? "legacy-character-card"}`}>
      <button
        className="character-card-open"
        disabled={!summary.isCurrent}
        onClick={() => {
          if (isCurrentStoredCharacter(character)) openCharacter(character);
        }}
        title={summary.isCurrent ? undefined : t("workspace.unsupportedCharacterTitle")}
      >
        {summary.gameLine ? <CharacterLineIcon line={summary.gameLine} /> : <div className="character-monogram">{t("workspace.unknownLine")}</div>}
        <div>
          <Badge variant={summary.isCurrent ? "outline" : "destructive"}>{title}</Badge>
          <h3>{summary.name}</h3>
          <p>{concept}</p>
          {!summary.isCurrent && <small>{t("workspace.unsupportedCharacterDescription")}</small>}
        </div>
        {summary.isCurrent && <ChevronRight />}
      </button>
      <Button
        className="character-card-delete"
        variant="ghost"
        size="icon"
        aria-label={t("workspace.deleteCharacterNamed", { name: summary.name })}
        title={t("workspace.deleteCharacter")}
        onClick={() => deleteCharacter(character)}
      >
        <Trash2 />
      </Button>
    </article>
  );
}

function CharacterLineIcon({ line }: { line: CharacterSheet["game_line"] }) {
  const registration = getGameLineRegistration(line);
  return (
    <div className="character-line-icon">
      <Image
        src={registration.iconSrc}
        alt=""
        aria-hidden="true"
        width={44}
        height={44}
        unoptimized
      />
    </div>
  );
}

function CharacterView({
  character,
  zoom,
  setZoom,
  setMaximumZoom,
  printOpen,
  setPrintOpen,
  updateState,
  updateSheet,
}: {
  character: CharacterSheet;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setMaximumZoom: React.Dispatch<React.SetStateAction<number>>;
  printOpen: boolean;
  setPrintOpen: (open: boolean) => void;
  updateState: (state: Record<string, unknown>) => void;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const isMobile=useIsMobile();
  const editorRef=useRef<HTMLElement>(null);
  const zoomSurfaceRef=useRef<HTMLDivElement>(null);
  const [sheetHeight,setSheetHeight]=useState(0);

  useLayoutEffect(()=>{
    const editor=editorRef.current;
    if(!editor)return;
    let frame=0;
    const measure=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const width=editor.getBoundingClientRect().width;
        const nextMaximum=maximumSheetZoom(width);
        setMaximumZoom((current)=>current===nextMaximum?current:nextMaximum);
        setZoom((current)=>Math.min(current,nextMaximum));
      });
    };
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(editor);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[setMaximumZoom,setZoom]);

  useLayoutEffect(()=>{
    const surface=zoomSurfaceRef.current;
    if(!surface)return;
    let frame=0;
    const measure=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const nextHeight=surface.getBoundingClientRect().height/zoom;
        setSheetHeight((current)=>current===nextHeight?current:nextHeight);
      });
    };
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(surface);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[isMobile,zoom]);

  const registration=getGameLineRegistration(character.game_line);
  const sheet=(
    <CatalogBoundary groups={registration.catalogGroups.sheet}>
      <Suspense fallback={<WorkspaceLoading />}>
        <GameLineSheet character={character} updateState={updateState} updateSheet={updateSheet}/>
      </Suspense>
    </CatalogBoundary>
  );
  return (
    <section ref={editorRef} className="sheet-editor character-sheet-editor">
      {isMobile ? sheet : <div className="sheet-zoom-viewport" style={{width:SHEET_BASE_WIDTH*zoom,height:sheetHeight?sheetHeight*zoom:undefined}}>
        <div ref={zoomSurfaceRef} className="sheet-zoom-surface" style={{transform:`scale(${zoom})`}}>{sheet}</div>
      </div>}
      {registration.loadPrintSheet && printOpen && <CatalogBoundary groups={registration.catalogGroups.print ?? registration.catalogGroups.sheet}>
        <Suspense fallback={<WorkspaceLoading />}><CharacterPrintDialog character={character} open onOpenChange={setPrintOpen}/></Suspense>
      </CatalogBoundary>}
    </section>
  );
}

function WorkspaceLoading() {
  const { t } = useLanguage();
  return <div className="loading-card">{t("workspace.loading")}</div>;
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
  const { t } = useLanguage();
  return (
    <div className="empty-state">
      <FileJson />
      <h3>{title}</h3>
      <p>{text}</p>
      {action && (
        <Button onClick={action}>
          <Plus /> {t("workspace.createSheet")}
        </Button>
      )}
    </div>
  );
}
