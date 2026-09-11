export function generateStableRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) / 2147483647;
}

export function getProductRandomValues(productId: string) {
  const baseRandom = generateStableRandom(productId);
  return {
    reviewCount: Math.floor(baseRandom * 200) + 50,
    isNew: baseRandom > 0.7,
    isBestseller: baseRandom > 0.8,
    discount: Math.floor(baseRandom * 30) + 10,
    reviews: Math.floor(baseRandom * 200) + 50
  };
}