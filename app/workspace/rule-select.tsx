"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import { systemTerm } from "@/lib/system-terms";

export type RuleSelectOption={value:string;label:string;group?:string};

export function RuleSelect({value,onChange,options}:{value:string;onChange:(value:string)=>void;options:RuleSelectOption[]}){
  const {locale}=useLanguage();
  const safe=options.length?value||options[0].value:"__none";
  const grouped=options.some(item=>Boolean(item.group));
  const sortedOptions=grouped?options:alphabetical(options,item=>systemTerm(item.label,locale),locale);
  const groups=[...new Set(sortedOptions.map(item=>item.group).filter(Boolean))];
  return <Select value={safe} onValueChange={onChange} disabled={!sortedOptions.length}>
    <SelectTrigger><SelectValue>{systemTerm(sortedOptions.find(item=>item.value===safe)?.label??"Nenhuma opção disponível",locale)}</SelectValue></SelectTrigger>
    <SelectContent>{sortedOptions.length?(groups.length?groups.map((group,index)=><SelectGroup key={group}>{index>0&&<SelectSeparator/>}<SelectLabel>{systemTerm(group!,locale)}</SelectLabel>{sortedOptions.filter(item=>item.group===group).map(item=><SelectItem key={item.value} value={item.value}>{systemTerm(item.label,locale)}</SelectItem>)}</SelectGroup>):sortedOptions.map(item=><SelectItem key={item.value} value={item.value}>{systemTerm(item.label,locale)}</SelectItem>)):<SelectItem value="__none" disabled>{systemTerm("Nenhuma opção disponível",locale)}</SelectItem>}</SelectContent>
  </Select>;
}
