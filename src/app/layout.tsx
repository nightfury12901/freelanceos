import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";

const dmSans       = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const dmSerif      = DM_Serif_Display({ subsets: ["latin"], variable: "--font-serif", weight: "400", display: "swap" });
const ibmMono      = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400","500","600"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "FreelanceOS — GST Compliance for Indian Freelancers",
    template: "%s | FreelanceOS",
  },
  description:
    "The all-in-one GST compliance platform for Indian freelancers. Generate invoices, track e-FIRA, manage contracts, and stay compliant — First Month Free.",
  keywords: ["GST invoice", "freelancer compliance", "Indian freelancer", "LUT invoice", "e-FIRA tracker", "GSTR-1", "freelance tools India", "freelanceos.xyz"],
  authors: [{ name: "FreelanceOS" }],
  creator: "FreelanceOS",
  metadataBase: new URL("https://freelanceos.xyz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://freelanceos.xyz",
    title: "FreelanceOS — GST Compliance for Indian Freelancers",
    description: "Generate GST invoices, track foreign remittances, manage contracts. Built for Indian freelancers. First Month Free.",
    siteName: "FreelanceOS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FreelanceOS — GST Compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelanceOS",
    description: "GST Compliance & Scaling for Indian Freelancers",
    images: ["/og-image.png"],
  },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(dmSans.variable, dmSerif.variable, ibmMono.variable, "font-sans")}>
      <head>
        {/* Google Analytics Placeholder */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        )}

        {/* Google Adsense Placeholder */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
