import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import type { CatalogGroupsBySurface } from "./catalog-groups";
import type { GameLineRulesModule } from "./game-line-rules";
import type {
  GameLineBuilderModule,
  GameLineHomebrewModule,
  GameLineSheetModule,
} from "./game-line-ui";

/**
 * Eager registration metadata plus independently lazy surface loaders.
 * Registrations must not statically import their builder, sheet, rules, or
 * homebrew implementations.
 */
export interface GameLineRegistration {
  id: PersistedGameLineId;
  slug: string;
  label: string;
  iconSrc: string;
  cardClass: string;
  summaryClass: string;
  catalogGroups: CatalogGroupsBySurface;
  loadRules: () => Promise<GameLineRulesModule>;
  loadBuilder: () => Promise<GameLineBuilderModule>;
  loadSheet: () => Promise<GameLineSheetModule>;
  loadHomebrew: () => Promise<GameLineHomebrewModule>;
}
