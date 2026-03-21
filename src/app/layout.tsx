import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://kahaani-story-bot.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KahaaniBot | AI Storytelling For Kids",
    template: "%s | KahaaniBot",
  },
  description:
    "KahaaniBot helps kids explore mythological tales and create personalized AI stories in multiple Indian languages.",
  keywords: [
    "kids stories",
    "AI storytelling",
    "Indian mythology for kids",
    "moral stories",
    "Hindi stories for children",
    "bedtime stories",
  ],
  applicationName: "KahaaniBot",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/Logo.ico",
    shortcut: "/Logo.ico",
    apple: "/Logo.ico",
  },
  openGraph: {
    title: "KahaaniBot | AI Storytelling For Kids",
    description:
      "Explore mythological stories and generate personalized tales for children with AI.",
    url: "/",
    siteName: "KahaaniBot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KahaaniBot Open Graph Image",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KahaaniBot | AI Storytelling For Kids",
    description:
      "Explore mythological stories and generate personalized tales for children with AI.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-brand">
      <body className={`font-fredoka antialiased`}>
        <ToastContainer autoClose={2000} />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
