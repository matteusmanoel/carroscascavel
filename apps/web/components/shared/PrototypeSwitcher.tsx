"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type PrototypeSwitcherVariant = {
  key: string;
  name: string;
  note?: string;
};

type Props = {
  variants: readonly PrototypeSwitcherVariant[];
  current: string;
  param?: string;
};

/**
 * PROTOTYPE — throwaway.
 * Floating variant switcher. Hidden in production builds.
 */
export function PrototypeSwitcher({ variants, current, param = "variant" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const go = useCallback(
    (direction: -1 | 1) => {
      const index = Math.max(
        0,
        variants.findIndex((variant) => variant.key === current),
      );
      const next = variants[(index + direction + variants.length) % variants.length];
      if (!next) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set(param, next.key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [current, param, pathname, router, searchParams, variants],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.closest("input, textarea, [contenteditable='true']") ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      go(event.key === "ArrowRight" ? 1 : -1);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (process.env.NODE_ENV === "production") return null;

  const active = variants.find((variant) => variant.key === current) ?? variants[0];
  if (!active) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-1 rounded-full border-2 border-black bg-[#f6f1e4] p-1.5 text-black shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Variante anterior"
        className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold hover:bg-black hover:text-[#f6f1e4]"
      >
        ←
      </button>
      <div className="min-w-[14rem] px-3 text-center">
        <p className="text-sm font-extrabold tracking-tight">
          {active.key.toUpperCase()} — {active.name}
        </p>
        {active.note ? <p className="text-[11px] leading-snug text-black/65">{active.note}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Próxima variante"
        className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold hover:bg-black hover:text-[#f6f1e4]"
      >
        →
      </button>
    </div>
  );
}
