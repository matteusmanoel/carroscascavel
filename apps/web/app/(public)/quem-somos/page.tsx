import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/features/content/server/queries";
import { cmsPageMetadata } from "@/features/content/server/page-metadata";
import { getSiteSettings } from "@/features/settings/server/queries";

import { STORE_MAPS_PLACE_URL, storeMapEmbedSrc } from "@/lib/store-maps";

export async function generateMetadata() {
  return cmsPageMetadata("quem-somos", "Quem somos");
}

export default async function QuemSomosPage() {
  const [page, settings] = await Promise.all([
    getPageBySlug("quem-somos"),
    getSiteSettings(),
  ]);
  if (!page) notFound();

  const wa = settings?.defaultWhatsappNumber?.replace(/\D/g, "") ?? "";
  const mapsHref = settings?.googleMapsUrl?.trim() || STORE_MAPS_PLACE_URL;
  const mapsEmbed = storeMapEmbedSrc(settings?.latitude, settings?.longitude);
  const addressLine = [
    settings?.addressLine,
    [settings?.city, settings?.state].filter(Boolean).join(" / "),
    settings?.zipCode,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="min-h-screen">
      <section className="relative isolate min-h-[320px] overflow-hidden md:min-h-[460px] lg:min-h-[520px]">
        <img
          src="/hero-desktop.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_right]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[320px] max-w-3xl flex-col justify-end px-4 pb-12 pt-24 text-center text-white md:min-h-[460px] lg:min-h-[520px]">
          <h1 className="text-4xl font-extrabold drop-shadow-sm md:text-5xl">{page.title}</h1>
          {page.excerpt ? (
            <p className="mt-6 text-lg text-zinc-100 drop-shadow-sm">{page.excerpt}</p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="public-prose">{page.body}</div>
      </section>

      <section className="border-t border-facil-border bg-facil-surface/40 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-extrabold text-foreground">Onde estamos</h2>
          {addressLine ? (
            <p className="mt-2 text-center text-sm text-facil-muted">{addressLine}</p>
          ) : null}
          <div className="mt-6 overflow-hidden rounded-2xl border border-facil-border bg-facil-card shadow-sm">
            <iframe
              title="Mapa da Carros Cascavel no Google Maps"
              src={mapsEmbed}
              className="aspect-[4/3] w-full border-0 md:aspect-[16/9]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-4 text-center">
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-facil-orange hover:underline"
            >
              Abrir no Google Maps
            </a>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="rounded-2xl border border-facil-orange/30 bg-orange-50/50 p-8 text-center">
          <p className="font-bold text-foreground">Quer nos conhecer pessoalmente?</p>
          <p className="mt-2 text-sm text-facil-muted">
            Agende uma visita ou fale pelo WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {wa ? (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-facil-orange px-6 py-3 font-bold text-white hover:bg-facil-orange-hover"
              >
                WhatsApp
              </a>
            ) : (
              <Link
                href="/estoque"
                className="rounded-xl bg-facil-orange px-6 py-3 font-bold text-white hover:bg-facil-orange-hover"
              >
                Ver estoque
              </Link>
            )}
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-facil-border bg-facil-card px-6 py-3 font-bold text-foreground hover:border-facil-orange/40"
            >
              Como chegar
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
