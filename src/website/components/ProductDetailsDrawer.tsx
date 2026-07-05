import { useState } from "react";
import { X, Heart, Shield, Sparkles, Sliders } from "lucide-react";
import { Product } from "../types";

interface ProductDetailsDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToBag: (product: Product, size: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductDetailsDrawer({
  product,
  isOpen,
  onClose,
  onAddToBag,
  isWishlisted,
  onToggleWishlist,
}: ProductDetailsDrawerProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"specs" | "features">("specs");
  const [error, setError] = useState<string>("");

  if (!product) return null;

  const handleAdd = () => {
    if (!selectedSize) {
      setError("PLEASE SELECT A SIZE");
      return;
    }
    setError("");
    onAddToBag(product, selectedSize);
    setSelectedSize("");
  };

  return (
    <div
      id="product-details-backdrop"
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Black ambient overlay */}
      <div
        id="product-details-overlay"
        onClick={onClose}
        className="absolute inset-0 bg-[#141b2b]/50 backdrop-blur-sm"
      />

      {/* Drawer Container (Slides from right) */}
      <div
        id="product-details-panel"
        className={`absolute top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl border-l border-black/10 flex flex-col z-10 transition-transform duration-500 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } rounded-none`}
      >
        {/* Header section of Drawer */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-black/5 bg-[#f9f9ff]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#575f65] uppercase bg-[#e9edff] px-2 py-0.5 font-medium">
              Glacier Monolith
            </span>
          </div>
          <button
            id="close-details-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-black/5 text-[#141b2b] transition-colors rounded-none"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable details content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Main Visual & Title */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-[#f9f9ff] border border-black/5 overflow-hidden">
              <img
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="flex justify-between items-start pt-2">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#141b2b] tracking-wider uppercase">
                  {product.name}
                </h2>
                <p className="font-mono text-xs tracking-[0.2em] text-[#575f65] uppercase mt-1">
                  {product.colorCode}
                </p>
              </div>
              <span className="font-mono text-lg font-bold text-[#141b2b]">
                ${product.price}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-[#575f65] uppercase font-bold">
              Description
            </h4>
            <p className="font-sans text-sm text-[#444748] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-[#575f65] uppercase font-bold">
                Select Size
              </h4>
              <span className="font-mono text-[10px] text-[#575f65]/70 underline cursor-pointer hover:text-[#141b2b]">
                Fit Guide
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  id={`size-btn-${size}`}
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setError("");
                  }}
                  className={`py-3.5 text-center font-mono text-xs tracking-widest transition-all rounded-none ${
                    selectedSize === size
                      ? "bg-[#141b2b] text-white font-bold"
                      : "bg-[#f9f9ff] hover:bg-black/5 text-[#141b2b] border border-black/10"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {error && (
              <p className="text-[#ba1a1a] font-mono text-[10px] tracking-widest mt-1 font-semibold animate-pulse">
                {error}
              </p>
            )}
          </div>

          {/* Tabbed Specifications & Features */}
          <div className="space-y-4">
            <div className="flex border-b border-black/5">
              <button
                id="tab-specs"
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`flex-1 pb-3 text-center font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition-colors rounded-none border-b-2 ${
                  activeTab === "specs"
                    ? "border-[#141b2b] text-[#141b2b]"
                    : "border-transparent text-[#575f65]/60 hover:text-[#141b2b]"
                }`}
              >
                Specifications
              </button>
              <button
                id="tab-features"
                type="button"
                onClick={() => setActiveTab("features")}
                className={`flex-1 pb-3 text-center font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition-colors rounded-none border-b-2 ${
                  activeTab === "features"
                    ? "border-[#141b2b] text-[#141b2b]"
                    : "border-transparent text-[#575f65]/60 hover:text-[#141b2b]"
                }`}
              >
                Unique Features
              </button>
            </div>

            <div className="bg-[#f9f9ff] p-4 border border-black/5 space-y-3 min-h-[140px]">
              {activeTab === "specs" ? (
                <ul className="space-y-2.5">
                  {product.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 font-mono text-xs text-[#444748]">
                      <Sliders className="w-3.5 h-3.5 text-[#575f65] mt-0.5 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2.5">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 font-mono text-xs text-[#444748]">
                      <Sparkles className="w-3.5 h-3.5 text-[#5d5f5f] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Premium Shipping Guarantee Card */}
          <div className="p-4 bg-[#f0f8ff] border border-[#dce2f7] flex items-start gap-3.5">
            <Shield className="w-5 h-5 text-[#5d5f5f] mt-0.5 shrink-0" />
            <div>
              <h5 className="font-mono text-[10px] font-bold tracking-wider text-[#141b2b] uppercase">
                Vault Security Insured
              </h5>
              <p className="font-sans text-xs text-[#404752] leading-relaxed mt-1">
                Complimentary 2-day express priority shipping and security-sealed delivery packaging. Includes custom alloy product tags.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions inside Drawer */}
        <div className="p-6 border-t border-black/5 bg-white space-y-3">
          <div className="flex gap-2">
            <button
              id="add-to-bag-details-btn"
              type="button"
              onClick={handleAdd}
              className="flex-grow bg-[#141b2b] hover:bg-[#2c3547] text-white py-4.5 font-mono text-[11px] uppercase tracking-[0.25em] font-bold transition-all active:scale-[0.98] rounded-none"
            >
              Add To Bag
            </button>
            <button
              id="wishlist-toggle-details-btn"
              type="button"
              onClick={() => onToggleWishlist(product)}
              className="p-4 bg-[#f9f9ff] hover:bg-black/5 border border-black/10 text-[#141b2b] transition-all active:scale-95 rounded-none shrink-0"
              aria-label="Toggle Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-transform duration-300 ${
                  isWishlisted ? "fill-[#ba1a1a] text-[#ba1a1a]" : "text-[#575f65]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
