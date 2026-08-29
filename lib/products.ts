import { notFound } from "next/navigation"

import { getDiscountedPrice } from "@/lib/discounts"
import { supabase } from "@/lib/supabase"

interface Product {
  id: number
  title: string
  price: number
  discountPercentage: number
  rating: number
  thumbnail: string
  category: string
  brand: string | null
  stock: number
}

interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

interface ProductDetail extends Product {
  description: string
  sku: string
  dimensions: { width: number; height: number; depth: number }
  warrantyInformation: string
  shippingInformation: string
  returnPolicy: string
  reviews: ProductReview[]
  images: string[]
}

interface Category {
  slug: string
  name: string
}

interface GetProductsParams {
  limit?: number
  skip?: number
  sortBy?: "rating" | "discountPercentage" | "price" | "title"
  order?: "asc" | "desc"
  category?: string
}

// PostgREST column aliases so the returned rows already match the camelCase
// types above — no separate mapping layer needed.
const CARD_COLUMNS =
  "id, title, price, discountPercentage:discount_percentage, rating, thumbnail, category, brand, stock"

const DETAIL_COLUMNS = `${CARD_COLUMNS}, description, sku, dimensions, warrantyInformation:warranty_information, shippingInformation:shipping_information, returnPolicy:return_policy, images, reviews:product_reviews(rating, comment, date:review_date, reviewerName:reviewer_name, reviewerEmail:reviewer_email)`

const SORT_COLUMNS: Record<
  NonNullable<GetProductsParams["sortBy"]>,
  string
> = {
  rating: "rating",
  discountPercentage: "discount_percentage",
  price: "price",
  title: "title",
}

async function getProducts({
  limit,
  skip,
  sortBy,
  order,
  category,
}: GetProductsParams = {}): Promise<Product[]> {
  let query = supabase.from("products").select(CARD_COLUMNS)

  if (category) query = query.eq("category", category)
  if (sortBy) {
    query = query.order(SORT_COLUMNS[sortBy], { ascending: order !== "desc" })
  }
  if (skip != null || limit != null) {
    const from = skip ?? 0
    const to = from + (limit ?? 1000) - 1
    query = query.range(from, to)
  } else if (limit != null) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
  return (data ?? []) as unknown as Product[]
}

async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select(CARD_COLUMNS)
  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
  return (data ?? []) as unknown as Product[]
}

async function getBestDeals(limit: number): Promise<Product[]> {
  const products = await getAllProducts()

  return products
    .filter((product) => product.discountPercentage > 0)
    .sort((a, b) => {
      const discountDiff = b.discountPercentage - a.discountPercentage
      return discountDiff !== 0 ? discountDiff : b.rating - a.rating
    })
    .slice(0, limit)
}

async function getLowStock(limit: number): Promise<Product[]> {
  const products = await getAllProducts()

  return products
    .filter((product) => product.stock >= 1 && product.stock < 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, limit)
}

