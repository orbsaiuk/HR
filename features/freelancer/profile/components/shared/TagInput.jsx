"use client";

import { useState } from "react";

import { X } from "lucide-react";

export function TagInput({
  values = [],
  onChange,
  placeholder,
  inputDir = "rtl",
  ariaLabel,
  id,
}) {
  const [draft, setDraft] = useState("");

  function commitDraft(raw = draft) {
    const trimmed = raw.trim();
    if (!trimmed) return false;
    const exists = values.some(
      (v) => v.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!exists) {
      onChange?.([...values, trimmed]);
    }
    setDraft("");
    return true;
  }

  function removeAt(index) {
    const next = values.slice();
    next.splice(index, 1);
    onChange?.(next);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === "," || event.key === "،") {
      event.preventDefault();
      commitDraft();
      return;
    }
    if (event.key === "Backspace" && draft === "" && values.length > 0) {
      removeAt(values.length - 1);
    }
  }

  function handleBlur() {
    if (draft.trim()) {
      commitDraft();
    }
  }

  return (
    <div className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="inline-flex items-center gap-1 rounded-md bg-[#F5F5FF] px-2 py-1 text-xs font-semibold text-[#5D5BDA]"
        >
          {value}
          <button
            type="button"
            onClick={() => removeAt(index)}
            aria-label={`إزالة ${value}`}
            className="inline-flex h-4 w-4 items-center justify-center rounded text-[#5D5BDA] transition hover:bg-[#E0E0FF]"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        aria-label={ariaLabel}
        dir={inputDir}
        value={draft}
        placeholder={values.length === 0 ? placeholder : undefined}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="flex-1 min-w-[6rem] bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
