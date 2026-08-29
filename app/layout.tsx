import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKS | Sammrat Ka Saagar Music Band",
  description:
    "Playback Singer • Music Director • Live Wire Performer — over 1300 shows across 40 countries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Limelight&family=Oswald:wght@400;500;600;700&family=Figtree:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
