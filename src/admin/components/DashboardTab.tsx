import { Download, Package, ShoppingCart, Users, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Product, Order } from '../types';

interface DashboardTabProps {
  products: Product[];
  orders: Order[];
  onNavigateToTab: (tab: 'products' | 'orders' | 'customers') => void;
}

const revenueData = [
  { month: 'Jan', revenue: 65000 },
  { month: 'Feb', revenue: 72000 },
  { month: 'Mar', revenue: 81000 },
  { month: 'Apr', revenue: 78000 },
  { month: 'May', revenue: 95000 },
  { month: 'Jun', revenue: 110000 },
  { month: 'Jul', revenue: 105000 },
  { month: 'Aug', revenue: 125000 },
  { month: 'Sep', revenue: 118000 },
  { month: 'Oct', revenue: 142000 },
  { month: 'Nov', revenue: 138000 },
  { month: 'Dec', revenue: 160000 },
];

const salesData = [
  { name: 'Q1', sales: 2800 },
  { name: 'Q2', sales: 3100 },
  { name: 'Q3', sales: 4200 },
  { name: 'Q4', sales: 4108 },
];

export default function DashboardTab({ products, orders, onNavigateToTab }: DashboardTabProps) {
  // Extract stats or use high-fidelity replicas from user design
  const totalProductsCount = products.length + 847; // 854 total
  const totalOrdersCount = 14208;
  const totalCustomersCount = 2492;
  const totalRevenue = 1248300;

  // Find products that have stock <= 5 (Low Stock)
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
    link.setAttribute("download", "vault_executive_report.csv");
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
          <p className="text-[#6E6E73] text-base mt-1">Welcome back. Here's a snapshot of the VAULT performance.</p>
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
