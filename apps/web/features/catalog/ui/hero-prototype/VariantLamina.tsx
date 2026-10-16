import { WhatsAppIcon } from "@/components/shared/brand-icons";
import { HeroLineCar } from "./HeroLineCar";

type Props = {
  whatsappHref: string;
};

/**
 * PROTOTYPE — throwaway.
 * A — Lâmina. The hero artwork is the layout: dark field, red blade, one action.
 */
export function VariantLamina({ whatsappHref }: Props) {
  return (
    <section className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden bg-[#1C2220] text-[#FAFAF7]">
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[#E2232E] md:hidden" aria-hidden />
      <div
        className="absolute inset-y-0 right-0 hidden w-[50%] bg-[#E2232E] md:block"
        style={{ clipPath: "polygon(26% 0, 100% 0, 100% 100%, 0 100%)" }}
        aria-hidden
      />

      <div className="relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-between px-5 py-8 sm:px-10 lg:px-14 lg:py-12">
        <p className="max-w-md text-xs font-semibold uppercase tracking-[0.32em] text-[#E2232E] md:text-sm">
          Mais do que carros
        </p>

        <div className="max-w-3xl md:max-w-[58%]">
          <h1 className="font-display text-[clamp(3.4rem,9vw,8.5rem)] uppercase leading-[0.84] text-white">
            A sua
            <br />
            próxima
            <br />
            história
          </h1>
          <p className="mt-5 font-hero text-2xl font-semibold text-white/80 sm:text-3xl">começa aqui.</p>
          {whatsappHref !== "#" ? (
            <a
              data-hero-cta
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-white px-6 py-3.5 text-base font-extrabold text-[#1C2220] transition hover:-translate-y-0.5 hover:bg-[#FAFAF7]"
            >
              <WhatsAppIcon className="h-6 w-6 text-[#1C2220]" />
              Fale com a gente
            </a>
          ) : null}
        </div>

        <p className="max-w-lg pl-12 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-xs">
          500+ negociações · 12+ financeiras · 100% online
        </p>
      </div>

      <HeroLineCar
        wheelFill="#9d1520"
        className="pointer-events-none absolute bottom-2 right-[-12%] w-[118%] text-[#FAFAF7] md:bottom-10 md:right-[-2%] md:w-[min(52vw,760px)]"
      />
    </section>
  );
}
