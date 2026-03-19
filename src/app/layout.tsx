import type { Metadata } from "next";
import { Inter, DM_Sans, Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FreelanceOS — GST Compliance for Indian Freelancers",
    template: "%s | FreelanceOS",
  },
  description:
    "The all-in-one GST compliance platform for Indian freelancers. Generate invoices, track e-FIRA, manage contracts, and stay compliant — ₹299/month.",
  keywords: [
    "GST invoice",
    "freelancer compliance",
    "Indian freelancer",
    "LUT invoice",
    "e-FIRA tracker",
    "GSTR-1",
    "freelance tools India",
  ],
  authors: [{ name: "FreelanceOS" }],
  creator: "FreelanceOS",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "FreelanceOS — GST Compliance for Indian Freelancers",
    description:
      "Generate GST invoices, track foreign remittances, manage contracts. Built for Indian freelancers.",
    siteName: "FreelanceOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelanceOS",
    description: "GST Compliance for Indian Freelancers",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, dmSans.variable, "font-sans", geist.variable, playfair.variable)}>
      <body className="bg-[#F8F9FA] text-slate-900 antialiased font-sans flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
