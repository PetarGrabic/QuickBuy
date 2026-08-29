function getSystemDiscount(discountPercentage: number, stock?: number): number {
  if (stock === 0) return 0

  const tier = Math.floor(discountPercentage)
  if (tier === 4) return 5
  if (tier === 9) return 10
  if (tier === 14) return 15
  if (tier === 19) return 20
  return 0
}

function getDiscountedPrice(
  price: number,
  discountPercentage: number,
  stock?: number
): number {
  const discount = getSystemDiscount(discountPercentage, stock)
  return price * (1 - discount / 100)
}

export { getSystemDiscount, getDiscountedPrice }
