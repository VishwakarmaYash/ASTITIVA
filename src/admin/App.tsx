import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardTab from './components/DashboardTab';
import ProductsTab from './components/ProductsTab';
import OrdersTab from './components/OrdersTab';
import CustomersTab from './components/CustomersTab';
import { ActiveTab, Product, Order, Customer } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
} from "./data";

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

  // Initialize databases
  useEffect(() => {
    try {
      const cachedProducts = localStorage.getItem('vault_products');
      const cachedOrders = localStorage.getItem('vault_orders');
      const cachedCustomers = localStorage.getItem('vault_customers');

      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      } else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('vault_products', JSON.stringify(INITIAL_PRODUCTS));
      }

      if (cachedOrders) {
        setOrders(JSON.parse(cachedOrders));
      } else {
        setOrders(INITIAL_ORDERS);
        localStorage.setItem('vault_orders', JSON.stringify(INITIAL_ORDERS));
      }

      if (cachedCustomers) {
        setCustomers(JSON.parse(cachedCustomers));
      } else {
        setCustomers(INITIAL_CUSTOMERS);
        localStorage.setItem('vault_customers', JSON.stringify(INITIAL_CUSTOMERS));
      }
    } catch (e) {
      console.error("Local storage error:", e);
      // Fallback in case of sandboxed iframe limitations
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setCustomers(INITIAL_CUSTOMERS);
    }
  }, []);

  // Update localStorage when states mutate
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('vault_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error(e);
    }
  };

  const updateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('vault_orders', JSON.stringify(newOrders));
    } catch (e) {
      console.error(e);
    }
  };

  const updateCustomers = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    try {
      localStorage.setItem('vault_customers', JSON.stringify(newCustomers));
    } catch (e) {
      console.error(e);
    }
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
        </main>
      </div>
    </div>
  );
}
