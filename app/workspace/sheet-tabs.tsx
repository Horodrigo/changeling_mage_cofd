"use client";

import { useRef, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/lib/i18n";

export type SheetTab={value:string;label:string;hidden?:boolean};

export function SwipeableSheetTabs({tabs,children,value,onValueChange}:{tabs:SheetTab[];children:Record<string,ReactNode>;value:string;onValueChange:(value:string)=>void}){
  const {tr}=useLanguage();
  const touchStart=useRef<{x:number;y:number}|null>(null);
  const select=(next:string)=>{onValueChange(next);requestAnimationFrame(()=>document.querySelector(`[data-mobile-tab="${next}"]`)?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}));};
  const visibleTabs=tabs.filter(tab=>!tab.hidden);
  return <Tabs value={value} onValueChange={select} className="ctl-sheet-tabs mobile-sheet-tabs">
    <TabsList className="ctl-sheet-tab-list" aria-label={tr("Seções da ficha","Character sections")}>{visibleTabs.map(tab=><TabsTrigger key={tab.value} value={tab.value} data-mobile-tab={tab.value}>{tab.label}</TabsTrigger>)}</TabsList>
    <div className="mobile-swipe-area" onTouchStart={event=>{const touch=event.changedTouches[0];touchStart.current={x:touch.clientX,y:touch.clientY};}} onTouchEnd={event=>{const start=touchStart.current;touchStart.current=null;if(!start)return;const touch=event.changedTouches[0],dx=touch.clientX-start.x,dy=touch.clientY-start.y;if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.25)return;const index=visibleTabs.findIndex(tab=>tab.value===value),next=dx<0?index+1:index-1;if(visibleTabs[next])select(visibleTabs[next].value);}}>
      {tabs.map(tab=><TabsContent key={tab.value} value={tab.value} className="ctl-sheet-page mobile-sheet-page">{children[tab.value]}</TabsContent>)}
    </div>
  </Tabs>;
}
