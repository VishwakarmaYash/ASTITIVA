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
      className="group relative flex flex-col bg-white border-2 border-black shadow-[4px_4px_0px_#141b2b] hover:shadow-[6px_6px_0px_#141b2b] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200 cursor-pointer rounded-none overflow-hidden"
      onClick={() => onViewDetails(product)}
    >
      {/* Wishlist Button Overlay */}
      <button
        id={`wishlist-toggle-${product.id}`}
        type="button"
        onClick={(e) => onToggleWishlist(product, e)}
        className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 bg-white text-[#141b2b] border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all active:scale-95 rounded-none cursor-pointer"
        aria-label="Toggle Wishlist"
      >
        <Heart
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isWishlisted ? "fill-[#ba1a1a] text-[#ba1a1a] scale-110" : "text-[#575f65] hover:text-[#141b2b]"
            }`}
        />
      </button>

      {/* Product Image Frame */}
      <div className="aspect-[3/4] overflow-hidden bg-white relative">
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
      <div className="bg-[#FFFFFF] p-3.5 sm:p-5 flex flex-col justify-between flex-grow text-black border-t-2 border-black">
        <div>
          <h3 className="font-display font-extrabold text-sm sm:text-base text-black tracking-wider uppercase mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="font-mono text-[9px] tracking-[0.15em] text-black/60 uppercase">
            {product.colorCode}
          </p>
        </div>
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <div className="flex items-baseline gap-2 mt-2 sm:mt-3">
            <span className="font-mono text-xs sm:text-sm md:text-base font-extrabold text-[#ba1a1a] block">
              Rs. {product.price}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] md:text-xs text-black/50 line-through decoration-1 block">
              Rs. {product.compareAtPrice}
            </span>
          </div>
        ) : (
          <span className="font-mono text-xs sm:text-sm md:text-base font-extrabold text-black block mt-2 sm:mt-3">
            Rs. {product.price}
          </span>
        )}
      </div>
    </div>
  );
}
