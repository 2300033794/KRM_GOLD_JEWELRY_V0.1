import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ChatWidget } from "@/components/chatbot/chat-widget";

export const metadata: Metadata = {
  title: "KMR Jewellery Shop",
  description: "Gold jewellery platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="mx-auto min-h-[calc(100vh-12rem)] w-full max-w-7xl px-4 py-6">{children}</main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
