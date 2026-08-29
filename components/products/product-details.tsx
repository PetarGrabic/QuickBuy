import type { ProductDetail } from "@/lib/dummyjson"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-xs text-foreground">{value}</dd>
    </>
  )
}

function ProductDetails({ product }: { product: ProductDetail }) {
  const { width, height, depth } = product.dimensions

  return (
    <div>
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Details
      </h2>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <DetailRow label="SKU" value={product.sku} />
        {product.brand && <DetailRow label="Brand" value={product.brand} />}
        <DetailRow
          label="Dimensions"
          value={`${width} × ${height} × ${depth}`}
        />
        <DetailRow label="Warranty" value={product.warrantyInformation} />
        <DetailRow label="Shipping" value={product.shippingInformation} />
        <DetailRow label="Returns" value={product.returnPolicy} />
      </dl>
    </div>
  )
}

export { ProductDetails }
