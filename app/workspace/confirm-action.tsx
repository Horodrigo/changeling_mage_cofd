"use client";
import type { ReactNode } from "react";
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/lib/i18n";

export function ConfirmAction({trigger,title,description,action,onConfirm,destructive=true}:{trigger:ReactNode;title:string;description:string;action:string;onConfirm:()=>void;destructive?:boolean}){
  const {tr}=useLanguage();
  return <AlertDialog><AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{title}</AlertDialogTitle><AlertDialogDescription>{description}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel size="sm" className="catalog-dialog-done">{tr("Cancelar","Cancel")}</AlertDialogCancel><AlertDialogAction size="sm" className="catalog-dialog-done" variant={destructive?"destructive":"default"} onClick={onConfirm}>{action}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
