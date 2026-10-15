import type { Metadata } from "next";
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
  metadataBase: new URL("https://couba.vercel.app"),
  title: {
    default: "Couba",
    template: "%s | Couba",
  },
  applicationName: "Couba",
  description:
    "Couba is a modern crypto market platform focused on transparent markets and halal spot trading.",
  appleWebApp: {
    capable: true,
    title: "Couba",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Couba",
    description:
      "Explore crypto markets with Couba, a modern platform focused on halal spot trading.",
    siteName: "Couba",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Couba",
    description:
      "Explore crypto markets with Couba.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
