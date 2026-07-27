import React from 'react';
import { Package, ShieldCheck, Truck, Headphones } from 'lucide-react';

export default function FeaturesBanner() {
  const props = [
    {
      icon: <Package className="w-5 h-5 text-black stroke-[1.5]" />,
      title: '7 Days Returns',
      subtitle: 'Secured money back protocol',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-black stroke-[1.5]" />,
      title: 'Heavyweight Quality',
      subtitle: '360 GSM Luxury Cotton',
    },
    {
      icon: <Truck className="w-5 h-5 text-black stroke-[1.5]" />,
      title: 'Free Shipping',
      subtitle: 'Auto applied above Rs. 999',
    },
    {
      icon: <Headphones className="w-5 h-5 text-black stroke-[1.5]" />,
      title: 'Priority Support',
      subtitle: '24/7 drop inquiries',
    },
  ];

  return (
    <div className="w-full bg-[#ffdfac] border-t-2 border-black relative overflow-hidden select-none">
      {/* Subtle background grid alignment lines to match website vibe */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Value Propositions Columns */}
      <div className="max-w-7xl mx-auto py-16 px-6 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 relative z-10">
        {props.map((item, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col items-center text-center p-4 ${
              idx !== 3 ? 'lg:border-r border-black/10' : ''
            }`}
          >
            {/* Neobrutalist Icon Box */}
            <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center mb-4 shrink-0 shadow-[3px_3px_0px_#000] transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
              {item.icon}
            </div>
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-black mb-1">
              {item.title}
            </h4>
            <p className="font-sans text-[9px] text-[#4a4a4a] uppercase font-bold tracking-widest">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Instagram Follow Section */}
      <div className="border-t-2 border-black py-16 text-center space-y-4 relative z-10 bg-[#ffdfac]/30">
        <span className="font-mono text-[10px] text-[#4a4a4a] uppercase tracking-[0.3em] font-bold">
          Follow us on instagram
        </span>
        <h3 className="font-display font-black text-2xl md:text-4xl tracking-wider text-black uppercase">
          <a
            href="https://instagram.com/astitiva_stylefit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:text-[#008080] hover:scale-102 transition-all duration-200 border-b-2 border-black pb-1 hover:border-[#008080]"
          >
            @astitiva_stylefit
          </a>
        </h3>
        <p className="font-mono text-[9px] text-[#4a4a4a] uppercase tracking-[0.2em] font-bold">
          Follow us and get 10% off coupon code: <span className="font-extrabold text-[#ba1a1a] select-all">ASTITIVA10</span>
        </p>
      </div>
    </div>
  );
}
