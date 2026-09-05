"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ChevronRight,
  Download,
  Eye,
  FileJson,
  History,
  FlaskConical,
  LayoutDashboard,
  MoreHorizontal,
  Pencil,
  Printer,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UsersRound,
  X,
} from "lucide-react";
import { courtCanonicalId, courtDisplayName, courtPresentation } from "@/lib/changeling-courts";
import { availableForeignClauseCourtIds } from "@/lib/contract-clauses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CharacterBuilder,
  MeritConfigurationEditor,
  type CharacterSheet,
} from "./character-builder";
import {
  expandedConfigurationLines,
  findMeritConfiguration,
  meritConfigurationTitle,
  normalizeMeritConfiguration,
  synchronizeMeritGrants,
} from "@/lib/merit-configurations";
import {
  ATTRIBUTES,
  CTL_SEEMINGS,
  seemingDisplayName,
  MTA_ORDER_LABELS,
  MTA_PATHS,
  SKILLS,
  normalizeChangelingFrailties,
  wyrdSummary,
} from "@/lib/creation-rules";
import {
  getMeritsForLine,
  meritRatingsFor,
  REPEATABLE_MERITS,
  type MeritDefinition,
} from "@/lib/merits";
import { findKith, kithDisplayName, kithPresentation } from "@/lib/changeling-kiths";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary, contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import { alphabetical } from "@/lib/option-order";
import {
  CONTRACTS,
  findContract,
  type ContractDefinition,
} from "@/lib/contracts";
import {
  normalizeClarityDamage,
  normalizeDamage,
  powerResourceLimits,
  permanentClarityBonus,
  changePermanentClarity,
  woundPenalty,
  type ClarityDamageLevel,
  type DamageLevel,
} from "@/lib/resource-rules";
import {
  CHANGELING_CONDITIONS,
  findChangelingCondition,
} from "@/lib/changeling-conditions";
import { MAGE_CONDITIONS, findMageCondition } from "@/lib/mage-conditions";
import { SPELLS } from "@/lib/spells";
import { meetsArcanaRequirements } from "@/lib/creation-eligibility";
import { EXPANDED_MERIT_NAMES, findExpandedMerit } from "@/lib/expanded-merits";
import { ARMORS, EQUIPMENT, WEAPONS } from "@/lib/combat-equipment";
import { TILTS, findTilt } from "@/lib/tilts";
import { ANIMALS, VEHICLES, type Animal } from "@/lib/companions";
import { HomebrewsPage } from "./homebrews";
import { useHomebrews } from "./use-homebrews";
import { isBuiltinHomebrew, isHomebrewActive, migrateCharacterHomebrews, saveHomebrews } from "@/lib/homebrews";
import { getDeviceValue, setDeviceValue } from "@/lib/device-storage";
import { withPowerRating, refundPowerRating } from "@/lib/power-progression";
import { subtractDots, refundMeritDots, refundMageAdvancement, type MageAdvancementUndo } from "@/lib/experience-refunds";
import { localeFlag, useLanguage, type Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";

type View = "inicio" | "personagens" | "homebrews";
type CatalogRule = {
  id: string;
  originalName: string;
  gameLine: string;
  sourceId: string | null;
  sourcePage: number | null;
  structuredData: string;
  reviewStatus: string;
};

const WORKSPACE_EN:Record<string,string>={
  "Nome":"Name","Jogador":"Player","Crônica":"Chronicle","Conceito":"Concept","Agulha":"Needle","Fio":"Thread","Feição":"Seeming","Frátria":"Kith","Corte":"Court",
  "Vício":"Vice","Virtude":"Virtue","Nome das Sombras":"Shadow Name","Caminho":"Path","Ordem":"Order",
  "Resumo":"Summary","Principal":"Main","Atributos":"Attributes","Perícias":"Skills","Detalhes":"Details","Poderes":"Powers","Combate":"Combat","Companheiros":"Companions","Anotações":"Notes",
  "Experiência":"Experience","Méritos":"Merits","Méritos Expandidos":"Expanded Merits","Aspirações":"Aspirations","Obsessões":"Obsessions","Fragilidades":"Frailties","Pedras de Contato":"Touchstones","Lucidez":"Clarity","Condições":"Conditions","Nimbus":"Nimbus","Sabedoria":"Wisdom","Feitiços Ativos":"Active Spells",
  "Regalias Favorecidas":"Favored Regalia","Contratos":"Contracts","Débito Goblin":"Goblin Debt","Juramentos":"Oaths","Arcanos":"Arcana","Rotas":"Rotes","Práxis":"Praxes","Attainments":"Attainments","Ferramentas Mágicas":"Magical Tools","Inclinação do Nimbus":"Nimbus Tilt","Itens Encantados":"Enchanted Items","Condições do Paradoxo":"Paradox Conditions",
  "Vitalidade":"Health","Força de Vontade":"Willpower","Características da Linha":"Line Traits","Outras Características":"Other Traits","Escolhas dos Méritos":"Merit Choices","Armadura":"Armor","Armas":"Weapons","Equipamentos":"Equipment","Veículos":"Vehicles",
  "Bênção da Fratria":"Kith Blessing","Bênção da Feição":"Seeming Blessing","Maldição da Feição":"Seeming Curse","Benefícios da Corte":"Court Benefits","Perícias de Ordem":"Order Skills",
  "Contrato":"Contract","Rota":"Rote","Todas":"All","Todos":"All",
  "Nenhum registro.":"No entries.","Nenhum Mérito selecionado":"No Merit selected","Nenhum Mérito Expandido adquirido.":"No Expanded Merit acquired.",
};
const workspaceTerm=(value:string,locale:Locale)=>locale==="en-US"?(WORKSPACE_EN[value]??systemTerm(value,locale)):value;

const nav = [
  ["inicio", "home", LayoutDashboard],
  ["personagens", "characters", UsersRound],
  ["homebrews", "homebrews", FlaskConical],
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
  const homebrews = useHomebrews();
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
        if (stored) {
          if (Array.isArray(stored) && !cancelled)
            setCharacters(stored.map(normalizeStoredSheet));
        } else {
          const legacy = await fetch("/api/characters", { cache: "no-store" });
          if (legacy.ok) {
            const data = await legacy.json();
            const migrated = (data.characters ?? []).map((item: any) =>
              migrateLegacy(item, displayName),
            );
            if (migrated.length && !cancelled) {
              setCharacters(migrated);
              await setDeviceValue(storageKey, migrated);
              setNotice(
                tr(`${migrated.length} ficha(s) antiga(s) foram transferidas para este navegador.`,`${migrated.length} legacy character sheet(s) were transferred to this browser.`),
              );
            }
          }
        }
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
    if (ready) void setDeviceValue(storageKey, characters);
  }, [characters, ready, storageKey]);

  useEffect(() => {
    if (!ready) return;
    const migrated = migrateCharacterHomebrews(homebrews, characters);
    if (
      migrated.kiths.length !== homebrews.kiths.length ||
      migrated.courts.length !== homebrews.courts.length ||
      migrated.orders.length !== homebrews.orders.length
    )
      saveHomebrews(migrated);
  }, [characters, homebrews, ready]);

  function commitCharacters(
    change: (current: CharacterSheet[]) => CharacterSheet[],
  ) {
    setCharacters((current) => {
      const next = change(current);
      void setDeviceValue(storageKey, next);
      return next;
    });
  }

  function navigate(next: View) {
    setView(next);
    setSelected(null);
    setEditing(null);
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
      if (
        parsed.system !== "chronicles-of-darkness" ||
        !["CtL", "MtA"].includes(parsed.game_line)
      )
        throw new Error(
          tr("O JSON não pertence a uma ficha CtL ou MtA compatível.","The JSON is not a compatible CtL or MtA character sheet."),
        );
      const sheet =
        parsed.schema_version === 2
          ? (parsed as CharacterSheet)
          : migrateJsonV1(parsed, displayName);
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
  const title = titleKey ? t(titleKey) : "Arquivo";
  if (editing)
    return (
      <CharacterBuilder
        player={displayName}
        initial={editing === "new" ? null : editing}
        onCancel={() => setEditing(null)}
        onSave={saveCharacter}
      />
    );

  return (
    <main className="app-shell">
      <section className="content">
        <header className="topbar">
          <button className="top-brand" onClick={() => navigate("inicio")}>
            <img src="/cod-emblem.png" alt="" aria-hidden="true" />
          <div>
            <strong>Arquivo</strong>
            <span>das Trevas</span>
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
            openCharacter={setSelected}
          />
        ) : view === "personagens" ? (
          <Characters
            characters={characters}
            ready={ready}
            open={setSelected}
          />
        ) : view === "homebrews" ? (
          <HomebrewsPage catalog={homebrews} />
        ) : null}
      </section>
      <DeleteCharacterDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        name={selected?.character.name ?? "esta ficha"}
        onDelete={() => {
          if (selected) deleteCharacter(selected);
          setDeleteOpen(false);
        }}
      />
    </main>
  );
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
          <Badge className="eyebrow">{tr("ARQUIVO DAS TREVAS","ARCHIVE OF DARKNESS")}</Badge>
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
          <img src="/cod-emblem.png" alt="" />
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
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const printSheet = () => {
    setPdfPreviewOpen(false);
    window.setTimeout(() => window.print(), 80);
  };
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
          <Button variant="outline" onClick={() => setPdfPreviewOpen(true)}>
            <Eye /> {tr("Visualizar PDF","Preview PDF")}
          </Button>
          <Button variant="outline" onClick={printSheet}>
            <Printer /> {tr("Imprimir PDF","Print PDF")}
          </Button>
          <Button variant="outline" onClick={edit}>
            <Pencil /> {tr("Editar","Edit")}
          </Button>
        </div>
      </div>
      <CharacterPaper
        character={character}
        updateState={updateState}
        updateSheet={updateSheet}
      />
      <div className="pdf-print-source" aria-hidden="true">
        <CharacterPaper
          character={character}
          updateState={updateState}
          updateSheet={updateSheet}
          printLayout
        />
      </div>
      <Dialog open={pdfPreviewOpen} onOpenChange={setPdfPreviewOpen}>
        <DialogContent className="pdf-preview-dialog">
          <DialogHeader className="pdf-preview-header">
            <div>
              <DialogTitle>{tr("Visualização para PDF","PDF preview")}</DialogTitle>
              <DialogDescription>
                {tr("As quatro abas serão impressas como páginas separadas.","The four tabs will print as separate pages.")}
              </DialogDescription>
            </div>
            <Button onClick={() => window.print()}>
              <Printer /> {tr("Imprimir ou salvar em PDF","Print or save as PDF")}
            </Button>
          </DialogHeader>
          <div className="pdf-preview-scroll">
            <CharacterPaper
              character={character}
              updateState={updateState}
              updateSheet={updateSheet}
              printLayout
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function DeleteCharacterDialog({
  open,
  onOpenChange,
  name,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onDelete: () => void;
}) {
  const {tr}=useLanguage();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tr(`Excluir “${name}”?`,`Delete “${name}”?`)}</AlertDialogTitle>
          <AlertDialogDescription>
            {tr("A ficha será removida do armazenamento deste navegador. Exporte o JSON antes se quiser conservar uma cópia.","This character will be removed from this browser's storage. Export the JSON first if you want to keep a copy.")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tr("Cancelar","Cancel")}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            {tr("Excluir definitivamente","Delete permanently")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SwipeableSheetTabs({
  tabs,
  children,
}: {
  tabs: Array<{ value: string; label: string }>;
  children: Record<string, ReactNode>;
}) {
  const {tr}=useLanguage();
  const [active, setActive] = useState(tabs[0]?.value ?? "");
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const select = (value: string) => {
    setActive(value);
    requestAnimationFrame(() =>
      document.querySelector(`[data-mobile-tab="${value}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }),
    );
  };
  return (
    <Tabs value={active} onValueChange={select} className="ctl-sheet-tabs mobile-sheet-tabs">
      <TabsList className="ctl-sheet-tab-list" aria-label={tr("Seções da ficha","Character sections")}>
        {tabs.map((tab) => <TabsTrigger key={tab.value} value={tab.value} data-mobile-tab={tab.value}>{tab.label}</TabsTrigger>)}
      </TabsList>
      <div
        className="mobile-swipe-area"
        onTouchStart={(event) => {
          const touch = event.changedTouches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
          const index = tabs.findIndex((tab) => tab.value === active);
          const next = dx < 0 ? index + 1 : index - 1;
          if (tabs[next]) select(tabs[next].value);
        }}
      >
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="ctl-sheet-page mobile-sheet-page">
            {children[tab.value]}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

function CharacterPaper({
  character,
  updateState,
  updateSheet,
  printLayout = false,
}: {
  character: CharacterSheet;
  updateState: (state: Record<string, unknown>) => void;
  updateSheet: (sheet: CharacterSheet) => void;
  printLayout?: boolean;
}) {
  const { locale, tr } = useLanguage();
  const isMobile = useIsMobile();
  const homebrews = useHomebrews();
  const isExpanded = (name: string) =>
    isExpandedMerit(name) ||
    Boolean(homebrews.merits.find((item) => item.name === name)?.levels?.length);
  const isCtl = character.game_line === "CtL";
  const data = character.line_data;
  const derived = derivedWithPermanentMerits(character);
  const grantedSkillBonuses = (
    data.merit_granted_skill_bonuses &&
    typeof data.merit_granted_skill_bonuses === "object"
      ? data.merit_granted_skill_bonuses
      : {}
  ) as Record<string, number>;
  const specialties = [
    ...character.specializations.map((item) =>
      typeof item === "string" ? { skill: "", name: item } : item,
    ),
    ...Object.entries(grantedSkillBonuses)
      .filter(([, value]) => Number(value) > 0)
      .map(([skill, value]) => ({
        skill,
        name: `+${value} concedido por Mérito`,
      })),
  ];
  const effectiveSkills = Object.fromEntries(
    Object.entries(character.skills).map(([name, value]) => [
      name,
      Number(value) + (Number(grantedSkillBonuses[name]) || 0),
    ]),
  );
  const aspirations = stringList(data.aspirations);
  const frailties = normalizeChangelingFrailties(data.frailties, Number(data.wyrd ?? 1));
  const oaths = stringList(data.oaths);
  const contracts = [
    ...objectList(data.contracts),
    ...objectList(data.learned_contracts),
  ];
  const rotes = [...objectList(data.rotes), ...objectList(data.learned_rotes)];
  const praxes = [
    ...objectList(data.praxes),
    ...objectList(data.learned_praxes),
  ];
  const arcana = (
    data.arcana && typeof data.arcana === "object" ? data.arcana : {}
  ) as Record<string, number>;
  const gnosis = Number(data.gnosis ?? 1);
  const powerRating = isCtl ? Number(data.wyrd ?? 1) : gnosis;
  const resource = powerResourceLimits(powerRating);
  const health = Math.max(1, Number(derived.Vitalidade ?? 5));
  const baseWillpower = Math.max(1, Number(derived.ForçaDeVontade ?? 1));
  const lostWillpower = boundedNumber(
    character.current_state?.willpower_lost_dots,
    baseWillpower - 1,
    0,
  );
  const willpower = Math.max(1, baseWillpower - lostWillpower);
  const damage = normalizeDamage(
    character.current_state?.health_damage,
    health,
  );
  const clarityMaximum = Math.max(
    1,
    Number(derived.LucidezMaxima ?? derived.ClarezaMaxima ?? 1),
  );
  const clarityDamage = normalizeClarityDamage(
    character.current_state?.clarity_damage,
    clarityMaximum,
  );
  const currentWillpower = boundedNumber(
    character.current_state?.willpower_current,
    willpower,
    willpower,
  );
  const resourceKey = isCtl ? "glamour_current" : "mana_current";
  const currentResource = boundedNumber(
    character.current_state?.[resourceKey],
    resource.maximum,
    resource.maximum,
  );
  const goblinDebt = boundedNumber(character.current_state?.goblin_debt, 9, 0);
  const expandedMerits = character.merits.filter(
    (item) => isExpanded(item.name) && !item.grantedBy,
  );
  const principalMerits = character.merits.filter(
    (item) => !item.grantedBy || item.grantedBy === "Corte",
  );
  const selectedConditions = [
    ...selectedConditionList(character.current_state?.conditions),
    ...stringList(data.merit_granted_conditions).map((id) => ({
      id,
      persistent: false,
    })),
  ].filter(
    (item, index, all) =>
      all.findIndex((other) => other.id === item.id) === index,
  );
  const notes = String(character.current_state?.notes ?? "");
  const setState = (key: string, value: unknown) =>
    updateState({ ...character.current_state, [key]: value });

  if (isMobile && !printLayout) {
    const identity = isCtl
      ? [
          ["Nome", character.character.name], ["Jogador", character.character.player],
          ["Crônica", character.character.chronicle], ["Agulha", data.needle], ["Fio", data.thread],
          ["Conceito", character.character.concept],
          ["Feição", seemingDisplayName(data.seeming,locale)],
          [tr("Frátria", "Kith"), kithDisplayName(data.kith, Boolean(data.kith_custom), locale)], [tr("Corte", "Court"), courtDisplayName(data.court, locale)],
        ]
      : [
          ["Nome", character.character.name], ["Jogador", character.character.player],
          ["Crônica", character.character.chronicle], ["Vício", data.vice], ["Virtude", data.virtue],
          ["Conceito", character.character.concept], ["Nome das Sombras", data.shadow_name],
          ["Caminho", data.path], ["Ordem", MTA_ORDER_LABELS[String(data.order)] ?? data.order],
        ];
    const paradoxConditions = MAGE_CONDITIONS.filter((condition) =>
      `${condition.name} ${condition.description} ${condition.penalty}`.toLocaleLowerCase("pt-BR").includes("paradoxo"),
    );
    return (
      <article className={`cod-sheet mobile-character-sheet ${isCtl ? "ctl-sheet" : "mta-sheet"}`}>
        <header className="cod-sheet-title">
          <div><span>{isCtl ? "CHANGELING" : tr("MAGO","MAGE")}</span><strong>{isCtl ? tr("OS PERDIDOS","THE LOST") : tr("O DESPERTAR","THE AWAKENING")}</strong></div>
          <p>{tr("CRÔNICAS DAS TREVAS","CHRONICLES OF DARKNESS")}</p>
        </header>
        <SwipeableSheetTabs tabs={[
          { value: "resumo", label: tr("Resumo","Summary") }, { value: "atributos", label: tr("Atributos","Attributes") },
          { value: "pericias", label: tr("Perícias","Skills") }, { value: "detalhes", label: tr("Detalhes","Details") },
          { value: "poderes", label: tr("Poderes","Powers") }, { value: "combate", label: tr("Combate","Combat") },
          { value: "companheiros", label: tr("Companheiros","Companions") }, { value: "anotacoes", label: tr("Anotações","Notes") },
        ]}>
          {{
            resumo: <>
              <section className="sheet-identity-grid">{identity.map(([label, value]) => <SheetField key={String(label)} label={String(label)} value={value} />)}</section>
              <SheetHeading>Experiência</SheetHeading>
              {isCtl ? <ExperiencePanel character={character} updateSheet={updateSheet} /> : <MageExperiencePanel character={character} updateSheet={updateSheet} />}
            </>,
            atributos: <div className="mobile-trait-stack">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes} />)}</div>,
            pericias: <div className="mobile-trait-stack">{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={effectiveSkills} specialties={specialties} />)}</div>,
            detalhes: isCtl ? <>
              <SheetHeading>Méritos</SheetHeading><MeritSheetList merits={principalMerits} line={character.game_line} />
              <SheetHeading>Méritos Expandidos</SheetHeading><ExpandedMeritList merits={expandedMerits} />
              <MeritConfigurationPanel character={character} updateSheet={updateSheet} />
              <SheetHeading>Aspirações</SheetHeading><EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração","Write an Aspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)} />
              <SheetHeading>Fragilidades</SheetHeading><FrailtyList values={frailties} onChange={(value) => updateLineData(updateSheet, character, "frailties", value)} />
              <SheetHeading>Pedras de Contato</SheetHeading><LineList items={[String(data.touchstone ?? "")]} />
              <SheetHeading>Lucidez</SheetHeading><ClarityTrack maximum={clarityMaximum} damage={clarityDamage} onChange={(value) => setState("clarity_damage", value)} />
              <SheetHeading>Condições</SheetHeading><ConditionManager selected={selectedConditions} catalog={CHANGELING_CONDITIONS} onChange={(value) => setState("conditions", value)} />
            </> : <>
              <SheetHeading>Méritos</SheetHeading><MeritSheetList merits={character.merits} line="MtA" />
              <SheetHeading>Méritos Expandidos</SheetHeading><ExpandedMeritList merits={expandedMerits} />
              <MeritConfigurationPanel character={character} updateSheet={updateSheet} />
              <SheetHeading>Aspirações</SheetHeading><EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração","Write an Aspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)} />
              <SheetHeading>Obsessões</SheetHeading><EditableList values={stringList(data.obsessions)} minimum={Math.max(1, Math.ceil(gnosis / 3))} placeholder={tr("Escreva uma Obsessão","Write an Obsession")} onChange={(value) => updateLineData(updateSheet, character, "obsessions", value)} />
              <SheetHeading>Nimbus</SheetHeading><LineList items={[String(data.nimbus ?? "")]} />
              <SheetHeading>Sabedoria</SheetHeading><CompactValues values={{ Sabedoria: Number(data.wisdom ?? 7) }} />
              <SheetHeading>Condições</SheetHeading><ConditionManager selected={selectedConditions} catalog={MAGE_CONDITIONS} onChange={(value) => setState("conditions", value)} />
              <SheetHeading>Feitiços Ativos</SheetHeading><EditableList values={stringList(character.current_state?.active_spells)} minimum={Math.max(gnosis, 4)} placeholder={tr("Feitiço ativo","Active spell")} onChange={(value) => setState("active_spells", value)} />
            </>,
            poderes: isCtl ? <>
              <PowerResource name="Fado" rating={powerRating} summary={wyrdSummary(powerRating)} resourceName="Glamour" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value) => setState(resourceKey, value)} />
              <SheetHeading>Regalias Favorecidas</SheetHeading><LineList items={[String(data.primary_regalia ?? ""), String(data.second_regalia ?? "")]} />
              <SheetHeading>Contratos</SheetHeading><ContractPowerList contracts={contracts} seeming={String(data.seeming ?? "")} court={String(data.court ?? "")} extraBenefits={objectList(data.extra_contract_benefits)} extraClauses={objectList(data.extra_contract_clauses)} />
              <SheetHeading>Débito Goblin</SheetHeading><GoblinDebtTrack value={goblinDebt} onChange={(value) => setState("goblin_debt", value)} />
              <SheetHeading>Juramentos</SheetHeading><EditableList values={oaths} minimum={5} placeholder={tr("Escreva um Juramento","Write an Oath")} onChange={(value) => updateLineData(updateSheet, character, "oaths", value)} />
              <SeemingLore seeming={String(data.seeming ?? "")} /><KithLore data={data} /><CourtLore data={data} merits={character.merits} />
            </> : <>
              <PowerResource name="Gnose" rating={powerRating} resourceName="Mana" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value) => setState(resourceKey, value)} />
              <SheetHeading>Arcanos</SheetHeading><div className="arcana-sheet-list">{Object.entries(arcana).map(([name, value]) => <TraitLine key={name} name={name} value={Number(value)} />)}</div>
              <SheetHeading>Rotas</SheetHeading><SpellColumn items={rotes} showSkill />
              <SheetHeading>Práxis</SheetHeading><SpellColumn items={praxes} />
              <SheetHeading>Attainments</SheetHeading><MageAttainmentList arcana={arcana} />
              <SheetHeading>Ferramentas Mágicas</SheetHeading><EditableList values={stringList(data.magical_tools).length ? stringList(data.magical_tools) : [String(data.dedicated_tool ?? "")]} minimum={3} placeholder={tr("Ferramenta mágica","Magical tool")} onChange={(value) => updateLineData(updateSheet, character, "magical_tools", value)} />
              <SheetHeading>Inclinação do Nimbus</SheetHeading><EditableList values={stringList(data.nimbus_tilt)} minimum={2} placeholder={tr("Descrição da Inclinação do Nimbus","Nimbus Tilt description")} onChange={(value) => updateLineData(updateSheet, character, "nimbus_tilt", value)} />
              <SheetHeading>Itens Encantados</SheetHeading><EditableList values={stringList(data.enchanted_items)} minimum={4} placeholder={tr("Tipo · Poder · Parada de Dados · Mana","Type · Power · Dice Pool · Mana")} onChange={(value) => updateLineData(updateSheet, character, "enchanted_items", value)} />
              <SheetHeading>Condições do Paradoxo</SheetHeading><ConditionManager selected={selectedConditions} catalog={paradoxConditions} onChange={(value) => setState("conditions", value)} />
              <CustomOrderLore data={data} />
            </>,
            combate: <>
              <SheetHeading>Vitalidade</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)} />
              <SheetHeading>Força de Vontade</SheetHeading><ResourceTrack label="Força de Vontade" current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)} />
              <CombatPage character={character} derived={derived} updateSheet={updateSheet} />
            </>,
            companheiros: <CompanionPage character={character} updateSheet={updateSheet} />,
            anotacoes: <><SheetHeading>Anotações</SheetHeading><NotesArea value={notes} onChange={(value) => setState("notes", value)} /></>,
          }}
        </SwipeableSheetTabs>
      </article>
    );
  }
  return (
    <article className={`cod-sheet ${isCtl ? "ctl-sheet" : "mta-sheet"}${printLayout ? " print-layout" : ""}`}>
      <header className="cod-sheet-title">
        <div>
          <span>{isCtl ? "CHANGELING" : tr("MAGO","MAGE")}</span>
          <strong>{isCtl ? tr("OS PERDIDOS","THE LOST") : tr("O DESPERTAR","THE AWAKENING")}</strong>
        </div>
        <p>{tr("CRÔNICAS DAS TREVAS","CHRONICLES OF DARKNESS")}</p>
      </header>
      {isCtl ? (
        <Tabs defaultValue="principal" className="ctl-sheet-tabs">
          <TabsList
            className="ctl-sheet-tab-list"
            aria-label={tr("Páginas da ficha","Character pages")}
          >
            <TabsTrigger value="principal">{tr("Principal","Main")}</TabsTrigger>
            <TabsTrigger value="poderes">{tr("Detalhes","Details")}</TabsTrigger>
            <TabsTrigger value="combate">{tr("Combate","Combat")}</TabsTrigger>
            <TabsTrigger value="companheiros">{tr("Companheiros","Companions")}</TabsTrigger>
          </TabsList>
          <TabsContent forceMount={printLayout ? true : undefined} value="principal" data-page-title="Principal" className="ctl-sheet-page">
            <section className="sheet-identity-grid">
              <SheetField label="Nome" value={character.character.name} />
              <SheetField label="Agulha" value={data.needle} />
              <SheetField
                label="Feição"
                value={seemingDisplayName(data.seeming,locale)}
              />
              <SheetField label="Jogador" value={character.character.player} />
              <SheetField label="Fio" value={data.thread} />
              <SheetField label="Fratria" value={kithDisplayName(data.kith, Boolean(data.kith_custom))} />
              <SheetField label="Crônica" value={character.character.chronicle} />
              <SheetField
                label="Conceito"
                value={character.character.concept}
              />
              <SheetField label={tr("Corte", "Court")} value={courtDisplayName(data.court, locale)} />
            </section>
            <SheetHeading>Atributos</SheetHeading>
            <div className="official-trait-grid">
              {Object.entries(ATTRIBUTES).map(([category, names]) => (
                <TraitBlock
                  key={category}
                  title={category}
                  names={names}
                  values={character.attributes}
                />
              ))}
            </div>
            <div className="official-sheet-body">
              <div className="sheet-skills-column">
                <SheetHeading>Perícias</SheetHeading>
                {Object.entries(SKILLS).map(([category, names]) => (
                  <TraitBlock
                    key={category}
                    title={category}
                    names={names}
                    values={effectiveSkills}
                    specialties={specialties}
                  />
                ))}
              </div>
              <div className="sheet-center-column">
                <SheetHeading>Méritos</SheetHeading>
                <MeritSheetList
                  merits={principalMerits}
                  line={character.game_line}
                />
                <SheetHeading>Regalias Favorecidas</SheetHeading>
                <LineList
                  items={[
                    String(data.primary_regalia ?? ""),
                    String(data.second_regalia ?? ""),
                  ]}
                />
                <SheetHeading>Fragilidades</SheetHeading>
                <FrailtyList
                  values={frailties}
                  onChange={(value) =>
                    updateLineData(updateSheet, character, "frailties", value)
                  }
                />
                <SheetHeading>Aspirações</SheetHeading>
                <EditableList
                  values={aspirations}
                  minimum={3}
                  maximum={3}
                  placeholder="Escreva uma Aspiração"
                  onChange={(value) =>
                    updateLineData(updateSheet, character, "aspirations", value)
                  }
                />
                <SheetHeading>Lucidez</SheetHeading>
                <ClarityTrack
                  maximum={clarityMaximum}
                  damage={clarityDamage}
                  onChange={(value) => setState("clarity_damage", value)}
                />
                <SheetHeading>Pedras de Contato</SheetHeading>
                <LineList items={[String(data.touchstone ?? "")]} />
              </div>
              <div className="sheet-right-column">
                <SheetHeading>Vitalidade</SheetHeading>
                <HealthTrack
                  health={health}
                  damage={damage}
                  onChange={(value) => setState("health_damage", value)}
                />
                <SheetHeading>Força de Vontade</SheetHeading>
                <ResourceTrack
                  label="Força de Vontade"
                  current={currentWillpower}
                  maximum={willpower}
                  onChange={(value) => setState("willpower_current", value)}
                />
                <SheetHeading>Características da Linha</SheetHeading>
                <PowerResource
                  name="Fado"
                  rating={powerRating}
                  summary={wyrdSummary(powerRating)}
                  resourceName="Glamour"
                  current={currentResource}
                  maximum={resource.maximum}
                  perTurn={resource.perTurn}
                  onChange={(value) => setState(resourceKey, value)}
                />
                <ExperiencePanel
                  character={character}
                  updateSheet={updateSheet}
                />
              </div>
            </div>
            <div className="sheet-bottom-grid">
              <section>
                <SheetHeading>Condições</SheetHeading>
                <ConditionManager
                  selected={selectedConditions}
                  catalog={CHANGELING_CONDITIONS}
                  onChange={(value) => setState("conditions", value)}
                />
              </section>
              <section>
                <SheetHeading>Anotações</SheetHeading>
                <NotesArea
                  value={notes}
                  onChange={(value) => setState("notes", value)}
                />
              </section>
            </div>
          </TabsContent>
          <TabsContent forceMount={printLayout ? true : undefined} value="poderes" data-page-title="Detalhes" className="ctl-sheet-page powers-page">
            <SheetHeading>Contratos</SheetHeading>
            <ContractPowerList
              contracts={contracts}
              seeming={String(data.seeming ?? "")}
              court={String(data.court ?? "")}
              extraBenefits={objectList(data.extra_contract_benefits)}
              extraClauses={objectList(data.extra_contract_clauses)}
            />
            <div className="powers-sheet-grid">
              <section>
                <SheetHeading>Outras Características</SheetHeading>
                <SeemingLore seeming={String(data.seeming ?? "")} />
                <KithLore data={data} />
                <CourtLore data={data} merits={character.merits} />
                <GoblinDebtTrack
                  value={goblinDebt}
                  onChange={(value) => setState("goblin_debt", value)}
                />
              </section>
              <section>
                <SheetHeading>Juramentos</SheetHeading>
                <EditableList
                  values={oaths}
                  minimum={5}
                  placeholder="Escreva um Juramento"
                  onChange={(value) =>
                    updateLineData(updateSheet, character, "oaths", value)
                  }
                />
                <SheetHeading>Méritos Expandidos</SheetHeading>
                <ExpandedMeritList merits={expandedMerits} />
                <MeritConfigurationPanel
                  character={character}
                  updateSheet={updateSheet}
                />
              </section>
            </div>
          </TabsContent>
          <TabsContent forceMount={printLayout ? true : undefined} value="combate" data-page-title="Combate" className="ctl-sheet-page powers-page">
            <CombatPage
              character={character}
              derived={derived}
              updateSheet={updateSheet}
            />
          </TabsContent>
          <TabsContent
            forceMount={printLayout ? true : undefined}
            value="companheiros"
            data-page-title="Companheiros"
            className="ctl-sheet-page powers-page"
          >
            <CompanionPage character={character} updateSheet={updateSheet} />
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs
          defaultValue="principal"
          className="ctl-sheet-tabs mta-sheet-tabs"
        >
          <TabsList
            className="ctl-sheet-tab-list"
            aria-label={tr("Páginas da ficha de Mago","Mage character pages")}
          >
            <TabsTrigger value="principal">{tr("Principal","Main")}</TabsTrigger>
            <TabsTrigger value="magia">{tr("Detalhes","Details")}</TabsTrigger>
            <TabsTrigger value="combate">{tr("Combate","Combat")}</TabsTrigger>
            <TabsTrigger value="companheiros">{tr("Companheiros","Companions")}</TabsTrigger>
          </TabsList>
          <TabsContent forceMount={printLayout ? true : undefined} value="principal" data-page-title="Principal" className="ctl-sheet-page">
            <section className="sheet-identity-grid">
              <SheetField label="Nome" value={character.character.name} />
              <SheetField label="Nome das Sombras" value={data.shadow_name} />
              <SheetField label="Caminho" value={data.path} />
              <SheetField
                label="Ordem"
                value={MTA_ORDER_LABELS[String(data.order)] ?? data.order}
              />
              <SheetField label="Jogador" value={character.character.player} />
              <SheetField label="Virtude" value={data.virtue} />
              <SheetField label="Vício" value={data.vice} />
              <SheetField label="Crônica" value={character.character.chronicle} />
              <SheetField
                label="Conceito"
                value={character.character.concept}
              />
              <SheetField label="Legado" value={data.legacy} />
            </section>
            <SheetHeading>Atributos</SheetHeading>
            <div className="official-trait-grid">
              {Object.entries(ATTRIBUTES).map(([category, names]) => (
                <TraitBlock
                  key={category}
                  title={category}
                  names={names}
                  values={character.attributes}
                />
              ))}
            </div>
            <div className="official-sheet-body">
              <div className="sheet-skills-column">
                <SheetHeading>Perícias</SheetHeading>
                {Object.entries(SKILLS).map(([category, names]) => (
                  <TraitBlock
                    key={category}
                    title={category}
                    names={names}
                    values={effectiveSkills}
                    specialties={specialties}
                  />
                ))}
              </div>
              <div className="sheet-center-column">
                <SheetHeading>Méritos</SheetHeading>
                <MeritSheetList merits={character.merits} line="MtA" />
                <SheetHeading>Arcanos</SheetHeading>
                <div className="arcana-sheet-list">
                  {Object.entries(arcana).map(([name, value]) => (
                    <TraitLine key={name} name={name} value={Number(value)} />
                  ))}
                </div>
                <SheetHeading>Aspirações</SheetHeading>
                <EditableList
                  values={aspirations}
                  minimum={3}
                  maximum={3}
                  placeholder="Escreva uma Aspiração"
                  onChange={(value) =>
                    updateLineData(updateSheet, character, "aspirations", value)
                  }
                />
                <SheetHeading>Obsessões</SheetHeading>
                <EditableList
                  values={stringList(data.obsessions)}
                  minimum={Math.max(1, Math.ceil(gnosis / 3))}
                  placeholder="Escreva uma Obsessão"
                  onChange={(value) =>
                    updateLineData(updateSheet, character, "obsessions", value)
                  }
                />
              </div>
              <div className="sheet-right-column">
                <SheetHeading>Vitalidade</SheetHeading>
                <HealthTrack
                  health={health}
                  damage={damage}
                  onChange={(value) => setState("health_damage", value)}
                />
                <SheetHeading>Força de Vontade</SheetHeading>
                <ResourceTrack
                  label="Força de Vontade"
                  current={currentWillpower}
                  maximum={willpower}
                  onChange={(value) => setState("willpower_current", value)}
                />
                <PowerResource
                  name="Gnose"
                  rating={powerRating}
                  resourceName="Mana"
                  current={currentResource}
                  maximum={resource.maximum}
                  perTurn={resource.perTurn}
                  onChange={(value) => setState(resourceKey, value)}
                />
                <MageExperiencePanel
                  character={character}
                  updateSheet={updateSheet}
                />
              </div>
            </div>
            <section className="sheet-wide-section">
              <SheetHeading>Condições</SheetHeading>
              <ConditionManager
                selected={selectedConditions}
                catalog={MAGE_CONDITIONS}
                onChange={(value) => setState("conditions", value)}
              />
            </section>
          </TabsContent>
          <TabsContent
            forceMount={printLayout ? true : undefined}
            value="magia"
            data-page-title="Detalhes"
            className="ctl-sheet-page powers-page mage-spell-page"
          >
            <section className="sheet-identity-grid">
              <SheetField label="Nome" value={character.character.name} />
              <SheetField label="Caminho" value={data.path} />
              <SheetField
                label="Ordem"
                value={MTA_ORDER_LABELS[String(data.order)] ?? data.order}
              />
              <SheetField label="Nimbus" value={data.nimbus} />
              <SheetField label="Sabedoria" value={data.wisdom} />
              <SheetField label="Gnose" value={gnosis} />
            </section>
            <CustomOrderLore data={data} />
            <div className="mage-page-355-grid">
              <section className="mage-page-left">
                <SheetHeading>Feitiços Ativos</SheetHeading>
                <EditableList
                  values={stringList(character.current_state?.active_spells)}
                  minimum={Math.max(gnosis, 4)}
                  placeholder="Feitiço ativo"
                  onChange={(value) => setState("active_spells", value)}
                />
                <SheetHeading>Attainments</SheetHeading>
                <MageAttainmentList arcana={arcana} />
                <SheetHeading>Ferramentas Mágicas</SheetHeading>
                <EditableList
                  values={
                    stringList(data.magical_tools).length
                      ? stringList(data.magical_tools)
                      : [String(data.dedicated_tool ?? "")]
                  }
                  minimum={3}
                  placeholder="Ferramenta mágica"
                  onChange={(value) =>
                    updateLineData(
                      updateSheet,
                      character,
                      "magical_tools",
                      value,
                    )
                  }
                />
                <SheetHeading>Práxis</SheetHeading>
                <SpellColumn items={praxes} />
              </section>
              <section className="mage-page-main">
                <SheetHeading>Rotas</SheetHeading>
                <SpellColumn items={rotes} showSkill />
                <SheetHeading>Inclinação do Nimbus</SheetHeading>
                <EditableList
                  values={stringList(data.nimbus_tilt)}
                  minimum={2}
                  placeholder="Descrição da Inclinação do Nimbus"
                  onChange={(value) =>
                    updateLineData(updateSheet, character, "nimbus_tilt", value)
                  }
                />
                <SheetHeading>Itens Encantados</SheetHeading>
                <EditableList
                  values={stringList(data.enchanted_items)}
                  minimum={4}
                  placeholder="Tipo · Poder · Parada de Dados · Mana"
                  onChange={(value) =>
                    updateLineData(
                      updateSheet,
                      character,
                      "enchanted_items",
                      value,
                    )
                  }
                />
                <SheetHeading>Méritos Expandidos</SheetHeading>
                <ExpandedMeritList
                  merits={character.merits.filter((item) =>
                    isExpanded(item.name),
                  )}
                />
                <MeritConfigurationPanel
                  character={character}
                  updateSheet={updateSheet}
                />
                <SheetHeading>Anotações</SheetHeading>
                <NotesArea
                  value={notes}
                  onChange={(value) => setState("notes", value)}
                />
              </section>
            </div>
          </TabsContent>
          <TabsContent forceMount={printLayout ? true : undefined} value="combate" data-page-title="Combate" className="ctl-sheet-page powers-page">
            <CombatPage
              character={character}
              derived={derived}
              updateSheet={updateSheet}
            />
          </TabsContent>
          <TabsContent
            forceMount={printLayout ? true : undefined}
            value="companheiros"
            data-page-title="Companheiros"
            className="ctl-sheet-page powers-page"
          >
            <CompanionPage character={character} updateSheet={updateSheet} />
          </TabsContent>
        </Tabs>
      )}
    </article>
  );
}

function SheetHeading({ children }: { children: ReactNode }) {
  const {locale}=useLanguage();
  return (
    <h3 className="official-heading">
      <span>{typeof children==="string"?workspaceTerm(children,locale):children}</span>
    </h3>
  );
}
function MeritConfigurationPanel({
  character,
  updateSheet,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, tr } = useLanguage();
  const configurable = character.merits.filter(
    (item) => findMeritConfiguration(item.name) && !item.grantedBy,
  );
  if (!configurable.length) return null;
  const conditions = stringList(character.line_data.merit_granted_conditions),
    attainments = stringList(character.line_data.merit_granted_attainments);
  return (
    <section className="sheet-merit-configurations">
      <SheetHeading>Escolhas dos Méritos</SheetHeading>
      {(conditions.length > 0 || attainments.length > 0) && (
        <div className="merit-grant-summary">
          {conditions.length > 0 && (
            <p>
              <strong>{tr("Condições concedidas:", "Granted Conditions:")}</strong> {conditions.join(", ")}
            </p>
          )}
          {attainments.length > 0 && (
            <p>
              <strong>{tr("Attainments concedidos:", "Granted Attainments:")}</strong> {attainments.join(", ")}
            </p>
          )}
        </div>
      )}
      {configurable.map((item, configIndex) => {
        const meritIndex = character.merits.indexOf(item);
        return (
          <article key={`${item.name}-${item.sourceId ?? ""}-${configIndex}`}>
            <strong>
              {getMeritsForLine(character.game_line).find(
                (entry) => entry.name === item.name,
              )?.[locale === "en-US" ? "name" : "translatedName"] ?? item.name}
            </strong>
            <MeritConfigurationEditor
              compact
              merit={item}
              onChange={(configuration) => {
                const next = structuredClone(character);
                const target = next.merits[meritIndex];
                if (target) target.configuration = configuration;
                updateSheet(synchronizeMeritGrants(next));
              }}
            />
          </article>
        );
      })}
    </section>
  );
}
function SheetField({ label, value }: { label: string; value: unknown }) {
  const {locale}=useLanguage();
  return (
    <div className="official-field">
      <span>{workspaceTerm(label,locale)}</span>
      <strong>{String(value ?? "")}</strong>
    </div>
  );
}
function TraitBlock({
  title,
  names,
  values,
  specialties = [],
}: {
  title: string;
  names: readonly string[];
  values: Record<string, number>;
  specialties?: Array<{ skill: string; name: string }>;
}) {
  const {locale}=useLanguage();
  return (
    <section className="official-trait-block">
      <h4>{workspaceTerm(title,locale)}</h4>
      {names.map((name) => (
        <TraitLine
          key={name}
          name={name}
          value={values[name] ?? 0}
          note={specialties
            .filter((item) => item.skill === name)
            .map((item) => item.name)
            .join(", ")}
        />
      ))}
    </section>
  );
}
function TraitLine({
  name,
  value,
  note,
}: {
  name: string;
  value: number;
  note?: string;
}) {
  const {locale}=useLanguage();
  return (
    <div className="official-trait-line">
      <span>
        {systemTerm(name,locale)}
        {note && <small>{note}</small>}
      </span>
      <DotValue value={value} />
    </div>
  );
}
function DotValue({ value, max = 5 }: { value: number; max?: number }) {
  const {tr}=useLanguage();
  const total = Math.max(max, Math.ceil(value / 5) * 5);
  return (
    <span className="official-dots" aria-label={tr(`${value} pontos`,`${value} dots`)}>
      {Array.from({ length: Math.ceil(total / 5) }, (_, row) => (
        <span className="official-dot-row" key={row}>
          {Array.from({ length: 5 }, (_, column) => {
            const index = row * 5 + column;
            return <i key={index} className={index < value ? "on" : ""} />;
          })}
        </span>
      ))}
    </span>
  );
}
function meritLabel(
  item: CharacterSheet["merits"][number],
  line?: "CtL" | "MtA",
  locale:Locale="pt-BR",
) {
  const definition = line
    ? getMeritsForLine(line).find((entry) => entry.name === item.name)
    : [...getMeritsForLine("CtL"), ...getMeritsForLine("MtA")].find(
        (entry) => entry.name === item.name,
      );
  const base = locale==="en-US"
      ? definition?.name ?? item.name
      : definition?.translatedName ??
      (item.name === "Hollow" ? "Recanto" : item.name),
    detail = meritConfigurationTitle(item.configuration);
  return detail ? `${base}: ${detail}` : base;
}
function CompactValues({ values }: { values: Record<string, number> }) {
  const {locale}=useLanguage();
  return (
    <div className="compact-values">
      {Object.entries(values).map(([name, value]) => (
        <div key={name}>
          <span>{workspaceTerm(pretty(name),locale)}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}
function ExpandedMeritList({ merits }: { merits: CharacterSheet["merits"] }) {
  const {locale,tr}=useLanguage();
  const homebrews = useHomebrews();
  const visible = merits.filter((item) => !item.grantedBy);
  return (
    <div className="expanded-merit-list">
      {visible.map((item, itemIndex) => {
        const style =
            findExpandedMerit(item.name) ??
            homebrews.merits.find(
              (merit) => merit.name === item.name && merit.levels?.length,
            ),
          configured = expandedConfigurationLines(
            item.name,
            item.dots,
            item.configuration,
          ),
          cult = String(
            normalizeMeritConfiguration(item.configuration).cult ?? "",
          ),
          title =
            homebrews.merits.find((merit) => merit.name === item.name)
              ?.[locale==="en-US"?"name":"translatedName"] ?? meritLabel(item,undefined,locale);
        if (!style)
          return (
            <article key={`${item.name}-${itemIndex}`}>
              <header>
                <h4>{title}</h4>
                <DotValue value={item.dots} />
              </header>
              <div>
                {configured.length ? (
                  configured.map((line, index) => (
                    <section key={`${item.name}-configured-${index}`}>
                      <strong>{line.split(":")[0]}</strong>
                      <p>{line.slice(line.indexOf(":") + 1).trim()}</p>
                    </section>
                  ))
                ) : (
                  <p>
                    {tr("Consulte a descrição deste Mérito para distribuir ou usar suas características internas.","See this Merit's description to assign or use its internal traits.")}
                  </p>
                )}
              </div>
            </article>
          );
        return (
          <article key={`${item.name}-${itemIndex}`}>
            <header>
              <div>
                <h4>
                  {title}
                  {cult && !title.includes(cult) ? `: ${cult}` : ""}
                </h4>
                <small>
                  {style.source} · p. {style.page} · Pré-requisitos:{" "}
                  {style.prerequisites}
                </small>
              </div>
              <DotValue value={item.dots} />
            </header>
            <div>
              {configured.length
                ? configured.map((line, index) => (
                    <section key={`${style.name}-configured-${index}`}>
                      <strong>{line.split(":")[0]}</strong>
                      <p>{line.slice(line.indexOf(":") + 1).trim()}</p>
                    </section>
                  ))
                : (style.levels ?? [])
                    .filter((level) => level.rating <= item.dots)
                    .map((level, index) => (
                      <section key={`${style.name}-${level.rating}-${index}`}>
                        <strong>
                          {"•".repeat(level.rating)} {level.name}
                        </strong>
                        <p>{level.description}</p>
                      </section>
                    ))}
            </div>
          </article>
        );
      })}
      {!visible.length && <em>{tr("Nenhum Mérito Expandido adquirido.", "No Expanded Merits purchased.")}</em>}
    </div>
  );
}
function CombatPage({
  character,
  derived,
  updateSheet,
}: {
  character: CharacterSheet;
  derived: Record<string, number>;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { tr } = useLanguage();
  const weaponIds = stringList(character.line_data.combat_weapons),
    equipmentIds = stringList(character.line_data.combat_equipment),
    tiltIds = stringList(character.line_data.combat_tilts),
    armorId = String(character.line_data.combat_armor ?? "");
  const armor = ARMORS.find((item) => item.id === armorId),
    weapons = weaponIds
      .map((id) => WEAPONS.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    equipment = equipmentIds
      .map((id) => EQUIPMENT.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const setData = (key: string, value: unknown) => {
    const next = structuredClone(character);
    next.line_data = { ...next.line_data, [key]: value };
    updateSheet(next);
  };
  const combatValues = {
    Defesa: Number(derived.Defesa ?? 0) + (armor?.defense ?? 0),
    Iniciativa: Number(derived.Iniciativa ?? 0),
    Deslocamento: Number(derived.Deslocamento ?? 0) + (armor?.speed ?? 0),
    Tamanho: Number(derived.Tamanho ?? 5),
    Vitalidade: Number(derived.Vitalidade ?? 5),
    "Armadura geral": armor?.general ?? 0,
    "Armadura balística": armor?.ballistic ?? 0,
  };
  return (
    <div className="combat-page">
      <section>
        <SheetHeading>Outras Características</SheetHeading>
        <CompactValues values={combatValues} />
        <p className="combat-note">{tr("Os valores de Defesa e Deslocamento já incluem a armadura vestida. A penalidade de Iniciativa aparece em cada arma equipada.", "Defense and Speed already include worn armor. Each equipped weapon shows its Initiative penalty.")}</p>
        <SheetHeading>Resumo de Combate</SheetHeading>
        <div className="combat-rules">
          <article>
            <strong>{tr("Ataques", "Attacks")}</strong>
            <p>{tr("Desarmado: Força + Briga − Defesa. Corpo a corpo: Força + Armas Brancas − Defesa. Distância: Destreza + Armas de Fogo. Arremesso: Destreza + Atletismo − Defesa.", "Unarmed: Strength + Brawl − Defense. Melee: Strength + Weaponry − Defense. Ranged: Dexterity + Firearms. Thrown: Dexterity + Athletics − Defense.")}</p>
          </article>
          <article>
            <strong>{tr("Dano e Defesa", "Damage and Defense")}</strong>
            <p>{tr("Some os sucessos ao dano da arma. Defesa diminui após cada ataque próximo recebido no turno; armas de fogo normalmente ignoram Defesa.", "Add successes to the weapon's damage. Defense decreases after each close attack received in the turn; firearms normally ignore Defense.")}</p>
          </article>
          <article>
            <strong>{tr("Iniciativa e Esquiva", "Initiative and Dodge")}</strong>
            <p>{tr("Iniciativa é 1d10 + modificador, reduzida pela arma empunhada. Esquivar usa o dobro da Defesa como parada disputada.", "Initiative is 1d10 + modifier, reduced by the wielded weapon. Dodge uses twice Defense as a contested pool.")}</p>
          </article>
          <article>
            <strong>{tr("Armadura", "Armor")}</strong>
            <p>{tr("Proteção geral reduz ataques comuns; proteção balística reduz armas de fogo. Penalidades da armadura já aparecem nos valores acima.", "General armor reduces ordinary attacks; ballistic armor reduces firearm attacks. Armor penalties are already included above.")}</p>
          </article>
        </div>
        <SheetHeading>{tr("Inclinações", "Tilts")}</SheetHeading>
        <TiltManager selected={tiltIds} onChange={(value) => setData("combat_tilts", value)} />
      </section>
      <section className="loadout-section">
        <SheetHeading>Armadura</SheetHeading>
        <RuleSelect
          value={armorId || "none"}
          onChange={(value) =>
            setData("combat_armor", value === "none" ? "" : value)
          }
          options={[
            { value: "none", label: "Sem armadura" },
            ...ARMORS.map((item) => ({
              value: item.id,
              label: `${item.name} · ${item.general}/${item.ballistic}`,
            })),
          ]}
        />
        {armor && (
          <div className="armor-summary">
            <strong>{armor.name}</strong>
            <span>
              Armadura {armor.general}/{armor.ballistic} · Defesa{" "}
              {signed(armor.defense)} · Deslocamento {signed(armor.speed)} ·{" "}
              {armor.coverage}
            </span>
          </div>
        )}
        <SheetHeading>Armas</SheetHeading>
        <LoadoutCatalog
          title="Selecionar Armas"
          items={WEAPONS}
          selected={weaponIds}
          describe={(item) =>
            `${item.kind} · Dano ${item.damage} · Iniciativa ${signed(item.initiative)} · Força ${item.strength} · Tamanho ${item.size}${item.ranges ? ` · Alcance ${item.ranges}` : ""}${item.clip ? ` · Carga ${item.clip}` : ""}`
          }
          details={(item) => item.special ?? "Sem propriedade especial."}
          onChange={(value) => setData("combat_weapons", value)}
        />
        <div className="loadout-list">
          {weapons.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>
                  {item.kind} · dano {item.damage} · Iniciativa{" "}
                  {signed(item.initiative)} · Força {item.strength} · Tamanho{" "}
                  {item.size}
                  {item.ranges ? ` · alcance ${item.ranges}` : ""}
                  {item.clip ? ` · carga ${item.clip}` : ""}
                </small>
                {item.special && <p>{item.special}</p>}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() =>
                  setData(
                    "combat_weapons",
                    weaponIds.filter((id) => id !== item.id),
                  )
                }
              >
                <X />
              </Button>
            </article>
          ))}
        </div>
        <SheetHeading>Equipamentos</SheetHeading>
        <LoadoutCatalog
          title="Selecionar Equipamentos"
          items={EQUIPMENT}
          selected={equipmentIds}
          describe={(item) =>
            `${item.category} · Bônus ${item.bonus} · Durabilidade ${item.durability} · Tamanho ${item.size} · Estrutura ${item.structure} · Disponibilidade ${item.availability}`
          }
          details={(item) => item.effect}
          onChange={(value) => setData("combat_equipment", value)}
        />
        <div className="loadout-list">
          {equipment.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>
                  {item.category} · bônus {item.bonus} · Durabilidade{" "}
                  {item.durability} · Tamanho {item.size} · Estrutura{" "}
                  {item.structure} · Disponibilidade {item.availability}
                </small>
                <p>{item.effect}</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() =>
                  setData(
                    "combat_equipment",
                    equipmentIds.filter((id) => id !== item.id),
                  )
                }
              >
                <X />
              </Button>
            </article>
          ))}
        </div>
      </section>
      <small className="combat-source">
        Regras e equipamentos: Chronicles of Darkness · pp. 86–103 e 268–276.
      </small>
    </div>
  );
}

function TiltManager({selected,onChange}:{selected:string[];onChange:(value:string[])=>void}) {
  const {locale,tr}=useLanguage();
  const [search,setSearch]=useState(""), [category,setCategory]=useState("All");
  const name=(tilt:(typeof TILTS)[number])=>locale==="en-US"?tilt.name:tilt.translatedName;
  const filtered=alphabetical(TILTS,name,locale).filter((tilt)=>(category==="All"||tilt.category===category)&&`${tilt.name} ${tilt.translatedName} ${tilt.description} ${tilt.effect}`.toLocaleLowerCase(locale).includes(search.toLocaleLowerCase(locale)));
  return <div className="tilt-manager">
    <div className="selected-tilts">
      {selected.map(findTilt).filter((tilt):tilt is NonNullable<typeof tilt>=>Boolean(tilt)).map((tilt)=><article key={tilt.id} className="selected-tilt"><div><strong>{name(tilt)}</strong><small>{tr(tilt.category==="Personal"?"Pessoal":"Ambiental",tilt.category)} · {tilt.sourceCode} · p. {tilt.page}</small><p>{tilt.effect}</p></div><Button type="button" size="icon" variant="ghost" onClick={()=>onChange(selected.filter((id)=>id!==tilt.id))} aria-label={`${tr("Remover","Remove")} ${name(tilt)}`}><X /></Button></article>)}
      {!selected.length&&<em>{tr("Nenhuma Inclinação selecionada.","No Tilts selected.")}</em>}
    </div>
    <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline"><Plus />{tr("Adicionar Inclinação","Add Tilt")}</Button></DialogTrigger><DialogContent className="tilt-dialog"><DialogHeader><DialogTitle>{tr("Inclinações de Combate","Combat Tilts")}</DialogTitle><DialogDescription>{tr("Selecione efeitos pessoais ou ambientais ativos na cena.","Select Personal or Environmental effects active in the scene.")}</DialogDescription></DialogHeader>
      <div className="tilt-filters"><label className="catalog-search"><Search/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder={tr("Buscar Inclinação","Search Tilts")}/></label><RuleSelect value={category} onChange={setCategory} options={[{value:"All",label:tr("Todas","All")},{value:"Personal",label:tr("Pessoais","Personal")},{value:"Environmental",label:tr("Ambientais","Environmental")}]} /></div>
      <div className="tilt-catalog">{filtered.map((tilt)=>{const active=selected.includes(tilt.id);return <article key={tilt.id} className={active?"selected":""}><header><div><strong>{name(tilt)}</strong><small>{tr(tilt.category==="Personal"?"Pessoal":"Ambiental",tilt.category)} · {tilt.sourceCode} · p. {tilt.page}</small></div><Button type="button" size="sm" variant={active?"ghost":"outline"} onClick={()=>onChange(active?selected.filter((id)=>id!==tilt.id):[...selected,tilt.id])}>{active?tr("Remover","Remove"):tr("Adicionar","Add")}</Button></header><p>{tilt.description}</p><p><b>{tr("Efeito","Effect")}:</b> {tilt.effect}</p><p><b>{tr("Causando a Inclinação","Causing the Tilt")}:</b> {tilt.causing}</p><p><b>{tr("Encerrando a Inclinação","Ending the Tilt")}:</b> {tilt.ending}</p></article>})}</div>
      <DialogFooter><DialogClose asChild><Button type="button">{tr("Concluir","Done")}</Button></DialogClose></DialogFooter>
    </DialogContent></Dialog>
  </div>;
}

function LoadoutCatalog<T extends { id: string; name: string }>({
  title,
  items,
  selected,
  describe,
  details,
  onChange,
}: {
  title: string;
  items: T[];
  selected: string[];
  describe: (item: T) => string;
  details: (item: T) => string;
  onChange: (value: string[]) => void;
}) {
  const {locale,tr}=useLanguage();
  const [search, setSearch] = useState("");
  const filtered = alphabetical(items, item => item.name,locale).filter((item) =>
    `${item.name} ${describe(item)} ${details(item)}`
      .toLocaleLowerCase("pt-BR")
      .includes(search.toLocaleLowerCase("pt-BR")),
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <Plus />
          {workspaceTerm(title,locale)}
        </Button>
      </DialogTrigger>
      <DialogContent className="loadout-dialog">
        <DialogHeader>
          <DialogTitle>{workspaceTerm(title,locale)}</DialogTitle>
          <DialogDescription>
            {tr("Pesquise, compare as características e marque tudo que deseja adicionar à ficha.","Search, compare traits, and select everything you want to add to the character sheet.")}
          </DialogDescription>
        </DialogHeader>
        <label className="catalog-search">
          <Search />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={tr("Buscar por nome ou característica","Search by name or trait")}
          />
        </label>
        <div className="loadout-catalog">
          {filtered.map((item) => {
            const active = selected.includes(item.id);
            return (
              <article key={item.id} className={active ? "selected" : ""}>
                <header>
                  <strong>{item.name}</strong>
                  <Button
                    type="button"
                    size="sm"
                    variant={active ? "ghost" : "outline"}
                    onClick={() =>
                      onChange(
                        active
                          ? selected.filter((id) => id !== item.id)
                          : [...selected, item.id],
                      )
                    }
                  >
                    {active ? tr("Remover","Remove") : tr("Adicionar","Add")}
                  </Button>
                </header>
                <small>{describe(item)}</small>
                <p>{details(item)}</p>
              </article>
            );
          })}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">{tr("Concluir","Done")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type SavedAnimalCompanion = { animalId: string; name?: string };
function CompanionPage({
  character,
  updateSheet,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { tr } = useLanguage();
  const vehicleIds = stringList(character.line_data.companion_vehicles),
    savedAnimals = objectList(character.line_data.animal_companions)
      .map((item) => ({
        animalId: String(item.animalId ?? ""),
        name: String(item.name ?? ""),
      }))
      .filter((item) => item.animalId);
  const owned = character.merits.filter((item) => !item.grantedBy);
  const [animalChoice, setAnimalChoice] = useState(ANIMALS[0]?.id ?? ""),
    [animalName, setAnimalName] = useState("");
  const setData = (key: string, value: unknown) => {
    const next = structuredClone(character);
    next.line_data = { ...next.line_data, [key]: value };
    updateSheet(next);
  };
  const configuredCompanions = character.merits
    .map((merit, index) => ({ merit, index }))
    .filter(
      ({ merit }) =>
        !merit.grantedBy && ["Fae Mount", "Familiar"].includes(merit.name),
    );
  return (
    <div className="companions-page">
      <section>
        <SheetHeading>Veículos</SheetHeading>
        <p className="combat-note">{tr("O modificador se aplica às paradas de Destreza + Condução. Acima da Velocidade segura, ele é aplicado novamente e falhas de manobra tornam-se falhas dramáticas.", "The modifier applies to Dexterity + Drive pools. Above safe Speed, apply it again and failed maneuvers become dramatic failures.")}</p>
        <LoadoutCatalog
          title={tr("Selecionar Veículos", "Select Vehicles")}
          items={VEHICLES}
          selected={vehicleIds}
          describe={(item) =>
            `Modificador ${signed(item.diceModifier)} · Tamanho ${item.size} · Durabilidade ${item.durability} · Estrutura ${item.structure} · Velocidade ${item.speed}`
          }
          details={(item) =>
            item.acceleration
              ? `Aceleração ${item.acceleration.toLocaleLowerCase("pt-BR")}.`
              : "Aceleração normal."
          }
          onChange={(value) => setData("companion_vehicles", value)}
        />
        <div className="companion-grid">
          {vehicleIds
            .map((id) => VEHICLES.find((item) => item.id === id))
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
            .map((item) => (
              <article className="companion-card" key={item.id}>
                <header>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{tr("Veículo", "Vehicle")}</small>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setData(
                        "companion_vehicles",
                        vehicleIds.filter((id) => id !== item.id),
                      )
                    }
                  >
                    <X />
                  </Button>
                </header>
                <CompactValues
                  values={{
                    Modificador: item.diceModifier,
                    Tamanho: item.size,
                    Durabilidade: item.durability,
                    Estrutura: item.structure,
                    Velocidade: item.speed,
                  }}
                />
                <p>
                  {item.acceleration
                    ? `Aceleração ${item.acceleration.toLowerCase()}.`
                    : "Aceleração normal: +5 de Velocidade por turno."}
                </p>
              </article>
            ))}
        </div>
      </section>
      <section>
        <SheetHeading>Companheiros</SheetHeading>
        {configuredCompanions.map(({ merit, index }) => (
          <MeritCompanionCard
            key={`${merit.name}-${index}`}
            merit={merit}
            meritIndex={index}
            character={character}
            updateSheet={updateSheet}
          />
        ))}
        <div className="animal-picker">
          <RuleSelect
            value={animalChoice}
            onChange={setAnimalChoice}
            options={ANIMALS.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
          <Input
            value={animalName}
            onChange={(event) => setAnimalName(event.target.value)}
            placeholder={tr("Nome do animal (opcional)", "Animal name (optional)")}
          />
          <Button
            type="button"
            size="sm"
            disabled={!animalChoice}
            onClick={() => {
              setData("animal_companions", [
                ...savedAnimals,
                { animalId: animalChoice, name: animalName.trim() },
              ]);
              setAnimalName("");
            }}
          >
            <Plus />
            {tr("Adicionar animal", "Add animal")}
          </Button>
        </div>
        <p className="combat-note">
          {tr("Animais comuns podem ser adicionados livremente; não exigem Mérito.", "Ordinary animals may be added freely; they do not require a Merit.")}
        </p>
        <div className="companion-grid">
          {savedAnimals.map((saved, index) => {
            const animal = ANIMALS.find((item) => item.id === saved.animalId);
            return animal ? (
              <AnimalCard
                key={`${saved.animalId}-${index}`}
                animal={animal}
                name={saved.name}
                onRemove={() =>
                  setData(
                    "animal_companions",
                    savedAnimals.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              />
            ) : null;
          })}
        </div>
      </section>
      <small className="combat-source">
        Veículos: Chronicles of Darkness, regras de Veículos; valores corrigidos
        conforme Chronicles of Darkness Rules. Animais: World of Darkness animal
        stat blocks.
      </small>
    </div>
  );
}
const FAE_MOUNT_ABILITIES = [
  [
    "manyleague",
    "Manyleague",
    "Dobra o Deslocamento; soma os pontos do Mérito à Iniciativa da montaria sozinha ou do dono montado.",
  ],
  [
    "chatterbox",
    "Chatterbox",
    "Fala e entende claramente o dono e transmite mensagens simples no idioma dele.",
  ],
  [
    "actormask",
    "Actormask",
    "Pode deixar a Sebe; por 1 Glamour por cena mantém uma Máscara no mundo mundano.",
  ],
  [
    "armorshell",
    "Armorshell",
    "Armadura 3/2 e ocultação parcial para o cavaleiro.",
  ],
  [
    "burdenback",
    "Burdenback",
    "Carrega pessoas adicionais iguais aos pontos do Mérito e recebe +2 Vigor.",
  ],
  [
    "dreamspun",
    "Dreamspun",
    "Ressurge após uma noite completa de sono do dono e recebe Furtividade igual aos pontos do Mérito.",
  ],
  [
    "thornbeast",
    "Thornbeast",
    "+2 dados nos ataques e modificador de arma +2.",
  ],
  ["hedgefoot", "Hedgefoot", "Escolha correr sobre água, escalar ou voar."],
] as const;
const FAMILIAR_NUMINA = [
  "Awe",
  "Blast",
  "Dement",
  "Drain",
  "Emotional Aura",
  "Entropic Decay",
  "Firestarter",
  "Hallucination",
  "Implant Mission",
  "Left-Handed Spanner",
  "Mortal Mask",
  "Pathfinder",
  "Regenerate",
  "Seek",
  "Speed",
  "Sign",
  "Stalwart",
  "Telekinesis",
];
function MeritCompanionCard({
  merit,
  meritIndex,
  character,
  updateSheet,
}: {
  merit: CharacterSheet["merits"][number];
  meritIndex: number;
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const configuration = normalizeMeritConfiguration(merit.configuration),
    name = String(
      configuration.name ??
        (merit.name === "Fae Mount" ? "Montaria Feérica" : "Familiar"),
    );
  const save = (patch: Record<string, string | string[]>) => {
    const next = structuredClone(character);
    const target = next.merits[meritIndex];
    if (target?.name === merit.name)
      target.configuration = {
        ...normalizeMeritConfiguration(target.configuration),
        ...patch,
      };
    updateSheet(next);
  };
  if (merit.name === "Fae Mount") {
    const abilities = stringList(configuration.abilities).slice(0, merit.dots),
      hedgefoot = String(configuration.hedgefoot ?? "water"),
      burden = abilities.includes("burdenback"),
      many = abilities.includes("manyleague"),
      thorn = abilities.includes("thornbeast");
    return (
      <article className="companion-card merit-companion companion-config">
        <header>
          <div>
            <strong>{name}</strong>
            <small>
              Montaria Feérica · {merit.dots} pontos · escolha {merit.dots}{" "}
              habilidades
            </small>
          </div>
        </header>
        <Input
          value={name}
          onChange={(event) => save({ name: event.target.value })}
          placeholder="Nome da montaria"
        />
        <CompactValues
          values={{
            Força: 5,
            Destreza: 3,
            Vigor: 5 + (burden ? 2 : 0),
            Iniciativa: 5 + (many ? merit.dots : 0),
            Defesa: 7,
            Deslocamento: many ? 38 : 19,
            Tamanho: 7,
            Vitalidade: 12 + (burden ? 2 : 0),
          }}
        />
        <p>
          <b>Ataques:</b> Mordida +0L ({5 + (thorn ? 2 : 0)} dados); coice ou
          garra {thorn ? "+4L" : "+2L"} ({6 + (thorn ? 2 : 0)} dados,
          Derrubado).
        </p>
        <div className="companion-options">
          {alphabetical(FAE_MOUNT_ABILITIES, item => item[1]).map(([id, label, description]) => {
            const active = abilities.includes(id);
            return (
              <label key={id} className={active ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={active}
                  disabled={!active && abilities.length >= merit.dots}
                  onChange={() =>
                    save({
                      abilities: active
                        ? abilities.filter((value) => value !== id)
                        : [...abilities, id],
                    })
                  }
                />
                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
              </label>
            );
          })}
        </div>
        {abilities.includes("hedgefoot") && (
          <label className="companion-field">
            Modo de Hedgefoot
            <RuleSelect
              value={hedgefoot}
              onChange={(value) => save({ hedgefoot: value })}
              options={[
                {
                  value: "water",
                  label: "Correr sobre água no Deslocamento normal",
                },
                {
                  value: "climb",
                  label: "Escalar a três vezes o Deslocamento",
                },
                { value: "fly", label: "Voar uma vez por cena" },
              ]}
            />
          </label>
        )}
      </article>
    );
  }
  const form = String(configuration.form ?? "animal"),
    rank = merit.dots >= 4 ? 2 : 1,
    animalId = String(configuration.animalId ?? ANIMALS[0]?.id ?? ""),
    animal = ANIMALS.find((item) => item.id === animalId),
    numina = stringList(configuration.numina),
    numinaLimit = rank === 1 ? 3 : 5;
  return (
    <article className="companion-card merit-companion companion-config">
      <header>
        <div>
          <strong>{name}</strong>
          <small>Familiar · entidade efêmera de Rank {rank}</small>
        </div>
      </header>
      <div className="companion-form-grid">
        <label>
          Nome
          <Input
            value={name}
            onChange={(event) => save({ name: event.target.value })}
          />
        </label>
        <label>
          Forma
          <RuleSelect
            value={form}
            onChange={(value) => save({ form: value })}
            options={[
              { value: "animal", label: "Animal" },
              { value: "object", label: "Objeto" },
            ]}
          />
        </label>
        {form === "animal" ? (
          <label>
            Animal
            <RuleSelect
              value={animalId}
              onChange={(value) => save({ animalId: value })}
              options={ANIMALS.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </label>
        ) : (
          <label>
            Objeto
            <Input
              value={String(configuration.object ?? "")}
              onChange={(event) => save({ object: event.target.value })}
              placeholder="Descrição do fetiche"
            />
          </label>
        )}
        <label>
          Power
          <Input
            type="number"
            min={1}
            max={rank === 1 ? 5 : 7}
            value={String(configuration.power ?? rank + 2)}
            onChange={(event) => save({ power: event.target.value })}
          />
        </label>
        <label>
          Finesse
          <Input
            type="number"
            min={1}
            max={rank === 1 ? 5 : 7}
            value={String(configuration.finesse ?? rank + 2)}
            onChange={(event) => save({ finesse: event.target.value })}
          />
        </label>
        <label>
          Resistance
          <Input
            type="number"
            min={1}
            max={rank === 1 ? 5 : 7}
            value={String(configuration.resistance ?? rank + 2)}
            onChange={(event) => save({ resistance: event.target.value })}
          />
        </label>
        <label>
          Influência
          <Input
            value={String(configuration.influence ?? "")}
            onChange={(event) => save({ influence: event.target.value })}
            placeholder={`Nome · ${rank} ponto(s)`}
          />
        </label>
        <label>
          Ban
          <Input
            value={String(configuration.ban ?? "")}
            onChange={(event) => save({ ban: event.target.value })}
          />
        </label>
        <label>
          Bane
          <Input
            value={String(configuration.bane ?? "")}
            onChange={(event) => save({ bane: event.target.value })}
          />
        </label>
      </div>
      {form === "animal" && animal && (
        <AnimalCard
          animal={animal}
          name={name}
          onRemove={() => save({ form: "object", animalId: "" })}
        />
      )}
      <strong>
        Numina ({numina.length}/{numinaLimit})
      </strong>
      <div className="companion-options numina-options">
        {alphabetical(FAMILIAR_NUMINA, item => item).map((item) => {
          const active = numina.includes(item);
          return (
            <label key={item} className={active ? "selected" : ""}>
              <input
                type="checkbox"
                checked={active}
                disabled={!active && numina.length >= numinaLimit}
                onChange={() =>
                  save({
                    numina: active
                      ? numina.filter((value) => value !== item)
                      : [...numina, item],
                  })
                }
              />
              <span>
                <strong>{item}</strong>
              </span>
            </label>
          );
        })}
      </div>
      <p className="combat-note">
        Rank {rank}: máximo de Atributo {rank === 1 ? 5 : 7}, Influência {rank}{" "}
        e até {numinaLimit} Numina. Complete Ban e Bane conforme a natureza da
        entidade.
      </p>
    </article>
  );
}
function AnimalCard({
  animal,
  name,
  onRemove,
}: {
  animal: Animal;
  name?: string;
  onRemove: () => void;
}) {
  return (
    <article className="companion-card">
      <header>
        <div>
          <strong>{name || animal.name}</strong>
          <small>{name ? animal.name : "Companheiro animal"}</small>
        </div>
        <Button type="button" size="icon" variant="ghost" onClick={onRemove}>
          <X />
        </Button>
      </header>
      <p>
        <b>Atributos:</b> {animal.attributes}
      </p>
      <p>
        <b>Perícias:</b> {animal.skills}
      </p>
      <CompactValues
        values={{
          "Força de Vontade": animal.willpower,
          Iniciativa: animal.initiative,
          Defesa: animal.defense,
          Tamanho: animal.size,
          Vitalidade: animal.health,
        }}
      />
      <p>
        <b>Deslocamento:</b> {animal.speed}
      </p>
      <p>
        <b>Ataques:</b>{" "}
        {animal.attacks.length
          ? animal.attacks
              .map(
                (item) =>
                  `${item.name} ${item.damage} (${item.pool} dados)${item.note ? ` — ${item.note}` : ""}`,
              )
              .join("; ")
          : "Nenhum"}
      </p>
      {animal.special && (
        <p>
          <b>Especial:</b> {animal.special}
        </p>
      )}
    </article>
  );
}
function signed(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}
function HealthTrack({
  health,
  damage,
  onChange,
}: {
  health: number;
  damage: DamageLevel[];
  onChange: (value: DamageLevel[]) => void;
}) {
  const penalty = woundPenalty(damage, health);
  const cycle = (index: number) => {
    const slots: Array<DamageLevel | undefined> = Array.from(
      { length: health },
      (_, slot) => damage[slot],
    );
    const current = slots[index];
    slots[index] =
      current === "bashing"
        ? "lethal"
        : current === "lethal"
          ? "aggravated"
          : current === "aggravated"
            ? undefined
            : "bashing";
    onChange(normalizeDamage(slots, health));
  };
  return (
    <div className="tracker-block">
      <div
        className="health-track"
        role="group"
        aria-label={`Vitalidade: ${damage.length} de ${health} caixas marcadas`}
      >
        {Array.from({ length: health }, (_, index) => {
          const level = damage[index];
          return (
            <button
              type="button"
              key={index}
              className={`health-box ${level ?? "empty"}`}
              onClick={() => cycle(index)}
              aria-label={`Caixa ${index + 1}: ${damageLabel(level)}. Clique para alterar.`}
            >
              <span aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="tracker-meta">
        <span>
          {damage.length}/{health} marcadas
        </span>
        <strong className={penalty < 0 ? "penalty" : ""}>
          Penalidade {penalty || "—"}
        </strong>
      </div>
      <p className="tracker-help">
        <span className="legend-mark bashing" />
        Contusão <span className="legend-mark lethal" />
        Letal <span className="legend-mark aggravated" />
        Agravado · clique para alternar
      </p>
    </div>
  );
}
function ClarityTrack({
  maximum,
  damage,
  onChange,
}: {
  maximum: number;
  damage: ClarityDamageLevel[];
  onChange: (value: ClarityDamageLevel[]) => void;
}) {
  const { tr } = useLanguage();
  const current = Math.max(0, maximum - damage.length);
  const cycle = (index: number) => {
    const slots: Array<ClarityDamageLevel | undefined> = Array.from(
      { length: maximum },
      (_, slot) => damage[slot],
    );
    const level = slots[index];
    slots[index] =
      level === "mild" ? "severe" : level === "severe" ? undefined : "mild";
    onChange(normalizeClarityDamage(slots, maximum));
  };
  return (
    <div className="tracker-block clarity-block">
      <div
        className="health-track clarity-track"
        role="group"
        aria-label={tr(`Lucidez atual ${current} de ${maximum}`, `Current Clarity ${current} of ${maximum}`)}
      >
        {Array.from({ length: maximum }, (_, index) => {
          const level = damage[index];
          return (
            <button
              type="button"
              key={index}
              className={`health-box clarity-box ${level ?? "empty"}`}
              onClick={() => cycle(index)}
              aria-label={tr(`Caixa ${index + 1}: ${level === "mild" ? "dano leve" : level === "severe" ? "dano grave" : "vazia"}. Clique para alterar.`, `Box ${index + 1}: ${level === "mild" ? "mild damage" : level === "severe" ? "severe damage" : "empty"}. Press to change.`)}
            >
              <span aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="clarity-numbers" aria-hidden="true">
        {Array.from({ length: maximum }, (_, index) => (
          <span key={index}>{index === 0 ? "" : index}</span>
        ))}
      </div>
      <div className="tracker-meta">
        <span>{tr("Lucidez atual", "Current Clarity")}</span>
        <strong>
          {current} / {maximum}
        </strong>
      </div>
      <p className="tracker-help">
        <span className="legend-mark mild" />
        {tr("Leve", "Mild")} <span className="legend-mark severe" />
        {tr("Grave · as três caixas à direita podem gerar Condições de Lucidez", "Severe · the three rightmost boxes may cause Clarity Conditions")}
      </p>
    </div>
  );
}
type SelectedCondition = { id: string; persistent: boolean };
function ConditionManager({
  selected,
  catalog,
  onChange,
}: {
  selected: SelectedCondition[];
  catalog: typeof CHANGELING_CONDITIONS;
  onChange: (value: SelectedCondition[]) => void;
}) {
  const {locale,tr}=useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const chosen = new Map(selected.map((item) => [item.id, item]));
  const categories = [
    "Todas",
    ...Array.from(new Set(catalog.map((item) => item.category))),
  ];
  const conditionName=(item:(typeof catalog)[number])=>locale==="en-US"?item.originalName:item.name;
  const filtered = alphabetical(catalog, conditionName,locale).filter(
    (condition) =>
      (category === "Todas" || condition.category === category) &&
      `${condition.name} ${condition.originalName} ${condition.description} ${condition.penalty ?? ""} ${condition.sourceCode}`
        .toLocaleLowerCase("pt-BR")
        .includes(search.toLocaleLowerCase("pt-BR")),
  );
  const find = (id: string) =>
    catalog.find((item) => item.id === id) ??
    findChangelingCondition(id) ??
    findMageCondition(id);
  return (
    <div className="condition-manager">
      <div className="selected-conditions">
        {selected.map((saved) => {
          const condition = find(saved.id);
          if (!condition) return null;
          const inlinePenalty =
            condition.penalty && condition.penalty.length <= 82;
          const tooltip = `${condition.description}${condition.penalty ? `\n${tr("Efeito","Effect")}: ${condition.penalty}` : ""}\n${tr("Resolução","Resolution")}: ${condition.resolution ?? "—"}${condition.beat ? `\nBeat: ${condition.beat}` : ""}\n${condition.source} · p. ${condition.page}`;
          return (
            <div
              key={condition.id}
              className="selected-condition"
              title={tooltip}
            >
              <span>
                <strong>
                  {conditionName(condition)}
                  {saved.persistent ? " [P]" : ""}
                </strong>
                {inlinePenalty && <>. {condition.penalty}</>}
                <small>
                  {condition.sourceCode} · p. {condition.page}
                  {condition.penalty && !inlinePenalty
                    ? tr(" · passe o mouse para ver efeitos, resolução e Beats"," · open for effects, resolution, and Beats")
                    : ""}
                </small>
              </span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() =>
                  onChange(selected.filter((item) => item.id !== condition.id))
                }
                aria-label={`${tr("Remover","Remove")} ${conditionName(condition)}`}
              >
                <X />
              </Button>
            </div>
          );
        })}
        {!selected.length && <em>{tr("Nenhuma Condição selecionada.","No Conditions selected.")}</em>}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" size="sm" variant="outline">
            <Plus /> {tr("Selecionar Condição","Select Condition")}
          </Button>
        </DialogTrigger>
        <DialogContent className="condition-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar Condição","Select Condition")}</DialogTitle>
            <DialogDescription>
              {tr("Escolha uma Condição e marque-a como Persistente quando necessário.","Choose a Condition and mark it Persistent when needed.")}
            </DialogDescription>
          </DialogHeader>
          <div className="condition-filters">
            <label>
              <Search />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={tr("Buscar por nome, efeito ou fonte","Search by name, effect, or source")}
              />
            </label>
            <RuleSelect
              value={categories.includes(category) ? category : "Todas"}
              onChange={setCategory}
              options={categories.map((value) => ({ value, label: value }))}
            />
          </div>
          <div className="condition-catalog">
            {filtered.map((condition) => {
              const saved = chosen.get(condition.id);
              return (
                <article key={condition.id} className={saved ? "selected" : ""}>
                  <div>
                    <strong>
                      {conditionName(condition)}
                      {saved?.persistent ? " [P]" : ""}
                    </strong>
                    <small>
                      {condition.originalName} · {condition.sourceCode} · p.{" "}
                      {condition.page}
                    </small>
                  </div>
                  <p>{condition.description}</p>
                  {condition.penalty && (
                    <p className="condition-penalty">
                      <b>{tr("Efeito","Effect")}:</b> {condition.penalty}
                    </p>
                  )}
                  <p>
                    <b>{tr("Resolução","Resolution")}:</b>{" "}
                    {condition.resolution ?? tr("Conforme a fonte indicada.","As described in the listed source.")}
                  </p>
                  {condition.beat && (
                    <p>
                      <b>Beat:</b> {condition.beat}
                    </p>
                  )}
                  <label className="persistent-toggle">
                    <input
                      type="checkbox"
                      checked={
                        saved?.persistent ?? condition.persistent ?? false
                      }
                      onChange={(event) => {
                        const persistent = event.target.checked;
                        onChange(
                          saved
                            ? selected.map((item) =>
                                item.id === condition.id
                                  ? { ...item, persistent }
                                  : item,
                              )
                            : [...selected, { id: condition.id, persistent }],
                        );
                      }}
                    />{" "}
                    {tr("Persistente","Persistent")} [P]
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant={saved ? "ghost" : "outline"}
                    onClick={() =>
                      onChange(
                        saved
                          ? selected.filter((item) => item.id !== condition.id)
                          : [
                              ...selected,
                              {
                                id: condition.id,
                                persistent: condition.persistent ?? false,
                              },
                            ],
                      )
                    }
                  >
                    {saved ? tr("Remover","Remove") : tr("Adicionar","Add")}
                  </Button>
                </article>
              );
            })}
            {!filtered.length && <em>{tr("Nenhuma Condição encontrada.","No Conditions found.")}</em>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">{tr("Concluir","Done")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function NotesArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const {tr}=useLanguage();
  return (
    <div className="notes-area">
      <Textarea
        key={value}
        defaultValue={value}
        onBlur={(event) => onChange(event.target.value)}
        placeholder={tr("Escreva livremente suas anotações...","Write your notes freely...")}
        aria-label={tr("Anotações da ficha","Character notes")}
      />
      <small>{tr("Salvo automaticamente ao sair do campo.","Saved automatically when leaving the field.")}</small>
    </div>
  );
}
type ExperienceUndo =
  | {
      kind: "trait";
      group: "attributes" | "skills";
      name: string;
      previous: number;
    }
  | {
      kind: "merit";
      name: string;
      previousDots: number | null;
      instanceIndex?: number;
      instanceId?: string;
    }
  | { kind: "specialty"; skill: string; name: string }
  | { kind: "contract"; id: string }
  | { kind: "benefit"; contractId: string; seeming: string }
  | { kind: "clause"; contractId: string; courtId: string }
  | { kind: "wyrd"; previous: number }
  | { kind: "clarityGain" }
  | { kind: "willpower"; previousLost: number }
  | { kind: "willpowerLoss"; previousLost: number };
type ExperienceEntry = {
  id: string;
  kind: "spend";
  description: string;
  experience: number;
  createdAt: string;
  undo?: ExperienceUndo;
};
const PURCHASE_TYPES = [
  "Atributo",
  "Perícia",
  "Mérito",
  "Especialização",
  "Contrato",
  "Benefício de Contrato",
  "Fado",
  "Ponto perdido de Força de Vontade",
];
const groupedTraitOptions = (
  groups: Record<string, readonly string[]>,
) =>
  Object.entries(groups).flatMap(([group, values]) =>
    values.map((value) => ({ value, label: value, group })),
  );
const ATTRIBUTE_OPTIONS = groupedTraitOptions(ATTRIBUTES);
const SKILL_OPTIONS = groupedTraitOptions(SKILLS);

function ExperiencePanel({
  character,
  updateSheet,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const {locale,tr}=useLanguage();
  const homebrews = useHomebrews();
  const contractsCatalog = [...CONTRACTS.filter(item=>!isBuiltinHomebrew(item.sourceId)||isHomebrewActive(homebrews,item.sourceId)).map(item=>contractWithSupplementalBenefits(item,isHomebrewActive(homebrews,"h-seemings")?["h-seemings"]:[])), ...homebrews.contracts.filter(item=>isHomebrewActive(homebrews,item.id))];
  const state = character.current_state ?? {};
  const beats = boundedNumber(state.experience_beats, 5, 0);
  const legacyTotal = Math.max(
    0,
    Math.trunc(Number(state.experience_total ?? 0) || 0),
  );
  const spentXp = Math.max(
    0,
    Math.trunc(Number(state.experience_spent ?? 0) || 0),
  );
  const available = Math.max(
    0,
    Math.trunc(
      Number(
        state.experience_available ?? Math.max(0, legacyTotal - spentXp),
      ) || 0,
    ),
  );
  const total = available + spentXp;
  const history = (
    Array.isArray(state.experience_history)
      ? (state.experience_history as ExperienceEntry[])
      : []
  ).filter((entry) => entry.kind === "spend");
  const [experienceInput, setExperienceInput] = useState(String(available));
  const [purchaseType, setPurchaseType] = useState(PURCHASE_TYPES[0]);
  const [attribute, setAttribute] = useState<string>(
    Object.values(ATTRIBUTES).flat()[0],
  );
  const [skill, setSkill] = useState<string>(Object.values(SKILLS).flat()[0]);
  const [meritId, setMeritId] = useState("");
  const [meritDots, setMeritDots] = useState(0);
  const [meritInstance, setMeritInstance] = useState(-1);
  const [specialtySkill, setSpecialtySkill] = useState<string>(
    Object.values(SKILLS).flat()[0],
  );
  const [specialtyName, setSpecialtyName] = useState("");
  const [contractId, setContractId] = useState("");
  const [benefitKey, setBenefitKey] = useState("");
  const [feedback, setFeedback] = useState("");
  const merits = [
    ...getMeritsForLine("CtL").filter(item=>!isBuiltinHomebrew(item.sourceId)||isHomebrewActive(homebrews,item.sourceId)),
    ...homebrews.merits.filter(
      (item) => (item.line === "Core" || item.line === "CtL") && isHomebrewActive(homebrews,item.id),
    ),
  ];
  const ownedContracts = [
    ...objectList(character.line_data.contracts),
    ...objectList(character.line_data.learned_contracts),
  ];
  const ownedContractIds = new Set(
    ownedContracts.map((item) => String(item.id ?? "")),
  );
  const contractOptions = contractsCatalog.filter(
    (item) => !ownedContractIds.has(item.id),
  );
  const extraBenefits = objectList(character.line_data.extra_contract_benefits);
  const extraKeys = new Set(
    extraBenefits.map(
      (item) => `${String(item.contractId)}::${String(item.seeming)}`,
    ),
  );
  const extraClauses = objectList(character.line_data.extra_contract_clauses);
  const extraClauseKeys = new Set(extraClauses.map((item) => `${String(item.contractId)}::${String(item.courtId)}`));
  const goodwill = new Map(objectList(character.line_data.court_goodwill_benefits).map((item) => [String(item.court), Number(item.dots ?? 0)]));
  const currentCourtId = courtCanonicalId(character.line_data.court);
  const benefitOptions = ownedContracts.flatMap((saved) => {
    const definition = findContract(String(saved.id ?? saved.name ?? ""));
    if (!definition) return [];
    const seemingOptions = Object.keys(definition.seemingBenefits ?? {})
          .filter(
            (seeming) =>
              seeming !== String(character.line_data.seeming) &&
              !extraKeys.has(`${definition.id}::${seeming}`),
          )
          .map((seeming) => ({
            value: `benefit::${definition.id}::${seeming}`,
            label: `${definition.name} · ${seemingDisplayName(seeming,locale)}`,
          }));
    const clauseOptions = availableForeignClauseCourtIds(definition, currentCourtId, goodwill, extraClauseKeys)
      .map((courtId) => ({ value: `clause::${definition.id}::${courtId}`, label: `${definition.name} · Clause: ${courtDisplayName(courtId, locale)}` }));
    return [...seemingOptions, ...clauseOptions];
  });
  const selectedMerit = merits.find((item) => item.id === meritId) ?? merits[0];
  const ownedMerit =
    meritInstance >= 0 &&
    character.merits[meritInstance]?.name === selectedMerit?.name
      ? character.merits[meritInstance]
      : selectedMerit && !isRepeatableDefinition(selectedMerit)
        ? character.merits.find(
            (item) => item.name === selectedMerit.name && !item.grantedBy,
          )
        : undefined;
  const availableMeritRatings = selectedMerit
    ? meritRatingsFor(selectedMerit).filter(
        (rating) => rating > (ownedMerit?.dots ?? 0),
      )
    : [];
  const nextMeritRating = availableMeritRatings.includes(meritDots)
    ? meritDots
    : availableMeritRatings[0];
  const selectedContract =
    contractsCatalog.find((item) => item.id === contractId) ?? contractOptions[0];
  const wyrd = Math.max(1, Number(character.line_data.wyrd ?? 1));
  const traitMaximum = Math.max(5, wyrd);
  const lostWillpower = boundedNumber(
    state.willpower_lost_dots,
    Math.max(0, Number(character.derived.ForçaDeVontade ?? 1) - 1),
    0,
  );

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setExperienceInput(String(available)), [available]);
  function setBeats(value: number) {
    const next = structuredClone(character);
    next.current_state = {
      ...next.current_state,
      experience_beats: value,
      experience_history: history,
    };
    updateSheet(next);
  }
  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>(
      `input[name="beats-${character.id}"]`,
    );
    const fieldset = input?.closest("fieldset");
    if (!fieldset) return;
    const click = (event: Event) => {
      const label = (event.target as HTMLElement).closest("label");
      if (!label || !fieldset.contains(label)) return;
      event.preventDefault();
      const labels = [...fieldset.querySelectorAll("label")];
      const index = labels.indexOf(label);
      const next = structuredClone(character);
      next.current_state = {
        ...next.current_state,
        experience_beats: index < beats ? index : index + 1,
        experience_history: history,
      };
      updateSheet(next);
    };
    fieldset.addEventListener("click", click);
    return () => fieldset.removeEventListener("click", click);
  }, [beats, character, history, updateSheet]);
  function commitAvailableExperience() {
    const value = Math.max(0, Math.trunc(Number(experienceInput) || 0));
    setExperienceInput(String(value));
    const next = structuredClone(character);
    next.current_state = {
      ...next.current_state,
      experience_available: value,
      experience_spent: spentXp,
      experience_total: value + spentXp,
      experience_history: history,
    };
    updateSheet(next);
    setFeedback("Experiência disponível atualizada.");
  }
  function append(entry: ExperienceEntry, nextState: Record<string, unknown>) {
    nextState.experience_history = [entry, ...history].slice(0, 100);
  }
  function markWillpowerLoss() {
    const maximum = Math.max(
      0,
      Number(character.derived.ForçaDeVontade ?? 1) - 1,
    );
    if (lostWillpower >= maximum) return;
    const next = structuredClone(character);
    const nextState = {
      ...next.current_state,
      willpower_lost_dots: lostWillpower + 1,
    };
    append(
      {
        id: crypto.randomUUID(),
        kind: "spend",
        description: "Perda permanente de um ponto de Força de Vontade",
        experience: 0,
        createdAt: new Date().toISOString(),
        undo: { kind: "willpowerLoss", previousLost: lostWillpower },
      },
      nextState,
    );
    next.current_state = nextState;
    updateSheet(next);
    setFeedback(
      "Perda permanente de Força de Vontade registrada no histórico.",
    );
  }
  function gainClarity() {
    const next = structuredClone(character);
    next.current_state = changePermanentClarity(next.current_state, 1);
    append({
      id: crypto.randomUUID(),
      kind: "spend",
      description: "Ganho permanente de uma caixa de Lucidez",
      experience: 0,
      createdAt: new Date().toISOString(),
      undo: { kind: "clarityGain" },
    }, next.current_state);
    updateSheet(next);
    setFeedback("Uma caixa permanente de Lucidez adicionada, sem custo de EXP.");
  }
  function spend(
    cost: number,
    description: string,
    undo: ExperienceUndo,
    apply: (next: CharacterSheet) => void,
  ) {
    if (cost < 1 || available < cost) {
      setFeedback("Experiência disponível insuficiente para esta compra.");
      return;
    }
    const next = structuredClone(character);
    apply(next);
    const nextAvailable = available - cost;
    const nextSpent = spentXp + cost;
    const nextState = {
      ...next.current_state,
      experience_available: nextAvailable,
      experience_spent: nextSpent,
      experience_total: nextAvailable + nextSpent,
    };
    append(
      {
        id: crypto.randomUUID(),
        kind: "spend",
        description,
        experience: -cost,
        createdAt: new Date().toISOString(),
        undo,
      },
      nextState,
    );
    next.current_state = nextState;
    updateSheet(synchronizeMeritGrants(next));
    setFeedback(
      `${description} adquirido por ${cost} Experiência${cost === 1 ? "" : "s"}.`,
    );
  }
  function revertPurchase(entry: ExperienceEntry) {
    if (!history.some(item => item.id === entry.id)) return;
    if (!entry.undo)
      return setFeedback(
        "Esta compra antiga não contém dados suficientes para ser revertida.",
      );
    const next = structuredClone(character);
    const undo = entry.undo;
    if (undo.kind === "trait") next[undo.group][undo.name] = subtractDots(next[undo.group][undo.name], 1, undo.group === "attributes" ? 1 : 0);
    else if (undo.kind === "merit") {
      refundMeritDots(next, undo.name, Math.abs(entry.experience), undo.instanceId, undo.instanceIndex);
    } else if (undo.kind === "specialty") {
      const index = next.specializations
        .map((item) => `${item.skill}::${item.name}`)
        .lastIndexOf(`${undo.skill}::${undo.name}`);
      if (index >= 0) next.specializations.splice(index, 1);
    } else if (undo.kind === "contract")
      next.line_data = {
        ...next.line_data,
        learned_contracts: objectList(next.line_data.learned_contracts).filter(
          (item) => String(item.id) !== undo.id,
        ),
      };
    else if (undo.kind === "benefit")
      next.line_data = {
        ...next.line_data,
        extra_contract_benefits: objectList(
          next.line_data.extra_contract_benefits,
        ).filter(
          (item) =>
            !(
              String(item.contractId) === undo.contractId &&
              String(item.seeming) === undo.seeming
            ),
        ),
      };
    else if (undo.kind === "clause")
      next.line_data = {
        ...next.line_data,
        extra_contract_clauses: objectList(next.line_data.extra_contract_clauses).filter(
          (item) => !(String(item.contractId) === undo.contractId && String(item.courtId) === undo.courtId),
        ),
      };
    else if (undo.kind === "clarityGain") {
      next.current_state = changePermanentClarity(next.current_state, -1);
      const maximum = Number(derivedWithPermanentMerits(next).LucidezMaxima ?? 1);
      next.current_state.clarity_damage = normalizeClarityDamage(next.current_state.clarity_damage, maximum);
    }
    else if (undo.kind === "wyrd") {
      next.line_data = refundPowerRating(next, "wyrd");
      next.line_data.frailties = normalizeChangelingFrailties(next.line_data.frailties, Number(next.line_data.wyrd));
    }
    else
      next.current_state = {
        ...next.current_state,
        willpower_lost_dots: Math.max(0, Number(next.current_state.willpower_lost_dots ?? 0) + (undo.kind === "willpower" ? 1 : -1)),
      };
    const refund = Math.abs(entry.experience);
    const nextAvailable = available + refund;
    const nextSpent = Math.max(0, spentXp - refund);
    next.current_state = {
      ...next.current_state,
      experience_available: nextAvailable,
      experience_spent: nextSpent,
      experience_total: nextAvailable + nextSpent,
      experience_history: history.filter((item) => item.id !== entry.id),
    };
    recalculateCtlDerived(next);
    updateSheet(synchronizeMeritGrants(next));
    setFeedback(`${entry.description} foi revertido; ${refund} EXP devolvida.`);
  }
  function buy() {
    if (purchaseType === "Atributo") {
      const current = Number(character.attributes[attribute] ?? 1);
      if (current >= traitMaximum)
        return setFeedback(
          "Este Atributo já atingiu o máximo permitido pelo Fado.",
        );
      const target = current + 1;
      spend(
        4,
        `${attribute} ${target}`,
        {
          kind: "trait",
          group: "attributes",
          name: attribute,
          previous: current,
        },
        (next) => {
          next.attributes[attribute] = target;
          recalculateCtlDerived(next);
        },
      );
      return;
    }
    if (purchaseType === "Perícia") {
      const current = Number(character.skills[skill] ?? 0);
      if (current >= traitMaximum)
        return setFeedback(
          "Esta Perícia já atingiu o máximo permitido pelo Fado.",
        );
      const target = current + 1;
      spend(
        2,
        `${skill} ${target}`,
        { kind: "trait", group: "skills", name: skill, previous: current },
        (next) => {
          next.skills[skill] = target;
          recalculateCtlDerived(next);
        },
      );
      return;
    }
    if (purchaseType === "Mérito") {
      if (!selectedMerit || !nextMeritRating)
        return setFeedback("Este Mérito não possui outro nível disponível.");
      const current = ownedMerit?.dots ?? 0;
      const cost = nextMeritRating - current;
      const instanceId = ownedMerit?.instanceId ?? crypto.randomUUID();
      const targetIndex = ownedMerit
        ? character.merits.indexOf(ownedMerit)
        : character.merits.length;
      spend(
        cost,
        `${selectedMerit.translatedName} ${nextMeritRating}`,
        {
          kind: "merit",
          name: selectedMerit.name,
          previousDots: ownedMerit?.dots ?? null,
          instanceIndex: targetIndex,
          instanceId,
        },
        (next) => {
          const found = ownedMerit ? next.merits[targetIndex] : undefined;
          if (found && found.name === selectedMerit.name) {
            found.instanceId = instanceId;
            found.dots = nextMeritRating;
          } else
            next.merits.push({
              instanceId,
              name: selectedMerit.name,
              dots: nextMeritRating,
              sourceId: selectedMerit.sourceId,
              source: selectedMerit.source,
              configuration: {},
            });
        },
      );
      return;
    }
    if (purchaseType === "Especialização") {
      if (!specialtyName.trim())
        return setFeedback("Informe o nome da Especialização.");
      const name = specialtyName.trim();
      spend(
        1,
        `Especialização ${specialtySkill}: ${name}`,
        { kind: "specialty", skill: specialtySkill, name },
        (next) => next.specializations.push({ skill: specialtySkill, name }),
      );
      setSpecialtyName("");
      return;
    }
    if (purchaseType === "Contrato") {
      if (!selectedContract)
        return setFeedback("Não há Contrato disponível para esta compra.");
      const cost = contractExperienceCost(selectedContract, character);
      spend(
        cost,
        `Contrato ${selectedContract.name}`,
        { kind: "contract", id: selectedContract.id },
        (next) => {
          const learned = objectList(next.line_data.learned_contracts);
          next.line_data = {
            ...next.line_data,
            learned_contracts: [...learned, { ...selectedContract }],
          };
        },
      );
      return;
    }
    if (purchaseType === "Benefício de Contrato") {
      const value = benefitKey || benefitOptions[0]?.value;
      if (!value)
        return setFeedback("Não há Benefício ou Clause adicional disponível.");
      const [kind, chosenContract, choice] = value.split("::");
      const definition = findContract(chosenContract);
      const isClause = kind === "clause";
      spend(
        1,
        isClause ? `Clause de ${courtDisplayName(choice, locale)} · ${definition?.name ?? "Contrato"}` : `Benefício de ${seemingDisplayName(choice,locale)} · ${definition?.name ?? "Contrato"}`,
        isClause ? { kind: "clause", contractId: chosenContract, courtId: choice } : { kind: "benefit", contractId: chosenContract, seeming: choice },
        (next) => {
          next.line_data = {
            ...next.line_data,
            ...(isClause
              ? { extra_contract_clauses: [...objectList(next.line_data.extra_contract_clauses), { contractId: chosenContract, courtId: choice }] }
              : { extra_contract_benefits: [...objectList(next.line_data.extra_contract_benefits), { contractId: chosenContract, seeming: choice }] }),
          };
        },
      );
      return;
    }
    if (purchaseType === "Fado") {
      if (wyrd >= 10) return setFeedback("Fado já atingiu 10.");
      spend(5, `Fado ${wyrd + 1}`, { kind: "wyrd", previous: wyrd }, (next) => {
        next.line_data = { ...withPowerRating(next, "wyrd", wyrd + 1), frailties: normalizeChangelingFrailties(next.line_data.frailties, wyrd + 1) };
      });
      return;
    }
    if (!lostWillpower)
      return setFeedback(
        "O personagem não possui pontos permanentes de Força de Vontade perdidos.",
      );
    spend(
      1,
      "Recuperação de um ponto perdido de Força de Vontade",
      { kind: "willpower", previousLost: lostWillpower },
      (next) => {
        next.current_state = {
          ...next.current_state,
          willpower_lost_dots: lostWillpower - 1,
        };
      },
    );
  }
  const preview = purchasePreview({
    purchaseType,
    character,
    attribute,
    skill,
    selectedMerit,
    nextMeritRating,
    ownedMerit,
    selectedContract,
    specialtySkill,
    specialtyName,
    benefitKey: benefitKey || benefitOptions[0]?.value,
    wyrd,
    lostWillpower,
  });
  return (
    <section className="experience-panel">
      <div className="experience-title">
        <div>
          <span>{tr("Beats e Experiência","Beats and Experience")}</span>
          <small>{tr("Beats são marcados separadamente da Experiência","Beats are tracked separately from Experience")}</small>
        </div>
        <Badge variant="outline">{available} {tr("EXP disponível","XP available")}</Badge>
      </div>
      <div className="experience-totals">
        <label className="experience-input">
          <Input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={experienceInput}
            onChange={(event) => setExperienceInput(event.target.value)}
            onBlur={commitAvailableExperience}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            aria-label={tr("Experiência disponível","Available Experience")}
          />
          <span>{tr("EXP disponível","XP available")}</span>
        </label>
        <div>
          <strong>{total}</strong>
          <span>{tr("EXP total","Total XP")}</span>
        </div>
        <div>
          <strong>{spentXp}</strong>
          <span>{tr("EXP gasta","XP spent")}</span>
        </div>
      </div>
      <fieldset className="beat-controls">
        <legend>Beats</legend>
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          return (
            <label key={value} title={`${value} Beat${value === 1 ? "" : "s"}`}>
              <input
                type="radio"
                name={`beats-${character.id}`}
                checked={beats === value}
                onChange={() => setBeats(value)}
              />
              <span>{value}</span>
            </label>
          );
        })}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={!beats}
          onClick={() => setBeats(0)}
        >
          {tr("Limpar","Clear")}
        </Button>
      </fieldset>
      <div className="experience-actions">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              <Sparkles /> {tr("Comprar característica","Purchase trait")}
            </Button>
          </DialogTrigger>
          <DialogContent className="experience-dialog">
            <DialogHeader>
              <DialogTitle>{tr("Gastar Experiência","Spend Experience")}</DialogTitle>
              <DialogDescription>
                {tr("Custos de Changeling the Lost, p. 94. Cada compra registra automaticamente a despesa e atualiza a ficha.","Costs from Changeling: The Lost, p. 94. Each purchase records the expense and updates the character sheet.")}
              </DialogDescription>
            </DialogHeader>
            <div className="experience-purchase-form">
              <label>
                {tr("Tipo","Type")}
                <RuleSelect
                  value={purchaseType}
                  onChange={(value) => {
                    setPurchaseType(value);
                    setFeedback("");
                  }}
                  options={PURCHASE_TYPES.map((value) => ({
                    value,
                    label: value,
                  }))}
                />
              </label>
              {purchaseType === "Atributo" && (
                <label>
                  {tr("Atributo","Attribute")}
                  <RuleSelect
                    value={attribute}
                    onChange={setAttribute}
                    options={ATTRIBUTE_OPTIONS}
                  />
                </label>
              )}
              {purchaseType === "Perícia" && (
                <label>
                  {tr("Perícia","Skill")}
                  <RuleSelect
                    value={skill}
                    onChange={setSkill}
                    options={SKILL_OPTIONS}
                  />
                </label>
              )}
              {purchaseType === "Mérito" && (
                <label>
                  {tr("Mérito","Merit")}
                  <ExperienceMeritPicker
                    line="CtL"
                    character={character}
                    selectedId={meritId}
                    targetDots={nextMeritRating ?? 0}
                    onSelect={(id, dots, instance) => {
                      setMeritId(id);
                      setMeritDots(dots);
                      setMeritInstance(instance);
                    }}
                  />
                </label>
              )}
              {purchaseType === "Especialização" && (
                <>
                  <label>
                    {tr("Perícia","Skill")}
                    <RuleSelect
                      value={specialtySkill}
                      onChange={setSpecialtySkill}
                      options={SKILL_OPTIONS}
                    />
                  </label>
                  <label>
                    {tr("Especialização","Specialty")}
                    <Input
                      value={specialtyName}
                      onChange={(event) => setSpecialtyName(event.target.value)}
                      maxLength={80}
                    />
                  </label>
                </>
              )}
              {purchaseType === "Contrato" && (
                <label>
                  {tr("Contrato","Contract")}
                  <ExperiencePowerPicker
                    kind="Contrato"
                    items={contractOptions.map((item) => ({
                      id: item.id,
                      name: locale==="en-US"?item.originalName:item.name,
                      category: systemTerm(item.regalia,locale),
                      secondaryCategory: item.type==="Comum"?tr("Comum","Common"):tr("Real","Royal"),
                      description: contractOutcomeSections(item,locale).map(section=>section.text).join(" "),
                      meta: `${item.type==="Comum"?tr("Comum","Common"):tr("Real","Royal")} · ${systemTerm(item.regalia,locale)} · ${item.source} · p. ${item.page || "—"}`,
                    }))}
                    selectedId={selectedContract?.id ?? ""}
                    onSelect={setContractId}
                  />
                </label>
              )}
              {purchaseType === "Benefício de Contrato" && (
                <label>
                  {tr("Benefício","Benefit")}
                  <RuleSelect
                    value={benefitKey || benefitOptions[0]?.value || ""}
                    onChange={setBenefitKey}
                    options={benefitOptions}
                  />
                </label>
              )}
            </div>
            <div className="purchase-preview">
              <strong>{preview.label}</strong>
              <span>
                {preview.cost} {tr(preview.cost===1?"Experiência":"Experiências","Experience")}
              </span>
            </div>
            {feedback && <p className="experience-feedback">{feedback}</p>}
            <details className="experience-rules">
              <summary>{tr("Tabela completa e formas de ganhar Beats","Full table and ways to earn Beats")}</summary>
              <ExperienceRules />
            </details>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{tr("Fechar","Close")}</Button>
              </DialogClose>
              <Button
                type="button"
                disabled={preview.cost < 1 || available < preview.cost}
                onClick={buy}
              >
                {tr("Comprar por","Purchase for")} {preview.cost} {tr("EXP","XP")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="permanent-resource-actions">
          <Button type="button" variant="ghost" size="sm" onClick={gainClarity}>{tr("Ganhar Lucidez","Gain Clarity")}</Button>
          <span aria-hidden="true">|</span>
          <Button type="button" variant="ghost" size="sm" onClick={markWillpowerLoss}>{tr("Perder FV","Lose WP")}</Button>
        </div>
      </div>
      {feedback && <p className="experience-feedback compact">{feedback}</p>}
      <details className="experience-history">
        <summary>
          <History /> {tr("Gastos de Experiência","Experience Expenses")} ({history.length})
        </summary>
        <div>
          {history.length ? (
            history.slice(0, 12).map((entry) => (
              <p key={entry.id}>
                <span>{entry.description}</span>
                <strong>{Math.abs(entry.experience)} EXP</strong>
                <small>
                  {new Date(entry.createdAt).toLocaleDateString(locale)}
                </small>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!entry.undo}
                  onClick={() => revertPurchase(entry)}
                >
                  <RotateCcw /> {tr("Reverter","Refund")}
                </Button>
              </p>
            ))
          ) : (
            <em>{tr("Nenhum gasto registrado.","No expenses recorded.")}</em>
          )}
        </div>
      </details>
    </section>
  );
}

type MageXpSnapshot = {
  attributes: Record<string, number>;
  skills: Record<string, number>;
  merits: CharacterSheet["merits"];
  specializations: CharacterSheet["specializations"];
  line_data: Record<string, unknown>;
};
type MageXpEntry = {
  undo?: MageAdvancementUndo;
  id: string;
  description: string;
  regular: number;
  arcane: number;
  createdAt: string;
  before: MageXpSnapshot;
  previousLostWillpower?: number;
};
const MAGE_PURCHASES = [
  "Atributo",
  "Perícia",
  "Mérito",
  "Especialização",
  "Arcano",
  "Gnose",
  "Rota",
  "Práxis",
  "Sabedoria",
  "Ponto perdido de Força de Vontade",
];
function MageExperiencePanel({
  character,
  updateSheet,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const {locale,tr}=useLanguage();
  const homebrews = useHomebrews();
  const state = character.current_state ?? {};
  const regular = Math.max(
    0,
    Math.trunc(Number(state.mage_experience_available ?? 0) || 0),
  );
  const arcane = Math.max(
    0,
    Math.trunc(Number(state.arcane_experience_available ?? 0) || 0),
  );
  const spentRegular = Math.max(
    0,
    Math.trunc(Number(state.mage_experience_spent ?? 0) || 0),
  );
  const spentArcane = Math.max(
    0,
    Math.trunc(Number(state.arcane_experience_spent ?? 0) || 0),
  );
  const beats = boundedNumber(state.mage_experience_beats, 5, 0),
    arcaneBeats = boundedNumber(state.arcane_experience_beats, 5, 0);
  const maximumLostWillpower = Math.max(
    0,
    Number(character.derived.ForçaDeVontade ?? 1) - 1,
  );
  const lostWillpower = boundedNumber(
    state.willpower_lost_dots,
    maximumLostWillpower,
    0,
  );
  const history = Array.isArray(state.mage_experience_history)
    ? (state.mage_experience_history as MageXpEntry[])
    : [];
  const [regularInput, setRegularInput] = useState(String(regular)),
    [arcaneInput, setArcaneInput] = useState(String(arcane));
  const [purchase, setPurchase] = useState<string>(MAGE_PURCHASES[0]),
    [target, setTarget] = useState<string>(Object.values(ATTRIBUTES).flat()[0]);
  const [meritDots, setMeritDots] = useState(0);
  const [mageMeritInstance, setMageMeritInstance] = useState(-1);
  const [regularSplit, setRegularSplit] = useState(0),
    [feedback, setFeedback] = useState("");
  const merits = [...getMeritsForLine("MtA"), ...homebrews.merits.filter((item) => (item.line === "Core" || item.line === "MtA") && isHomebrewActive(homebrews,item.id))],
    spells = [...SPELLS, ...homebrews.spells.filter(item=>isHomebrewActive(homebrews,item.id))];
  const arcana = (
    character.line_data.arcana && typeof character.line_data.arcana === "object"
      ? character.line_data.arcana
      : {}
  ) as Record<string, number>;
  const path =
    MTA_PATHS[String(character.line_data.path) as keyof typeof MTA_PATHS];
  const knownSpellIds = new Set(
    [
      ...objectList(character.line_data.rotes),
      ...objectList(character.line_data.praxes),
      ...objectList(character.line_data.learned_rotes),
      ...objectList(character.line_data.learned_praxes),
    ].map((item) => String(item.id ?? "")),
  );
  const availableSpells = spells.filter(
    (spell) =>
      !knownSpellIds.has(spell.id) &&
      meetsArcanaRequirements(spell.requirements, arcana),
  );
  const options =
    purchase === "Atributo"
      ? Object.values(ATTRIBUTES).flat()
      : purchase === "Perícia" || purchase === "Especialização"
        ? Object.values(SKILLS).flat()
        : purchase === "Mérito"
          ? merits.map((item) => item.id)
          : purchase === "Arcano"
            ? Object.keys(arcana)
            : purchase === "Rota" || purchase === "Práxis"
              ? availableSpells.map((item) => item.id)
              : [purchase];
  const selectedMerit = merits.find((item) => item.id === target) ?? merits[0],
    ownedMerit =
      mageMeritInstance >= 0 &&
      character.merits[mageMeritInstance]?.name === selectedMerit?.name
        ? character.merits[mageMeritInstance]
        : selectedMerit && !isRepeatableDefinition(selectedMerit)
          ? character.merits.find(
              (item) => item.name === selectedMerit.name && !item.grantedBy,
            )
          : undefined,
    meritRatings = selectedMerit
      ? meritRatingsFor(selectedMerit).filter(
          (dot) => dot > (ownedMerit?.dots ?? 0),
        )
      : [],
    nextMerit = meritRatings.includes(meritDots) ? meritDots : meritRatings[0];
  const selectedSpell =
    availableSpells.find((item) => item.id === target) ?? availableSpells[0];
  let cost = 1,
    label: string = target,
    mode: "regular" | "arcane" | "either" = "regular";
  if (purchase === "Atributo") cost = 4;
  else if (purchase === "Perícia") cost = 2;
  else if (purchase === "Mérito") {
    cost = nextMerit ? nextMerit - (ownedMerit?.dots ?? 0) : 0;
    label = selectedMerit?.translatedName ?? "Mérito";
  } else if (purchase === "Arcano") {
    const current = Number(arcana[target] ?? 0);
    const ruling = path?.ruling.includes(target as never);
    const inferior = path?.inferior === target;
    const limit = ruling ? 5 : inferior ? 2 : 4;
    cost = current < limit ? 4 : 5;
    mode = current < limit ? "either" : "regular";
    label = `${target} ${current + 1}`;
  } else if (purchase === "Gnose") {
    cost = 5;
    mode = "either";
    label = `Gnose ${Number(character.line_data.gnosis ?? 1) + 1}`;
  } else if (purchase === "Rota") {
    cost = 1;
    label = selectedSpell?.name ?? "Rota";
  } else if (purchase === "Práxis") {
    cost = 1;
    mode = "arcane";
    label = selectedSpell?.name ?? "Práxis";
  } else if (purchase === "Sabedoria") {
    cost = 2;
    mode = "arcane";
    label = `Sabedoria ${Number(character.line_data.wisdom ?? 7) + 1}`;
  } else if (purchase === "Ponto perdido de Força de Vontade") {
    cost = lostWillpower ? 1 : 0;
    label = lostWillpower
      ? "Recuperar ponto perdido de Força de Vontade"
      : "Nenhum ponto perdido";
  }
  const splitRegular =
      mode === "regular"
        ? cost
        : mode === "arcane"
          ? 0
          : Math.min(cost, regularSplit),
    splitArcane =
      mode === "arcane" ? cost : mode === "regular" ? 0 : cost - splitRegular;
  const saveBalances = (patch: Record<string, unknown>) => {
    const next = structuredClone(character);
    next.current_state = { ...next.current_state, ...patch };
    updateSheet(next);
  };
  function commitBalances() {
    const r = Math.max(0, Math.trunc(Number(regularInput) || 0)),
      a = Math.max(0, Math.trunc(Number(arcaneInput) || 0));
    setRegularInput(String(r));
    setArcaneInput(String(a));
    saveBalances({
      mage_experience_available: r,
      arcane_experience_available: a,
      mage_experience_total: r + spentRegular,
      arcane_experience_total: a + spentArcane,
    });
  }
  function buy() {
    if (cost < 1 || regular < splitRegular || arcane < splitArcane) {
      setFeedback("Experiência insuficiente ou compra indisponível.");
      return;
    }
    const traitMaximum = Math.max(5, Number(character.line_data.gnosis ?? 1));
    if ((purchase === "Gnose" && Number(character.line_data.gnosis ?? 1) >= 10) ||
        (purchase === "Sabedoria" && Number(character.line_data.wisdom ?? 7) >= 10) ||
        (purchase === "Arcano" && Number(arcana[target] ?? 0) >= 10) ||
        (purchase === "Atributo" && Number(character.attributes[target] ?? 1) >= traitMaximum) ||
        (purchase === "Perícia" && Number(character.skills[target] ?? 0) >= traitMaximum))
      return setFeedback("Esta característica já atingiu seu limite de pontos.");
    if (
      (purchase === "Rota" || purchase === "Práxis") &&
      (!selectedSpell ||
        !meetsArcanaRequirements(selectedSpell.requirements, arcana))
    ) {
      setFeedback(
        "Não há feitiço disponível que atenda aos níveis atuais de Arcana.",
      );
      return;
    }
    const next = structuredClone(character);
    const before = {
      attributes: structuredClone(next.attributes),
      skills: structuredClone(next.skills),
      merits: structuredClone(next.merits),
      specializations: structuredClone(next.specializations),
      line_data: structuredClone(next.line_data),
    };
    if (purchase === "Atributo")
      next.attributes[target] = Number(next.attributes[target] ?? 1) + 1;
    else if (purchase === "Perícia")
      next.skills[target] = Number(next.skills[target] ?? 0) + 1;
    else if (purchase === "Mérito" && selectedMerit && nextMerit) {
      const found =
        mageMeritInstance >= 0
          ? next.merits[mageMeritInstance]
          : !isRepeatableDefinition(selectedMerit)
            ? next.merits.find(
                (item) => item.name === selectedMerit.name && !item.grantedBy,
              )
            : undefined;
      if (found && found.name === selectedMerit.name) found.dots = nextMerit;
      else
        next.merits.push({
          name: selectedMerit.name,
          dots: nextMerit,
          sourceId: selectedMerit.sourceId,
          source: selectedMerit.source,
          configuration: {},
        });
    } else if (purchase === "Especialização")
      next.specializations.push({ skill: target, name: "Nova Especialização" });
    else if (purchase === "Arcano")
      next.line_data = {
        ...next.line_data,
        arcana: { ...arcana, [target]: Number(arcana[target] ?? 0) + 1 },
      };
    else if (purchase === "Gnose")
      next.line_data = withPowerRating(next, "gnosis", Number(next.line_data.gnosis ?? 1) + 1);
    else if (purchase === "Rota" && selectedSpell)
      next.line_data = {
        ...next.line_data,
        learned_rotes: [
          ...objectList(next.line_data.learned_rotes),
          { ...selectedSpell, roteSkill: selectedSpell.roteSkills[0] },
        ],
      };
    else if (purchase === "Práxis" && selectedSpell)
      next.line_data = {
        ...next.line_data,
        learned_praxes: [
          ...objectList(next.line_data.learned_praxes),
          selectedSpell,
        ],
      };
    else if (purchase === "Sabedoria")
      next.line_data = {
        ...next.line_data,
        wisdom: Number(next.line_data.wisdom ?? 7) + 1,
      };
    else if (purchase === "Ponto perdido de Força de Vontade")
      next.current_state = {
        ...next.current_state,
        willpower_lost_dots: Math.max(
          0,
          Number(next.current_state.willpower_lost_dots ?? 0) - 1,
        ),
      };
    recalculateCtlDerived(next);
    let undo: MageAdvancementUndo;
    if (purchase === "Atributo" || purchase === "Perícia")
      undo = { kind: "trait", group: purchase === "Atributo" ? "attributes" : "skills", name: target };
    else if (purchase === "Arcano") undo = { kind: "arcana", name: target };
    else if (purchase === "Gnose") undo = { kind: "gnosis" };
    else if (purchase === "Sabedoria") undo = { kind: "wisdom" };
    else if (purchase === "Mérito") {
      const index = next.merits.findIndex((item, i) => item.name === selectedMerit.name && item.dots !== before.merits[i]?.dots);
      if (index < 0) return setFeedback("Não foi possível identificar o Mérito adquirido.");
      const instanceId = next.merits[index].instanceId ?? crypto.randomUUID();
      next.merits[index].instanceId = instanceId;
      undo = { kind: "merit", name: selectedMerit.name, dots: cost, instanceId };
    } else if (purchase === "Especialização") undo = { kind: "specialty", skill: target, name: "Nova Especialização" };
    else if (purchase === "Rota" || purchase === "Práxis")
      undo = { kind: "spell", key: purchase === "Rota" ? "learned_rotes" : "learned_praxes", id: selectedSpell.id };
    else undo = { kind: "willpower" };
    const entry: MageXpEntry = {
      undo,
      id: crypto.randomUUID(),
      description: label,
      regular: splitRegular,
      arcane: splitArcane,
      createdAt: new Date().toISOString(),
      before,
    };
    next.current_state = {
      ...next.current_state,
      mage_experience_available: regular - splitRegular,
      arcane_experience_available: arcane - splitArcane,
      mage_experience_spent: spentRegular + splitRegular,
      arcane_experience_spent: spentArcane + splitArcane,
      mage_experience_history: [entry, ...history].slice(0, 100),
    };
    updateSheet(synchronizeMeritGrants(next));
    setFeedback(`${label} adquirido.`);
  }
  function markWillpowerLoss() {
    if (lostWillpower >= maximumLostWillpower) {
      setFeedback(
        "Não é possível perder outro ponto permanente de Força de Vontade.",
      );
      return;
    }
    const next = structuredClone(character);
    const before = {
      attributes: structuredClone(next.attributes),
      skills: structuredClone(next.skills),
      merits: structuredClone(next.merits),
      specializations: structuredClone(next.specializations),
      line_data: structuredClone(next.line_data),
    };
    const entry: MageXpEntry = {
      id: crypto.randomUUID(),
      description: "Perda permanente de um ponto de Força de Vontade",
      undo: { kind: "willpowerLoss" },
      regular: 0,
      arcane: 0,
      createdAt: new Date().toISOString(),
      before,
      previousLostWillpower: lostWillpower,
    };
    next.current_state = {
      ...next.current_state,
      willpower_lost_dots: lostWillpower + 1,
      mage_experience_history: [entry, ...history].slice(0, 100),
    };
    updateSheet(next);
    setFeedback(
      "Perda permanente de Força de Vontade registrada no histórico.",
    );
  }
  function revert(entry: MageXpEntry) {
    if (!history.some(item => item.id === entry.id)) return;
    let undo = entry.undo;
    // Older purchases lack a delta record; recognize only unambiguous targets.
    if (!undo) {
      if (/^Gnose \d+$/.test(entry.description)) undo = { kind: "gnosis" };
      else if (/^Sabedoria \d+$/.test(entry.description)) undo = { kind: "wisdom" };
      else if (Object.values(ATTRIBUTES).flat().some(name => name === entry.description))
        undo = { kind: "trait", group: "attributes", name: entry.description };
      else if (Object.values(SKILLS).flat().some(name => name === entry.description) && entry.regular + entry.arcane === 2)
        undo = { kind: "trait", group: "skills", name: entry.description };
      else if (entry.previousLostWillpower !== undefined) undo = { kind: "willpowerLoss" };
      else if (entry.description === "Recuperar ponto perdido de Força de Vontade") undo = { kind: "willpower" };
      else {
        const arcanaName = Object.keys(arcana).find(name => entry.description.startsWith(`${name} `) && /^\d+$/.test(entry.description.slice(name.length + 1)));
        const merit = merits.find(item => item.translatedName === entry.description);
        const spell = spells.find(item => item.name === entry.description);
        if (arcanaName) undo = { kind: "arcana", name: arcanaName };
        else if (merit && character.merits.filter(item => item.name === merit.name && !item.grantedBy).length === 1)
          undo = { kind: "merit", name: merit.name, dots: entry.regular + entry.arcane };
        else if (spell) undo = { kind: "spell", id: spell.id, key: entry.arcane > 0 ? "learned_praxes" : "learned_rotes" };
        else if (Object.values(SKILLS).flat().some(name => name === entry.description))
          undo = { kind: "specialty", skill: entry.description, name: "Nova Especialização" };
      }
    }
    if (!undo) return setFeedback("Esta compra antiga não identifica com segurança o avanço a reembolsar.");
    const next = structuredClone(character);
    refundMageAdvancement(next, undo);
    next.current_state = {
      ...next.current_state,
      mage_experience_available: regular + entry.regular,
      arcane_experience_available: arcane + entry.arcane,
      mage_experience_spent: Math.max(0, spentRegular - entry.regular),
      arcane_experience_spent: Math.max(0, spentArcane - entry.arcane),
      mage_experience_history: history.filter((item) => item.id !== entry.id),
    };
    recalculateCtlDerived(next);
    updateSheet(synchronizeMeritGrants(next));
  }
  useEffect(() => {
    const handler = () => markWillpowerLoss();
    window.addEventListener("mage-willpower-loss", handler);
    return () => window.removeEventListener("mage-willpower-loss", handler);
  });
  return (
    <section className="experience-panel mage-experience">
      <div className="experience-title">
        <div>
          <span>{tr("Experiência","Experience")}</span>
          <small>{tr("Experiência comum e Arcana possuem reservas separadas","Regular and Arcane Experience use separate pools")}</small>
        </div>
      </div>
      <div className="mage-xp-balances">
        <label className="experience-input">
          <Input
            type="number"
            min={0}
            value={regularInput}
            onChange={(e) => setRegularInput(e.target.value)}
            onBlur={commitBalances}
          />
          <span>{tr("EXP disponível","XP available")}</span>
        </label>
        <label className="experience-input">
          <Input
            type="number"
            min={0}
            value={arcaneInput}
            onChange={(e) => setArcaneInput(e.target.value)}
            onBlur={commitBalances}
          />
          <span>{tr("EXP Arcana disponível","Arcane XP available")}</span>
        </label>
      </div>
      <BeatTrack
        label="Beats"
        value={beats}
        onChange={(value) => saveBalances({ mage_experience_beats: value })}
      />
      <BeatTrack
        label={tr("Beats Arcanos","Arcane Beats")}
        value={arcaneBeats}
        onChange={(value) => saveBalances({ arcane_experience_beats: value })}
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Sparkles /> {tr("Comprar característica","Purchase trait")}
          </Button>
        </DialogTrigger>
        <DialogContent className="experience-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Gastar Experiência de Mago","Spend Mage Experience")}</DialogTitle>
            <DialogDescription>
              {tr("Custos de Mage the Awakening, pp. 83–85. Para Gnose e Arcanos dentro do limite, escolha como dividir o gasto.","Costs from Mage: The Awakening, pp. 83–85. For Gnosis and Arcana within the limit, choose how to split the cost.")}
            </DialogDescription>
          </DialogHeader>
          <div className="experience-purchase-form">
            <label>
              {tr("Tipo","Type")}
              <RuleSelect
                value={purchase}
                onChange={(value) => {
                  setPurchase(value);
                  setTarget("");
                  setRegularSplit(0);
                }}
                options={MAGE_PURCHASES.map((value) => ({
                  value,
                  label: value,
                }))}
              />
            </label>
            {purchase === "Mérito" && (
              <label>
                {tr("Mérito","Merit")}
                <ExperienceMeritPicker
                  line="MtA"
                  character={character}
                  selectedId={selectedMerit?.id ?? ""}
                  targetDots={nextMerit ?? 0}
                  onSelect={(id, dots, instance) => {
                    setTarget(id);
                    setMeritDots(dots);
                    setMageMeritInstance(instance);
                  }}
                />
              </label>
            )}
            {purchase !== "Mérito" &&
              ((purchase === "Rota" || purchase === "Práxis") ||
                options.length > 1) && (
              <label>
                {tr("Característica","Trait")}
                {purchase === "Rota" || purchase === "Práxis" ? (
                  <ExperiencePowerPicker
                    kind={purchase}
                    items={availableSpells.map((spell) => {
                      const requirements = Object.entries(spell.requirements).sort(
                        (a, b) => b[1] - a[1],
                      );
                      const [mainArcanum, level] = requirements[0] ?? ["Outro", 0];
                      return {
                        id: spell.id,
                        name: locale==="en-US"?(spell.originalName||spell.name):spell.name,
                        category: systemTerm(mainArcanum,locale),
                        secondaryCategory: `${tr("Nível","Level")} ${level}`,
                        description: spell.description ?? "",
                        meta: `${formatSpellRequirements(spell.requirements)} · ${spell.source} · p. ${spell.page || "—"}`,
                      };
                    })}
                    selectedId={selectedSpell?.id ?? ""}
                    onSelect={setTarget}
                  />
                ) : (
                  <RuleSelect
                    value={target || options[0]}
                    onChange={setTarget}
                    options={
                      purchase === "Atributo"
                        ? ATTRIBUTE_OPTIONS
                        : purchase === "Perícia" || purchase === "Especialização"
                          ? SKILL_OPTIONS
                          : options.map((value) => ({ value, label: value }))
                    }
                  />
                )}
              </label>
            )}
            {mode === "either" && (
              <>
                <label>
                  {tr("Experiência comum","Regular Experience")}
                  <Input
                    type="number"
                    min={0}
                    max={cost}
                    value={regularSplit}
                    onChange={(e) =>
                      setRegularSplit(
                        Math.max(
                          0,
                          Math.min(cost, Number(e.target.value) || 0),
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  {tr("Experiência Arcana","Arcane Experience")}
                  <Input
                    type="number"
                    value={cost - Math.min(cost, regularSplit)}
                    readOnly
                  />
                </label>
              </>
            )}
          </div>
          <div className="purchase-preview">
            <strong>{label}</strong>
            <span>
              {splitRegular} {tr("EXP","XP")} + {splitArcane} {tr("EXP Arcana","Arcane XP")}
            </span>
          </div>
          {feedback && <p className="experience-feedback">{feedback}</p>}
          <details className="experience-rules">
            <summary>{tr("Tabela completa e formas de ganhar Beats","Full table and ways to earn Beats")}</summary>
            <MageExperienceRules />
          </details>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{tr("Fechar","Close")}</Button>
            </DialogClose>
            <Button
              type="button"
              disabled={
                cost < 1 || regular < splitRegular || arcane < splitArcane
              }
              onClick={buy}
            >
              {tr("Comprar","Purchase")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <details className="experience-history">
        <summary>
          <History /> {tr("Gastos de Experiência","Experience Expenses")} ({history.length})
        </summary>
        <div>
          {history.length ? (
            history.map((entry) => (
              <p key={entry.id}>
                <span>{entry.description}</span>
                <strong>
                  {entry.regular} + {entry.arcane} Arcana
                </strong>
                <small>
                  {new Date(entry.createdAt).toLocaleDateString(locale)}
                </small>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => revert(entry)}
                >
                  <RotateCcw /> {tr("Reverter","Refund")}
                </Button>
              </p>
            ))
          ) : (
            <em>{tr("Nenhum gasto registrado.","No expenses recorded.")}</em>
          )}
        </div>
      </details>
    </section>
  );
}
function BeatTrack({
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
      {label === "Beats Arcanos" && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="mage-willpower-loss"
          onClick={() => window.dispatchEvent(new Event("mage-willpower-loss"))}
        >
          {tr("Registrar perda permanente de FV", "Record permanent Willpower loss")}
        </Button>
      )}
    </div>
  );
}
function MageExperienceRules() {
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
    <div className="experience-rules-grid">
      <table>
        <caption>{tr("Beats comuns e Arcanos", "Regular and Arcane Beats")}</caption>
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
      </table>
      <table>
        <caption>{tr("Custos", "Costs")}</caption>
        <tbody>
          {costs.map(([a, b]) => (
            <tr key={a}>
              <td>{a}</td>
              <td>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
type ExperienceCatalogItem = {
  id: string;
  name: string;
  category: string;
  secondaryCategory?: string;
  description: string;
  meta: string;
};

function ExperiencePowerPicker({
  kind,
  items,
  selectedId,
  onSelect,
}: {
  kind: "Contrato" | "Rota" | "Práxis";
  items: ExperienceCatalogItem[];
  selectedId: string;
  onSelect: (id: string) => void;
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
  const visible = alphabetical(items, item => item.name,locale).filter(
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
        <Button type="button" variant="outline" className="experience-merit-trigger">
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

function ExperienceMeritPicker({
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
  const meritName=(item:MeritDefinition)=>locale==="en-US"?item.name:item.translatedName;
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
                      (!owned.grantedBy ||
                        (line === "CtL" &&
                          owned.name === "Mantle" &&
                          owned.grantedBy === "Corte")),
                  ),
                repeatable = isRepeatableDefinition(item),
                ratings = meritRatingsFor(item);
              if (item.name === "Mantle" && !instances.length) return null;
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
                    <p>{item.description}</p>
                    {item.prerequisites && (
                      <p>
                        <b>{tr("Pré-requisitos","Prerequisites")}:</b> {item.prerequisites}
                      </p>
                    )}
                  </div>
                  <div className="experience-merit-choice">
                    {instances.map(({ owned, index }, instanceNumber) =>
                      ratings
                        .filter((dot) => dot > owned.dots)
                        .map((dot) => (
                          <DialogClose asChild key={`${index}-${dot}`}>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => onSelect(item.id, dot, index)}
                            >
                              {tr("Aumentar","Raise")}{" "}
                              {meritConfigurationTitle(owned.configuration) ||
                                `${tr("instância","instance")} ${instanceNumber + 1}`}{" "}
                              {tr("para","to")} {dot}
                            </Button>
                          </DialogClose>
                        )),
                    )}
                    {item.name !== "Mantle" && (repeatable || !instances.length) &&
                      ratings.map((dot) => (
                        <DialogClose asChild key={`new-${dot}`}>
                          <Button
                            type="button"
                            size="sm"
                            variant={
                              selectedId === item.id && targetDots === dot
                                ? "default"
                                : "outline"
                            }
                            onClick={() => onSelect(item.id, dot, -1)}
                          >
                            {repeatable && instances.length
                              ? tr("Nova instância · ","New instance · ")
                              : ""}
                            {dot} {tr(dot===1?"ponto":"pontos",dot===1?"dot":"dots")}
                          </Button>
                        </DialogClose>
                      ))}
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
function RuleSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; group?: string }>;
}) {
  const {locale}=useLanguage();
  const safe = options.length ? value || options[0].value : "__none";
  // These two lists deliberately follow the character sheet's trait groups.
  if (options !== ATTRIBUTE_OPTIONS && options !== SKILL_OPTIONS) {
    options = alphabetical(options, item => systemTerm(item.label,locale),locale);
  }
  const groups = [...new Set(options.map((item) => item.group).filter(Boolean))];
  return (
    <Select value={safe} onValueChange={onChange} disabled={!options.length}>
      <SelectTrigger>
        <SelectValue>
          {systemTerm(options.find((item) => item.value === safe)?.label ??
            "Nenhuma opção disponível",locale)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.length ? (
          groups.length ? (
            groups.map((group, groupIndex) => (
              <SelectGroup key={group}>
                {groupIndex > 0 && <SelectSeparator />}
                <SelectLabel>{systemTerm(group!,locale)}</SelectLabel>
                {options
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {systemTerm(item.label,locale)}
                    </SelectItem>
                  ))}
              </SelectGroup>
            ))
          ) : (
            options.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {systemTerm(item.label,locale)}
              </SelectItem>
            ))
          )
        ) : (
          <SelectItem value="__none" disabled>
            {systemTerm("Nenhuma opção disponível",locale)}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
function isRepeatableDefinition(definition: MeritDefinition) {
  return (
    REPEATABLE_MERITS.has(definition.name) ||
    Boolean((definition as MeritDefinition & { repeatable?: boolean }).repeatable)
  );
}
function formatSpellRequirements(requirements: Record<string, number>) {
  return Object.entries(requirements)
    .map(([arcanum, dots]) => `${arcanum} ${dots}`)
    .join(" + ");
}
function contractExperienceCost(
  contract: ContractDefinition,
  character: CharacterSheet,
) {
  if (contract.goblin) return 2;
  const favored = [
    String(character.line_data.primary_regalia ?? ""),
    String(character.line_data.second_regalia ?? ""),
  ].includes(contract.regalia);
  return contract.type === "Comum" ? (favored ? 2 : 3) : favored ? 3 : 4;
}
function purchasePreview(input: {
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
  const { purchaseType, character } = input;
  if (purchaseType === "Atributo") {
    const target = Number(character.attributes[input.attribute] ?? 1) + 1;
    return { label: `${input.attribute} ${target}`, cost: 4 };
  }
  if (purchaseType === "Perícia") {
    const target = Number(character.skills[input.skill] ?? 0) + 1;
    return { label: `${input.skill} ${target}`, cost: 2 };
  }
  if (purchaseType === "Mérito")
    return {
      label: input.nextMeritRating
        ? `${input.selectedMerit?.translatedName} ${input.nextMeritRating}`
        : "Sem nível adicional",
      cost: input.nextMeritRating
        ? input.nextMeritRating - (input.ownedMerit?.dots ?? 0)
        : 0,
    };
  if (purchaseType === "Especialização")
    return {
      label: `${input.specialtySkill}: ${input.specialtyName || "nova Especialização"}`,
      cost: 1,
    };
  if (purchaseType === "Contrato")
    return {
      label: input.selectedContract?.name ?? "Nenhum Contrato disponível",
      cost: input.selectedContract
        ? contractExperienceCost(input.selectedContract, character)
        : 0,
    };
  if (purchaseType === "Benefício de Contrato")
    return {
      label: input.benefitKey
        ? "Benefício de outra Feição"
        : "Nenhum Benefício disponível",
      cost: input.benefitKey ? 1 : 0,
    };
  if (purchaseType === "Fado")
    return {
      label: input.wyrd < 10 ? `Fado ${input.wyrd + 1}` : "Fado máximo",
      cost: input.wyrd < 10 ? 5 : 0,
    };
  return {
    label: input.lostWillpower
      ? "Recuperar ponto perdido de Força de Vontade"
      : "Nenhum ponto perdido",
    cost: input.lostWillpower ? 1 : 0,
  };
}
function recalculateCtlDerived(sheet: CharacterSheet) {
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
function derivedWithPermanentMerits(character: CharacterSheet) {
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
function ExperienceRules() {
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
    <div className="experience-rules-grid">
      <table>
        <caption>{tr("Formas de ganhar Beats", "Ways to earn Beats")}</caption>
        <tbody>
          {beatRows.map((label) => (
            <tr key={label}>
              <td>{label}</td>
              <td>1 Beat</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <caption>{tr("Tabela de custos", "Cost table")}</caption>
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
      </table>
    </div>
  );
}
function GoblinDebtTrack({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const {tr}=useLanguage();
  return (
    <div className="goblin-debt-block">
      <h4>{tr("Débito Goblin","Goblin Debt")}</h4>
      <div
        className="goblin-debt-track"
        role="group"
        aria-label={tr(`Débito Goblin: ${value} de 9`,`Goblin Debt: ${value} of 9`)}
      >
        {Array.from({ length: 9 }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index < value ? "filled" : ""}
            onClick={() => onChange(index < value ? index : index + 1)}
            aria-label={tr(`Definir Débito Goblin como ${index < value ? index : index + 1}`,`Set Goblin Debt to ${index < value ? index : index + 1}`)}
          />
        ))}
      </div>
      <p>
        {value}/9 · {tr("ao receber o décimo ponto, o personagem adquire a Condição Habitante da Sebe.","upon receiving the tenth point, the character gains the Hedge Denizen Condition.")}
      </p>
    </div>
  );
}
function ResourceTrack({
  label,
  current,
  maximum,
  onChange,
}: {
  label: string;
  current: number;
  maximum: number;
  onChange: (value: number) => void;
}) {
  const {locale,tr}=useLanguage();
  const displayLabel=systemTerm(label,locale);
  return (
    <div className="tracker-block">
      <div
        className="resource-track"
        role="group"
        data-label={displayLabel}
        aria-label={tr(`${displayLabel}: ${current} de ${maximum}`,`${displayLabel}: ${current} of ${maximum}`)}
      >
        {Array.from({ length: maximum }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index < current ? "filled" : ""}
            onClick={() => onChange(index < current ? index : index + 1)}
            aria-label={tr(`Definir ${displayLabel} como ${index < current ? index : index + 1}`,`Set ${displayLabel} to ${index < current ? index : index + 1}`)}
          />
        ))}
      </div>
      <div className="tracker-meta">
        <span>{tr("Atual","Current")}</span>
        <strong>
          {current} / {maximum}
        </strong>
      </div>
    </div>
  );
}
function PowerResource({
  name,
  rating,
  resourceName,
  current,
  maximum,
  perTurn,
  onChange,
  summary,
}: {
  name: string;
  rating: number;
  resourceName: string;
  current: number;
  maximum: number;
  perTurn: number;
  onChange: (value: number) => void;
  summary?: string;
}) {
  const {locale,tr}=useLanguage();
  return (
    <div className="power-resource">
      <div className="power-rating power-rating-summary" tabIndex={summary ? 0 : undefined} title={summary} aria-label={summary} data-tooltip={summary}>
        <span>{systemTerm(name,locale)}</span>
        <DotValue value={rating} max={10} />
      </div>
      <ResourceTrack
        label={resourceName}
        current={current}
        maximum={maximum}
        onChange={onChange}
      />
      <p className="tracker-help">
        {tr(`${resourceName} máximo:`,`${systemTerm(resourceName,locale)} maximum:`)} <strong>{maximum}</strong> · {tr("gasto por turno:","spent per turn:")}{" "}
        <strong>{perTurn}</strong>
      </p>
    </div>
  );
}
function FrailtyList({ values, onChange }: { values: string[]; onChange: (value: string[]) => void }) {
  return (
    <div className="editable-lines frailty-lines">
      {values.map((value, index) => (
        <div className="editable-line-row" key={index}>
          <Input
            value={value}
            readOnly={index === 0}
            aria-label={index === 0 ? "Fragilidade obrigatória: Ferro Frio" : `Fragilidade de Fado ${index * 2}`}
            placeholder={index === 0 ? undefined : `Fragilidade de Fado ${index * 2}`}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
        </div>
      ))}
    </div>
  );
}
function damageLabel(value: DamageLevel | undefined) {
  return value === "bashing"
    ? "dano de contusão"
    : value === "lethal"
      ? "dano letal"
      : value === "aggravated"
        ? "dano agravado"
        : "vazia";
}
function boundedNumber(value: unknown, maximum: number, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.max(0, Math.min(maximum, Math.trunc(number)))
    : fallback;
}
function LineList({ items }: { items: string[] }) {
  return (
    <div className="official-lines">
      {items.filter(Boolean).map((item, index) => (
        <div key={`${item}-${index}`}>{item}</div>
      ))}
      {!items.filter(Boolean).length && <div>&nbsp;</div>}
    </div>
  );
}
function EditableList({
  values,
  minimum = 1,
  maximum,
  placeholder,
  onChange,
}: {
  values: string[];
  minimum?: number;
  maximum?: number;
  placeholder: string;
  onChange: (value: string[]) => void;
}) {
  const rows =
    maximum === undefined ? [...values] : [...values].slice(0, maximum);
  while (rows.length < minimum) rows.push("");
  const removable = rows.length > minimum;
  return (
    <div className="editable-lines">
      {rows.map((value, index) => (
        <div className="editable-line-row" key={index}>
          <Input
            value={value}
            placeholder={placeholder}
            onChange={(event) => {
              const next = [...rows];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          {removable && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Remover linha ${index + 1}`}
              onClick={() =>
                onChange(rows.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              <Trash2 />
            </Button>
          )}
        </div>
      ))}
      {(!maximum || rows.length < maximum) && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onChange([...rows, ""])}
        >
          <Plus /> Adicionar linha
        </Button>
      )}
    </div>
  );
}
function updateLineData(
  updateSheet: (sheet: CharacterSheet) => void,
  character: CharacterSheet,
  key: string,
  value: string[],
) {
  const next = structuredClone(character);
  next.line_data = { ...next.line_data, [key]: value };
  updateSheet(next);
}
function normalizeStoredSheet(value: CharacterSheet): CharacterSheet {
  const next = structuredClone(value);
  next.specializations = Array.isArray(next.specializations)
    ? next.specializations.map((item: any) =>
        typeof item === "string"
          ? { skill: "", name: item }
          : {
              skill: String(item?.skill ?? ""),
              name: String(item?.name ?? ""),
              grantedBy: item?.grantedBy ? String(item.grantedBy) : undefined,
            },
      )
    : [];
  next.merits = Array.isArray(next.merits)
    ? next.merits.map((item: any) => ({
        name: String(
          item?.name === "Throne"
            ? "Power Behind the Throne"
            : (item?.name ?? ""),
        ),
        dots: Number(item?.dots ?? 1),
        instanceId: item?.instanceId ? String(item.instanceId) : undefined,
        sourceId: item?.sourceId ? String(item.sourceId) : undefined,
        source: item?.source ? String(item.source) : undefined,
        configuration: normalizeMeritConfiguration(item?.configuration),
        grantedBy: item?.grantedBy ? String(item.grantedBy) : undefined,
      }))
    : [];
  next.line_data =
    next.line_data && typeof next.line_data === "object" ? next.line_data : {};
  if (next.game_line === "CtL") {
    const wyrd = Number(next.line_data.wyrd ?? 1);
    next.line_data = {
      ...next.line_data,
      frailties: normalizeChangelingFrailties(next.line_data.frailties, wyrd),
    };
  }
  return synchronizeMeritGrants(next);
}
const ARCANA_PT: Record<string, string> = {
  Death: "Morte",
  Fate: "Destino",
  Forces: "Forças",
  Life: "Vida",
  Matter: "Matéria",
  Mind: "Mente",
  Prime: "Primórdio",
  Space: "Espaço",
  Spirit: "Espírito",
  Time: "Tempo",
  Morte: "Morte",
  Destino: "Destino",
  Forças: "Forças",
  Vida: "Vida",
  Matéria: "Matéria",
  Mente: "Mente",
  Primórdio: "Primórdio",
  Espaço: "Espaço",
  Espírito: "Espírito",
  Tempo: "Tempo",
};
const LESSER_ATTAINMENTS: Record<string, [string, string]> = {
  Death: [
    "Olhos dos Mortos",
    "Percebe fantasmas, almas e fenômenos do Crepúsculo com a Visão da Morte; com Mana, pode interagir com eles pela cena.",
  ],
  Fate: [
    "Duração Condicional",
    "Acrescenta a um feitiço uma condição de encerramento que amplia sua Duração.",
  ],
  Forces: [
    "Força Precisa",
    "Otimiza a aplicação deliberada de força contra objetos ou alvos imóveis.",
  ],
  Life: [
    "Restauração Aprimorada do Padrão",
    "Cura dano com Mana de modo mais eficiente e reduz efeitos derivados do Esfolamento de Atributos Físicos.",
  ],
  Matter: [
    "Permanência",
    "Permite pagar Mana, em vez de Alcance, para aplicar Duração Avançada a feitiços cujo Arcano mais alto seja Matéria.",
  ],
  Mind: [
    "Olho da Mente",
    "Percebe Goetia, entidades Astrais e projeções no Crepúsculo; com Mana, pode interagir com elas pela cena.",
  ],
  Prime: [
    "Contramágica Universal",
    "Permite usar Contramágica contra qualquer feitiço Desperto usando Gnose + Primórdio.",
  ],
  Space: [
    "Alcance Simpático",
    "Permite conjurar à distância por uma conexão simpática, um Yantra apropriado e Mana.",
  ],
  Spirit: [
    "Olhos do Espírito",
    "Percebe espíritos e fenômenos do Crepúsculo espiritual; com Mana, pode interagir com eles pela cena.",
  ],
  Time: [
    "Simpatia Temporal",
    "Permite lançar determinados feitiços de Tempo sobre o passado de um alvo atual.",
  ],
};
const GREATER_ATTAINMENTS: Record<string, [string, string]> = {
  Death: [
    "Alma Inviolável",
    "Pode repelir reflexivamente poderes que afetem sua alma, Nimbus, aura ou tentem possuí-lo.",
  ],
  Fate: [
    "Destino Desimpedido",
    "Pode repelir juramentos, compulsões e alterações sobrenaturais impostas ao próprio destino.",
  ],
  Forces: [
    "Imunidade Ambiental",
    "Com Mana, ignora Inclinações Ambientais e Ambientes Extremos pela cena.",
  ],
  Life: [
    "Autonomia Corporal",
    "Pode repelir reflexivamente poderes que alterem ou firam seu corpo ou imponham Inclinações Pessoais.",
  ],
  Matter: [
    "Controle de Durabilidade",
    "Com Mana e toque, aumenta ou reduz a Durabilidade de um objeto pelos pontos em Matéria.",
  ],
  Mind: [
    "Salto Intuitivo",
    "Com Mana, transforma três ou mais sucessos em teste Mental ou Social num sucesso excepcional.",
  ],
  Prime: [
    "Imbuir Item",
    "Permite criar um Item Imbuído com um feitiço que o mago saiba conjurar.",
  ],
  Space: [
    "Onipresença",
    "Permite pagar Mana, em vez de Alcance, para aplicar Escala Avançada.",
  ],
  Spirit: [
    "Posto Honorário",
    "Espíritos reconhecem um Posto honorário igual a Espírito, com benefícios sociais e ofensivos.",
  ],
  Time: [
    "Tempo numa Garrafa",
    "Permite pagar Mana, em vez de Alcance, para usar tempo de conjuração instantâneo.",
  ],
};
function MageAttainmentList({ arcana }: { arcana: Record<string, number> }) {
  const owned = (minimum: number) =>
    Object.entries(arcana)
      .filter(([, dots]) => Number(dots) >= minimum)
      .map(([name]) => ARCANA_PT[name] ?? name);
  const rows: Array<{ name: string; arcana: string[]; description: string }> =
    [];
  const one = owned(1),
    two = owned(2),
    three = owned(3),
    five = owned(5);
  if (one.length)
    rows.push({
      name: "Contramágica",
      arcana: one,
      description:
        "Desfaz a Imago de um feitiço observado com Visão Mágica Ativa por meio de um Confronto de Vontades.",
    });
  for (const [name, dots] of Object.entries(arcana)) {
    if (Number(dots) >= 2 && LESSER_ATTAINMENTS[name])
      rows.push({
        name: LESSER_ATTAINMENTS[name][0],
        arcana: [ARCANA_PT[name] ?? name],
        description: LESSER_ATTAINMENTS[name][1],
      });
  }
  if (two.length)
    rows.push({
      name: "Armadura do Mago",
      arcana: two,
      description:
        "Ativa uma proteção correspondente a um dos Arcanos dominados; somente uma forma pode permanecer ativa por vez.",
    });
  if (three.length)
    rows.push({
      name: "Invocação Direcionada",
      arcana: three,
      description:
        "Ao invocar um ser Superno, permite especificar um segundo Arcano para refinar o alvo da invocação.",
    });
  for (const [name, dots] of Object.entries(arcana)) {
    if (Number(dots) >= 4 && GREATER_ATTAINMENTS[name])
      rows.push({
        name: GREATER_ATTAINMENTS[name][0],
        arcana: [ARCANA_PT[name] ?? name],
        description: GREATER_ATTAINMENTS[name][1],
      });
  }
  if (five.length)
    rows.push({
      name: "Criar Rota",
      arcana: five,
      description:
        "Permite codificar como Rota um feitiço cujos Arcanos tenham sido dominados.",
    });
  return (
    <div className="mage-attainment-list">
      {rows.map((row) => (
        <div
          key={`${row.name}-${row.arcana.join("-")}`}
          title={row.description}
        >
          <strong>
            {row.name} ({row.arcana.join(", ")})
          </strong>
          <small>{row.description}</small>
        </div>
      ))}
      {!rows.length && <em>Nenhum Attainment adquirido.</em>}
    </div>
  );
}
function SpellColumn({
  items,
  showSkill = false,
}: {
  items: Array<Record<string, unknown>>;
  showSkill?: boolean;
}) {
  const {locale,tr}=useLanguage();
  return (
    <div className="mage-spell-lines">
      {items.map((item, index) => (
        <div
          key={`${String(item.id ?? item.name)}-${index}`}
          title={String(item.description ?? "")}
        >
          <strong>{String(locale==="en-US"?item.originalName??item.name:item.name??item.originalName??"")}</strong>
          <small>
            {Object.entries((item.requirements ?? {}) as Record<string, number>)
              .map(([name, dots]) => `${name} ${dots}`)
              .join(" · ")}
            {showSkill && item.roteSkill ? ` · ${String(item.roteSkill)}` : ""}
          </small>
        </div>
      ))}
      {!items.length && <em>{tr("Nenhum registro.","No entries.")}</em>}
    </div>
  );
}
function MeritSheetList({
  merits,
  line,
}: {
  merits: CharacterSheet["merits"];
  line: "CtL" | "MtA";
}) {
  const {locale,tr}=useLanguage();
  const homebrews = useHomebrews();
  const catalog = [
      ...getMeritsForLine(line),
      ...homebrews.merits.filter(
        (item) => item.line === "Core" || item.line === line,
      ),
    ],
    visible = merits.filter(
      (item) =>
        !item.grantedBy ||
        (line === "CtL" && item.grantedBy === "Corte") ||
        (line === "MtA" && item.grantedBy === "Ordem"),
    );
  return (
    <div className="sheet-merits single-column">
      {visible.length ? (
        visible.map((item, index) => {
          const definition = catalog.find((entry) => entry.name === item.name);
          const tooltip = definition
            ? `${definition.description}${definition.prerequisites ? `\nPré-requisitos: ${definition.prerequisites}` : ""}`
            : item.source;
          return (
            <div key={`${item.name}-${index}`} title={tooltip}>
              <span>{meritLabel(item,line,locale)}</span>
              <DotValue value={item.dots} max={Math.max(5, item.dots)} />
            </div>
          );
        })
      ) : (
        <em>{tr("Nenhum Mérito selecionado","No Merit selected")}</em>
      )}
    </div>
  );
}
function ContractSheetList({
  contracts,
  seeming,
}: {
  contracts: Array<Record<string, unknown>>;
  seeming: string;
}) {
  const {locale}=useLanguage();
  const homebrews=useHomebrews();
  return (
    <div className="official-lines">
      {contracts
        .filter((item) => item.name)
        .map((item, index) => {
          const found = findContract(String(item.id ?? item.name ?? ""));
          const definition = found ? contractPresentation(contractWithSupplementalBenefits(found,isHomebrewActive(homebrews,"h-seemings")?["h-seemings"]:[]),locale) : undefined;
          const description =
            definition?.description ?? String(item.description ?? "");
          const dicePool =
            definition?.dicePool ?? String(item.dicePool ?? "Não informada");
          const benefit =
            definition?.seemingBenefits?.[
              seeming as keyof typeof definition.seemingBenefits
            ];
          return (
            <div
              key={`${String(item.name)}-${index}`}
              title={`${description}\nParada de dados: ${dicePool}\nBrecha: ${definition?.loophole ?? "Não informada"}${benefit ? `\nBenefício de ${seemingDisplayName(seeming,locale)}: ${benefit}` : ""}`}
            >
              <span>{String(locale==="en-US"?(definition?.originalName??item.originalName??item.name):(definition?.name??item.name))}</span>
              <small>
                {systemTerm(definition?.regalia ?? String(item.regalia ?? ""),locale)} ·{" "}
                {definition?.type ??
                  String(item.type ?? (index < 4 ? "Comum" : "Real"))}
              </small>
            </div>
          );
        })}
      {!contracts.some((item) => item.name) && <div>&nbsp;</div>}
    </div>
  );
}
function ContractPowerList({
  contracts,
  seeming,
  court,
  extraBenefits = [],
  extraClauses = [],
}: {
  contracts: Array<Record<string, unknown>>;
  seeming: string;
  court: string;
  extraBenefits?: Array<Record<string, unknown>>;
  extraClauses?: Array<Record<string, unknown>>;
}) {
  const {locale,tr}=useLanguage();
  const homebrews=useHomebrews();
  return (
    <div className="contract-power-list">
      {contracts
        .filter((item) => item.name)
        .map((item, index) => {
          const baseDefinition =
            findContract(String(item.id ?? item.name ?? "")) ??
            (item as unknown as ContractDefinition);
          const definition=contractPresentation(contractWithSupplementalBenefits(baseDefinition,isHomebrewActive(homebrews,"h-seemings")?["h-seemings"]:[]),locale);
          const summary=contractSummary(baseDefinition,locale);
          if (!definition?.id) return null;
          const benefits = [
            seeming,
            ...extraBenefits
              .filter((extra) => String(extra.contractId) === definition.id)
              .map((extra) => String(extra.seeming)),
          ]
            .filter(
              (value, item, array) => value && array.indexOf(value) === item,
            )
            .map((key) => ({
              key,
              text: definition.seemingBenefits?.[
                key as keyof typeof definition.seemingBenefits
              ],
            }))
            .filter((item) => item.text);
          const courtBenefit = (
            definition as ContractDefinition & {
              courtBenefits?: Record<string, string>;
            }
          ).courtBenefits?.[court];
          const clauseCourtIds = [
            courtCanonicalId(court),
            ...extraClauses.filter((extra) => String(extra.contractId) === definition.id).map((extra) => String(extra.courtId)),
          ].filter((value, position, values) => value && values.indexOf(value) === position);
          const clauses = clauseCourtIds.map((courtId) => ({ courtId, text: definition.courtClauses?.[courtId] })).filter((item) => item.text);
          const displayOptions = contractDisplayOptions(definition, locale);
          return (
            <article key={`${definition.id}-${index}`}>
              <div className="contract-power-title">
                <strong>{locale==="en-US"?definition.originalName??definition.name:definition.name}</strong>
                <Badge variant={definition.goblin ? "default" : "outline"}>
                  {definition.goblin ? "Goblin" : definition.type === "Comum" ? tr("Comum", "Common") : tr("Real", "Royal")}
                </Badge>
              </div>
              <small>
                {systemTerm(definition.regalia,locale)} · {definition.source} · p.{" "}
                {definition.page}
              </small>
              <dl>
                {summary && <div>
                  <dt>{tr("Resumo", "Summary")}</dt>
                  <dd>{summary}</dd>
                </div>}
                {contractHasInvocationRoll(definition) === true && <div>
                  <dt>{tr("Parada de dados", "Dice Pool")}</dt>
                  <dd>{definition.dicePool ?? tr("Não informada", "Not listed")}</dd>
                </div>}
                <div>
                  <dt>{tr("Custo", "Cost")}</dt>
                  <dd>{definition.cost ?? tr("Conforme descrição", "As described")}</dd>
                </div>
                <div>
                  <dt>{tr("Ação / Duração","Action / Duration")}</dt>
                  <dd>
                    {definition.action ?? tr("Instantânea", "Instant")} ·{" "}
                    {definition.duration ?? tr("Cena", "Scene")}
                  </dd>
                </div>
                {displayOptions.length > 0 && (
                  <div className="contract-options">
                    <dt>{tr("Opções", "Options")}</dt>
                    <dd><ul>{displayOptions.map((option) => <li key={option}>{option}</li>)}</ul></dd>
                  </div>
                )}
                {contractOutcomeSections(definition, locale).map((section) => (
                    <div key={section.label}>
                      <dt>{section.label}</dt>
                      <dd>{section.text}</dd>
                    </div>
                  ))}
                {definition.detailTables?.map((table) => (
                  <div className="contract-detail-table" key={table.title}>
                    <dt>{table.title}</dt>
                    <dd><table><thead><tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row) => <tr key={row.join("::")}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></dd>
                  </div>
                ))}
                <div>
                  <dt>{tr("Brecha","Loophole")}</dt>
                  <dd>{definition.loophole}</dd>
                </div>
                {benefits.map((benefit) => (
                  <div key={benefit.key}>
                    <dt>
                      {tr("Benefício de", "Benefit for")}{" "}
                      {seemingDisplayName(benefit.key,locale)}
                    </dt>
                    <dd>{benefit.text}</dd>
                  </div>
                ))}
                {courtBenefit && (
                  <div>
                    <dt>{tr("Benefício da Corte", "Court Benefit")} {court}</dt>
                    <dd>{courtBenefit}</dd>
                  </div>
                )}
                {clauses.map((clause) => (
                  <div key={`clause-${clause.courtId}`}>
                    <dt>Clause · {courtDisplayName(clause.courtId, locale)}</dt>
                    <dd>{clause.text}</dd>
                  </div>
                ))}
                {definition.goblin && (
                  <div className="goblin-debt-row">
                    <dt>{tr("Débito Goblin", "Goblin Debt")}</dt>
                    <dd>{definition.goblinDebt}</dd>
                  </div>
                )}
              </dl>
            </article>
          );
        })}
    </div>
  );
}
function SeemingLore({ seeming }: { seeming: string }) {
  const {locale,tr}=useLanguage();
  const definition = CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS];
  if (!definition)
    return <LorePanel title={tr("Feição","Seeming")} text={tr("Nenhuma Feição selecionada.","No Seeming selected.")} />;
  const page = (
    {
      Beast: 22,
      Darkling: 24,
      Elemental: 26,
      Fairest: 28,
      Ogre: 30,
      Wizened: 32,
    } as Record<string, number>
  )[seeming];
  return (
    <>
      <LorePanel
        title={tr(`Bênção de ${definition.translated}`,`${seeming} Blessing`)}
        text={locale==="en-US"?definition.blessingEn:definition.blessing}
        source={`Changeling the Lost · p. ${page}`}
      />
      <LorePanel
        title={tr(`Maldição de ${definition.translated}`,`${seeming} Curse`)}
        text={locale==="en-US"?definition.curseEn:definition.curse}
        source={`Changeling the Lost · p. ${page}`}
      />
    </>
  );
}
function KithLore({ data }: { data: Record<string, unknown> }) {
  const {locale,tr}=useLanguage();
  const definition = data.kith_custom ? undefined : findKith(data.kith);
  const presentation=data.kith_custom?undefined:kithPresentation(data.kith,locale);
  const name = data.kith_custom?kithDisplayName(data.kith,true):presentation?.name??"";
  const skill = String(presentation?.skill ?? definition?.skill ?? data.kith_skill ?? "");
  const description = String(presentation?.description ?? definition?.description ?? data.kith_description ?? "");
  const blessing = String(presentation?.blessing ?? definition?.blessing ?? data.kith_blessing ?? "");
  const source = String(definition?.source ?? data.kith_source ?? "");
  const page = Number(definition?.page ?? data.kith_page ?? 0);
  if (!name)
    return (
      <LorePanel
        title={tr("Bênção da Fratria","Kith Blessing")}
        text={tr("Nenhuma Fratria selecionada.","No Kith selected.")}
      />
    );
  return (
    <LorePanel
      title={tr(`Bênção de ${name}`,`${name} Blessing`)}
      intro={data.kith_custom ? undefined : description}
      text={`${skill ? `${skill}. ` : ""}${blessing || description}`}
      source={source ? `${source}${page ? ` · p. ${page}` : ""}` : undefined}
    />
  );
}
function CourtLore({
  data,
  merits,
}: {
  data: Record<string, unknown>;
  merits: CharacterSheet["merits"];
}) {
  const { locale, tr } = useLanguage();
  const raw = data.custom_court;
  const custom = raw && typeof raw === "object" ? raw as Record<string, unknown> : undefined;
  const official = custom ? undefined : courtPresentation(data.court, locale);
  if (!custom && !official) return null;
  const name = custom ? String(custom.name ?? data.court ?? "") : courtDisplayName(data.court, locale);
  const emotion = custom ? String(custom.emotion ?? "") : String(official?.emotion ?? "");
  const benefits = custom && Array.isArray(custom.mantleBenefits)
      ? custom.mantleBenefits.map(String)
      : official?.mantleBenefits ?? [],
    dots =
      merits.find(
        (item) => item.name === "Mantle" && item.grantedBy === "Corte",
      )?.dots ?? 1;
  return (
    <article className="lore-panel">
      <h4>{tr("Manto", "Mantle")}: {name}</h4>
      <small>{tr("Sentimento da Corte", "Court emotion")}: {emotion}</small>
      {benefits.slice(0, dots).map((benefit, index) => (
        <p key={index}>
          <strong>{tr("Manto", "Mantle")} {index + 1}:</strong> {benefit}
        </p>
      ))}
      {official && <small>{official.source} · p. {official.page}</small>}
    </article>
  );
}
function CustomOrderLore({ data }: { data: Record<string, unknown> }) {
  const raw = data.custom_order;
  if (!raw || typeof raw !== "object") return null;
  const order = raw as Record<string, unknown>;
  const skills = Array.isArray(order.roteSkills)
    ? order.roteSkills.map(String).filter(Boolean)
    : [];
  return (
    <article className="lore-panel">
      <h4>Ordem: {String(order.name ?? data.order ?? "")}</h4>
      <p>{String(order.description ?? "")}</p>
      <small>Perícias de Rota: {skills.join(", ")}</small>
    </article>
  );
}
function LorePanel({
  title,
  intro,
  text,
  source,
}: {
  title: string;
  intro?: string;
  text: string;
  source?: string;
}) {
  return (
    <article className="lore-panel">
      <h4>{title}</h4>
      {intro && intro !== text && <p className="lore-intro">{intro}</p>}
      <p>{text}</p>
      {source && <small>{source}</small>}
    </article>
  );
}
function LabeledBlank({ title, lines }: { title: string; lines: number }) {
  return (
    <div className="labeled-blank">
      <h4>{title}</h4>
      <div className="blank-lines">
        {Array.from({ length: lines }, (_, index) => (
          <i key={index} />
        ))}
      </div>
    </div>
  );
}
function SpellSheetList({
  rotes,
  praxes,
}: {
  rotes: Array<Record<string, unknown>>;
  praxes: Array<Record<string, unknown>>;
}) {
  const {locale,tr}=useLanguage();
  const rows = [
    ...rotes.map((item) => ({ kind: "Rota", item })),
    ...praxes.map((item) => ({ kind: "Práxis", item })),
  ];
  return (
    <div className="official-lines">
      {rows.map(({ kind, item }, index) => (
        <div
          key={`${kind}-${String(item.id ?? item.name)}-${index}`}
          title={`Resumo: ${spellItemSummary(item)}\nParada de dados: Gnose + ${formatSpellRequirements((item.requirements ?? {}) as Record<string, number>)}\nCusto: Conforme os Alcances e efeitos aplicados\nAção / Duração: Conjuração instantânea · Fator Primário: ${String(item.primaryFactor ?? "")}\nEfeitos: ${String(item.description ?? "Descrição não disponível.")}\nPrática: ${String(item.practice ?? "")}${item.withstand ? ` · Resistência: ${String(item.withstand)}` : ""}`}
        >
          <span>
            {kind==="Rota"?tr("Rota","Rote"):tr("Práxis","Praxis")} · {String(locale==="en-US"?item.originalName??item.name:item.name??item.originalName??"")}
          </span>
          <small>
            {kind === "Rota" && item.roteSkill
              ? `${tr("Perícia","Skill")}: ${systemTerm(String(item.roteSkill),locale)} · `
              : ""}
            {String(item.source ?? "")} · p. {String(item.page ?? "—")}
          </small>
        </div>
      ))}
    </div>
  );
}
function spellItemSummary(item: Record<string, unknown>) {
  const description = String(item.description ?? "").trim() ||
    "Descrição não disponível.";
  return description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || description;
}
function stringList(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}
function selectedConditionList(value: unknown): SelectedCondition[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) =>
      typeof item === "string"
        ? {
            id: item,
            persistent: Boolean(
              findChangelingCondition(item)?.persistent ||
              findMageCondition(item)?.persistent,
            ),
          }
        : item && typeof item === "object"
          ? {
              id: String((item as Record<string, unknown>).id ?? ""),
              persistent: Boolean((item as Record<string, unknown>).persistent),
            }
          : null,
    )
    .filter((item): item is SelectedCondition => Boolean(item?.id));
}
function objectList(value: unknown) {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}
function isExpandedMerit(name: string) {
  return (
    EXPANDED_MERIT_NAMES.has(name) ||
    [
      "Hollow",
      "Warded Dreams",
      "Dream Bastion",
      "Mantle",
      "Court Goodwill",
      "Token",
    ].includes(name)
  );
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

function migrateLegacy(item: any, player: string): CharacterSheet {
  const attributes = Object.values(ATTRIBUTES)
    .flat()
    .reduce<Record<string, number>>((acc, name) => ({ ...acc, [name]: 1 }), {});
  const skills = Object.values(SKILLS)
    .flat()
    .reduce<Record<string, number>>((acc, name) => ({ ...acc, [name]: 0 }), {});
  const now = new Date().toISOString();
  return {
    id: item.id ?? crypto.randomUUID(),
    schema_version: 2,
    system: "chronicles-of-darkness",
    game_line: item.gameLine === "MtA" ? "MtA" : "CtL",
    ruleset: {
      id: item.rulesetId ?? "legacy",
      version: item.rulesetVersion ?? 1,
    },
    character: {
      name: item.name ?? "Sem nome",
      concept: item.concept ?? "",
      player,
    },
    attributes,
    skills,
    specializations: [],
    merits: [],
    line_data: safeJson(item.characterData),
    derived: {},
    current_state: { legacy: true },
    created_at: item.createdAt ?? now,
    updated_at: now,
  };
}
function migrateJsonV1(value: any, player: string): CharacterSheet {
  const now = new Date().toISOString();
  const specializations = Array.isArray(value.specializations)
    ? value.specializations.map((item: any) =>
        typeof item === "string"
          ? { skill: "", name: item }
          : { skill: String(item.skill ?? ""), name: String(item.name ?? "") },
      )
    : [];
  const merits = Array.isArray(value.merits)
    ? value.merits.map((raw: any) => ({
        name: String(
          raw?.name === "Throne"
            ? "Power Behind the Throne"
            : (raw?.name ?? ""),
        ),
        dots: Number(raw?.dots ?? 1),
        sourceId: raw?.sourceId ? String(raw.sourceId) : undefined,
        source: raw?.source ? String(raw.source) : undefined,
        configuration: normalizeMeritConfiguration(raw?.configuration),
        grantedBy: raw?.grantedBy ? String(raw.grantedBy) : undefined,
      }))
    : [];
  return synchronizeMeritGrants({
    id: crypto.randomUUID(),
    schema_version: 2,
    system: "chronicles-of-darkness",
    game_line: value.game_line,
    ruleset: value.ruleset ?? { id: "imported-v1", version: 1 },
    character: {
      name: value.character?.name ?? "Sem nome",
      concept: value.character?.concept ?? "",
      player,
    },
    attributes: value.attributes ?? {},
    skills: value.skills ?? {},
    specializations,
    merits,
    line_data: value.line_data ?? {},
    derived: {},
    current_state: value.current_state ?? {},
    created_at: now,
    updated_at: now,
  });
}
function safeJson(value: string) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return {};
  }
}
function pretty(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();
}
function summarizeRule(rule: CatalogRule) {
  try {
    const data = JSON.parse(rule.structuredData);
    return `${Object.keys(data).length} blocos mecânicos estruturados e aplicados pelo criador de fichas.`;
  } catch {
    return "Regra compartilhada ativa.";
  }
}

for (const [translated, original] of Object.entries({
  Morte: "Death",
  Destino: "Fate",
  Forças: "Forces",
  Vida: "Life",
  Matéria: "Matter",
  Mente: "Mind",
  Primórdio: "Prime",
  Espaço: "Space",
  Espírito: "Spirit",
  Tempo: "Time",
})) {
  LESSER_ATTAINMENTS[translated] = LESSER_ATTAINMENTS[original];
  GREATER_ATTAINMENTS[translated] = GREATER_ATTAINMENTS[original];
}
