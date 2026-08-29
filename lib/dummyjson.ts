import { notFound } from "next/navigation"

import { getSystemDiscount, getDiscountedPrice } from "@/lib/discounts"

const API_BASE = "https://dummyjson.com"

interface Product {
  id: number
  title: string
  price: number
  discountPercentage: number
  rating: number
  thumbnail: string
  category: string
  brand?: string
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
  tags: string[]
  sku: string
  weight: number
  dimensions: { width: number; height: number; depth: number }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: ProductReview[]
  returnPolicy: string
  minimumOrderQuantity: number
  images: string[]
}

interface Category {
  slug: string
  name: string
  url: string
}

interface GetProductsParams {
  limit?: number
  skip?: number
  sortBy?: "rating" | "discountPercentage" | "price" | "title"
  order?: "asc" | "desc"
  category?: string
}

async function getProducts({
  limit,
  skip,
  sortBy,
  order,
  category,
}: GetProductsParams = {}): Promise<Product[]> {
  const search = new URLSearchParams()
  search.set(
    "select",
    "id,title,price,discountPercentage,rating,thumbnail,category,brand,stock"
  )
  if (limit) search.set("limit", String(limit))
  if (skip) search.set("skip", String(skip))
  if (sortBy) search.set("sortBy", sortBy)
  if (order) search.set("order", order)

  const path = category ? `/products/category/${category}` : "/products"

  const res = await fetch(`${API_BASE}${path}?${search.toString()}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`)
  }

  const data: { products: Product[] } = await res.json()
  return data.products
}

async function getAllProducts(): Promise<Product[]> {
  const search = new URLSearchParams()
  search.set(
    "select",
    "id,title,price,discountPercentage,rating,thumbnail,category,brand,stock"
  )
  search.set("limit", "200")

  const res = await fetch(`${API_BASE}/products?${search.toString()}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`)
  }

  const data: { products: Product[] } = await res.json()
  return data.products
}

async function getBestDeals(limit: number): Promise<Product[]> {
  const products = await getAllProducts()

  return products
    .filter(
      (product) =>
        getSystemDiscount(product.discountPercentage, product.stock) > 0
    )
    .sort((a, b) => {
      const discountDiff =
        getSystemDiscount(b.discountPercentage, b.stock) -
        getSystemDiscount(a.discountPercentage, a.stock)
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
      (p) =>
        getDiscountedPrice(p.price, p.discountPercentage, p.stock) >=
        minPrice
    )
  if (maxPrice != null)
    base = base.filter(
      (p) =>
        getDiscountedPrice(p.price, p.discountPercentage, p.stock) <=
        maxPrice
    )
  if (discountedOnly)
    base = base.filter(
      (p) => getSystemDiscount(p.discountPercentage, p.stock) > 0
    )
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
        getDiscountedPrice(a.price, a.discountPercentage, a.stock) -
        getDiscountedPrice(b.price, b.discountPercentage, b.stock)
    )
  else if (sort === "price-desc")
    sorted.sort(
      (a, b) =>
        getDiscountedPrice(b.price, b.discountPercentage, b.stock) -
        getDiscountedPrice(a.price, a.discountPercentage, a.stock)
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
      sorted.sort(
        (a, b) =>
          getSystemDiscount(b.discountPercentage, b.stock) -
          getSystemDiscount(a.discountPercentage, a.stock)
      )
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
  const res = await fetch(`${API_BASE}/products/${id}`, {
    next: { revalidate: 3600 },
  })

  if (res.status === 404) {
    notFound()
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status}`)
  }

  return res.json()
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/products/categories`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`)
  }

  return res.json()
}

async function searchProducts(
  query: string,
  limit = 4,
  signal?: AbortSignal
): Promise<Product[]> {
  const search = new URLSearchParams({ q: query, limit: String(limit) })

  const res = await fetch(`${API_BASE}/products/search?${search.toString()}`, {
    signal,
  })

  if (!res.ok) {
    throw new Error(`Failed to search products: ${res.status}`)
  }

  const data: { products: Product[] } = await res.json()
  return data.products
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
