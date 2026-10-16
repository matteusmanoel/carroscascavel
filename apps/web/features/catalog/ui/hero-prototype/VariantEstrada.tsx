"use client";

import { useRef, useState, type FocusEvent, type MouseEvent } from "react";
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
    scene: "/hero-cena-comprar.jpg",
  },
  {
    id: "vender",
    href: "/vender-seu-veiculo",
    index: "02",
    title: "Vender",
    line: "Traga o seu. A avaliação vira proposta, sem formulário infinito.",
    scene: "/hero-cena-vender.jpg",
  },
  {
    id: "financiar",
    href: "/financiamento",
    index: "03",
    title: "Financiar",
    line: "Pré-ficha online. A parcela só existe depois da análise.",
    scene: "/hero-cena-financiar.jpg",
  },
] as const;

type DoorId = (typeof doors)[number]["id"];
type Point = { x: number; y: number };

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
 * On a fine pointer, each door floods the stage from the cursor. On a phone,
 * each door carries its own scene, because there is no hover.
 */
export function VariantEstrada({ reserveSwitcher = false }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const [mode, setMode] = useState<"intro" | "static">("intro");
  const [run, setRun] = useState(0);
  const [active, setActive] = useState<DoorId | null>(null);
  const [origins, setOrigins] = useState<Record<DoorId, Point>>({
    comprar: { x: 0, y: 0 },
    vender: { x: 0, y: 0 },
    financiar: { x: 0, y: 0 },
  });
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

  function openFromPoint(id: DoorId, point: Point) {
    setOrigins((current) => ({ ...current, [id]: point }));
    setActive(id);
  }

  function canFlood() {
    return window.matchMedia("(min-width: 768px)").matches;
  }

  function onDoorEnter(id: DoorId, event: MouseEvent<HTMLAnchorElement>) {
    if (!canFlood()) return;
    const stage = stageRef.current?.getBoundingClientRect();
    if (!stage) return;
    openFromPoint(id, { x: event.clientX - stage.left, y: event.clientY - stage.top });
  }

  function onDoorFocus(id: DoorId, event: FocusEvent<HTMLAnchorElement>) {
    if (!canFlood()) return;
    const stage = stageRef.current?.getBoundingClientRect();
    const door = event.currentTarget.getBoundingClientRect();
    if (!stage) return;
    openFromPoint(id, {
      x: door.left + door.width / 2 - stage.left,
      y: door.top + door.height / 2 - stage.top,
    });
  }

  function replayIntro() {
    sessionStorage.removeItem(INTRO_SEEN_KEY);
    setActive(null);
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

      <div
        ref={stageRef}
        className="relative flex min-h-[calc(100svh-3.5rem-2.6rem)] flex-col overflow-hidden"
      >
        <img
          src="/hero-familia-sonho.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-1000 ease-out"
          style={{
            transform: active ? "scale(1.08)" : "scale(1)",
            filter: active ? "brightness(0.45) blur(2px)" : "brightness(0.8)",
          }}
        />

        {doors.map((door) => {
          const open = active === door.id;
          const { x, y } = origins[door.id];
          return (
            <img
              key={door.id}
              src={door.scene}
              alt=""
              className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover md:block"
              style={{
                clipPath: `circle(${open ? "150%" : "0%"} at ${x}px ${y}px)`,
                transform: open ? "scale(1)" : "scale(1.12)",
                transition:
                  "clip-path 900ms cubic-bezier(.7,0,.2,1), transform 1400ms cubic-bezier(.2,.7,.2,1)",
              }}
            />
          );
        })}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.15)_34%,rgba(0,0,0,0.1)_52%,rgba(0,0,0,0.85)_100%)]" />

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
              className="mt-1 block font-display text-[clamp(1.85rem,8.6vw,6.5rem)] uppercase leading-[0.92] [text-shadow:0_6px_40px_rgba(0,0,0,0.5)] sm:mt-2"
            >
              Sua próxima{" "}
              <span className="relative inline-block text-[#E2232E]">
                história
                <svg
                  aria-hidden
                  viewBox="0 0 400 24"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-3 w-full sm:-bottom-4 sm:h-5"
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
          className={`relative z-10 mt-auto flex flex-col border-t border-white/15 md:h-[44%] md:min-h-[17rem] md:flex-row ${
            reserveSwitcher ? "bg-[#1C2220] pb-28 md:bg-transparent md:pb-0" : ""
          }`}
        >
          {doors.map((door) => {
            const open = active === door.id;
            const dimmed = active !== null && !open;
            return (
              <Link
                key={door.id}
                data-hero-door
                href={door.href}
                data-hero-cta={door.id === "comprar" ? "" : undefined}
                onMouseEnter={(event) => onDoorEnter(door.id, event)}
                onMouseLeave={() => setActive(null)}
                onFocus={(event) => onDoorFocus(door.id, event)}
                onBlur={() => setActive(null)}
                className={`group relative flex flex-col justify-end overflow-hidden border-b border-white/15 px-5 py-3.5 transition-[flex-grow,opacity] duration-700 ease-[cubic-bezier(.7,0,.2,1)] sm:px-8 md:min-h-0 md:border-b-0 md:border-l md:px-8 md:pb-20 md:pt-8 md:first:border-l-0 ${
                  open ? "md:grow-[1.7]" : "md:grow"
                } ${dimmed ? "md:opacity-55" : "opacity-100"} md:basis-0`}
              >
                <img
                  src={door.scene}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover md:hidden"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25 md:hidden" />
                <span
                  className={`absolute inset-x-0 top-0 h-1 origin-left bg-[#E2232E] transition-transform duration-700 ${
                    open ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <span className="relative font-hero text-[10px] font-bold uppercase tracking-[0.28em] text-white/70 sm:text-xs">
                  {door.index} · Quero
                </span>
                <h2 className="font-display relative mt-1 text-[2rem] uppercase leading-none sm:text-5xl md:mt-2 md:text-6xl lg:text-7xl xl:text-8xl">
                  {door.title}
                </h2>
                <p
                  className={`hidden max-w-sm overflow-hidden text-sm leading-relaxed text-white/85 transition-all duration-500 md:block md:max-h-0 md:opacity-0 ${
                    open ? "md:mt-3 md:max-h-24 md:opacity-100" : "md:mt-0"
                  }`}
                >
                  {door.line}
                </p>
                <span className="relative mt-2 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest sm:text-sm md:mt-5">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition duration-500 md:h-10 md:w-10 ${
                      open ? "border-[#E2232E] bg-[#E2232E]" : "border-white/40"
                    }`}
                  >
                    →
                  </span>
                  Entrar
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
