"use client";

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
import { useLanguage } from "@/lib/i18n";

export default function DeleteCharacterDialog({
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
  const { tr } = useLanguage();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tr(`Excluir “${name}”?`, `Delete “${name}”?`)}</AlertDialogTitle>
          <AlertDialogDescription>
            {tr(
              "A ficha será removida do armazenamento deste navegador. Exporte o JSON antes se quiser conservar uma cópia.",
              "This character will be removed from this browser's storage. Export the JSON first if you want to keep a copy.",
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel size="sm" className="catalog-dialog-done">{tr("Cancelar", "Cancel")}</AlertDialogCancel>
          <AlertDialogAction size="sm" className="catalog-dialog-done" variant="destructive" onClick={onDelete}>
            {tr("Excluir definitivamente", "Delete permanently")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
