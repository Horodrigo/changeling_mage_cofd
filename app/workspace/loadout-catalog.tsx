"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import { systemTerm } from "@/lib/system-terms";
import { SelectableCatalogCard } from "../selectable-catalog-card";
export function LoadoutCatalog<T extends { id: string; name: string }>({
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
  const { locale, t }=useLanguage();
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
          {systemTerm(title,locale)}
        </Button>
      </DialogTrigger>
      <DialogContent className="loadout-dialog">
        <DialogHeader>
          <DialogTitle>{systemTerm(title,locale)}</DialogTitle>
          <DialogDescription>
            {t("ui.searchCompareTraitsAndSelectEverythingYouWant")}
          </DialogDescription>
        </DialogHeader>
        <label className="catalog-search">
          <Search />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("ui.searchByNameOrTrait")}
          />
        </label>
        <div className="loadout-catalog">
          {filtered.map((item) => {
            const active = selected.includes(item.id);
            return (
              <SelectableCatalogCard
                key={item.id}
                selected={active}
                label={`${active ? t("ui.remove7d41cc") : t("ui.add")} ${item.name}`}
                onToggle={() =>
                  onChange(
                    active
                      ? selected.filter((id) => id !== item.id)
                      : [...selected, item.id],
                  )
                }
              >
                <header>
                  <strong>{item.name}</strong>
                </header>
                <small>{describe(item)}</small>
                <p>{details(item)}</p>
              </SelectableCatalogCard>
            );
          })}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size="sm" className="catalog-dialog-done">{t("ui.done")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
