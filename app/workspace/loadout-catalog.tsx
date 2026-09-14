"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import { workspaceTerm } from "./workspace-i18n";
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
              <SelectableCatalogCard
                key={item.id}
                selected={active}
                label={`${active ? tr("Remover","Remove") : tr("Adicionar","Add")} ${item.name}`}
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
            <Button type="button" size="sm" className="catalog-dialog-done">{tr("Concluir","Done")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
