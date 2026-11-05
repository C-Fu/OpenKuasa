import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import {
  Lexend,
  Inter,
  Space_Grotesk,
  Newsreader,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  JetBrains_Mono,
  Chivo_Mono,
  Share_Tech_Mono,
  VT323,
  Geist_Mono,
} from "next/font/google";
import { ThemeSync } from "@/components/theme/theme-sync";
import { PwaSetup } from "@/components/pwa/pwa-setup";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";
import { publicConfig } from "@/lib/supabase/env";
import { PUBLIC_CONFIG_ID, serializePublicConfig } from "@/lib/supabase/public-config";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const chivoMono = Chivo_Mono({
  variable: "--font-chivo-mono",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const fontVariables = [
  lexend.variable,
  inter.variable,
  spaceGrotesk.variable,
  newsreader.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
  jetbrainsMono.variable,
  chivoMono.variable,
  shareTechMono.variable,
  vt323.variable,
  geistMono.variable,
].join(" ");

const title = 'OpenKuasa';
const description = 'The community-built, open-source operating system for your business.';

// The share image comes from the opengraph-image file convention, so no `images` here.
export const metadata: Metadata = {
  metadataBase: new URL('https://openkuasa.com'),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: 'OpenKuasa',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  // Installed on an iPhone or iPad from Safari's "Add to Home Screen": opens full screen, named OpenKuasa.
  appleWebApp: {
    capable: true,
    title: 'OpenKuasa',
    statusBarStyle: 'default',
  },
};

// The window and status bar colour of the installed app, matching the page background in each theme.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f141a' },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // This request's script nonce, set by src/proxy.ts. Reading it also makes every
  // page render per request, which the content policy needs: Next.js can only put
  // the nonce on its own scripts in a page it renders for the request.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/*
          Applies the saved theme before anything in <body> paints. It sits at
          the top of <body>, not in <head>: rendering our own <head> makes React
          check that element's children on hydration, and hosts that inject
          markup there (Netlify adds a comment) then fail the whole page.
        */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          id={PUBLIC_CONFIG_ID}
          type="application/json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: serializePublicConfig(publicConfig()) }}
        />
        <ThemeSync />
        <PwaSetup />
        {children}
      </body>
    </html>
  );
}
