import type { ReactNode } from "react";

export function PrintField({ label, value }: { label: string; value: unknown }) {
  return <div className="cod-print-field"><span>{label}</span><strong>{String(value ?? "")}</strong></div>;
}

export function PrintDots({ value, maximum = 5 }: { value: number; maximum?: number }) {
  return <span className="cod-print-dots">{Array.from({ length: maximum }, (_, index) => <i className={index < value ? "filled" : ""} key={index}/>)}</span>;
}

export function PrintBoxes({ value = 0, maximum = 10 }: { value?: number; maximum?: number }) {
  return <span className="cod-print-boxes">{Array.from({ length: maximum }, (_, index) => <i className={index < value ? "filled" : ""} key={index}/>)}</span>;
}

export function PrintLines({ values, minimum = 0 }: { values: readonly ReactNode[]; minimum?: number }) {
  const rows = [...values];
  while (rows.length < minimum) rows.push("\u00a0");
  return <div className="cod-print-lines">{rows.map((value, index) => <div key={index}>{value}</div>)}</div>;
}

export function PrintRatedLines({ values, minimum = 0 }: { values: ReadonlyArray<{ name: ReactNode; rating: number }>; minimum?: number }) {
  const rows = [...values];
  while (rows.length < minimum) rows.push({ name: "\u00a0", rating: 0 });
  return <div className="cod-print-rated-lines">{rows.map((value, index) => <div key={index}><span>{value.name}</span><PrintDots value={value.rating}/></div>)}</div>;
}

export function PrintIntegrityTrack({ value, notes = new Map<number, ReactNode>() }: { value: number; notes?: ReadonlyMap<number, ReactNode> }) {
  return <div className="cod-print-integrity">{Array.from({ length: 10 }, (_, index) => 10 - index).map((rating) => <div key={rating}><span>{notes.get(rating) ?? "\u00a0"}</span><b>{rating}</b><i className={rating === value ? "filled" : ""}/></div>)}</div>;
}

export function PrintSingleMarkDots({ value, maximum = 10 }: { value: number; maximum?: number }) {
  return <span className="cod-print-dots">{Array.from({ length: maximum }, (_, index) => <i className={index + 1 === value ? "filled" : ""} key={index}/>)}</span>;
}

export function PrintExperience({ beatTracks, values }: { beatTracks: ReadonlyArray<{ label: ReactNode; value: number }>; values: ReadonlyArray<{ label: ReactNode; value: number }> }) {
  return <div className="cod-print-experience">{beatTracks.map((track, index) => <div className="beats" key={index}><span>{track.label}</span><PrintDots value={track.value} maximum={5}/></div>)}{values.map((item, index) => <div key={index}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>;
}
