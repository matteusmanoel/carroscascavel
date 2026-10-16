export const HERO_PROTOTYPE_VARIANTS = [
  {
    key: "a",
    name: "Lâmina",
    note: "Poster. A arte vira o layout. Uma ação.",
  },
  {
    key: "b",
    name: "Três portas",
    note: "A escolha é o hero. Comprar, vender ou financiar.",
  },
  {
    key: "c",
    name: "Letreiro",
    note: "Cinema. O carro corta a tela. A busca é a legenda.",
  },
  {
    key: "d",
    name: "Anterior",
    note: "Hero antiga, para comparar.",
  },
  {
    key: "e",
    name: "Portas + faixa",
    note: "Botões do B com a faixa de cima do C.",
  },
  {
    key: "f",
    name: "Estrada aberta",
    note: "Abertura rumo ao horizonte. Cada porta inunda a tela com sua cena.",
  },
] as const;

export type HeroPrototypeKey = (typeof HERO_PROTOTYPE_VARIANTS)[number]["key"];

export function resolveHeroPrototypeKey(value: string | undefined): HeroPrototypeKey {
  const key = value?.toLowerCase();
  const match = HERO_PROTOTYPE_VARIANTS.find((variant) => variant.key === key);
  return match?.key ?? "f";
}
