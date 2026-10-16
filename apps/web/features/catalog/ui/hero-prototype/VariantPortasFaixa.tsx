"use client";

import { useState } from "react";
import Link from "next/link";

const doors = [
  {
    id: "comprar",
    href: "/estoque",
    index: "01",
    title: "Comprar",
    line: "O estoque está aberto. Escolha o carro e a gente conduz o resto.",
    shift: "0%",
    origin: "16.67% center",
  },
  {
    id: "vender",
    href: "/vender-seu-veiculo",
    index: "02",
    title: "Vender",
    line: "Traga o seu. A avaliação vira proposta, sem formulário infinito.",
    shift: "-100%",
    origin: "50% center",
  },
  {
    id: "financiar",
    href: "/financiamento",
    index: "03",
    title: "Financiar",
    line: "Pré-ficha online. A parcela só existe depois da análise.",
    shift: "-200%",
    origin: "83.33% center",
  },
] as const;

type DoorId = (typeof doors)[number]["id"];

const ticker = [
  "500+ negociações",
  "12+ financeiras",
  "100% financiamento online",
  "Cascavel / PR",
];

/**
 * PROTOTYPE — throwaway.
 * E — Portas + faixa. Each giant door opens its third of the dream photo.
 */
export function VariantPortasFaixa() {
  const loop = [...ticker, ...ticker];
  const [active, setActive] = useState<DoorId | null>(null);

  return (
    <section className="flex min-h-[calc(100svh-3.5rem)] flex-col bg-[#1C2220] text-[#FAFAF7] md:overflow-hidden">
      <div className="relative shrink-0 overflow-hidden border-b border-white/10 bg-[#1C2220] py-3">
        <div className="featured-marquee-track flex w-max gap-10">
          {loop.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60"
            >
              {item}
              <span className="ml-10 text-[#E2232E]">/</span>
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#1C2220] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#1C2220] to-transparent" />
      </div>

      <div className="relative grid flex-1 md:min-h-0 md:grid-cols-3">
        {doors.map((door) => {
          const open = active === door.id;
          const dimmed = active !== null && !open;

          return (
            <Link
              key={door.id}
              href={door.href}
              data-hero-cta={door.id === "comprar" ? "" : undefined}
              onMouseEnter={() => setActive(door.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(door.id)}
              onBlur={() => setActive(null)}
              className="group relative flex min-h-[42vh] flex-col justify-end overflow-hidden border-b border-white/10 px-6 pb-28 pt-16 sm:px-8 md:min-h-0 md:border-b-0 md:border-r md:pb-24"
            >
              <img
                src="/hero-familia-sonho.jpg"
                alt=""
                className="pointer-events-none absolute top-0 h-full w-[300%] max-w-none object-cover transition duration-700 ease-out"
                style={{
                  left: door.shift,
                  transformOrigin: door.origin,
                  transform: open ? "scale(1.14)" : "scale(1)",
                  filter: dimmed ? "brightness(0.38) saturate(0.75)" : "brightness(1)",
                }}
              />
              <div
                className={`absolute inset-0 transition duration-700 ${
                  open ? "bg-black/10" : dimmed ? "bg-black/55" : "bg-black/35"
                }`}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              <div className="relative z-10">
                <span className="font-hero text-sm font-bold tracking-[0.28em] text-white/70">
                  {door.index}
                </span>
                <h2 className="font-display mt-3 text-6xl uppercase leading-none text-white sm:text-7xl lg:text-8xl">
                  {door.title}
                </h2>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">{door.line}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
                  Entrar
                  <span aria-hidden className="transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
