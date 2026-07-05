import { Search, Bell, Sun, Moon } from 'lucide-react';
import { ActiveTab } from '../types';
import { useState } from 'react';

interface TopBarProps {
  activeTab: ActiveTab;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function TopBar({
  activeTab,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
}: TopBarProps) {
  const [unreadNotifications, setUnreadNotifications] = useState(true);

  // Dynamic values depending on active tab
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Search analytics, products...';
      case 'products':
        return 'Quick search...';
      case 'orders':
        return 'Search orders...';
      case 'customers':
        return 'Search customers, orders...';
      default:
        return 'Search...';
    }
  };

  const getProfileInfo = () => {
    if (activeTab === 'products') {
      return {
        name: 'Alex Vault',
        role: 'Inventory Manager',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjSvH6ICbDrLvHeb86CmEJ_KBOVFXn7levBuztLd01TkXMEKXF0WtacjdNeaFDheX8Wm-6PMy_kMuIHDmc1Xv9sehjs0C3SIEJRMck8MwpPXG8ial3fHgFnZyNPl5CgmvDFj9MkTXrER17hNffWNzjwPvq-A_ieMUSIkZQqx0hcvQHiakPotE3hoJS3dGr6hb-UO-u8Xg7lugXBOTRiUlDgU5dT7GIxRRLOp7xCwmc1L5UTfa-PiwD',
      };
    }
    return {
      name: 'Admin User',
      role: 'System Manager',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbzrAG20H1KTY0u2keYaR-GFt1wIHr_8x2xC8YZ7y1WoxFd7Go0-rRg9MTFClLW9yhEvufiPGC-Ng6V42XKZIlPYMdKo8CDQ0ag0mlEbXckvrKtugmsXqA5KaZzCbSKjcPs3I1O1aAuK04X4i0ogHdITA6mcEREJANnunhZ-E3bzl25Ty8JIj9c-wgDBosbVAQ34vz8cDc0AdRNEYz4SFJaAT-kY8rEa41q9BY2v0UNkzAbzJPPmB',
    };
  };

  const profile = getProfileInfo();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 z-40 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] flex justify-between items-center px-8">
      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f3f3f5] border-none rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#005cba] text-sm placeholder:text-[#6E6E73]"
            placeholder={getSearchPlaceholder()}
          />
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button
          onClick={() => {
            setUnreadNotifications(false);
            alert('No new notifications. Everything is in perfect order.');
          }}
          className="relative text-[#1a1c1d] hover:text-[#005cba] transition-colors duration-200 cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifications && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#005cba] rounded-full border border-white"></span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => {
            setDarkMode(!darkMode);
            alert('Symmetric dark/light themes are automatically adjusted to elegant light-mode for editorial quiet luxury comfort.');
          }}
          className="text-[#1a1c1d] hover:text-[#005cba] transition-colors duration-200 cursor-pointer"
          title="Toggle color theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-[1px] bg-[#E5E7EB]"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-tight group-hover:text-[#005cba] transition-colors">
              {profile.name}
            </p>
            <p className="text-[10px] text-[#6E6E73] uppercase tracking-wider">
              {profile.role}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E7EB] bg-[#eeeef0]">
            <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={profile.avatar} alt={profile.name} />
          </div>
        </div>
      </div>
    </header>
  );
}
