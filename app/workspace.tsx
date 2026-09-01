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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CTL_SEEMING_LABELS,
  MTA_ORDER_LABELS,
  MTA_PATHS,
  SKILLS,
} from "@/lib/creation-rules";
import {
  getMeritsForLine,
  meritRatingsFor,
  REPEATABLE_MERITS,
  type MeritDefinition,
} from "@/lib/merits";
import { findKith } from "@/lib/changeling-kiths";
import {
  CONTRACTS,
  findContract,
  type ContractDefinition,
} from "@/lib/contracts";
import {
  normalizeClarityDamage,
  normalizeDamage,
  powerResourceLimits,
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
import { ANIMALS, VEHICLES, type Animal } from "@/lib/companions";
import { HomebrewsPage } from "./homebrews";
import { useHomebrews } from "./use-homebrews";
import { isBuiltinHomebrew, isHomebrewActive, migrateCharacterHomebrews, saveHomebrews } from "@/lib/homebrews";
import { getDeviceValue, setDeviceValue } from "@/lib/device-storage";
import { StorageSettings } from "./storage-settings";

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

const nav = [
  ["inicio", "Início", LayoutDashboard],
  ["personagens", "Personagens", UsersRound],
  ["homebrews", "Homebrews", FlaskConical],
] as const;

export function Workspace({
  displayName,
  userKey,
}: {
  displayName: string;
  userKey: string;
}) {
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
                `${migrated.length} ficha(s) antiga(s) foram transferidas para este navegador.`,
              );
            }
          }
        }
      } catch {
        setNotice(
          "Não foi possível ler o armazenamento local deste navegador.",
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
      "Ficha salva localmente neste navegador. Exporte o JSON para manter uma cópia independente.",
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
    setNotice(`“${character.character.name}” foi excluído deste navegador.`);
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
          "O JSON não pertence a uma ficha CtL ou MtA compatível.",
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
      setNotice(`“${sheet.character.name}” foi importado para este navegador.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "JSON inválido.");
    }
  }

  const title = nav.find(([id]) => id === view)?.[1] ?? "Arquivo";
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
          <nav className="top-navigation" aria-label="Navegação principal">
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
                className={view === id && !selected ? "active" : ""}
              onClick={() => navigate(id)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
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
              <span>{characters.length} personagem(ns)</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="sheet-actions-trigger">
                  <MoreHorizontal /> Ações da ficha
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="sheet-actions-menu">
                <DropdownMenuLabel>Gerenciar fichas</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setEditing("new")}>
                  <Plus /> Criar ficha
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => fileRef.current?.click()}>
                  <Upload /> Importar JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={!selected}
                  onSelect={() => selected && exportCharacter(selected)}
                >
                  <Download /> Salvar JSON
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={!selected}
                  onSelect={(event) => {
                    event.preventDefault();
                    if (selected) setDeleteOpen(true);
                  }}
                >
                  <Trash2 /> Deletar ficha
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
            <button onClick={() => setNotice("")} aria-label="Fechar aviso">
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
          <Badge className="eyebrow">ARQUIVO DAS TREVAS</Badge>
          <h2>Catálogo de Fichas</h2>
          <p>
            Quem você será desta vez?
          </p>
          <div className="welcome-actions">
            <Button variant="outline" onClick={openCharacters}>
              Todos os personagens
            </Button>
          </div>
        </div>
        <div className="sigil" aria-hidden="true">
          <img src="/cod-emblem.png" alt="" />
        </div>
      </section>
      <section className="line-summary wide">
        <span><strong>{characters.length}</strong> personagens</span>
        <span className="ctl-summary"><strong>{changelings}</strong> Changelings</span>
        <span className="mta-summary"><strong>{mages}</strong> Magos</span>
      </section>
      <StorageSettings />
      <section className="panel wide recent-panel">
        <div className="panel-heading">
          <div>
            <span className="kicker">CONTINUAR</span>
            <h3>Personagens recentes</h3>
            <p>Acesse rapidamente as fichas usadas por último.</p>
          </div>
          {characters.length > 4 && (
            <Button variant="ghost" onClick={openCharacters}>
              Ver todos
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
                    {character.game_line === "CtL" ? "Changeling" : "Mago"}
                  </Badge>
                  <h3>{character.character.name}</h3>
                  <p>
                    {character.character.concept || "Conceito não informado"}
                  </p>
                  <small>
                    {character.game_line === "CtL"
                      ? String(
                          character.line_data.seeming ?? "Feição não definida",
                        )
                      : String(
                          character.line_data.path ?? "Caminho não definido",
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
              <strong>Comece uma nova crônica</strong>
              <p>Use “Ações da ficha” no painel superior para criar seu primeiro personagem.</p>
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
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="kicker">PERSONAGENS</span>
          <h3>Suas fichas</h3>
          <p>
            Abra uma ficha para jogar, atualizar características ou exportar uma
            cópia.
          </p>
        </div>
      </div>
      {!ready ? (
        <div className="loading-card">Carregando personagens…</div>
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
                  {character.game_line === "CtL" ? "Changeling" : "Mago"}
                </Badge>
                <h3>{character.character.name}</h3>
                <p>{character.character.concept}</p>
                <small>
                  {character.game_line === "CtL"
                    ? String(character.line_data.seeming ?? "Changeling")
                    : String(character.line_data.path ?? "Mage")}
                </small>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
      ) : (
        <Empty
          title="Nenhum personagem criado"
          text="Use “Ações da ficha” no painel superior para criar um Changeling ou Mago."
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
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const printSheet = () => {
    setPdfPreviewOpen(false);
    window.setTimeout(() => window.print(), 80);
  };
  return (
    <section className="sheet-editor">
      <div className="sheet-toolbar">
        <Button variant="ghost" onClick={back}>
          ← Personagens
        </Button>
        <div>
          <Badge>{character.game_line}</Badge>
          <span>Alterações nos marcadores são salvas automaticamente</span>
        </div>
        <div className="sheet-toolbar-actions">
          <Button variant="outline" onClick={() => setPdfPreviewOpen(true)}>
            <Eye /> Visualizar PDF
          </Button>
          <Button variant="outline" onClick={printSheet}>
            <Printer /> Imprimir PDF
          </Button>
          <Button variant="outline" onClick={edit}>
            <Pencil /> Editar
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
              <DialogTitle>Visualização para PDF</DialogTitle>
              <DialogDescription>
                As quatro abas serão impressas como páginas separadas.
              </DialogDescription>
            </div>
            <Button onClick={() => window.print()}>
              <Printer /> Imprimir ou salvar em PDF
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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir “{name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            A ficha será removida do armazenamento deste navegador. Exporte o
            JSON antes se quiser conservar uma cópia.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            Excluir definitivamente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
  const frailties = stringList(data.frailties);
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
  return (
    <article className={`cod-sheet ${isCtl ? "ctl-sheet" : "mta-sheet"}${printLayout ? " print-layout" : ""}`}>
      <header className="cod-sheet-title">
        <div>
          <span>{isCtl ? "CHANGELING" : "MAGO"}</span>
          <strong>{isCtl ? "OS PERDIDOS" : "O DESPERTAR"}</strong>
        </div>
        <p>CRÔNICAS DAS TREVAS</p>
      </header>
      {isCtl ? (
        <Tabs defaultValue="principal" className="ctl-sheet-tabs">
          <TabsList
            className="ctl-sheet-tab-list"
            aria-label="Páginas da ficha"
          >
            <TabsTrigger value="principal">Principal</TabsTrigger>
            <TabsTrigger value="poderes">Detalhes</TabsTrigger>
            <TabsTrigger value="combate">Combate</TabsTrigger>
            <TabsTrigger value="companheiros">Companheiros</TabsTrigger>
          </TabsList>
          <TabsContent forceMount={printLayout ? true : undefined} value="principal" data-page-title="Principal" className="ctl-sheet-page">
            <section className="sheet-identity-grid">
              <SheetField label="Nome" value={character.character.name} />
              <SheetField label="Agulha" value={data.needle} />
              <SheetField
                label="Feição"
                value={CTL_SEEMING_LABELS[String(data.seeming)] ?? data.seeming}
              />
              <SheetField label="Jogador" value={character.character.player} />
              <SheetField label="Fio" value={data.thread} />
              <SheetField label="Fratria" value={data.kith} />
              <SheetField label="Crônica" value="" />
              <SheetField
                label="Conceito"
                value={character.character.concept}
              />
              <SheetField label="Corte" value={data.court} />
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
                <EditableList
                  values={frailties}
                  minimum={3}
                  placeholder="Escreva uma Fragilidade"
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
            />
            <div className="powers-sheet-grid">
              <section>
                <SheetHeading>Outras Características</SheetHeading>
                <SeemingLore seeming={String(data.seeming ?? "")} />
                <KithLore data={data} />
                <CustomCourtLore data={data} merits={character.merits} />
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
            aria-label="Páginas da ficha de Mago"
          >
            <TabsTrigger value="principal">Principal</TabsTrigger>
            <TabsTrigger value="magia">Detalhes</TabsTrigger>
            <TabsTrigger value="combate">Combate</TabsTrigger>
            <TabsTrigger value="companheiros">Companheiros</TabsTrigger>
          </TabsList>
          <TabsContent forceMount={printLayout ? true : undefined} value="principal" data-page-title="Principal" className="ctl-sheet-page">
            <section className="sheet-identity-grid">
              <SheetField label="Nome" value={character.character.name} />
              <SheetField label="Caminho" value={data.path} />
              <SheetField
                label="Ordem"
                value={MTA_ORDER_LABELS[String(data.order)] ?? data.order}
              />
              <SheetField label="Jogador" value={character.character.player} />
              <SheetField label="Virtude" value={data.virtue} />
              <SheetField label="Vício" value={data.vice} />
              <SheetField label="Crônica" value="" />
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
  return (
    <h3 className="official-heading">
      <span>{children}</span>
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
              <strong>Condições concedidas:</strong> {conditions.join(", ")}
            </p>
          )}
          {attainments.length > 0 && (
            <p>
              <strong>Attainments concedidos:</strong> {attainments.join(", ")}
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
              )?.translatedName ?? item.name}
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
  return (
    <div className="official-field">
      <span>{label}</span>
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
  return (
    <section className="official-trait-block">
      <h4>{title}</h4>
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
  return (
    <div className="official-trait-line">
      <span>
        {name}
        {note && <small>{note}</small>}
      </span>
      <DotValue value={value} />
    </div>
  );
}
function DotValue({ value, max = 5 }: { value: number; max?: number }) {
  const total = Math.max(max, Math.ceil(value / 5) * 5);
  return (
    <span className="official-dots" aria-label={`${value} pontos`}>
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
) {
  const definition = line
    ? getMeritsForLine(line).find((entry) => entry.name === item.name)
    : [...getMeritsForLine("CtL"), ...getMeritsForLine("MtA")].find(
        (entry) => entry.name === item.name,
      );
  const base =
      definition?.translatedName ??
      (item.name === "Hollow" ? "Recanto" : item.name),
    detail = meritConfigurationTitle(item.configuration);
  return detail ? `${base}: ${detail}` : base;
}
function CompactValues({ values }: { values: Record<string, number> }) {
  return (
    <div className="compact-values">
      {Object.entries(values).map(([name, value]) => (
        <div key={name}>
          <span>{pretty(name)}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}
function ExpandedMeritList({ merits }: { merits: CharacterSheet["merits"] }) {
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
              ?.translatedName ?? meritLabel(item);
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
                    Consulte a descrição deste Mérito para distribuir ou usar
                    suas características internas.
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
      {!visible.length && <em>Nenhum Mérito Expandido adquirido.</em>}
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
  const weaponIds = stringList(character.line_data.combat_weapons),
    equipmentIds = stringList(character.line_data.combat_equipment),
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
        <p className="combat-note">
          Os valores de Defesa e Deslocamento já incluem a armadura vestida. A
          penalidade de Iniciativa aparece em cada arma equipada.
        </p>
        <SheetHeading>Resumo de Combate</SheetHeading>
        <div className="combat-rules">
          <article>
            <strong>Ataques</strong>
            <p>
              Desarmado: Força + Briga − Defesa. Corpo a corpo: Força + Armas
              Brancas − Defesa. Distância: Destreza + Armas de Fogo. Arremesso:
              Destreza + Esportes − Defesa.
            </p>
          </article>
          <article>
            <strong>Dano e Defesa</strong>
            <p>
              Some os sucessos ao dano da arma. Defesa diminui após cada ataque
              próximo recebido no turno; armas de fogo normalmente ignoram
              Defesa.
            </p>
          </article>
          <article>
            <strong>Iniciativa e Esquiva</strong>
            <p>
              Iniciativa é 1d10 + modificador, reduzida pela arma empunhada.
              Esquivar usa o dobro da Defesa como parada disputada.
            </p>
          </article>
          <article>
            <strong>Armadura</strong>
            <p>
              Proteção geral reduz ataques comuns; proteção balística reduz
              armas de fogo. Penalidades da armadura já aparecem nos valores
              acima.
            </p>
          </article>
        </div>
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
  const [search, setSearch] = useState("");
  const filtered = items.filter((item) =>
    `${item.name} ${describe(item)} ${details(item)}`
      .toLocaleLowerCase("pt-BR")
      .includes(search.toLocaleLowerCase("pt-BR")),
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <Plus />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="loadout-dialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Pesquise, compare as características e marque tudo que deseja
            adicionar à ficha.
          </DialogDescription>
        </DialogHeader>
        <label className="catalog-search">
          <Search />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou característica"
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
                    {active ? "Remover" : "Adicionar"}
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
            <Button type="button">Concluir</Button>
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
        <p className="combat-note">
          O modificador se aplica às paradas de Destreza + Condução. Acima da
          Velocidade segura, ele é aplicado novamente e falhas de manobra
          tornam-se falhas dramáticas.
        </p>
        <LoadoutCatalog
          title="Selecionar Veículos"
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
                    <small>Veículo</small>
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
            placeholder="Nome do animal (opcional)"
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
            Adicionar animal
          </Button>
        </div>
        <p className="combat-note">
          Animais comuns podem ser adicionados livremente; não exigem Mérito.
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
          {FAE_MOUNT_ABILITIES.map(([id, label, description]) => {
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
        {FAMILIAR_NUMINA.map((item) => {
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
        aria-label={`Lucidez atual ${current} de ${maximum}`}
      >
        {Array.from({ length: maximum }, (_, index) => {
          const level = damage[index];
          return (
            <button
              type="button"
              key={index}
              className={`health-box clarity-box ${level ?? "empty"}`}
              onClick={() => cycle(index)}
              aria-label={`Caixa ${index + 1}: ${level === "mild" ? "dano leve" : level === "severe" ? "dano grave" : "vazia"}. Clique para alterar.`}
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
        <span>Lucidez atual</span>
        <strong>
          {current} / {maximum}
        </strong>
      </div>
      <p className="tracker-help">
        <span className="legend-mark mild" />
        Leve <span className="legend-mark severe" />
        Grave · as três caixas à direita podem gerar Condições de Lucidez
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const chosen = new Map(selected.map((item) => [item.id, item]));
  const categories = [
    "Todas",
    ...Array.from(new Set(catalog.map((item) => item.category))),
  ];
  const filtered = catalog.filter(
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
          const tooltip = `${condition.description}${condition.penalty ? `\nEfeito: ${condition.penalty}` : ""}\nResolução: ${condition.resolution ?? "—"}${condition.beat ? `\nBeat: ${condition.beat}` : ""}\n${condition.source} · p. ${condition.page}`;
          return (
            <div
              key={condition.id}
              className="selected-condition"
              title={tooltip}
            >
              <span>
                <strong>
                  {condition.name}
                  {saved.persistent ? " [P]" : ""}
                </strong>
                {inlinePenalty && <>. {condition.penalty}</>}
                <small>
                  {condition.sourceCode} · p. {condition.page}
                  {condition.penalty && !inlinePenalty
                    ? " · passe o mouse para ver efeitos, resolução e Beats"
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
                aria-label={`Remover ${condition.name}`}
              >
                <X />
              </Button>
            </div>
          );
        })}
        {!selected.length && <em>Nenhuma Condição selecionada.</em>}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" size="sm" variant="outline">
            <Plus /> Selecionar Condição
          </Button>
        </DialogTrigger>
        <DialogContent className="condition-dialog">
          <DialogHeader>
            <DialogTitle>Selecionar Condição</DialogTitle>
            <DialogDescription>
              Escolha uma Condição e marque-a como Persistente quando
              necessário.
            </DialogDescription>
          </DialogHeader>
          <div className="condition-filters">
            <label>
              <Search />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome, efeito ou fonte"
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
                      {condition.name}
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
                      <b>Efeito:</b> {condition.penalty}
                    </p>
                  )}
                  <p>
                    <b>Resolução:</b>{" "}
                    {condition.resolution ?? "Conforme a fonte indicada."}
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
                    Persistente [P]
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
                    {saved ? "Remover" : "Adicionar"}
                  </Button>
                </article>
              );
            })}
            {!filtered.length && <em>Nenhuma Condição encontrada.</em>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Concluir</Button>
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
  return (
    <div className="notes-area">
      <Textarea
        key={value}
        defaultValue={value}
        onBlur={(event) => onChange(event.target.value)}
        placeholder="Escreva livremente suas anotações..."
        aria-label="Anotações da ficha"
      />
      <small>Salvo automaticamente ao sair do campo.</small>
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
    }
  | { kind: "specialty"; skill: string; name: string }
  | { kind: "contract"; id: string }
  | { kind: "benefit"; contractId: string; seeming: string }
  | { kind: "wyrd"; previous: number }
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
  const homebrews = useHomebrews();
  const contractsCatalog = [...CONTRACTS.filter(item=>!isBuiltinHomebrew(item.sourceId)||isHomebrewActive(homebrews,item.sourceId)), ...homebrews.contracts.filter(item=>isHomebrewActive(homebrews,item.id))];
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
  const benefitOptions = ownedContracts.flatMap((saved) => {
    const definition = findContract(String(saved.id ?? saved.name ?? ""));
    return definition
      ? Object.keys(definition.seemingBenefits ?? {})
          .filter(
            (seeming) =>
              seeming !== String(character.line_data.seeming) &&
              !extraKeys.has(`${definition.id}::${seeming}`),
          )
          .map((seeming) => ({
            value: `${definition.id}::${seeming}`,
            label: `${definition.name} · ${CTL_SEEMING_LABELS[seeming] ?? seeming}`,
          }))
      : [];
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
    if (!entry.undo)
      return setFeedback(
        "Esta compra antiga não contém dados suficientes para ser revertida.",
      );
    const next = structuredClone(character);
    const undo = entry.undo;
    if (undo.kind === "trait") next[undo.group][undo.name] = undo.previous;
    else if (undo.kind === "merit") {
      const indexed = undo.instanceIndex ?? -1,
        index =
          indexed >= 0 && next.merits[indexed]?.name === undo.name
            ? indexed
            : next.merits.findIndex(
                (item) => item.name === undo.name && !item.grantedBy,
              );
      if (undo.previousDots === null) {
        if (index >= 0) next.merits.splice(index, 1);
      } else if (index >= 0) next.merits[index].dots = undo.previousDots;
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
    else if (undo.kind === "wyrd")
      next.line_data = { ...next.line_data, wyrd: undo.previous };
    else
      next.current_state = {
        ...next.current_state,
        willpower_lost_dots: undo.previousLost,
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
        },
        (next) => {
          const found = ownedMerit ? next.merits[targetIndex] : undefined;
          if (found && found.name === selectedMerit.name)
            found.dots = nextMeritRating;
          else
            next.merits.push({
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
        return setFeedback("Não há Benefício de outra Feição disponível.");
      const [chosenContract, seeming] = value.split("::");
      const definition = findContract(chosenContract);
      spend(
        1,
        `Benefício de ${CTL_SEEMING_LABELS[seeming] ?? seeming} · ${definition?.name ?? "Contrato"}`,
        { kind: "benefit", contractId: chosenContract, seeming },
        (next) => {
          const existing = objectList(next.line_data.extra_contract_benefits);
          next.line_data = {
            ...next.line_data,
            extra_contract_benefits: [
              ...existing,
              { contractId: chosenContract, seeming },
            ],
          };
        },
      );
      return;
    }
    if (purchaseType === "Fado") {
      if (wyrd >= 10) return setFeedback("Fado já atingiu 10.");
      spend(5, `Fado ${wyrd + 1}`, { kind: "wyrd", previous: wyrd }, (next) => {
        next.line_data = { ...next.line_data, wyrd: wyrd + 1 };
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
          <span>Beats e Experiência</span>
          <small>Beats são marcados separadamente da Experiência</small>
        </div>
        <Badge variant="outline">{available} EXP disponível</Badge>
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
            aria-label="Experiência disponível"
          />
          <span>EXP disponível</span>
        </label>
        <div>
          <strong>{total}</strong>
          <span>EXP total</span>
        </div>
        <div>
          <strong>{spentXp}</strong>
          <span>EXP gasta</span>
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
          Limpar
        </Button>
      </fieldset>
      <div className="experience-actions">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              <Sparkles /> Comprar característica
            </Button>
          </DialogTrigger>
          <DialogContent className="experience-dialog">
            <DialogHeader>
              <DialogTitle>Gastar Experiência</DialogTitle>
              <DialogDescription>
                Custos de Changeling the Lost, p. 94. Cada compra registra
                automaticamente a despesa e atualiza a ficha.
              </DialogDescription>
            </DialogHeader>
            <div className="experience-purchase-form">
              <label>
                Tipo
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
                  Atributo
                  <RuleSelect
                    value={attribute}
                    onChange={setAttribute}
                    options={ATTRIBUTE_OPTIONS}
                  />
                </label>
              )}
              {purchaseType === "Perícia" && (
                <label>
                  Perícia
                  <RuleSelect
                    value={skill}
                    onChange={setSkill}
                    options={SKILL_OPTIONS}
                  />
                </label>
              )}
              {purchaseType === "Mérito" && (
                <label>
                  Mérito
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
                    Perícia
                    <RuleSelect
                      value={specialtySkill}
                      onChange={setSpecialtySkill}
                      options={SKILL_OPTIONS}
                    />
                  </label>
                  <label>
                    Especialização
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
                  Contrato
                  <ExperiencePowerPicker
                    kind="Contrato"
                    items={contractOptions.map((item) => ({
                      id: item.id,
                      name: item.name,
                      category: item.regalia,
                      secondaryCategory: item.type,
                      description: item.description,
                      meta: `${item.type} · ${item.regalia} · ${item.source} · p. ${item.page || "—"}`,
                    }))}
                    selectedId={selectedContract?.id ?? ""}
                    onSelect={setContractId}
                  />
                </label>
              )}
              {purchaseType === "Benefício de Contrato" && (
                <label>
                  Benefício
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
                {preview.cost} Experiência{preview.cost === 1 ? "" : "s"}
              </span>
            </div>
            {feedback && <p className="experience-feedback">{feedback}</p>}
            <details className="experience-rules">
              <summary>Tabela completa e formas de ganhar Beats</summary>
              <ExperienceRules />
            </details>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
              </DialogClose>
              <Button
                type="button"
                disabled={preview.cost < 1 || available < preview.cost}
                onClick={buy}
              >
                Comprar por {preview.cost} EXP
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={markWillpowerLoss}
        >
          Registrar perda permanente de FV
        </Button>
      </div>
      {feedback && <p className="experience-feedback compact">{feedback}</p>}
      <details className="experience-history">
        <summary>
          <History /> Gastos de Experiência ({history.length})
        </summary>
        <div>
          {history.length ? (
            history.slice(0, 12).map((entry) => (
              <p key={entry.id}>
                <span>{entry.description}</span>
                <strong>{Math.abs(entry.experience)} EXP</strong>
                <small>
                  {new Date(entry.createdAt).toLocaleDateString("pt-BR")}
                </small>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!entry.undo}
                  onClick={() => revertPurchase(entry)}
                >
                  <RotateCcw /> Reverter
                </Button>
              </p>
            ))
          ) : (
            <em>Nenhum gasto registrado.</em>
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
      next.line_data = {
        ...next.line_data,
        gnosis: Number(next.line_data.gnosis ?? 1) + 1,
      };
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
    const entry: MageXpEntry = {
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
    const next = structuredClone(character);
    next.attributes = entry.before.attributes;
    next.skills = entry.before.skills;
    next.merits = entry.before.merits;
    next.specializations = entry.before.specializations;
    next.line_data = entry.before.line_data;
    next.current_state = {
      ...next.current_state,
      willpower_lost_dots:
        entry.previousLostWillpower ?? next.current_state?.willpower_lost_dots,
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
          <span>Experiência</span>
          <small>Experiência comum e Arcana possuem reservas separadas</small>
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
          <span>EXP disponível</span>
        </label>
        <label className="experience-input">
          <Input
            type="number"
            min={0}
            value={arcaneInput}
            onChange={(e) => setArcaneInput(e.target.value)}
            onBlur={commitBalances}
          />
          <span>EXP Arcana disponível</span>
        </label>
      </div>
      <BeatTrack
        label="Beats"
        value={beats}
        onChange={(value) => saveBalances({ mage_experience_beats: value })}
      />
      <BeatTrack
        label="Beats Arcanos"
        value={arcaneBeats}
        onChange={(value) => saveBalances({ arcane_experience_beats: value })}
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Sparkles /> Comprar característica
          </Button>
        </DialogTrigger>
        <DialogContent className="experience-dialog">
          <DialogHeader>
            <DialogTitle>Gastar Experiência de Mago</DialogTitle>
            <DialogDescription>
              Custos de Mage the Awakening, pp. 83–85. Para Gnose e Arcanos
              dentro do limite, escolha como dividir o gasto.
            </DialogDescription>
          </DialogHeader>
          <div className="experience-purchase-form">
            <label>
              Tipo
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
                Mérito
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
                Característica
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
                        name: spell.name,
                        category: mainArcanum,
                        secondaryCategory: `Nível ${level}`,
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
                  Experiência comum
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
                  Experiência Arcana
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
              {splitRegular} EXP + {splitArcane} EXP Arcana
            </span>
          </div>
          {feedback && <p className="experience-feedback">{feedback}</p>}
          <details className="experience-rules">
            <summary>Tabela completa e formas de ganhar Beats</summary>
            <MageExperienceRules />
          </details>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
            <Button
              type="button"
              disabled={
                cost < 1 || regular < splitRegular || arcane < splitArcane
              }
              onClick={buy}
            >
              Comprar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <details className="experience-history">
        <summary>
          <History /> Gastos de Experiência ({history.length})
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
                  {new Date(entry.createdAt).toLocaleDateString("pt-BR")}
                </small>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => revert(entry)}
                >
                  <RotateCcw /> Reverter
                </Button>
              </p>
            ))
          ) : (
            <em>Nenhum gasto registrado.</em>
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
  return (
    <div className="beat-resource">
      <span>{label}</span>
      <div
        className="resource-track"
        role="group"
        aria-label={`${label}: ${value} de 5`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index < value ? "filled" : ""}
            onClick={() => onChange(index < value ? index : index + 1)}
            aria-label={`Definir ${label} como ${index < value ? index : index + 1}`}
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
          Registrar perda permanente de FV
        </Button>
      )}
    </div>
  );
}
function MageExperienceRules() {
  const beats = [
    "Cumprir ou avançar uma Aspiração",
    "Resolver uma Condição",
    "Aceitar falha dramática",
    "Fim do capítulo",
  ];
  const arcane = [
    "Cumprir ou avançar uma Obsessão",
    "Resolver Condição criada por magia, Paradoxo ou efeito mágico",
    "Falha dramática em conjuração",
    "Arriscar Ato de Hubris",
    "Tutoria de Legado",
    "Encontro novo e significativo com o sobrenatural",
  ];
  const costs = [
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
  return (
    <div className="experience-rules-grid">
      <table>
        <caption>Beats comuns e Arcanos</caption>
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
              <td>1 Beat Arcano</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <caption>Custos</caption>
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
  const visible = items.filter(
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
          <span>{selected?.name ?? `Selecionar ${kind}`}</span>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="merit-dialog experience-merit-dialog">
        <DialogHeader>
          <DialogTitle>Comprar {kind}</DialogTitle>
          <DialogDescription>
            O catálogo mostra somente opções disponíveis para este personagem.
          </DialogDescription>
        </DialogHeader>
        <div className="catalog-filters">
          <label className="merit-search">
            <Search />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Buscar ${kind.toLocaleLowerCase("pt-BR")}, fonte ou descrição`}
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
                    Selecionar
                  </Button>
                </DialogClose>
              </div>
            </article>
          ))}
          {!visible.length && <em>Nenhuma opção corresponde aos filtros.</em>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
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
  const homebrews = useHomebrews();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const catalog = [
      ...getMeritsForLine(line).filter(item=>!isBuiltinHomebrew(item.sourceId)||isHomebrewActive(homebrews,item.sourceId)),
      ...homebrews.merits.filter(
        (item) => (item.line === "Core" || item.line === line) && isHomebrewActive(homebrews,item.id),
      ),
    ],
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
              ? `${selected.translatedName} ${targetDots}`
              : "Selecionar Mérito e pontos"}
          </span>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="merit-dialog experience-merit-dialog">
        <DialogHeader>
          <DialogTitle>Comprar Mérito</DialogTitle>
          <DialogDescription>
            Escolha o Mérito e a quantidade de pontos. Nos Méritos repetíveis,
            escolha entre aumentar uma instância existente ou criar outra.
          </DialogDescription>
        </DialogHeader>
        <div className="catalog-filters">
          <label className="merit-search">
            <Search />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, descrição, requisito ou fonte"
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
                    <strong>{item.translatedName}</strong>
                    <small>
                      {item.source} · p. {item.page || "—"}
                      {repeatable ? " · pode ser comprado várias vezes" : ""}
                    </small>
                    <p>{item.description}</p>
                    {item.prerequisites && (
                      <p>
                        <b>Pré-requisitos:</b> {item.prerequisites}
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
                              Aumentar{" "}
                              {meritConfigurationTitle(owned.configuration) ||
                                `instância ${instanceNumber + 1}`}{" "}
                              para {dot}
                            </Button>
                          </DialogClose>
                        )),
                    )}
                    {(repeatable || !instances.length) &&
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
                              ? "Nova instância · "
                              : ""}
                            {dot} ponto{dot === 1 ? "" : "s"}
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
              Cancelar
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
  const safe = options.length ? value || options[0].value : "__none";
  const groups = [...new Set(options.map((item) => item.group).filter(Boolean))];
  return (
    <Select value={safe} onValueChange={onChange} disabled={!options.length}>
      <SelectTrigger>
        <SelectValue>
          {options.find((item) => item.value === safe)?.label ??
            "Nenhuma opção disponível"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.length ? (
          groups.length ? (
            groups.map((group, groupIndex) => (
              <SelectGroup key={group}>
                {groupIndex > 0 && <SelectSeparator />}
                <SelectLabel>{group}</SelectLabel>
                {options
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
              </SelectGroup>
            ))
          ) : (
            options.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))
          )
        ) : (
          <SelectItem value="__none" disabled>
            Nenhuma opção disponível
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
    ForçaDeVontade: Number(a.Perseverança ?? 1) + Number(a.Autocontrole ?? 1),
    Iniciativa: Number(a.Destreza ?? 1) + Number(a.Autocontrole ?? 1),
    Defesa:
      Math.min(Number(a.Destreza ?? 1), Number(a.Raciocínio ?? 1)) +
      Number(s.Esportes ?? 0),
    LucidezMaxima: Number(a.Raciocínio ?? 1) + Number(a.Autocontrole ?? 1),
  };
}
function derivedWithPermanentMerits(character: CharacterSheet) {
  const derived = { ...character.derived };
  const grantedSkills = (
    character.line_data.merit_granted_skill_bonuses &&
    typeof character.line_data.merit_granted_skill_bonuses === "object"
      ? character.line_data.merit_granted_skill_bonuses
      : {}
  ) as Record<string, number>;
  derived.Defesa =
    Number(derived.Defesa ?? 0) + (Number(grantedSkills.Esportes) || 0);
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
  const beatRows = [
    "Cumprir uma Aspiração",
    "Resolver uma Condição",
    "Aceitar uma falha dramática",
    "Render-se em combate",
    "Sofrer dano nas caixas finais de Vitalidade",
    "Encerrar uma sessão",
    "Sofrer dano de Lucidez",
    "Liberar Desvario involuntariamente",
  ];
  const costRows = [
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
  return (
    <div className="experience-rules-grid">
      <table>
        <caption>Formas de ganhar Beats</caption>
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
        <caption>Tabela de custos</caption>
        <thead>
          <tr>
            <th>Característica</th>
            <th>EXP</th>
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
  return (
    <div className="goblin-debt-block">
      <h4>Débito Goblin</h4>
      <div
        className="goblin-debt-track"
        role="group"
        aria-label={`Débito Goblin: ${value} de 9`}
      >
        {Array.from({ length: 9 }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index < value ? "filled" : ""}
            onClick={() => onChange(index < value ? index : index + 1)}
            aria-label={`Definir Débito Goblin como ${index < value ? index : index + 1}`}
          />
        ))}
      </div>
      <p>
        {value}/9 · ao receber o décimo ponto, o personagem adquire a Condição
        Habitante da Sebe.
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
  return (
    <div className="tracker-block">
      <div
        className="resource-track"
        role="group"
        data-label={label}
        aria-label={`${label}: ${current} de ${maximum}`}
      >
        {Array.from({ length: maximum }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index < current ? "filled" : ""}
            onClick={() => onChange(index < current ? index : index + 1)}
            aria-label={`Definir ${label} como ${index < current ? index : index + 1}`}
          />
        ))}
      </div>
      <div className="tracker-meta">
        <span>Atual</span>
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
}: {
  name: string;
  rating: number;
  resourceName: string;
  current: number;
  maximum: number;
  perTurn: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="power-resource">
      <div className="power-rating">
        <span>{name}</span>
        <DotValue value={rating} max={10} />
      </div>
      <ResourceTrack
        label={resourceName}
        current={current}
        maximum={maximum}
        onChange={onChange}
      />
      <p className="tracker-help">
        {resourceName} máximo: <strong>{maximum}</strong> · gasto por turno:{" "}
        <strong>{perTurn}</strong>
      </p>
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
        sourceId: item?.sourceId ? String(item.sourceId) : undefined,
        source: item?.source ? String(item.source) : undefined,
        configuration: normalizeMeritConfiguration(item?.configuration),
        grantedBy: item?.grantedBy ? String(item.grantedBy) : undefined,
      }))
    : [];
  next.line_data =
    next.line_data && typeof next.line_data === "object" ? next.line_data : {};
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
  return (
    <div className="mage-spell-lines">
      {items.map((item, index) => (
        <div
          key={`${String(item.id ?? item.name)}-${index}`}
          title={String(item.description ?? "")}
        >
          <strong>{String(item.name ?? item.originalName ?? "")}</strong>
          <small>
            {Object.entries((item.requirements ?? {}) as Record<string, number>)
              .map(([name, dots]) => `${name} ${dots}`)
              .join(" · ")}
            {showSkill && item.roteSkill ? ` · ${String(item.roteSkill)}` : ""}
          </small>
        </div>
      ))}
      {!items.length && <em>Nenhum registro.</em>}
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
              <span>{meritLabel(item, line)}</span>
              <DotValue value={item.dots} max={Math.max(5, item.dots)} />
            </div>
          );
        })
      ) : (
        <em>Nenhum Mérito selecionado</em>
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
  return (
    <div className="official-lines">
      {contracts
        .filter((item) => item.name)
        .map((item, index) => {
          const definition = findContract(String(item.id ?? item.name ?? ""));
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
              title={`${description}\nParada de dados: ${dicePool}\nBrecha: ${definition?.loophole ?? "Não informada"}${benefit ? `\nBenefício de ${CTL_SEEMING_LABELS[seeming] ?? seeming}: ${benefit}` : ""}`}
            >
              <span>{definition?.name ?? String(item.name)}</span>
              <small>
                {definition?.regalia ?? String(item.regalia ?? "")} ·{" "}
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
}: {
  contracts: Array<Record<string, unknown>>;
  seeming: string;
  court: string;
  extraBenefits?: Array<Record<string, unknown>>;
}) {
  return (
    <div className="contract-power-list">
      {contracts
        .filter((item) => item.name)
        .map((item, index) => {
          const definition =
            findContract(String(item.id ?? item.name ?? "")) ??
            (item as unknown as ContractDefinition);
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
          return (
            <article key={`${definition.id}-${index}`}>
              <div className="contract-power-title">
                <strong>{definition.name}</strong>
                <Badge variant={definition.goblin ? "default" : "outline"}>
                  {definition.goblin ? "Goblin · Comum" : definition.type}
                </Badge>
              </div>
              <small>
                {definition.regalia} · {definition.source} · p.{" "}
                {definition.page}
              </small>
              <p>{definition.description}</p>
              {definition.success && (
                <p className="rule-detail">
                  <strong>Efeito / Sucesso:</strong> {definition.success}
                </p>
              )}
              {definition.exceptionalSuccess && (
                <p className="rule-detail">
                  <strong>Sucesso excepcional:</strong>{" "}
                  {definition.exceptionalSuccess}
                </p>
              )}
              {definition.options?.length && (
                <div className="contract-options">
                  <strong>Opções</strong>
                  <ul>
                    {definition.options.map((option) => (
                      <li key={option}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
              <dl>
                <div>
                  <dt>Custo</dt>
                  <dd>{definition.cost ?? "Conforme descrição"}</dd>
                </div>
                <div>
                  <dt>Parada de dados</dt>
                  <dd>{definition.dicePool}</dd>
                </div>
                <div>
                  <dt>Ação / Duração</dt>
                  <dd>
                    {definition.action ?? "Instantânea"} ·{" "}
                    {definition.duration ?? "Cena"}
                  </dd>
                </div>
                <div>
                  <dt>Brecha</dt>
                  <dd>{definition.loophole}</dd>
                </div>
                {benefits.map((benefit) => (
                  <div key={benefit.key}>
                    <dt>
                      Benefício de{" "}
                      {CTL_SEEMING_LABELS[benefit.key] ?? benefit.key}
                    </dt>
                    <dd>{benefit.text}</dd>
                  </div>
                ))}
                {courtBenefit && (
                  <div>
                    <dt>Benefício da Corte {court}</dt>
                    <dd>{courtBenefit}</dd>
                  </div>
                )}
                {definition.goblin && (
                  <div className="goblin-debt-row">
                    <dt>Débito Goblin</dt>
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
  const definition = CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS];
  if (!definition)
    return <LorePanel title="Feição" text="Nenhuma Feição selecionada." />;
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
        title={`Bênção de ${definition.translated}`}
        text={definition.blessing}
        source={`Changeling the Lost · p. ${page}`}
      />
      <LorePanel
        title={`Maldição de ${definition.translated}`}
        text={definition.curse}
        source={`Changeling the Lost · p. ${page}`}
      />
    </>
  );
}
function KithLore({ data }: { data: Record<string, unknown> }) {
  const definition = findKith(data.kith);
  const name = String(data.kith ?? "");
  const skill = String(data.kith_skill ?? definition?.skill ?? "");
  const description = String(
    data.kith_description ?? definition?.description ?? "",
  );
  const blessing = String(data.kith_blessing ?? definition?.blessing ?? "");
  const source = String(data.kith_source ?? definition?.source ?? "");
  const page = Number(data.kith_page ?? definition?.page ?? 0);
  if (!name)
    return (
      <LorePanel
        title="Bênção da Fratria"
        text="Nenhuma Fratria selecionada."
      />
    );
  return (
    <LorePanel
      title={`Bênção de ${name}`}
      intro={data.kith_custom ? undefined : description}
      text={`${skill ? `${skill}. ` : ""}${blessing || description}`}
      source={source ? `${source}${page ? ` · p. ${page}` : ""}` : undefined}
    />
  );
}
function CustomCourtLore({
  data,
  merits,
}: {
  data: Record<string, unknown>;
  merits: CharacterSheet["merits"];
}) {
  const raw = data.custom_court;
  if (!raw || typeof raw !== "object") return null;
  const court = raw as Record<string, unknown>,
    benefits = Array.isArray(court.mantleBenefits)
      ? court.mantleBenefits.map(String)
      : [],
    dots =
      merits.find(
        (item) => item.name === "Mantle" && item.grantedBy === "Corte",
      )?.dots ?? 1;
  return (
    <article className="lore-panel">
      <h4>Manto: {String(court.name ?? data.court ?? "")}</h4>
      <small>Sentimento da Corte: {String(court.emotion ?? "")}</small>
      {benefits.slice(0, dots).map((benefit, index) => (
        <p key={index}>
          <strong>Manto {index + 1}:</strong> {benefit}
        </p>
      ))}
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
  const rows = [
    ...rotes.map((item) => ({ kind: "Rota", item })),
    ...praxes.map((item) => ({ kind: "Práxis", item })),
  ];
  return (
    <div className="official-lines">
      {rows.map(({ kind, item }, index) => (
        <div
          key={`${kind}-${String(item.id ?? item.name)}-${index}`}
          title={`${String(item.description ?? "")}\nPrática: ${String(item.practice ?? "")} · Fator Primário: ${String(item.primaryFactor ?? "")}${item.withstand ? ` · Resistência: ${String(item.withstand)}` : ""}`}
        >
          <span>
            {kind} · {String(item.name ?? item.originalName ?? "")}
          </span>
          <small>
            {kind === "Rota" && item.roteSkill
              ? `Perícia: ${String(item.roteSkill)} · `
              : ""}
            {String(item.source ?? "")} · p. {String(item.page ?? "—")}
          </small>
        </div>
      ))}
    </div>
  );
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
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="kicker">BANCO COMPARTILHADO</span>
          <h3>Regras ativas para todos</h3>
          <p>
            Não há fila de aprovação. Ajustes posteriores substituem a versão
            compartilhada.
          </p>
        </div>
        <Badge className="approved-badge">ATIVAS</Badge>
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
              Fonte: {rule.sourceId} · {rule.reviewStatus}
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
