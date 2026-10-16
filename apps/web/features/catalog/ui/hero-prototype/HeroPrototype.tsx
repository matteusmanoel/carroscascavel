import { PrototypeSwitcher } from "@/components/shared/PrototypeSwitcher";
import { HomeHero } from "@/features/catalog/ui/HomeHero";
import { HERO_PROTOTYPE_VARIANTS, resolveHeroPrototypeKey } from "./variants";
import { VariantLamina } from "./VariantLamina";
import { VariantLetreiro } from "./VariantLetreiro";
import { VariantPortas } from "./VariantPortas";
import { VariantPortasFaixa } from "./VariantPortasFaixa";
import { VariantEstrada } from "./VariantEstrada";

type Props = {
  variant?: string;
  whatsappHref: string;
};

/**
 * PROTOTYPE — throwaway.
 * Six hero variants on `/`, switchable via `?variant=` outside production.
 * Production always renders F — Estrada aberta.
 * A Lâmina, B Três portas, C Letreiro, D Anterior, E Portas + faixa, F Estrada aberta.
 */
export function HeroPrototype({ variant, whatsappHref }: Props) {
  const isProduction = process.env.NODE_ENV === "production";
  const key = isProduction ? "f" : resolveHeroPrototypeKey(variant);

  return (
    <>
      {key === "a" ? <VariantLamina whatsappHref={whatsappHref} /> : null}
      {key === "b" ? <VariantPortas /> : null}
      {key === "c" ? <VariantLetreiro whatsappHref={whatsappHref} /> : null}
      {key === "d" ? <HomeHero whatsappHref={whatsappHref} /> : null}
      {key === "e" ? <VariantPortasFaixa /> : null}
      {key === "f" ? <VariantEstrada reserveSwitcher={!isProduction} /> : null}
      {isProduction ? null : (
        <PrototypeSwitcher variants={HERO_PROTOTYPE_VARIANTS} current={key} />
      )}
    </>
  );
}
