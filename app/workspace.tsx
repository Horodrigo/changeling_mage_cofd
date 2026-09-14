"use client";

import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Download,
  FileJson,
  LayoutDashboard,
  MoreHorizontal,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { getDeviceValue, setDeviceValue, stageDeviceValue } from "@/lib/device-storage";
import { localeFlag, useLanguage, type Locale } from "@/lib/i18n";
import {
  isCurrentStoredCharacter,
  storedCharacterId,
  summarizeStoredCharacter,
  type StoredCharacter,
} from "@/lib/stored-character";
import { CatalogBoundary } from "./catalog-boundary";
import { getGameLineRegistration, listGameLineRegistrations, normalizeGameLineCharacter } from "@/game-lines/registry/game-line-registry";
import { useIsMobile } from "@/hooks/use-mobile";
import { maximumSheetZoom, parseStoredSheetZoom, SHEET_BASE_WIDTH, SHEET_ZOOM_STORAGE_KEY, stepSheetZoom } from "./workspace/sheet-zoom";

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
  const [characters, setCharacters] = useState<StoredCharacter[]>([]);
  const [selected, setSelected] = useState<CharacterSheet | null>(null);
  const [editing, setEditing] = useState<CharacterSheet | null | "new">(null);
  const [ready, setReady] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoredCharacter | null>(null);
  const [notice, setNotice] = useState("");
  const [sheetZoom,setSheetZoom]=useState(() => {
    if (typeof window === "undefined" || window.matchMedia("(max-width: 767px)").matches) return 1;
    try { return parseStoredSheetZoom(window.localStorage.getItem(SHEET_ZOOM_STORAGE_KEY)); } catch { return 1; }
  });
  const [maximumZoom,setMaximumZoom]=useState(1);
  const [printOpen,setPrintOpen]=useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const storageKey = useMemo(
    () => `arquivo-das-trevas:v2:${userKey}`,
    [userKey],
  );

  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stored = await getDeviceValue<StoredCharacter[]>(storageKey);
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

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    try { window.localStorage.setItem(SHEET_ZOOM_STORAGE_KEY, String(sheetZoom)); } catch { /* Zoom persistence is optional; interaction remains available. */ }
  }, [sheetZoom]);

  function commitCharacters(
    change: (current: StoredCharacter[]) => StoredCharacter[],
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
    setMaximumZoom(1);
    setPrintOpen(false);
  }

  async function openCharacter(sheet: CharacterSheet) {
    setMaximumZoom(1);
    setPrintOpen(false);
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
      const exists = current.some((item) => storedCharacterId(item) === sheet.id);
      return exists
        ? current.map((item) => (storedCharacterId(item) === sheet.id ? sheet : item))
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
      current.map((item) => (storedCharacterId(item) === sheet.id ? sheet : item)),
    );
    setSelected(sheet);
  }

  function updateCharacter(sheet: CharacterSheet) {
    const updated = { ...sheet, updated_at: new Date().toISOString() };
    commitCharacters((current) =>
      current.map((item) => (storedCharacterId(item) === updated.id ? updated : item)),
    );
    setSelected(updated);
  }

  function deleteCharacter(character: StoredCharacter) {
    const summary = summarizeStoredCharacter(character);
    const id = storedCharacterId(character);
    commitCharacters((current) =>
      current.filter((item) => item !== character && (!id || storedCharacterId(item) !== id)),
    );
    setSelected(null);
    setView("personagens");
    setNotice(tr(`“${summary.name}” foi excluído deste navegador.`,`“${summary.name}” was deleted from this browser.`));
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
        ...current.filter((item) => storedCharacterId(item) !== sheet.id),
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
            <NewCharacterBuilder player={displayName} onCancel={() => setEditing(null)} onSave={saveCharacter} />
          ) : (
            <GameLineBuilder gameLine={editing.game_line} player={displayName} initial={editing} onCancel={() => setEditing(null)} onSave={saveCharacter} />
          )}
        </Suspense>
      </CatalogBoundary>
    );

  const lineThemeClass = selected ? `line-theme-${selected.game_line.toLowerCase()}` : "";
  return (
    <main className={`app-shell${lineThemeClass ? ` ${lineThemeClass}` : ""}`}>
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
            <DropdownMenuContent align="end" className={lineThemeClass}>
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
            {selected && <div className="top-sheet-tools">
              {selected.game_line === "CtL" && <Button type="button" size="sm" className="top-sheet-print" onClick={()=>setPrintOpen(true)} title={tr("Imprimir ficha","Print character sheet")}>
                <Printer /><span>{tr("Imprimir","Print")}</span>
              </Button>}
              <div className="sheet-zoom-control" role="group" aria-label={tr("Zoom da ficha","Character sheet zoom")}>
                <Button type="button" variant="ghost" size="icon-xs" disabled={sheetZoom<=1} onClick={()=>setSheetZoom(stepSheetZoom(sheetZoom,"out",maximumZoom))} aria-label={tr("Diminuir ficha","Zoom out")} title={tr("Diminuir ficha","Zoom out")}><ZoomOut /></Button>
                <button type="button" className="sheet-zoom-value" onClick={()=>setSheetZoom(1)} title={tr("Restaurar tamanho","Reset size")} aria-label={tr(`Zoom da ficha: ${Math.round(sheetZoom*100)}%. Restaurar tamanho.`,`Character sheet zoom: ${Math.round(sheetZoom*100)}%. Reset size.`)}>{Math.round(sheetZoom*100)}%</button>
                <Button type="button" variant="ghost" size="icon-xs" disabled={sheetZoom>=maximumZoom-0.001} onClick={()=>setSheetZoom(stepSheetZoom(sheetZoom,"in",maximumZoom))} aria-label={tr("Aumentar ficha","Zoom in")} title={tr("Aumentar ficha","Zoom in")}><ZoomIn /></Button>
              </div>
              <Button type="button" size="sm" className="top-sheet-edit" onClick={()=>setEditing(selected)} title={tr("Editar","Edit")}>
                <Pencil /><span>{tr("Editar","Edit")}</span>
              </Button>
            </div>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="sheet-actions-trigger">
                  <MoreHorizontal /> {t("sheetActions")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`sheet-actions-menu${lineThemeClass ? ` ${lineThemeClass}` : ""}`}>
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
                    if (selected) setDeleteTarget(selected);
                  }}
                >
                  <Trash2 /> {t("deleteSheet")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {!selected && <div className="view-heading">
          <p>Chronicles of Darkness</p>
          <h1>{title}</h1>
        </div>}
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
            zoom={sheetZoom}
            setZoom={setSheetZoom}
            setMaximumZoom={setMaximumZoom}
            printOpen={printOpen}
            setPrintOpen={setPrintOpen}
            updateState={(state) => updateCharacterState(selected, state)}
            updateSheet={updateCharacter}
          />
        ) : view === "inicio" ? (
          <Dashboard
            characters={characters}
            openCharacters={() => navigate("personagens")}
            openCharacter={(sheet) => { void openCharacter(sheet); }}
            deleteCharacter={setDeleteTarget}
          />
        ) : (
          <Characters
            characters={characters}
            ready={ready}
            open={(sheet) => { void openCharacter(sheet); }}
            deleteCharacter={setDeleteTarget}
          />
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
  deleteCharacter,
}: {
  characters: StoredCharacter[];
  openCharacters: () => void;
  openCharacter: (item: CharacterSheet) => void;
  deleteCharacter: (item: StoredCharacter) => void;
}) {
  const {tr}=useLanguage();
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
        {lineCounts.map(({ registration, count }) => (
          <span className={registration.summaryClass} key={registration.id}>
            <strong>{count}</strong> {registration.label}
          </span>
        ))}
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
  deleteCharacter,
}: {
  characters: StoredCharacter[];
  ready: boolean;
  open: (item: CharacterSheet) => void;
  deleteCharacter: (item: StoredCharacter) => void;
}) {
  const {tr}=useLanguage();
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
          title={tr("Nenhum personagem criado","No characters created")}
          text={tr("Use “Ações da ficha” no painel superior para criar um Changeling ou Mago.","Use “Character actions” in the top panel to create a Changeling or Mage.")}
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
  const {tr}=useLanguage();
  const summary = summarizeStoredCharacter(character);
  const registration = summary.gameLine ? getGameLineRegistration(summary.gameLine) : null;
  const title = summary.isCurrent
    ? registration?.label ?? ""
    : tr("Ficha incompatível", "Unsupported character");
  const concept = summary.concept || tr("Conceito não informado", "No concept provided");
  return (
    <article className={`character-card ${registration?.cardClass ?? "legacy-character-card"}`}>
      <button
        className="character-card-open"
        disabled={!summary.isCurrent}
        onClick={() => {
          if (isCurrentStoredCharacter(character)) openCharacter(character);
        }}
        title={summary.isCurrent ? undefined : tr("Esta ficha usa um formato não suportado e não pode ser aberta.", "This character uses an unsupported format and cannot be opened.")}
      >
        {summary.gameLine ? <CharacterLineIcon line={summary.gameLine} /> : <div className="character-monogram">?</div>}
        <div>
          <Badge variant={summary.isCurrent ? "outline" : "destructive"}>{title}</Badge>
          <h3>{summary.name}</h3>
          <p>{concept}</p>
          {!summary.isCurrent && <small>{tr("Formato não suportado — exclua sem abrir.", "Unsupported format — delete without opening.")}</small>}
        </div>
        {summary.isCurrent && <ChevronRight />}
      </button>
      <Button
        className="character-card-delete"
        variant="ghost"
        size="icon"
        aria-label={tr(`Excluir ${summary.name}`, `Delete ${summary.name}`)}
        title={tr("Excluir ficha", "Delete character")}
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
      <img
        src={registration.iconSrc}
        alt=""
        aria-hidden="true"
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
    const measure=()=>{
      const width=editor.getBoundingClientRect().width;
      const nextMaximum=maximumSheetZoom(width);
      setMaximumZoom(nextMaximum);
      setZoom((current)=>Math.min(current,nextMaximum));
    };
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(editor);
    return()=>observer.disconnect();
  },[setMaximumZoom,setZoom]);

  useLayoutEffect(()=>{
    const surface=zoomSurfaceRef.current;
    if(!surface)return;
    const measure=()=>setSheetHeight(surface.getBoundingClientRect().height/zoom);
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(surface);
    return()=>observer.disconnect();
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
      {character.game_line === "CtL" && printOpen && <CatalogBoundary groups={registration.catalogGroups.print ?? registration.catalogGroups.sheet}>
        <Suspense fallback={<WorkspaceLoading />}><CharacterPrintDialog character={character} open onOpenChange={setPrintOpen}/></Suspense>
      </CatalogBoundary>}
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
