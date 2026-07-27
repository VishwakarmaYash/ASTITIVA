import { useState, useEffect } from 'react';
import { Download, Package, ShoppingCart, Users, ArrowUpRight, AlertTriangle, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Product, Order, Customer } from '../types';
import { shippingAPI } from '../../api/client';

interface DashboardTabProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onNavigateToTab: (tab: 'products' | 'orders' | 'customers') => void;
}

export default function DashboardTab({ products, orders, customers, onNavigateToTab }: DashboardTabProps) {
  // Shipping config management state
  const [shippingFee, setShippingFee] = useState<string>('50');
  const [shippingThreshold, setShippingThreshold] = useState<string>('1000');
  
  // Announcement settings state
  const [announcementText, setAnnouncementText] = useState<string>('FREE SHIPPING ON ORDERS OVER Rs. 1000');
  const [announcementBgColor, setAnnouncementBgColor] = useState<string>('#ccff00');
  const [announcementTextColor, setAnnouncementTextColor] = useState<string>('#000000');
  const [announcementIsActive, setAnnouncementIsActive] = useState<boolean>(true);
  
  // Popup settings state
  const [popupTitle, setPopupTitle] = useState<string>('EXCLUSIVE VIP ACCESS');
  const [popupDescription, setPopupDescription] = useState<string>('Join the ASTITVA mailing list for priority drop notifications and 10% off.');
  const [popupImageUrl, setPopupImageUrl] = useState<string>('/images/astitva_white_tee.png');
  const [popupButtonText, setPopupButtonText] = useState<string>('JOIN CLUB');
  const [popupIsActive, setPopupIsActive] = useState<boolean>(true);
  const [popupDiscountCode, setPopupDiscountCode] = useState<string>('VAULT10');

  // Coupon settings state
  const [couponTitle, setCouponTitle] = useState<string>('Get 10% Off');
  const [couponSubtitle, setCouponSubtitle] = useState<string>('Up To Rs. 100 Off*');
  const [couponCode, setCouponCode] = useState<string>('ASTITIVA10');
  const [couponDescription, setCouponDescription] = useState<string>('On Your First Order | T&C Apply');
  const [couponIsActive, setCouponIsActive] = useState<boolean>(true);

  const [activeSettingsTab, setActiveSettingsTab] = useState<'delivery' | 'announcement' | 'popup' | 'coupon'>('delivery');
  const [isUpdatingShipping, setIsUpdatingShipping] = useState<boolean>(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await shippingAPI.getConfig();
        if (config) {
          setShippingFee(config.baseShippingFee.toString());
          setShippingThreshold(config.freeShippingThreshold.toString());
          setAnnouncementText(config.announcementText || '');
          setAnnouncementBgColor(config.announcementBgColor || '#ccff00');
          setAnnouncementTextColor(config.announcementTextColor || '#000000');
          setAnnouncementIsActive(!!config.announcementIsActive);
          setPopupTitle(config.popupTitle || '');
          setPopupDescription(config.popupDescription || '');
          setPopupImageUrl(config.popupImageUrl || '');
          setPopupButtonText(config.popupButtonText || 'JOIN CLUB');
          setPopupIsActive(!!config.popupIsActive);
          setPopupDiscountCode(config.popupDiscountCode || 'VAULT10');
          setCouponTitle(config.couponTitle || 'Get 10% Off');
          setCouponSubtitle(config.couponSubtitle || 'Up To Rs. 100 Off*');
          setCouponCode(config.couponCode || 'ASTITIVA10');
          setCouponDescription(config.couponDescription || 'On Your First Order | T&C Apply');
          setCouponIsActive(!!config.couponIsActive);
        }
      } catch (err) {
        console.error("Failed to load shipping config on dashboard:", err);
      }
    };
    fetchConfig();
  }, []);

  const handleUpdateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingShipping(true);
      const payload = {
        baseShippingFee: parseFloat(shippingFee) || 0,
        freeShippingThreshold: parseFloat(shippingThreshold) || 0,
        announcementText,
        announcementBgColor,
        announcementTextColor,
        announcementIsActive,
        popupTitle,
        popupDescription,
        popupImageUrl,
        popupButtonText,
        popupIsActive,
        popupDiscountCode,
        couponTitle,
        couponSubtitle,
        couponCode,
        couponDescription,
        couponIsActive,
      };
      await shippingAPI.updateConfig(payload);
      alert("System settings updated successfully!");
    } catch (err: any) {
      alert("Failed to update settings: " + err.message);
    } finally {
      setIsUpdatingShipping(false);
    }
  };

  // Compute dynamic stats from live databases
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const totalCustomersCount = customers.length;
  
  // Calculate total revenue of all orders (excluding cancelled/On Hold ones)
  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'On Hold')
    .reduce((sum, o) => sum + o.amount, 0);

  // Generate dynamic revenueData (last 12 months)
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      year: d.getFullYear(),
      revenue: 0
    };
  }).reverse();

  orders.forEach(o => {
    const orderDate = new Date(o.date);
    const monthStr = orderDate.toLocaleDateString('en-US', { month: 'short' });
    const year = orderDate.getFullYear();
    
    const slot = last12Months.find(m => m.month === monthStr && m.year === year);
    if (slot && o.orderStatus !== 'On Hold') {
      slot.revenue += o.amount;
    }
  });

  const revenueData = last12Months;

  // Generate dynamic salesData (sales counts per quarter of current year)
  const currentYear = new Date().getFullYear();
  const quarterlySales = [
    { name: 'Q1', sales: 0 },
    { name: 'Q2', sales: 0 },
    { name: 'Q3', sales: 0 },
    { name: 'Q4', sales: 0 }
  ];

  orders.forEach(o => {
    const orderDate = new Date(o.date);
    if (orderDate.getFullYear() === currentYear && o.orderStatus !== 'On Hold') {
      const month = orderDate.getMonth();
      const quarterIndex = Math.floor(month / 3);
      if (quarterIndex >= 0 && quarterIndex < 4) {
        quarterlySales[quarterIndex].sales += 1;
      }
    }
  });

  const salesData = quarterlySales;

  // Find products that have stock <= 12 (Low Stock)
  const lowStockProducts = products.filter(p => p.stock <= 12).sort((a,b) => a.stock - b.stock);

  // Take top 5 orders to show
  const recentOrders = orders.slice(0, 5);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Metric,Value", `Total Products,${totalProductsCount}`, `Total Orders,${totalOrdersCount}`, `Total Customers,${totalCustomersCount}`, `Total Revenue,${totalRevenue}`].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "astitiva_executive_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-black">Executive Dashboard</h2>
          <p className="text-[#6E6E73] text-base mt-1">Welcome back. Here's a snapshot of the ASTITIVA performance.</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-black text-white px-6 py-2.5 rounded-lg font-sans text-sm font-semibold flex items-center gap-2 active:scale-95 hover:opacity-90 transition-all cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Top Stats bento style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div
          onClick={() => onNavigateToTab('products')}
          className="tonal-card p-6 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Total Products</span>
            <Package className="text-[#005cba] opacity-50 w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-bold tracking-tight">{totalProductsCount}</span>
            <span className="text-[#28CD41] text-xs font-semibold flex items-center gap-0.5">
              +2.4%
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigateToTab('orders')}
          className="tonal-card p-6 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingCart className="text-[#005cba] opacity-50 w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-bold tracking-tight">{totalOrdersCount.toLocaleString()}</span>
            <span className="text-[#28CD41] text-xs font-semibold">+12.1%</span>
          </div>
        </div>

        {/* Total Customers */}
        <div
          onClick={() => onNavigateToTab('customers')}
          className="tonal-card p-6 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Total Customers</span>
            <Users className="text-[#005cba] opacity-50 w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-bold tracking-tight">{totalCustomersCount.toLocaleString()}</span>
            <span className="text-[#28CD41] text-xs font-semibold">+8.5%</span>
          </div>
        </div>

        {/* Total Revenue - Highlight Dark Card */}
        <div className="bg-black p-6 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[#e2e2e4] text-[11px] font-bold uppercase tracking-wider">Total Revenue</span>
            <ArrowUpRight className="text-white opacity-70 w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-bold tracking-tight text-white">{formatCurrency(totalRevenue)}</span>
            <span className="text-[#28CD41] text-xs font-semibold">+18.2%</span>
          </div>
        </div>
      </div>

      {/* Dynamic Marketing Settings Card */}
      <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#E5E7EB]">
          <div>
            <h3 className="font-sans text-lg font-bold text-black">Global Configurations</h3>
            <p className="text-xs text-[#6E6E73] mt-0.5">Manage active announcements, popups, and delivery settings.</p>
          </div>
          {/* Subtabs selectors */}
          <div className="flex gap-2 bg-[#F5F5F7] p-1 rounded-lg">
            {(['delivery', 'announcement', 'popup', 'coupon'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSettingsTab(tab)}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeSettingsTab === tab
                    ? 'bg-white text-black shadow-xs'
                    : 'text-[#6E6E73] hover:text-black'
                }`}
              >
                {tab === 'delivery' ? 'Delivery Fees' : tab === 'announcement' ? 'Announcement Bar' : tab === 'popup' ? 'Promo Popup' : 'Coupon Code'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleUpdateShipping} className="space-y-6">
          {activeSettingsTab === 'delivery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Base Delivery Fee (Rs.)</label>
                <input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden font-mono text-black font-semibold"
                  placeholder="50"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Free Delivery Min Order (Rs.)</label>
                <input
                  type="number"
                  value={shippingThreshold}
                  onChange={(e) => setShippingThreshold(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden font-mono text-black font-semibold"
                  placeholder="1000"
                  required
                />
              </div>
            </div>
          )}

          {activeSettingsTab === 'announcement' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider">Announcement Status</span>
                <button
                  type="button"
                  onClick={() => setAnnouncementIsActive(!announcementIsActive)}
                  className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer outline-hidden ${
                    announcementIsActive ? 'text-green-700' : 'text-gray-400'
                  }`}
                >
                  {announcementIsActive ? 'Active' : 'Disabled'}
                </button>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Banner Announcement Text</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold"
                  placeholder="e.g. FREE SHIPPING ON ALL ORDERS OVER Rs. 1000"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Background Color (Hex)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={announcementBgColor}
                      onChange={(e) => setAnnouncementBgColor(e.target.value)}
                      className="w-10 h-10 border border-[#E5E7EB] rounded-lg cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={announcementBgColor}
                      onChange={(e) => setAnnouncementBgColor(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden font-mono uppercase"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Text Color (Hex)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={announcementTextColor}
                      onChange={(e) => setAnnouncementTextColor(e.target.value)}
                      className="w-10 h-10 border border-[#E5E7EB] rounded-lg cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={announcementTextColor}
                      onChange={(e) => setAnnouncementTextColor(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden font-mono uppercase"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'popup' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider">Popup Display status</span>
                <button
                  type="button"
                  onClick={() => setPopupIsActive(!popupIsActive)}
                  className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer outline-hidden ${
                    popupIsActive ? 'text-green-700' : 'text-gray-400'
                  }`}
                >
                  {popupIsActive ? 'Active' : 'Disabled'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Popup Title</label>
                  <input
                    type="text"
                    value={popupTitle}
                    onChange={(e) => setPopupTitle(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold"
                    placeholder="e.g. EXCLUSIVE VIP ACCESS"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Discount Code (Promo)</label>
                  <input
                    type="text"
                    value={popupDiscountCode}
                    onChange={(e) => setPopupDiscountCode(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold"
                    placeholder="VAULT10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Popup Description</label>
                <textarea
                  rows={2}
                  value={popupDescription}
                  onChange={(e) => setPopupDescription(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold resize-none"
                  placeholder="Tell user about the promo benefit..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Image URL</label>
                  <input
                    type="text"
                    value={popupImageUrl}
                    onChange={(e) => setPopupImageUrl(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold"
                    placeholder="/images/astitva_white_tee.png"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Button Action Text</label>
                  <input
                    type="text"
                    value={popupButtonText}
                    onChange={(e) => setPopupButtonText(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold"
                    placeholder="JOIN CLUB"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'coupon' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider">Coupon Display status</span>
                <button
                  type="button"
                  onClick={() => setCouponIsActive(!couponIsActive)}
                  className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer outline-hidden ${
                    couponIsActive ? 'text-green-700' : 'text-gray-400'
                  }`}
                >
                  {couponIsActive ? 'Active' : 'Disabled'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Voucher/Coupon Title</label>
                  <input
                    type="text"
                    value={couponTitle}
                    onChange={(e) => setCouponTitle(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold"
                    placeholder="e.g. Get 10% Off"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Coupon Discount Code</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold"
                    placeholder="ASTITIVA10"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Subtitle/Condition</label>
                  <input
                    type="text"
                    value={couponSubtitle}
                    onChange={(e) => setCouponSubtitle(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold"
                    placeholder="Up To Rs. 100 Off*"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">Terms/T&C description</label>
                  <input
                    type="text"
                    value={couponDescription}
                    onChange={(e) => setCouponDescription(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden text-black font-semibold"
                    placeholder="On Your First Order | T&C Apply"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingShipping}
              className="bg-black text-white px-6 py-3 rounded-lg font-sans text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 min-w-[150px] flex items-center justify-center"
            >
              {isUpdatingShipping ? 'Updating Settings...' : 'Save Configurations'}
            </button>
          </div>
        </form>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview Line/Area Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] p-6 rounded-xl min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-sans text-lg font-semibold text-black">Revenue Overview</h3>
            <select className="bg-[#eeeef0] border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer">
              <option>Last 12 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005cba" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#005cba" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#76777d', fontSize: 12, fontFamily: 'Hanken Grotesk' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#76777d', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
                  contentStyle={{ fontFamily: 'Hanken Grotesk', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#005cba" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Sales Bar Chart */}
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-sans text-lg font-semibold text-black">Monthly Sales</h3>
            <button 
              onClick={() => onNavigateToTab('orders')} 
              className="text-[#005cba] hover:underline text-xs font-bold cursor-pointer"
            >
              Details
            </button>
          </div>
          <div className="flex-1 h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barSize={40} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#1a1c1d', fontSize: 12, fontWeight: 600, fontFamily: 'Hanken Grotesk' }} 
                />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: any) => [value, 'Sales']}
                  contentStyle={{ fontFamily: 'Hanken Grotesk', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#000000" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-sans text-lg font-semibold text-black">Recent Orders</h3>
            <button 
              onClick={() => onNavigateToTab('orders')} 
              className="text-[#6E6E73] hover:text-black text-xs font-semibold cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider border-b border-[#E5E7EB]">
                  <th className="py-4">Order ID</th>
                  <th className="py-4">Customer</th>
                  <th className="py-4">Date</th>
                  <th className="py-4">Amount</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((order) => {
                  let badgeColor = '';
                  switch (order.orderStatus) {
                    case 'Delivered':
                      badgeColor = 'bg-[#28CD41]/10 text-[#28CD41]';
                      break;
                    case 'Shipped':
                      badgeColor = 'bg-[#005cba]/10 text-[#005cba]';
                      break;
                    case 'Processing':
                      badgeColor = 'bg-[#f9dfbd]/50 text-[#55442c]';
                      break;
                    default:
                      badgeColor = 'bg-gray-100 text-gray-700';
                  }

                  return (
                    <tr 
                      key={order.id} 
                      className="border-b border-[#E5E7EB] hover:bg-[#FBFBFC] transition-colors duration-150"
                    >
                      <td className="py-5 font-mono text-xs text-black font-semibold">{order.id}</td>
                      <td className="py-5 font-semibold text-black">{order.customerName}</td>
                      <td className="py-5 text-[#6E6E73]">{order.date}</td>
                      <td className="py-5 font-mono text-xs font-semibold text-black">{formatCurrency(order.amount)}</td>
                      <td className="py-5">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-sans text-lg font-semibold text-black">Low Stock</h3>
            <button 
              onClick={() => alert('Restock requested for all items.')} 
              className="text-[#005cba] hover:underline text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Restock All
            </button>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar max-h-[350px]">
            {lowStockProducts.map((p) => {
              const isOut = p.stock === 0;
              const isVeryLow = p.stock <= 2 && p.stock > 0;
              const ratio = Math.max(5, Math.min(100, (p.stock / 24) * 100));

              return (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#eeeef0] overflow-hidden flex-shrink-0 border border-[#E5E7EB]">
                    <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={p.image} alt={p.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-black truncate">{p.name}</p>
                    <p className="text-[11px] text-[#6E6E73]">SKU: {p.sku}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-mono font-bold text-xs ${isOut ? 'text-[#ba1a1a]' : isVeryLow ? 'text-[#ba1a1a]' : 'text-[#55442c]'}`}>
                      {p.stock} {isOut ? 'Out' : 'Left'}
                    </p>
                    <div className="w-16 h-1 bg-[#eeeef0] rounded-full overflow-hidden mt-1 ml-auto">
                      <div 
                        className={`h-full rounded-full ${isOut ? 'bg-red-200' : isVeryLow ? 'bg-[#ba1a1a]' : 'bg-[#55442c]'}`}
                        style={{ width: `${ratio}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
