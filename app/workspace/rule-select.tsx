"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import { systemTerm } from "@/lib/system-terms";

export type RuleSelectOption={value:string;label:string;group?:string};

const TRAIT_GROUPS: Array<[string, readonly string[]]> = [
  ...Object.entries(ATTRIBUTES),
  ...Object.entries(SKILLS),
];

function inferredTraitGroup(value: string) {
  return TRAIT_GROUPS.find(([, values]) => values.includes(value))?.[0];
}

export function RuleSelect({value,onChange,options}:{value:string;onChange:(value:string)=>void;options:RuleSelectOption[]}){
  const {locale}=useLanguage();
  const normalizedOptions=options.map((item)=>item.group?item:{...item,group:inferredTraitGroup(item.value)});
  const safe=normalizedOptions.length?value||normalizedOptions[0].value:"__none";
  const grouped=normalizedOptions.some(item=>Boolean(item.group));
  const sortedOptions=grouped?normalizedOptions:alphabetical(normalizedOptions,item=>systemTerm(item.label,locale),locale);
  const groups=[...new Set(sortedOptions.map(item=>item.group).filter(Boolean))];
  const ungrouped=sortedOptions.filter((item)=>!item.group);
  return <Select value={safe} onValueChange={onChange} disabled={!sortedOptions.length}>
    <SelectTrigger><SelectValue>{systemTerm(sortedOptions.find(item=>item.value===safe)?.label??"Nenhuma opção disponível",locale)}</SelectValue></SelectTrigger>
    <SelectContent>{sortedOptions.length?(groups.length?<>
      {ungrouped.map(item=><SelectItem key={item.value} value={item.value}>{systemTerm(item.label,locale)}</SelectItem>)}
      {groups.map((group,index)=><SelectGroup key={group}>{(index>0||ungrouped.length>0)&&<SelectSeparator/>}<SelectLabel>{systemTerm(group!,locale)}</SelectLabel>{sortedOptions.filter(item=>item.group===group).map(item=><SelectItem key={item.value} value={item.value}>{systemTerm(item.label,locale)}</SelectItem>)}</SelectGroup>)}
    </>:sortedOptions.map(item=><SelectItem key={item.value} value={item.value}>{systemTerm(item.label,locale)}</SelectItem>)):<SelectItem value="__none" disabled>{systemTerm("Nenhuma opção disponível",locale)}</SelectItem>}</SelectContent>
  </Select>;
}
