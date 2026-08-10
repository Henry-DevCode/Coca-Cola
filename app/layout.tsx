import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coca-Cola — Open Happiness",
  description:
    "A cinematic parallax scrolling experience celebrating Coca-Cola. Built with Next.js, React Three Fiber and GSAP.",
  icons: {
    icon: "/image/CC-LOGO.png",
    apple: "/image/CC-LOGO.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a0000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-white selection:bg-coke-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
