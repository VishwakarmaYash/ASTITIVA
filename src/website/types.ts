export interface Product {
  id: string;
  name: string;
  price: number;
  colorCode: string;
  image: string;
  description: string;
  category: "Jackets" | "Pants" | "Footwear" | "Accessories";
  features: string[];
  specs: string[];
  sizes: string[];
}

export interface CartItem {
  id: string; // unique cart item identifier (product.id + size)
  product: Product;
  size: string;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productName: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
}
