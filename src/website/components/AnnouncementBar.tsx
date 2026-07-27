import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
  text: string;
  bgColor: string;
  textColor: string;
  isActive: boolean;
}

export default function AnnouncementBar({ text, bgColor, textColor, isActive }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user dismissed it during this session
    const isDismissed = sessionStorage.getItem('vault_announcement_dismissed');
    if (!isDismissed && isActive) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  const handleDismiss = () => {
    sessionStorage.setItem('vault_announcement_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible || !text) return null;

  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className="relative w-full py-2 px-8 text-center text-[10px] md:text-xs font-mono font-extrabold uppercase tracking-widest z-50 flex items-center justify-center min-h-[36px] transition-all duration-300 border-b border-black/10"
    >
      <div className="flex-1 truncate px-4">{text}</div>
      <button
        onClick={handleDismiss}
        style={{ color: textColor }}
        className="absolute right-3 hover:opacity-75 transition-opacity cursor-pointer p-1 rounded-full outline-hidden"
        title="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
