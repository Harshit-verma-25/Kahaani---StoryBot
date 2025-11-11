import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "KahaaniBot - AI-Powered Storytelling for Kids",
  description: "Experience the magic of storytelling with KahaaniBot.",
  icons: {
    icon: "/Logo.ico",
    shortcut: "/Logo.ico",
    apple: "/Logo.ico",
  },
  openGraph: {
    title: "KahaaniBot - AI-Powered Storytelling for Kids",
    description: "Experience the magic of storytelling with KahaaniBot.",
    url: "https://kahaani-story-bot.vercel.app/",
    siteName: "KahaaniBot",
    images: [
      {
        url: "https://kahaani-story-bot.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "KahaaniBot Open Graph Image",
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-fredoka antialiased`}>
        <ToastContainer />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
