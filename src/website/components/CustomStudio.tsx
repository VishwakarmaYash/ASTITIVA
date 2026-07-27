import React, { useState, useRef } from 'react';
import { Upload, ShoppingBag, Info, Trash2, ArrowLeftRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface CustomStudioProps {
  onAddCustomToCart: (customItem: {
    apparelType: 'tee' | 'hoodie';
    size: string;
    color: 'black' | 'white';
    designImage: string;
    customText: string;
    fontFamily: string;
    textColor: string;
    placement: 'front' | 'back';
    price: number;
  }) => void;
  onNavigateHome: () => void;
}

const FONTS = [
  { name: 'JetBrains Mono', class: 'font-mono' },
  { name: 'Sans‑Serif (Outfit)', class: 'font-sans' },
  { name: 'Impact (Heavy)', class: 'font-display font-black uppercase' },
  { name: 'Serif (Playfair)', class: 'font-serif' },
];

const COLORS = [
  { name: 'Obsidian Black', value: 'black', hex: '#141414', textHex: '#ffffff' },
  { name: 'Pure White', value: 'white', hex: '#F9F9FB', textHex: '#000000' },
];

export default function CustomStudio({ onAddCustomToCart, onNavigateHome }: CustomStudioProps) {
  const [apparelType, setApparelType] = useState<'tee' | 'hoodie'>('tee');
  const [size, setSize] = useState<string>('M');
  const [color, setColor] = useState<'black' | 'white'>('black');
  const [designImage, setDesignImage] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('Impact (Heavy)');
  const [textColor, setTextColor] = useState<string>('#ccff00'); // Neon green by default
  const [placement, setPlacement] = useState<'front' | 'back'>('front');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const price = apparelType === 'tee' ? 999 : 1999;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File is too large! Please upload an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setDesignImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designImage && !customText) {
      alert('Please upload a design artwork or add custom slogan text to create your piece.');
      return;
    }
    onAddCustomToCart({
      apparelType,
      size,
      color,
      designImage,
      customText,
      fontFamily,
      textColor,
      placement,
      price,
    });
  };

  const selectedColorHex = COLORS.find(c => c.value === color)?.hex || '#141414';
  const selectedTextFontClass = FONTS.find(f => f.name === fontFamily)?.class || 'font-sans';

  return (
    <div className="py-12 px-6 md:px-16 max-w-7xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b-2 border-black">
        <div>
          <h2 className="font-display font-black text-3xl md:text-5xl text-black uppercase tracking-tight">
            CUSTOM PRINT STUDIO
          </h2>
          <p className="text-sm font-sans font-bold text-[#6E6E73] uppercase tracking-wider mt-1">
            Build your own 1-of-1 premium streetwear garment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-5 bg-white border-2 border-black p-6 md:p-8 space-y-6 shadow-[6px_6px_0px_#000]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Apparel Type */}
            <div>
              <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">1. Choose Garment</label>
              <div className="grid grid-cols-2 gap-3">
                {(['tee', 'hoodie'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setApparelType(type)}
                    className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
                      apparelType === type
                        ? 'bg-black text-white shadow-none'
                        : 'bg-white text-black hover:bg-neutral-50 active:translate-y-0.5'
                    }`}
                  >
                    {type === 'tee' ? 'Heavy Tee (Rs. 999)' : 'Oversized Hoodie (Rs. 1999)'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Color Selection */}
            <div>
              <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">2. Garment Color</label>
              <div className="grid grid-cols-2 gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value as 'black' | 'white')}
                    className={`flex items-center gap-2 py-3 px-4 text-xs font-bold uppercase border-2 border-black transition-all cursor-pointer ${
                      color === c.value
                        ? 'bg-neutral-100 text-black border-2 border-black ring-2 ring-black'
                        : 'bg-white text-[#6E6E73] hover:text-black'
                    }`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full border border-black/30 shrink-0" 
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Sizing Selection */}
            <div>
              <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">3. Size Selection</label>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`w-12 h-12 text-sm font-black border-2 border-black flex items-center justify-center transition-all cursor-pointer ${
                      size === s
                        ? 'bg-black text-white shadow-none'
                        : 'bg-white text-black hover:bg-neutral-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Placement Selector */}
            <div>
              <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">4. Custom Print Placement</label>
              <div className="grid grid-cols-2 gap-3">
                {(['front', 'back'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlacement(p)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase border-2 border-black transition-all cursor-pointer ${
                      placement === p
                        ? 'bg-black text-white shadow-none'
                        : 'bg-white text-black hover:bg-neutral-50'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    {p === 'front' ? 'Front Center' : 'Back Print'}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Custom Artwork Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider block">5. Upload Artwork (PNG/JPG)</label>
                {designImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-[9px] font-bold text-red-600 flex items-center gap-0.5 uppercase hover:underline"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>
              
              {!designImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-black bg-neutral-50 hover:bg-neutral-100/50 p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2"
                >
                  <Upload className="w-6 h-6 text-neutral-400 stroke-[1.5]" />
                  <span className="text-xs font-bold font-sans uppercase tracking-wider text-black">Click to Upload Design</span>
                  <span className="text-[9px] text-[#6E6E73] uppercase">transparent PNG works best</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-neutral-50 border-2 border-black">
                  <img src={designImage} alt="Preview thumbnail" className="w-12 h-12 object-contain bg-white border border-neutral-200" />
                  <div className="overflow-hidden flex-grow">
                    <span className="text-xs font-bold block truncate">Design Artwork Loaded</span>
                    <span className="text-[9px] text-[#6E6E73] uppercase block">Ready to print</span>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Custom Text/Slogan */}
            <div>
              <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">6. Custom Text Overlay</label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter custom slogan..."
                className="w-full bg-white border-2 border-black px-4 py-2.5 text-sm focus:ring-0 focus:outline-hidden text-black font-semibold placeholder-neutral-400"
              />
              
              {customText && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[9px] font-bold text-[#6E6E73] uppercase block mb-1">Font family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full bg-white border-2 border-black px-2 py-1.5 text-xs focus:ring-0 cursor-pointer font-sans"
                    >
                      {FONTS.map(f => (
                        <option key={f.name} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[#6E6E73] uppercase block mb-1">Text Color</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {['#ccff00', '#ba1a1a', '#000000', '#ffffff', '#005cba'].map((cHex) => (
                        <button
                          key={cHex}
                          type="button"
                          onClick={() => setTextColor(cHex)}
                          className={`w-6 h-6 border border-black/40 ${
                            textColor === cHex ? 'ring-2 ring-black' : ''
                          }`}
                          style={{ backgroundColor: cHex }}
                          title={cHex}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Info Banner */}
            <div className="bg-neutral-50 border-2 border-black p-4 flex gap-3">
              <Info className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-sans font-bold text-[#6E6E73] uppercase leading-relaxed">
                All custom studio products are handmade, printed using DTF premium transfers, and require 3-5 days handling.
              </p>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-neutral-900 py-4 px-6 text-xs font-black uppercase tracking-widest border-2 border-black flex items-center justify-center gap-3 transition-transform active:scale-98 cursor-pointer shadow-[4px_4px_0px_#ccc]"
            >
              <ShoppingBag className="w-4 h-4" />
              Add Custom {apparelType === 'tee' ? 'Tee' : 'Hoodie'} to Bag — Rs. {price}
            </button>
          </form>
        </div>

        {/* Right Panel: Interactive Canvas Mockup */}
        <div className="lg:col-span-7 bg-[#ffdfac]/45 border-2 border-black p-6 md:p-8 flex flex-col items-center justify-center min-h-[500px] md:min-h-[600px] shadow-[6px_6px_0px_#000] relative overflow-hidden select-none">
          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-wider">
            {apparelType === 'tee' ? 'Heavyweight T-Shirt' : 'Oversized Hoodie'} ({color}) — {placement.toUpperCase()} VIEW
          </div>

          <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center mt-4">
            
            {/* SVG Base Apparel Mockup Vector */}
            {apparelType === 'tee' ? (
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full drop-shadow-[8px_8px_0px_rgba(0,0,0,0.15)] transition-all duration-300"
                style={{ fill: selectedColorHex }}
              >
                {/* Centered T-Shirt Vector Path */}
                <path 
                  d="M23,20 L38,12 C40,15 44,18 50,18 C56,18 60,15 62,12 L77,20 L70,35 L63,33 L63,88 L37,88 L37,33 L30,35 L23,20 Z" 
                  stroke="#000" 
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Centered Neck Collar Rib line */}
                <path 
                  d="M46,15.5 C49,18 51,18 54,15.5" 
                  fill="none" 
                  stroke="#000" 
                  strokeWidth="1.2"
                />
              </svg>
            ) : (
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full drop-shadow-[8px_8px_0px_rgba(0,0,0,0.15)] transition-all duration-300"
                style={{ fill: selectedColorHex }}
              >
                {/* Centered Hoodie Vector Path */}
                {/* Centered Hood */}
                <path 
                  d="M40,18 C38,4 62,4 60,18 C56,15 44,15 40,18 Z" 
                  stroke="#000" 
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Centered Body & Sleeves */}
                <path 
                  d="M22,35 L34,22 L40,23 L39,85 L61,85 L60,23 L66,22 L78,35 L70,48 L64,43 L64,85 L36,85 L36,43 L30,48 L22,35 Z" 
                  stroke="#000" 
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Centered Front Kangaroo Pouch Pocket */}
                <path 
                  d="M42,60 L58,60 L54,75 L46,75 Z" 
                  stroke="#000" 
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                {/* Centered Drawstrings */}
                <path d="M47,21 L47,32" fill="none" stroke="#000" strokeWidth="1" />
                <path d="M53,21 L53,29" fill="none" stroke="#000" strokeWidth="1" />
              </svg>
            )}

            {/* Dotted Bounds representation for centered chest print safe zone */}
            <div className={`absolute left-1/2 -translate-x-1/2 border border-dashed border-neutral-400/50 flex flex-col items-center justify-center p-2 z-10 transition-all ${
              apparelType === 'tee' 
                ? 'w-[26%] h-[46%] top-[34%]' 
                : 'w-[24%] h-[34%] top-[32%]'
            }`}>
              
              {/* Custom Design Logo Image Overlay */}
              {designImage && (
                <motion.img 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={designImage} 
                  alt="Custom Print Preview" 
                  className="max-w-[75%] max-h-[60%] object-contain select-none pointer-events-none drop-shadow-md"
                />
              )}

              {/* Custom Text Overlay */}
              {customText && (
                <div 
                  className={`mt-2 select-none text-center leading-none ${selectedTextFontClass} break-words max-w-[90%] drop-shadow-xs transition-all`}
                  style={{ color: textColor, fontSize: customText.length > 15 ? '10px' : '14px' }}
                >
                  {customText}
                </div>
              )}

              {/* If no custom details provided */}
              {!designImage && !customText && (
                <span className="text-[8px] font-sans text-neutral-400 uppercase tracking-widest text-center">
                  Print Area
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