async function getTopRated(limit: number): Promise<Product[]> {
  const products = await getAllProducts()

  return products
    .filter((product) => product.stock !== 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

type ShopSort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-asc"
  | "rating-desc"
  | "title-asc"
  | "title-desc"

interface ShopFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  discountedOnly?: boolean
  lowStockOnly?: boolean
  sort?: ShopSort
  page?: number
  pageSize?: number
}

interface ShopProductsResult {
  products: Product[]
  total: number
  ratingCounts: Record<number, number>
  allRatingsCount: number
}

const RATING_THRESHOLDS = [4, 3, 2]

async function getShopProducts({
  query,
  category,
  minPrice,
  maxPrice,
  minRating,
  discountedOnly,
  lowStockOnly,
  sort = "featured",
  page = 1,
  pageSize = 15,
}: ShopFilters = {}): Promise<ShopProductsResult> {
  const all = await getAllProducts()

  // Filters other than rating are applied first so rating facet counts
  // ("how many results at each star threshold") reflect every other active
  // filter without being narrowed by the rating filter itself.
  let base = all
  if (query) {
    const q = query.trim().toLowerCase()
    base = base.filter((p) => p.title.toLowerCase().includes(q))
  }
  if (category) base = base.filter((p) => p.category === category)
  if (minPrice != null)
    base = base.filter(
      (p) => getDiscountedPrice(p.price, p.discountPercentage) >= minPrice
    )
  if (maxPrice != null)
    base = base.filter(
      (p) => getDiscountedPrice(p.price, p.discountPercentage) <= maxPrice
    )
  if (discountedOnly) base = base.filter((p) => p.discountPercentage > 0)
  if (lowStockOnly) base = base.filter((p) => p.stock < 10)

  const ratingCounts: Record<number, number> = {}
  for (const threshold of RATING_THRESHOLDS) {
    ratingCounts[threshold] = base.filter((p) => p.rating >= threshold).length
  }
  const allRatingsCount = base.length

  const filtered =
    minRating != null ? base.filter((p) => p.rating >= minRating) : base

  const sorted = [...filtered]
  if (sort === "price-asc")
    sorted.sort(
      (a, b) =>
        getDiscountedPrice(a.price, a.discountPercentage) -
        getDiscountedPrice(b.price, b.discountPercentage)
    )
  else if (sort === "price-desc")
    sorted.sort(
      (a, b) =>
        getDiscountedPrice(b.price, b.discountPercentage) -
        getDiscountedPrice(a.price, a.discountPercentage)
    )
  else if (sort === "rating-asc") sorted.sort((a, b) => a.rating - b.rating)
  else if (sort === "rating-desc") sorted.sort((a, b) => b.rating - a.rating)
  else if (sort === "title-asc")
    sorted.sort((a, b) => a.title.localeCompare(b.title))
  else if (sort === "title-desc")
    sorted.sort((a, b) => b.title.localeCompare(a.title))
  else if (sort === "featured") {
    if (lowStockOnly) {
      sorted.sort((a, b) => a.stock - b.stock)
    } else if (discountedOnly) {
      sorted.sort((a, b) => b.discountPercentage - a.discountPercentage)
    }
  }

  // Out-of-stock items are always demoted to the very end of the results —
  // regardless of which sort/filter is active — so they only ever surface
  // on the last page.
  const inStock = sorted.filter((p) => p.stock !== 0)
  const outOfStock = sorted.filter((p) => p.stock === 0)
  const finalProducts = [...inStock, ...outOfStock]

  const total = finalProducts.length
  const start = (page - 1) * pageSize
  const products = finalProducts.slice(start, start + pageSize)

  return { products, total, ratingCounts, allRatingsCount }
}

async function getProduct(id: string): Promise<ProductDetail> {
  const { data, error } = await supabase
    .from("products")
    .select(DETAIL_COLUMNS)
    .eq("id", Number(id))
    .order("id", { referencedTable: "product_reviews", ascending: true })
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch product: ${error.message}`)
  }
  if (!data) {
    notFound()
  }

  return data as unknown as ProductDetail
}

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name")
    .order("name")

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
  return (data ?? []) as Category[]
}

async function searchProducts(
  query: string,
  limit = 4,
  signal?: AbortSignal
): Promise<Product[]> {
  const q = query.trim()
  if (!q) return []

  let request = supabase
    .from("products")
    .select(CARD_COLUMNS)
    .ilike("search_text", `%${q}%`)
    .limit(limit)

  if (signal) request = request.abortSignal(signal)

  const { data, error } = await request
  if (error) {
    throw new Error(`Failed to search products: ${error.message}`)
  }
  return (data ?? []) as unknown as Product[]
}

export {
  getProducts,
  getProduct,
  getBestDeals,
  getLowStock,
  getTopRated,
  getCategories,
  searchProducts,
  getShopProducts,
}
export type { Product, ProductDetail, ProductReview, Category, ShopFilters, ShopSort }
