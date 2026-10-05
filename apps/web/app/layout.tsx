import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { PostHogInit } from "@/components/analytics/PostHogInit";
import { AppThemeProvider } from "@/components/app-theme-provider";
import { getSiteSettings } from "@/features/settings/server/queries";
import { BRAND } from "@/lib/brand";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { normalizePublicTheme } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.seoDefaultTitle?.trim() || BRAND.name;
  const description =
    settings?.seoDefaultDescription?.trim() || BRAND.defaultDescription;
  const siteName = settings?.siteName?.trim() || BRAND.name;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      title,
      description,
      locale: "pt_BR",
      type: "website",
      siteName,
      url: SITE_URL,
      images: [{ url: DEFAULT_OG_IMAGE, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const publicTheme = normalizePublicTheme(settings?.publicTheme);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${barlow.variable} antialiased`}>
        <AppThemeProvider publicTheme={publicTheme}>
          <PostHogInit />
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}
