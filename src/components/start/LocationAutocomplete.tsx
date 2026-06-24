"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

// Build a readable label from a Photon feature's properties.
function labelOf(p: Record<string, string | undefined>): string {
  const parts = [p.name, p.city, p.state, p.country].filter(Boolean) as string[];
  // Drop consecutive duplicates (e.g. name === city for a city result).
  return parts.filter((part, i) => part !== parts[i - 1]).join(", ");
}

export function LocationAutocomplete({
  id,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const typing = useRef(false); // only fetch when the user is actively typing
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!typing.current || value.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=5&lang=en`,
          { signal: ctrl.signal },
        );
        const data = await res.json();
        const labels: string[] = (data.features ?? [])
          .map((f: { properties: Record<string, string> }) => labelOf(f.properties))
          .filter(Boolean);
        const uniq = Array.from(new Set(labels));
        setSuggestions(uniq);
        setOpen(uniq.length > 0);
      } catch {
        /* ignore aborts / network errors — field still works as free text */
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

  // Close the dropdown on outside click.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <Input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          typing.current = true;
          onChange(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {open && (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-2xl border border-border bg-white py-1 shadow-lg">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => {
                  typing.current = false;
                  onChange(s);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2.5 text-left text-base hover:bg-secondary"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
