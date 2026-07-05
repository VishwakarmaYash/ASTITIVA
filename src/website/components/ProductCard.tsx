import React from "react";
import { Heart } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product, e?: React.MouseEvent) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col glass-card p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#141b2b]/30 bg-white/20 cursor-pointer rounded-none"
      onClick={() => onViewDetails(product)}
    >
      {/* Wishlist Button Overlay */}
      <button
        id={`wishlist-toggle-${product.id}`}
        type="button"
        onClick={(e) => onToggleWishlist(product, e)}
        className="absolute top-8 right-8 z-10 p-2.5 bg-white/60 hover:bg-white backdrop-blur-md text-[#141b2b] border border-white/50 hover:border-[#141b2b]/20 transition-all active:scale-90 rounded-none"
        aria-label="Toggle Wishlist"
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 ${
            isWishlisted ? "fill-[#ba1a1a] text-[#ba1a1a] scale-110" : "text-[#575f65] hover:text-[#141b2b]"
          }`}
        />
      </button>

      {/* Product Image Frame */}
      <div className="aspect-[3/4] mb-8 overflow-hidden bg-white border border-black/5 relative">
        <img
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={product.image}
          alt={product.name}
        />
        {/* Hover overlay detail hint */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Card Details Block */}
      <div className="flex justify-between items-start flex-grow">
        <div>
          <h3 className="font-display font-extrabold text-lg md:text-xl text-[#141b2b] tracking-wider uppercase mb-1">
            {product.name}
          </h3>
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#575f65] uppercase">
            {product.colorCode}
          </p>
        </div>
        <span className="font-mono text-sm font-semibold tracking-wider text-[#141b2b]">
          ${product.price}
        </span>
      </div>

      {/* Hover action footer */}
      <button
        id={`product-discover-btn-${product.id}`}
        type="button"
        className="mt-8 w-full bg-[#141b2b] hover:bg-[#2c3547] text-white py-4 font-mono text-[11px] uppercase tracking-[0.25em] transition-all duration-300 active:scale-[0.98] rounded-none opacity-0 group-hover:opacity-100"
      >
        Discover Details
      </button>
    </div>
  );
}
