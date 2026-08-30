import type { Metadata } from "next";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";
import { MinimalFooter } from "@/components/footer/minimal-footer";
import { SiteFooter } from "@/components/footer/site-footer";
import { Toaster } from "@/components/ui/toast";
import { ScrollRestorer } from "@/components/scroll-restorer";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/lib/cart/cart-context";
import { RecentsProvider } from "@/lib/recent/recents-context";
import { FavoritesProvider } from "@/lib/favorites/favorites-context";
import { sanityFetch } from "@/lib/sanity/fetch";
import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity.types";

const FALLBACK_METADATA: Metadata = {
  title: "QuickBuy",
  description: "QuickBuy — your one-stop shop.",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SITE_SETTINGS_QUERY_RESULT>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  return {
    title: settings?.title ?? FALLBACK_METADATA.title,
    description: settings?.description ?? FALLBACK_METADATA.description,
  };
}

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthProvider>
      <CartProvider>
        <RecentsProvider>
          <FavoritesProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <SiteFooter full={<Footer />} minimal={<MinimalFooter />} />
            <Toaster />
            <ScrollRestorer />
          </FavoritesProvider>
        </RecentsProvider>
      </CartProvider>
    </AuthProvider>
  );
}
