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

const ticker = [
  "500+ negociações",
  "12+ financeiras",
  "100% financiamento online",
  "Cascavel / PR",
];

/**
 * PROTOTYPE — throwaway.
 * F — Estrada aberta. Coded opening: the car runs to the horizon and the sun
 * bursts into the hero. Each door then floods the whole stage with its scene,
 * starting from the exact point where the cursor entered.
 */
export function VariantEstrada() {
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

      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: finish });
      introRef.current = tl;
      tl.set("[data-intro-flash]", { xPercent: -50, yPercent: -50, scale: 0 })
        .set("[data-intro-road]", { transformOrigin: HORIZON, scale: 1.04, filter: "blur(0px)" })
        .fromTo("[data-intro-road]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 })
        .to(
          "[data-intro-road]",
          { scale: 3.4, filter: "blur(5px) brightness(1.15)", duration: 2.3, ease: "power3.in" },
          0.35,
        )
        .fromTo(
          "[data-intro-streaks]",
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 0.85, scale: 2.4, duration: 2.3, ease: "power3.in" },
          0.35,
        )
        .fromTo(
          "[data-intro-word]",
          { autoAlpha: 0, y: 24, letterSpacing: "0.5em" },
          { autoAlpha: 1, y: 0, letterSpacing: "0.18em", duration: 0.7, stagger: 0.18 },
          0.7,
        )
        .to("[data-intro-word]", { autoAlpha: 0, scale: 1.6, duration: 0.45, ease: "power2.in" }, 2.05)
        .fromTo(
          "[data-intro-flash]",
          { scale: 0, autoAlpha: 1 },
          { scale: 60, duration: 0.55, ease: "power4.in" },
          2.3,
        )
        .to("[data-intro]", { autoAlpha: 0, duration: 0.7 }, 2.9)
        .from("[data-hero-line]", { y: 60, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "power4.out" }, 2.95)
        .from("[data-hero-swoosh]", { strokeDashoffset: 420, duration: 0.9, ease: "power2.inOut" }, 3.4)
        .from("[data-hero-door]", { y: 80, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: "power4.out" }, 3.15);

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

  function onDoorEnter(id: DoorId, event: MouseEvent<HTMLAnchorElement>) {
    const stage = stageRef.current?.getBoundingClientRect();
    if (!stage) return;
    openFromPoint(id, { x: event.clientX - stage.left, y: event.clientY - stage.top });
  }

  function onDoorFocus(id: DoorId, event: FocusEvent<HTMLAnchorElement>) {
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
        <div
          data-intro
          role="presentation"
          onClick={() => introRef.current?.progress(1)}
          className="fixed inset-0 z-[60] cursor-pointer overflow-hidden bg-black"
        >
          <img
            data-intro-road
            src="/hero-intro-estrada.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-0"
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0,rgba(0,0,0,0.3)_75%)]" />
          <p className="pointer-events-none absolute inset-x-0 top-[14%] text-center font-display text-4xl uppercase text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.6)] sm:text-6xl">
            <span data-intro-word className="inline-block opacity-0">
              Mais que
            </span>{" "}
            <span data-intro-word className="inline-block text-[#E2232E] opacity-0">
              carros.
            </span>
          </p>
          <div
            data-intro-flash
            className="pointer-events-none absolute h-16 w-16 scale-0 rounded-full"
            style={{
              left: "50%",
              top: "38%",
              background: "radial-gradient(circle, #fff7e8 0%, #ffd2a1 35%, #E2232E 70%, #1C2220 100%)",
            }}
          />
          <span className="pointer-events-none absolute bottom-6 right-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
            Clique ou Esc para pular
          </span>
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
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#1C2220] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#1C2220] to-transparent" />
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
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
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

        <div className="relative z-10 px-5 pt-8 sm:px-10 sm:pt-12 lg:px-14">
          <h1 className="max-w-5xl">
            <span
              data-hero-line
              className="block font-hero text-2xl font-semibold text-white/90 sm:text-4xl lg:text-5xl"
            >
              Mais que <strong className="font-extrabold text-[#E2232E]">carros</strong>.
            </span>
            <span
              data-hero-line
              className="mt-2 block font-display text-[clamp(2.6rem,7vw,6.5rem)] uppercase leading-[0.9] [text-shadow:0_6px_40px_rgba(0,0,0,0.5)]"
            >
              Sua próxima{" "}
              <span className="relative inline-block text-[#E2232E]">
                história
                <svg
                  aria-hidden
                  viewBox="0 0 400 24"
                  preserveAspectRatio="none"
                  className="absolute -bottom-3 left-0 h-4 w-full sm:-bottom-4 sm:h-5"
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

        <div className="relative z-10 mt-8 flex flex-col border-t border-white/15 pb-20 md:mt-auto md:h-[44%] md:pb-0 md:min-h-[17rem] md:flex-row">
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
                className={`group relative flex min-h-[22vh] flex-col justify-end border-b border-white/15 px-6 pb-8 pt-8 transition-[flex-grow,opacity] duration-700 ease-[cubic-bezier(.7,0,.2,1)] sm:px-8 md:min-h-0 md:border-b-0 md:border-l md:pb-20 md:first:border-l-0 ${
                  open ? "md:grow-[1.7]" : "md:grow"
                } ${dimmed ? "opacity-55" : "opacity-100"} md:basis-0`}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-1 origin-left bg-[#E2232E] transition-transform duration-700 ${
                    open ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <span className="font-hero text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                  {door.index} · Quero
                </span>
                <h2 className="font-display mt-2 text-5xl uppercase leading-none sm:text-6xl lg:text-7xl xl:text-8xl">
                  {door.title}
                </h2>
                <p
                  className={`max-w-sm overflow-hidden text-sm leading-relaxed text-white/85 transition-all duration-500 md:max-h-0 md:opacity-0 ${
                    open ? "mt-3 md:max-h-24 md:opacity-100" : "mt-3 md:mt-0"
                  }`}
                >
                  {door.line}
                </p>
                <span className="mt-5 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition duration-500 ${
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

        {mode === "static" ? (
          <button
            type="button"
            onClick={replayIntro}
            className="absolute right-4 top-4 z-20 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur hover:text-white"
          >
            ↺ Abertura
          </button>
        ) : null}
      </div>
    </section>
  );
}
