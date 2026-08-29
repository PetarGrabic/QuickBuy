import type { Metadata } from "next"

import { getProduct } from "@/lib/dummyjson"
import { truncateForDisplay } from "@/lib/utils"
import { Breadcrumb } from "@/components/products/breadcrumb"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductInfo } from "@/components/products/product-info"
import { ProductDetails } from "@/components/products/product-details"
import { ProductReviews } from "@/components/products/product-reviews"
import { RelatedProducts } from "@/components/products/related-products"

async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params
  const product = await getProduct(id)

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-10 lg:py-10 xl:px-14">
      <Breadcrumb category={product.category} title={product.title} />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-8 lg:mt-6 lg:grid-cols-2 lg:gap-12">
        <div className="-mx-4 sm:-mx-6 lg:mx-0">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        <div className="flex flex-col gap-4 sm:gap-8">
          <ProductInfo product={product} />
          <div className="mt-2 border-t border-border pt-6 lg:mt-8">
            <ProductDetails product={product} />
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12 md:mt-16">
        <ProductReviews reviews={product.reviews} />
      </div>

      <div className="mt-10 sm:mt-12 md:mt-16">
        <RelatedProducts category={product.category} excludeId={product.id} />
      </div>
    </div>
  )
}

export default ProductPage

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  return {
    title: `${product.title} — QuickBuy`,
    description: truncateForDisplay(product.description, 160),
  }
}
