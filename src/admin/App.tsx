import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardTab from './components/DashboardTab';
import ProductsTab from './components/ProductsTab';
import OrdersTab from './components/OrdersTab';
import CustomersTab from './components/CustomersTab';
import BannersTab from './components/BannersTab';
import { ActiveTab, Product, Order, Customer } from './types';
import { productsAPI, ordersAPI, authAPI } from '../api/client';

export default function App() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Dark/Light theme mode state (light is default for quiet luxury aesthetic)
  const [darkMode, setDarkMode] = useState(false);

  // Synchronized Core Database States with Local Storage Persistence
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Load databases from API
  const refreshDatabase = async () => {
    try {
      // 1. Fetch products
      const prodsData = await productsAPI.getAll();
      const formattedProds: Product[] = prodsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.id,
        category: p.category,
        price: Number(p.price),
        compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
        stock: p.inventory || 0,
        status: (p.inventory || 0) > 0 ? 'Active' : 'Draft',
        image: p.image || "",
        description: p.description || "",
        sizes: p.sizes || [],
        colors: p.color_code ? [p.color_code] : []
      }));
      setProducts(formattedProds);

      // 2. Fetch orders
      const ordersData = await ordersAPI.getAll();
      const formattedOrders: Order[] = ordersData.map((ord: any) => ({
        id: ord.id,
        customerName: ord.users ? `${ord.users.first_name || ''} ${ord.users.last_name || ''}`.trim() || ord.users.email || 'Anonymous' : 'Anonymous User',
        customerAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(ord.users?.email || 'A')}`,
        email: ord.users?.email || '',
        phone: ord.users?.phone || '',
        date: new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: Number(ord.total),
        paymentStatus: (ord.status === 'pending' || ord.status === 'cancelled') ? 'Pending' : 'Paid',
        orderStatus: ord.status === 'pending' ? 'On Hold' :
                     ord.status === 'processing' ? 'Processing' :
                     ord.status === 'shipped' ? 'Shipped' :
                     ord.status === 'delivered' ? 'Delivered' : 'On Hold',
        items: (ord.order_items || []).map((item: any) => ({
          productName: item.product_name,
          sku: item.product_id,
          price: Number(item.price),
          quantity: item.quantity,
          customization: item.customization || null,
        })),
        shippingAddress: ord.shipping_address || ''
      }));
      setOrders(formattedOrders);

      // 3. Fetch customers
      const customersData = await authAPI.getCustomers();
      const formattedCustomers: Customer[] = customersData.map((usr: any) => {
        const userOrders = formattedOrders.filter(o => o.email === usr.email);
        const totalSpending = userOrders.reduce((sum, o) => sum + o.amount, 0);
        const timeline = userOrders.map((o, idx) => ({
          id: `${usr.id}-t-${idx}`,
          type: 'order' as const,
          title: `Order placed: ${o.id}`,
          date: o.date,
          description: `Placed order totaling $${o.amount.toFixed(2)} with ${o.items?.length || 0} items.`
        }));

        return {
          id: usr.id,
          name: `${usr.first_name || ''} ${usr.last_name || ''}`.trim() || usr.email || 'Anonymous',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(usr.email)}`,
          email: usr.email,
          phone: usr.phone || 'No phone registered',
          joinedDate: `Joined ${new Date(usr.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
          totalOrders: userOrders.length,
          totalSpending: totalSpending,
          status: totalSpending > 1000 ? 'VIP' : 'Member',
          recentOrdersList: userOrders.slice(0, 3).map(o => ({ id: o.id, date: o.date, amount: o.amount })),
          timeline: timeline
        };
      });
      setCustomers(formattedCustomers);
    } catch (e) {
      console.error("Failed to load admin databases:", e);
    }
  };

  useEffect(() => {
    refreshDatabase();
  }, []);

  const updateProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const updateOrders = async (newOrders: Order[]) => {
    setOrders(newOrders);
  };

  const updateCustomers = async (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
  };

  // Clear search on tab switch for smooth context shifts
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] text-[#1a1c1d]">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Page Layout Wrapper */}
      <div className="ml-[280px] min-h-screen relative flex flex-col">
        {/* Dynamic Top Header Bar */}
        <TopBar
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Primary Page Canvas Content */}
        <main className="pt-24 pb-16 px-10 max-w-(--spacing-container-max) mx-auto w-full flex-1">
          {activeTab === 'dashboard' && (
            <DashboardTab
              products={products}
              orders={orders}
              customers={customers}
              onNavigateToTab={handleTabChange}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              setProducts={updateProducts}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              setOrders={updateOrders}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersTab
              customers={customers}
              setCustomers={updateCustomers}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'banners' && (
            <BannersTab />
          )}
        </main>
      </div>
    </div>
  );
}
