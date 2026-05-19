// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel AI Assistant",
  description:
    "AI-powered travel assistant — phrasebook, checklist, itinerary and map for any city.",
  keywords: ["travel", "AI", "phrasebook", "itinerary", "map", "assistant"],
  authors: [{ name: "Travel AI" }],
  openGraph: {
    title: "Travel AI Assistant",
    description: "Plan your trip in seconds with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 font-sans antialiased">{children}</body>
    </html>
  );
}
