"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Input } from "./input";
import { Textarea } from "./textarea";

type BufferedProps<T extends "input" | "textarea"> = Omit<ComponentProps<T>, "value" | "defaultValue" | "onChange"> & {
  value: string;
  onValueCommit: (value: string) => void;
};

function useBufferedText(value: string, onValueCommit: (value: string) => void) {
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);
  const latest = useRef(value);
  const committed = useRef(value);
  useEffect(() => {
    committed.current = value;
    if (!focused.current) {
      latest.current = value;
      setDraft(value);
    }
  }, [value]);
  const commit = () => {
    if (latest.current === committed.current) return;
    committed.current = latest.current;
    onValueCommit(latest.current);
  };
  return {
    draft,
    focus: () => { focused.current = true; },
    change: (next: string) => { latest.current = next; setDraft(next); },
    blur: () => { focused.current = false; commit(); },
  };
}

export function BufferedInput({ value, onValueCommit, onBlur, onFocus, ...props }: BufferedProps<"input">) {
  const text = useBufferedText(value, onValueCommit);
  return <Input {...props} value={text.draft} onChange={event => text.change(event.target.value)}
    onFocus={event => { text.focus(); onFocus?.(event); }}
    onBlur={event => { text.blur(); onBlur?.(event); }} />;
}

export function BufferedTextarea({ value, onValueCommit, onBlur, onFocus, ...props }: BufferedProps<"textarea">) {
  const text = useBufferedText(value, onValueCommit);
  return <Textarea {...props} value={text.draft} onChange={event => text.change(event.target.value)}
    onFocus={event => { text.focus(); onFocus?.(event); }}
    onBlur={event => { text.blur(); onBlur?.(event); }} />;
}
