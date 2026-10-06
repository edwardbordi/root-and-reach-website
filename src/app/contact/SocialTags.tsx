"use client";

import { useEffect, useRef, useState } from "react";
import { ASK_PLATFORMS, PLATFORMS, fixSocialHost, parseSocial, socialFromHandle, socialLabel } from "../../lib/social";

/**
 * Social media accounts as tags, in one compact field.
 *
 * The field stays a normal, fully editable input. Type a handle or link and
 * press Enter (or a comma, or click away) to add it; add as many as they like.
 * Once added, a single small "N added" bubble sits at the end of the field and
 * opens a list with every account in full, each editable inline or removable —
 * so the form stays one line tall.
 *
 * Each account in the list shows its platform and name, an "open" link so
 * the person can check it in one tap, and help where it's needed: a bare
 * "@handle" asks which app it's on, a near-miss like "instagran.com" offers
 * the fix, and YouTube, TikTok and X accounts get a real lookup: a small green
 * "Found" check, or "Not found" (lib/social.ts explains why only those). Enter adds a tag instead of submitting the form, and
 * anything still typed when they press Send is picked up by the form
 * (`pending`), so a handle nobody "entered" is never lost.
 */

export const MAX_SOCIALS = 8;

/** "https://www.instagram.com/cristina_creative_/" → "instagram.com/cristina_creative_" */
export function shortSocial(v: string): string {
  return v
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
}

