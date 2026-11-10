"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const INTRO_SEEN_KEY = "cc-hero-intro-seen";
// Sun / vanishing point in hero-intro-estrada.jpg.
const HORIZON = "50% 38%";

const doors = [
  {
    id: "comprar",
    href: "/estoque",
    index: "01",
    title: "Comprar",
    line: "O estoque está aberto. Escolha o carro e a gente conduz o resto.",
  },
  {
    id: "vender",
    href: "/vender-seu-veiculo",
    index: "02",
    title: "Vender",
    line: "Traga o seu. A avaliação vira proposta, sem formulário infinito.",
  },
  {
    id: "financiar",
    href: "/financiamento",
    index: "03",
    title: "Financiar",
    line: "Pré-ficha online. A parcela só existe depois da análise.",
  },
] as const;

function IntroChars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {Array.from(text).map((char, index) => (
        <span key={`${char}-${index}`} data-intro-char className="inline-block opacity-0">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

const ticker = [
  "500+ negociações",
  "12+ financeiras",
  "100% financiamento online",
  "Cascavel / PR",
];

type Props = {
  /** Leaves room for the dev-only variant switcher along the bottom. */
  reserveSwitcher?: boolean;
};

/**
 * Home hero — Estrada aberta.
 * Coded opening: the car runs to the horizon and the sun bursts into the hero.
 * The stage keeps one family photo. Vender and financiar carry their own
 * scene on those routes.
 */
export function VariantEstrada({ reserveSwitcher = false }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const [mode, setMode] = useState<"intro" | "static">("intro");
  const [run, setRun] = useState(0);
  const loop = [...ticker, ...ticker];

  useGSAP(
    () => {
      if (mode !== "intro") return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || sessionStorage.getItem(INTRO_SEEN_KEY)) {
        setMode("static");
        return;
      }

      const finish = () => {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
        setMode("static");
      };

      const width = window.innerWidth;
      const height = window.innerHeight;
      const farthest = Math.hypot(width / 2, Math.max(height * 0.38, height * 0.62));
      const ballScale = (farthest / 32) * 1.2;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: finish });
      introRef.current = tl;
      tl.set("[data-intro-flash]", { xPercent: -50, yPercent: -50, scale: 0 })
        .set("[data-intro-road]", { autoAlpha: 1, transformOrigin: HORIZON, scale: 1.02 })
        .fromTo(
          "[data-intro-char]",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.085, ease: "power2.out" },
          0.1,
        )
        .to({}, { duration: 1 }, ">")
        .addLabel("drive")
        .to("[data-intro-road]", { scale: 1.5, duration: 2.9, ease: "power2.in" }, "drive")
        .fromTo(
          "[data-intro-streaks]",
          { autoAlpha: 0, scale: 0.2 },
          { autoAlpha: 1, scale: 3.4, duration: 0.32, ease: "power4.in" },
          "drive+=2.2",
        )
        .addLabel("burst", "drive+=2.48")
        .fromTo(
          "[data-intro-flash]",
          { scale: 0, autoAlpha: 1 },
          { scale: ballScale, duration: 0.16, ease: "power4.in" },
          "burst",
        )
        .addLabel("covered", "burst+=0.16")
        .set(
          "[data-intro-road], [data-intro-streaks], [data-intro-shade], [data-intro-phrase], [data-intro-skip]",
          { autoAlpha: 0 },
          "covered",
        )
        .to({}, { duration: 0.1 }, "covered")
        .to("[data-intro-flash]", { autoAlpha: 0, duration: 0.18, ease: "power2.in" }, "covered+=0.1")
        .addLabel("reveal", "covered+=0.3")
        .from("[data-hero-line]", { y: 60, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: "power4.out" }, "reveal")
        .from("[data-hero-swoosh]", { strokeDashoffset: 420, duration: 0.75, ease: "power2.inOut" }, "reveal+=0.18")
        .from("[data-hero-door]", { y: 80, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "power4.out" }, "reveal+=0.06");

      const skip = (event: KeyboardEvent) => {
        if (event.key === "Escape" || event.key === "Enter" || event.key === " ") tl.progress(1);
      };
      window.addEventListener("keydown", skip);
      return () => window.removeEventListener("keydown", skip);
    },
    { scope: rootRef, dependencies: [mode, run], revertOnUpdate: true },
  );

  function replayIntro() {
    sessionStorage.removeItem(INTRO_SEEN_KEY);
    setMode("intro");
    setRun((value) => value + 1);
  }

  return (
    <section ref={rootRef} className="relative bg-black text-white">
      {mode === "intro" ? (
        <img
          src="/hero-familia-sonho.jpg"
          alt=""
          className="pointer-events-none fixed inset-0 z-[55] h-full w-full object-cover"
        />
      ) : null}
      {mode === "intro" ? (
        <div
          data-intro
          role="presentation"
          onClick={() => introRef.current?.progress(1)}
          className="fixed inset-0 z-[60] cursor-pointer overflow-hidden bg-transparent"
        >
          <img
            data-intro-road
            src="/hero-intro-estrada.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 40%" }}
          />
          <div
            data-intro-streaks
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
            style={{
              transformOrigin: HORIZON,
              background:
                "repeating-conic-gradient(from 0deg at 50% 38%, rgba(255,214,170,0) 0deg, rgba(255,214,170,0) 5deg, rgba(255,214,170,0.35) 5.6deg, rgba(255,214,170,0) 6.4deg)",
              maskImage: "radial-gradient(circle at 50% 38%, transparent 0 9%, black 40%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 38%, transparent 0 9%, black 40%)",
            }}
          />
          <div
            data-intro-shade
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0,rgba(0,0,0,0.22)_78%)]"
          />
          <p
            data-intro-phrase
            className="pointer-events-none absolute inset-x-0 top-[18%] px-4 text-center font-display text-[clamp(1.85rem,8vw,4.25rem)] uppercase text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.65)]"
          >
            <IntroChars text="Mais que" />
            <IntroChars text=" " />
            <IntroChars text="carros." className="text-[#E2232E]" />
          </p>
          <span
            data-intro-skip
            className="pointer-events-none absolute bottom-6 right-6 z-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60"
          >
            Toque ou Esc para pular
          </span>
          <div
            data-intro-flash
            className="pointer-events-none absolute z-20 h-16 w-16 rounded-full opacity-0"
            style={{
              left: "50%",
              top: "38%",
              background: "radial-gradient(circle, #fff7e8 0%, #ffb9a4 24%, #E2232E 58%, #E2232E 100%)",
            }}
          />
        </div>
      ) : null}

      <div className="relative overflow-hidden border-b border-white/10 bg-[#1C2220] py-3">
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
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#1C2220] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#1C2220] to-transparent sm:w-36" />
        {mode === "static" ? (
          <button
            type="button"
            onClick={replayIntro}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-[#1C2220] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 hover:text-white sm:right-3 sm:px-3 sm:text-[11px] sm:tracking-[0.2em]"
          >
            ↺ Abertura
          </button>
        ) : null}
      </div>

      <div className="relative flex min-h-[calc(100svh-3.5rem-2.6rem)] flex-col overflow-hidden">
        <img
          src="/hero-familia-sonho.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.05)_42%,rgba(0,0,0,0.08)_62%,rgba(0,0,0,0.55)_100%)]" />

        <div className="relative z-10 px-5 pt-5 sm:px-10 sm:pt-12 lg:px-14">
          <h1 className="max-w-5xl">
            <span
              data-hero-line
              className="block font-hero text-lg font-semibold text-white/90 sm:text-4xl lg:text-5xl"
            >
              Mais que <strong className="font-extrabold text-[#E2232E]">carros</strong>.
            </span>
            <span
              data-hero-line
              className="mt-1 block font-display text-[clamp(1.3rem,6vw,4.55rem)] uppercase leading-[0.92] [text-shadow:0_6px_40px_rgba(0,0,0,0.5)] sm:mt-2"
            >
              Sua próxima{" "}
              <span className="relative inline-block text-[#E2232E]">
                história
                <svg
                  aria-hidden
                  viewBox="0 0 400 24"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2 w-full sm:-bottom-3 sm:h-3.5"
                >
                  <path
                    data-hero-swoosh
                    d="M4 18 C 120 4, 260 2, 396 12"
                    fill="none"
                    stroke="#E2232E"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="420"
                    strokeDashoffset="0"
                  />
                </svg>
              </span>
              <br />
              começa aqui.
            </span>
          </h1>
        </div>

        <div
          className={`relative z-10 mt-auto flex flex-col border-t border-white/20 bg-black/35 backdrop-blur-[2px] md:flex-row ${
            reserveSwitcher ? "pb-28 md:pb-0" : ""
          }`}
        >
          {doors.map((door) => (
            <Link
              key={door.id}
              data-hero-door
              href={door.href}
              data-hero-cta={door.id === "comprar" ? "" : undefined}
              className="group relative flex flex-1 flex-col justify-end border-b border-white/15 px-5 py-4 sm:px-8 md:border-b-0 md:border-l md:px-8 md:pb-8 md:pt-7 md:first:border-l-0"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[#E2232E] transition-transform duration-500 group-hover:scale-x-100" />
              <span className="relative font-hero text-[11px] font-bold uppercase tracking-[0.28em] text-white/55">
                {door.index}
              </span>
              <span className="relative mt-1 font-hero text-sm font-extrabold uppercase tracking-[0.22em] text-[#E2232E] sm:text-base md:text-lg">
                Quero
              </span>
              <h2 className="font-display relative mt-1 text-[2rem] uppercase leading-none sm:text-5xl md:text-6xl lg:text-7xl">
                {door.title}
              </h2>
              <p className="relative mt-2 hidden max-w-sm text-sm leading-relaxed text-white/80 md:block">
                {door.line}
              </p>
              <span className="relative mt-3 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/90 sm:text-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 transition duration-500 group-hover:border-[#E2232E] group-hover:bg-[#E2232E] md:h-10 md:w-10">
                  →
                </span>
                Entrar
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
