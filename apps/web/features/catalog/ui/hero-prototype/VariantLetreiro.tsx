import { HeroLineCar } from "./HeroLineCar";

type Props = {
  whatsappHref: string;
};

const ticker = [
  "500+ negociações",
  "12+ financeiras",
  "100% financiamento online",
  "Cascavel / PR",
];

/**
 * PROTOTYPE — throwaway.
 * C — Letreiro. The car is cropped like a title card. Search is the caption.
 */
export function VariantLetreiro({ whatsappHref }: Props) {
  const loop = [...ticker, ...ticker];

  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden bg-[#1C2220] text-[#FAFAF7]">
      <div className="relative overflow-hidden border-b border-white/10 py-3">
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

      <div className="relative min-h-[18rem] flex-1">
        <svg className="absolute inset-0 h-full w-full text-white/15" aria-hidden>
          <line x1="62%" y1="0" x2="28%" y2="100%" stroke="currentColor" strokeWidth="1" />
          <line x1="78%" y1="0" x2="44%" y2="100%" stroke="currentColor" strokeWidth="1" />
        </svg>
        <HeroLineCar
          wheelFill="#1C2220"
          className="pointer-events-none absolute right-[-28%] top-1/2 w-[min(150vw,1080px)] -translate-y-[46%] text-[#FAFAF7] md:right-[-8%]"
        />
      </div>

      <div className="relative border-t border-white/15 bg-[#141816] px-5 pb-28 pt-6 sm:px-10 sm:pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#E2232E]">Mais do que carros</p>
        <h1 className="font-display mt-2 max-w-4xl text-4xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
          A sua próxima história começa aqui.
        </h1>
        <div className="mt-6 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-end">
          <form action="/estoque" method="get" className="flex min-w-0 flex-1 items-end gap-3 border-b border-white/35">
            <label className="sr-only" htmlFor="hero-prototype-search">
              Buscar no estoque
            </label>
            <input
              id="hero-prototype-search"
              type="search"
              name="q"
              placeholder="Busque por modelo, marca..."
              className="min-w-0 flex-1 bg-transparent py-3 text-lg text-white outline-none placeholder:text-white/35"
            />
            <button type="submit" className="mb-3 shrink-0 text-sm font-bold uppercase tracking-widest text-white">
              Buscar
            </button>
          </form>
          {whatsappHref !== "#" ? (
            <a
              data-hero-cta
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 pb-3 text-sm text-white/60 underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              ou fale com a gente
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