export default function SocialTags({
  id,
  tags,
  onChange,
  pending,
  onPendingChange,
  maxLength,
}: {
  id: string;
  tags: string[];
  onChange: (next: string[]) => void;
  pending: string;
  onPendingChange: (v: string) => void;
  maxLength: number;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  // Real lookups (YouTube only): true = found, false = not found, null = can't tell.
  const [found, setFound] = useState<Record<string, boolean | null | "checking">>({});
  // Bare handles they chose to leave as-is ("Other").
  const [kept, setKept] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close the list on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setEditing(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setEditing(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const same = (a: string, b: string) => shortSocial(a).toLowerCase() === shortSocial(b).toLowerCase();

  function needsHelp(t: string): boolean {
    const info = parseSocial(t);
    if (info.problem || info.typoHost) return true;
    return !info.platform && !info.url && !kept.includes(t);
  }

  async function check(t: string) {
    if (!parseSocial(t).checkable) return;
    setFound((m) => ({ ...m, [t]: "checking" }));
    try {
      const res = await fetch("/api/check-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: t }),
      });
      const data = (await res.json()) as { found?: boolean | null };
      setFound((m) => ({ ...m, [t]: data.found ?? null }));
    } catch {
      setFound((m) => ({ ...m, [t]: null }));
    }
  }

  function added(v: string) {
    void check(v);
    // Open the list when the new one needs a quick answer from them.
    if (needsHelp(v)) setOpen(true);
  }

  function commit(raw: string) {
    const v = raw.replace(/,+$/, "").trim();
    if (!v) return;
    if (!tags.some((t) => same(t, v)) && tags.length < MAX_SOCIALS) {
      onChange([...tags, v]);
      added(v);
    }
    onPendingChange("");
  }

  function replaceAt(i: number, v: string) {
    onChange(tags.map((t, k) => (k === i ? v : t)));
    added(v);
  }

  function remove(i: number) {
    const next = tags.filter((_, k) => k !== i);
    onChange(next);
    setEditing(null);
    if (next.length === 0) setOpen(false);
  }

  function startEdit(i: number) {
    setEditing(i);
    setEditValue(tags[i]);
  }

  function saveEdit() {
    if (editing === null) return;
    const v = editValue.trim();
    if (!v) remove(editing);
    else if (v !== tags[editing] && !tags.some((t, k) => k !== editing && same(t, v))) replaceAt(editing, v);
    setEditing(null);
  }

  const full = tags.length >= MAX_SOCIALS;
  const count = tags.length;
  const attention = tags.some(needsHelp);

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          id={id}
          name="social"
          value={pending}
          maxLength={maxLength}
          placeholder={full ? "That's the max" : count === 0 ? "@yourbusiness" : "Add another"}
          disabled={full}
          onChange={(e) => {
            const v = e.target.value;
            // A comma (or a pasted list) adds what's before it.
            if (v.includes(",")) {
              v.split(",").slice(0, -1).forEach(commit);
              onPendingChange(v.split(",").pop() ?? "");
              return;
            }
            onPendingChange(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // add it, don't submit the form
              commit(pending);
            }
          }}
          onBlur={() => commit(pending)}
          aria-describedby={`${id}-hint`}
          className={`w-full rounded-xl border border-line bg-paper px-4 py-3 text-base text-ink placeholder:text-slate/60 field-soft ${count ? "pr-28" : ""}`}
        />
        {count > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-label={`${count} added${attention ? ", one needs a quick look" : ""}. Show list`}
            className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-signal/10 px-2.5 py-1 text-[0.78rem] font-semibold text-signal-strong hover:bg-signal/20"
          >
            {attention && <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />}
            {count} added
            <svg viewBox="0 0 12 12" className={`h-2.5 w-2.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
              <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      <p id={`${id}-hint`} className="mt-1.5 text-[0.8rem] text-slate/80">
        Press Enter to add more than one.
      </p>

      {open && count > 0 && (
        <ul id={`${id}-list`} className="absolute left-0 right-0 top-[calc(100%-1.4rem)] z-20 mt-1 max-h-64 overflow-auto rounded-xl border border-line bg-paper p-1.5 shadow-lg">
          {tags.map((t, i) => (
            <li key={`${i}-${t}`} className="flex items-start gap-1 rounded-lg px-2 py-1 text-[0.9rem] text-ink hover:bg-bone">
              {editing === i ? (
                <input
                  autoFocus
                  value={editValue}
                  maxLength={maxLength}
                  aria-label="Edit account"
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveEdit();
                    } else if (e.key === "Escape") {
                      e.stopPropagation();
                      setEditing(null);
                    }
                  }}
                  onBlur={saveEdit}
                  className="min-w-0 flex-1 rounded-md field-soft border border-line bg-paper px-2 py-1 text-[0.9rem]"
                />
              ) : (
                <SocialRow
                  value={t}
                  found={found[t]}
                  kept={kept.includes(t)}
                  onPick={(v) => replaceAt(i, v)}
                  onKeep={() => setKept((k) => [...k, t])}
                />
              )}
              {editing !== i && (
                <button type="button" onClick={() => startEdit(i)} aria-label={`Edit ${shortSocial(t)}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate hover:bg-line hover:text-ink">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M11 2.5l2.5 2.5L6 12.5H3.5V10L11 2.5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => remove(i)} aria-label={`Remove ${shortSocial(t)}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg leading-none text-slate hover:bg-line hover:text-ink">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** One account in the list: platform, name, open link, and any help it needs. */
function SocialRow({
  value,
  found,
  kept,
  onPick,
  onKeep,
}: {
  value: string;
  found: boolean | null | "checking" | undefined;
  kept: boolean;
  onPick: (next: string) => void;
  onKeep: () => void;
}) {
  const info = parseSocial(value);
  const { platform, name } = socialLabel(info);
  const askPlatform = !info.platform && !info.url && !info.problem && !kept;

  return (
    <div className="min-w-0 flex-1 px-0.5 py-1">
      <div className="flex min-w-0 items-center gap-1.5">
        {platform && <span className="shrink-0 text-[0.78rem] text-slate">{platform}</span>}
        <span className="truncate" title={value}>
          {name}
        </span>
        <span className="ml-auto shrink-0">
          {found === true ? (
            <span className="flex items-center gap-1 text-[0.75rem] font-medium text-[#2f7a4f]">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.14" />
                <path d="M4.8 8.2 7 10.4l4.2-4.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Found
            </span>
          ) : found === false ? (
            <span className="text-[0.75rem] font-medium text-signal">Not found</span>
          ) : found === "checking" ? (
            <span className="text-[0.72rem] text-slate/80">Checking…</span>
          ) : info.url && !info.problem && !info.typoHost ? (
            // Can't be checked from here (Instagram, Facebook, LinkedIn…), or the
            // check couldn't tell: let them look for themselves.
            <a href={info.url} target="_blank" rel="noopener noreferrer" className="text-[0.75rem] text-signal underline-offset-2 hover:underline">
              open
            </a>
          ) : null}
        </span>
      </div>

      {found === false && <p className="mt-0.5 text-[0.78rem] text-slate">We couldn&apos;t find that account. Double-check it?</p>}
      {info.problem && <p className="mt-0.5 text-[0.78rem] text-slate">{info.problem}. Tap the pencil to fix it.</p>}
      {info.typoHost && (
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[0.78rem] text-slate">
          Did you mean {info.typoHost}?
          <button type="button" onClick={() => onPick(fixSocialHost(value, info.typoHost!))} className="font-medium text-signal hover:underline">
            Yes, fix it
          </button>
        </p>
      )}
      {askPlatform && (
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[0.78rem] text-slate">
          Which app?
          {ASK_PLATFORMS.map((p) => (
            <button key={p} type="button" onClick={() => onPick(socialFromHandle(info.handle, p))} className="rounded-full border border-line px-2 py-0.5 text-ink hover:border-signal/50 hover:bg-bone">
              {PLATFORMS[p].label}
            </button>
          ))}
          <button type="button" onClick={onKeep} className="rounded-full border border-line px-2 py-0.5 text-ink hover:border-signal/50 hover:bg-bone">
            Other
          </button>
        </div>
      )}
    </div>
  );
}
