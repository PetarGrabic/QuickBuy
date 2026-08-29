// A product's `discountPercentage` is already the applied discount percent
// (0 / 5 / 10 / 15 / 20), baked in at the data layer. Nothing to derive here.
function getDiscountedPrice(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100)
}

export { getDiscountedPrice }
