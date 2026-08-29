import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";
import { MinimalFooter } from "@/components/footer/minimal-footer";
import { SiteFooter } from "@/components/footer/site-footer";
import { Toaster } from "@/components/ui/toast";
import { CartProvider } from "@/lib/cart/cart-context";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickBuy",
  description: "QuickBuy — your one-stop shop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <SiteFooter full={<Footer />} minimal={<MinimalFooter />} />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
