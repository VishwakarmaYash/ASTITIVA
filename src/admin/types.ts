export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: 'Active' | 'Draft' | 'Archived';
  image: string;
  description: string;
  sizes: string[];
  colors: string[]; // hex codes or color names
  images?: string[];
}

export interface OrderItem {
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  customization?: any;
}

export interface Order {
  id: string;
  customerName: string;
  customerAvatar: string;
  email: string;
  phone: string;
  date: string;
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'On Hold';
  items?: OrderItem[];
  shippingAddress?: string;
}

export interface ActivityTimelineItem {
  id: string;
  type: 'order' | 'loyalty' | 'profile' | 'support';
  title: string;
  date: string;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalOrders: number;
  totalSpending: number;
  status: 'VIP' | 'Member';
  recentOrdersList?: Array<{ id: string; date: string; amount: number }>;
  timeline?: ActivityTimelineItem[];
}

export type ActiveTab = 'dashboard' | 'products' | 'orders' | 'customers' | 'banners';

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
