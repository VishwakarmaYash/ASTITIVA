import { Heart, ShoppingBag, Eye, Trash2 } from "lucide-react";
import { Product } from "../types";

interface WishlistTabProps {
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onGoToArchive: () => void;
}

export default function WishlistTab({
  wishlist,
  onRemoveFromWishlist,
  onViewDetails,
  onGoToArchive,
}: WishlistTabProps) {
  return (
    <section className="py-12 px-6 md:px-16 max-w-7xl mx-auto space-y-8 min-h-[70vh]">
      {/* Header and Title */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#575f65] uppercase">
          CURATED VAULT SELECTIONS
        </span>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#141b2b] uppercase tracking-widest">
          YOUR WISHLIST
        </h2>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-black/10 p-8 space-y-4">
          <div className="text-[#575f65]/30 p-4 inline-block border border-dashed border-black/10">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <p className="font-display font-bold text-[#141b2b] uppercase tracking-wider text-lg">
              Wishlist Is Currently Vacant
            </p>
            <p className="font-sans text-xs text-[#575f65] max-w-sm mx-auto leading-relaxed">
              Pin your favorite technical masterpieces to this private vault space to monitor availability.
            </p>
          </div>
          <button
            id="wishlist-back-to-archive-btn"
            type="button"
            onClick={onGoToArchive}
            className="px-6 py-3.5 bg-[#141b2b] text-white font-mono text-[10px] uppercase tracking-widest transition-colors rounded-none font-bold"
          >
            Explore Archive Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col glass-card p-6 transition-all duration-500 hover:-translate-y-1 bg-white/20 rounded-none"
            >
              {/* Image Frame */}
              <div className="aspect-[3/4] mb-6 overflow-hidden bg-white border border-black/5 relative">
                <img
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={p.image}
                  alt={p.name}
                />
              </div>

              {/* Specs block */}
              <div className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-display font-extrabold text-lg text-[#141b2b] tracking-wider uppercase">
                      {p.name}
                    </h3>
                    <span className="font-mono text-sm font-semibold tracking-wider text-[#141b2b]">
                      Rs. {p.price}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[#575f65] uppercase mt-0.5">
                    {p.colorCode}
                  </p>
                </div>

                {/* Actions bottom bar */}
                <div className="flex gap-2 pt-2">
                  <button
                    id={`wishlist-view-details-${p.id}`}
                    type="button"
                    onClick={() => onViewDetails(p)}
                    className="flex-grow flex items-center justify-center gap-1.5 bg-[#141b2b] hover:bg-[#2c3547] text-white py-3.5 font-mono text-[10px] uppercase tracking-widest font-bold transition-all rounded-none"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Explore Specifications</span>
                  </button>
                  <button
                    id={`wishlist-remove-item-${p.id}`}
                    type="button"
                    onClick={() => onRemoveFromWishlist(p)}
                    className="p-3 bg-[#f9f9ff] hover:bg-[#ffdad6] border border-black/10 text-[#575f65] hover:text-[#ba1a1a] transition-all rounded-none shrink-0"
                    aria-label="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
