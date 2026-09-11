export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  inStock: boolean;
}

// Static data removed - use API endpoints instead
export const products: Product[] = [];

export const categories = [
  "All",
  "Buckets",
  "Lids", 
  "Patlas",
  "Furniture",
  "Basins",
  "Tubs",
  "Mugs",
  "Planters",
  "Kitchen",
  "Bathroom",
  "Cleaning",
  "Storage",
  "Bottles",
  "Laundry"
];



