import React, { useState } from 'react';
import { Copy, Check, Ticket } from 'lucide-react';
import { motion } from 'motion/react';

interface CouponTicketProps {
  title: string;
  subtitle: string;
  code: string;
  description: string;
  isActive: boolean;
  onCopySuccess: (msg: string) => void;
}

export default function CouponTicket({
  title,
  subtitle,
  code,
  description,
  isActive,
  onCopySuccess,
}: CouponTicketProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isActive || !code) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    onCopySuccess(`COUPON CODE COPIED: ${code}`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="py-6 px-6 md:px-16 max-w-7xl mx-auto w-full">
      <div 
        onClick={handleCopy}
        className="relative w-full bg-gradient-to-r from-[#FFF5EC] to-[#FFFBF7] border-2 border-black flex flex-col md:flex-row items-center justify-between p-6 md:p-8 cursor-pointer select-none group shadow-[6px_6px_0px_#141b2b] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0px_#141b2b] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150 overflow-hidden"
      >
        {/* Decorative Circle Punches (Cutouts) matching the body background '#ffdfac' */}
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#ffdfac] border-2 border-black z-10" />
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#ffdfac] border-2 border-black z-10" />

        {/* Left Section: Offer Details */}
        <div className="flex items-center gap-4 md:gap-6 z-10 pl-4">
          <div className="p-3 bg-[#ffdfac] text-black border border-black rounded-none shrink-0 group-hover:rotate-6 transition-transform">
            <Ticket className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="font-display font-extrabold text-xl md:text-2xl text-[#ba1a1a] uppercase tracking-wider leading-none">
              {title || 'Get 10% Off'}
            </h4>
            <p className="font-sans text-xs text-[#575f65] font-bold uppercase tracking-wider">
              {subtitle || 'Up To Rs. 100 Off*'}
            </p>
          </div>
        </div>

        {/* Dashed vertical separator in desktop view, horizontal in mobile */}
        <div className="w-full md:w-0 h-0 md:h-12 border-b-2 md:border-b-0 md:border-r-2 border-dashed border-black/25 my-4 md:my-0 md:mx-8 z-10" />

        {/* Right Section: Coupon Stub Box */}
        <div className="flex flex-col items-center md:items-end gap-3 z-10 pr-4 w-full md:w-auto">
          <div className="flex border-2 border-black bg-white overflow-hidden w-full md:w-auto">
            <span className="bg-[#fcf8f2] font-mono text-[10px] font-bold text-[#6E6E73] flex items-center justify-center px-3 border-r-2 border-black uppercase tracking-widest shrink-0">
              COUPON CODE
            </span>
            <div className="flex-grow font-mono text-sm font-black px-6 py-2.5 text-center uppercase tracking-wider text-black select-all">
              {code}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="bg-black hover:bg-neutral-900 text-white px-4 flex items-center justify-center cursor-pointer transition-colors border-l border-black shrink-0"
              title="Copy coupon code"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <span className="font-sans text-[9px] text-[#6E6E73] font-bold uppercase tracking-wider text-center md:text-right">
            {description || 'On Your First Order | T&C Apply'}
          </span>
        </div>
      </div>
    </div>
  );
}
