export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  colorCode?: string;
  image: string;
  description: string;
  category: "Jackets" | "Pants" | "Footwear" | "Accessories" | "T-Shirts" | "Customs" | string;
  features?: string[];
  specs?: string[];
  sizes: string[];
  images?: string[];
  inventory?: number;
}

export interface CartItem {
  id: string; // unique cart item identifier (product.id + size)
  product: Product;
  size: string;
  quantity: number;
  customization?: any;
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

export interface Banner {
  id?: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  location: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}
