import Link from "next/link";
import { HeroLineCar } from "./HeroLineCar";

const doors = [
  {
    href: "/estoque",
    index: "01",
    title: "Comprar",
    line: "O estoque está aberto. Escolha o carro e a gente conduz o resto.",
    panel: "bg-[#1C2220]",
  },
  {
    href: "/vender-seu-veiculo",
    index: "02",
    title: "Vender",
    line: "Traga o seu. A avaliação vira proposta, sem formulário infinito.",
    panel: "bg-[#252D29]",
  },
  {
    href: "/financiamento",
    index: "03",
    title: "Financiar",
    line: "Pré-ficha online. A parcela só existe depois da análise.",
    panel: "bg-[#E2232E]",
  },
];

/**
 * PROTOTYPE — throwaway.
 * B — Três portas. The hero is the decision, not a slogan over a picture.
 */
export function VariantPortas() {
  return (
    <section className="relative overflow-hidden bg-[#1C2220] text-[#FAFAF7]">
      <p className="pointer-events-none absolute left-5 top-5 z-30 max-w-xs text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:left-8 sm:top-7 sm:max-w-none sm:text-xs">
        Mais do que carros
        <span className="mt-1 block font-hero text-base font-semibold normal-case tracking-normal text-white sm:ml-3 sm:mt-0 sm:inline">
          A história começa na porta que você abrir.
        </span>
      </p>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-[52%] overflow-hidden md:block">
        <HeroLineCar
          wheelFill="#1C2220"
          className="absolute left-1/2 top-8 w-[130%] -translate-x-1/2 text-white/30 md:top-4 md:w-[118%]"
        />
      </div>

      <div className="relative z-10 grid min-h-[calc(100svh-3.5rem)] md:grid-cols-3">
        {doors.map((door) => (
          <Link
            key={door.href}
            href={door.href}
            data-hero-cta={door.index === "01" ? "" : undefined}
            className={`group relative flex min-h-[46vh] flex-col justify-end border-b border-white/10 px-6 pb-28 pt-24 transition duration-300 hover:bg-white hover:text-[#1C2220] sm:px-8 md:min-h-[calc(100svh-3.5rem)] md:border-b-0 md:border-r ${door.panel}`}
          >
            <span className="font-hero text-sm font-bold tracking-[0.28em] text-white/50 group-hover:text-[#E2232E]">
              {door.index}
            </span>
            <h2 className="font-display mt-3 text-6xl uppercase leading-none sm:text-7xl lg:text-8xl">
              {door.title}
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75 group-hover:text-[#1C2220]/80">
              {door.line}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              Entrar
              <span aria-hidden className="transition group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

    </section>
  );
}
