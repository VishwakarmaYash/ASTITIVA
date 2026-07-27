import { useState, useEffect } from "react";
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
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const allImages = product
    ? Array.from(new Set([product.image, ...(product.images || [])])).filter((img) => img && img.trim() !== "")
    : [];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  useEffect(() => {
    if (!isOpen || allImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    }, 4000); // Transitions automatically every 4 seconds

    return () => clearInterval(interval);
  }, [isOpen, allImages.length, activeImageIndex]);

  if (!product) return null;

  const activeImage = allImages[activeImageIndex] || product.image;

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
        className={`absolute top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl border-l-2 border-black flex flex-col z-10 transition-transform duration-500 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } rounded-none`}
      >
        {/* Header section of Drawer */}
        <div className="flex justify-between items-center px-6 py-5 border-b-2 border-black bg-[#f9f9ff]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-[0.25em] text-black uppercase bg-[#ccff00] border border-black px-2.5 py-1 font-extrabold shadow-[1px_1px_0px_#000]">
              Glacier Monolith
            </span>
          </div>
          <button
            id="close-details-btn"
            onClick={onClose}
            className="p-1.5 bg-white text-[#141b2b] border-2 border-black hover:bg-[#ccff00] hover:scale-95 transition-all shadow-[2px_2px_0px_#000] cursor-pointer rounded-none"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable details content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Main Visual & Title */}
          <div className="space-y-4">
            {/* Main Visual Container */}
            <div className="relative aspect-[4/3] bg-white border-2 border-black overflow-hidden shadow-[4px_4px_0px_#141b2b]">
              <img
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                src={activeImage}
                alt={product.name}
              />
            </div>

            {/* Gallery Previews (Thumbnails) */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-thin">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 bg-white overflow-hidden transition-all duration-200 cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? "border-2 border-black shadow-[2px_2px_0px_#000] scale-95"
                        : "border border-black/10 opacity-70 hover:opacity-100 hover:scale-95"
                    }`}
                  >
                    <img
                      referrerPolicy="no-referrer"
                      src={imgUrl}
                      alt={`${product.name} gallery ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Align title and price on same row, and colorCode below it */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between items-baseline gap-4">
                <h2 className="font-display font-extrabold text-2xl text-[#141b2b] tracking-wider uppercase">
                  {product.name}
                </h2>
                {product.compareAtPrice && product.compareAtPrice > product.price ? (
                  <div className="flex items-baseline gap-2 whitespace-nowrap">
                    <span className="font-mono text-lg font-extrabold text-[#ba1a1a]">
                      Rs. {product.price}
                    </span>
                    <span className="font-mono text-xs text-[#575f65] line-through decoration-1">
                      Rs. {product.compareAtPrice}
                    </span>
                  </div>
                ) : (
                  <span className="font-mono text-lg font-extrabold text-[#141b2b] whitespace-nowrap">
                    Rs. {product.price}
                  </span>
                )}
              </div>
              <p className="font-mono text-xs tracking-[0.2em] text-[#575f65] uppercase">
                {product.colorCode}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-black uppercase font-extrabold">
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
              <span className="font-mono text-[10px] text-[#575f65]/70 underline cursor-pointer hover:text-[#141b2b] font-bold">
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
                  className={`py-3.5 text-center font-mono text-xs tracking-widest transition-all rounded-none border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                    selectedSize === size
                      ? "bg-[#ccff00] text-black font-extrabold"
                      : "bg-white hover:bg-neutral-50 text-[#141b2b]"
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
            <div className="flex gap-2.5 pb-2">
              <button
                id="tab-specs"
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`flex-1 py-3 text-center font-mono text-[9px] tracking-[0.15em] uppercase font-extrabold transition-all border-2 border-black rounded-none cursor-pointer ${
                  activeTab === "specs"
                    ? "bg-[#ccff00] text-black shadow-[2px_2px_0px_#000] -translate-y-[1px]"
                    : "bg-white text-neutral-500 hover:text-black hover:border-black"
                }`}
              >
                Specifications
              </button>
              <button
                id="tab-features"
                type="button"
                onClick={() => setActiveTab("features")}
                className={`flex-1 py-3 text-center font-mono text-[9px] tracking-[0.15em] uppercase font-extrabold transition-all border-2 border-black rounded-none cursor-pointer ${
                  activeTab === "features"
                    ? "bg-[#ccff00] text-black shadow-[2px_2px_0px_#000] -translate-y-[1px]"
                    : "bg-white text-neutral-500 hover:text-black hover:border-black"
                }`}
              >
                Unique Features
              </button>
            </div>

            <div className="bg-white p-5 border-2 border-black space-y-3 min-h-[140px] shadow-[4px_4px_0px_#000]">
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
          <div className="p-4 bg-white border-2 border-black flex items-start gap-3.5 shadow-[4px_4px_0px_#000]">
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
              className="flex-grow bg-[#ccff00] text-black font-mono text-[10px] font-bold py-4 px-6 border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer text-center uppercase tracking-widest"
            >
              Add To Bag
            </button>
            <button
              id="wishlist-toggle-details-btn"
              type="button"
              onClick={() => onToggleWishlist(product)}
              className="p-4 bg-white border-2 border-black text-[#141b2b] shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer rounded-none shrink-0"
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
