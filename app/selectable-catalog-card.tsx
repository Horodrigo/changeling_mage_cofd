"use client";

import type { KeyboardEvent, ReactNode } from "react";

export function SelectableCatalogCard({
  children,
  className = "",
  selected,
  disabled = false,
  label,
  onToggle,
}: {
  children: ReactNode;
  className?: string;
  selected: boolean;
  disabled?: boolean;
  label: string;
  onToggle: () => void;
}) {
  const toggle = () => {
    if (!disabled) onToggle();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle();
  };

  return (
    <article
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      className={`${className} selectable-catalog-card${selected ? " selected" : ""}`.trim()}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      {children}
    </article>
  );
}
