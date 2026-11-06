import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/src/components/layout/footer";
import { Header } from "@/src/components/layout/header";
import { MobileStickyCTA } from "@/src/components/layout/mobile-sticky-cta";
import { GoogleAnalytics } from "@/src/features/analytics/components/google-analytics";
import { buildMetadata } from "@/src/lib/seo";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Điện Máy Nga Sơn | Điện máy và điện lạnh Kinh Môn",
    description:
      "Điện Máy Nga Sơn tư vấn điều hòa, tivi, tủ lạnh, máy giặt, sửa chữa và bảo dưỡng điện lạnh tại Kinh Môn, Hải Dương.",
    path: "/",
  }),
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[#111827]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileStickyCTA />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
