import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
  ] as const;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#FBFBFC] border-r border-[#E5E7EB] z-50 flex flex-col py-8 shadow-xs">
      <div className="px-6 mb-10">
        <h1 className="font-sans text-2xl font-bold tracking-tight text-black">ASTITIVA</h1>
        <p className="text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider mt-1">Luxury Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full relative flex items-center gap-3 px-6 py-4 transition-all duration-200 text-left cursor-pointer group ${
                isActive
                  ? 'text-[#005cba] bg-[#eeeef0] font-semibold border-l-4 border-[#005cba]'
                  : 'text-[#6E6E73] hover:bg-[#f3f3f5] hover:text-black'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
              <span className="font-sans text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-6 mt-auto pt-6 border-t border-[#E5E7EB]">
        <button
          onClick={() => alert('Logout clicked - this is a luxury demo environment.')}
          className="w-full flex items-center gap-3 py-4 text-[#6E6E73] hover:text-[#ba1a1a] transition-colors duration-200 group text-left cursor-pointer"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          <span className="font-sans text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
