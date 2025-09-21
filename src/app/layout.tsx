import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "KahaaniBot - AI-Powered Storytelling for Kids",
  description: "Experience the magic of storytelling with KahaaniBot.",
  icons: {
    icon: "/Logo.ico",
    shortcut: "/Logo.ico",
    apple: "/Logo.ico",
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
