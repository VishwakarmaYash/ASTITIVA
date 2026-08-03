import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { Product } from "../types";
import ProductCard from "./ProductCard";

interface SearchTabProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product, e?: React.MouseEvent) => void;
}

export default function SearchTab({
  products,
  onViewDetails,
  wishlist,
  onToggleWishlist,
}: SearchTabProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [sortOption, setSortOption] = useState<"default" | "low-high" | "high-low">("default");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Derive active lists
  const categories = useMemo(() => {
    return ["All", "Jackets", "Pants", "Footwear"];
  }, []);

  const sizes = useMemo(() => {
    return ["All", "XS", "S", "M", "L", "XL"];
  }, []);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query matching (case-insensitive)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.colorCode.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Size filter
    if (selectedSize !== "All") {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // Sorting
    if (sortOption === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSize, sortOption]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedSize("All");
    setSortOption("default");
  };

  return (
    <section className="py-12 px-4 md:px-16 max-w-7xl mx-auto space-y-8 min-h-[70vh]">
      {/* Header and Title */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#575f65] uppercase">
          EXPLORATION CENTER
        </span>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#141b2b] uppercase tracking-widest">
          CATALOG ARCHIVE
        </h2>
      </div>

      {/* Control panel (Search & Toggle filters) */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input block */}
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]" />
            <input
              id="catalog-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH BY MASTERPIECE NAME, SPEC, OR CODE..."
              className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 pl-11 pr-4 py-4 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
            />
          </div>

          {/* Action toggle buttons */}
          <div className="flex gap-2">
            <button
              id="filter-toggle-btn"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-4 border font-mono text-[10px] uppercase tracking-widest transition-all rounded-none shrink-0 ${
                showFilters || selectedCategory !== "All" || selectedSize !== "All"
                  ? "bg-[#141b2b] text-white border-[#141b2b]"
                  : "bg-white text-[#141b2b] border-black/15 hover:border-[#141b2b]/30"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sorting trigger */}
            <div className="relative">
              <select
                id="catalog-sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="appearance-none bg-white border border-black/15 hover:border-[#141b2b]/30 text-[#141b2b] px-6 pr-10 py-4 font-mono text-[10px] uppercase tracking-widest rounded-none focus:outline-none cursor-pointer h-full"
              >
                <option value="default">SORT PROTOCOL</option>
                <option value="low-high">PRICE: LOW TO HIGH</option>
                <option value="high-low">PRICE: HIGH TO LOW</option>
              </select>
              <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#575f65] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Expandable filters selection bar */}
        {showFilters && (
          <div className="p-6 bg-[#f9f9ff] border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in rounded-none">
            {/* Category selection */}
            <div className="space-y-2.5">
              <h4 className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#575f65] uppercase">
                Product Category
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    id={`filter-cat-${cat}`}
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest border transition-all rounded-none ${
                      selectedCategory === cat
                        ? "bg-[#141b2b] text-white border-[#141b2b] font-bold"
                        : "bg-white hover:bg-black/5 text-[#141b2b] border-black/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="space-y-2.5">
              <h4 className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#575f65] uppercase">
                Fit Sizing
              </h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    id={`filter-size-${size}`}
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest border transition-all rounded-none ${
                      selectedSize === size
                        ? "bg-[#141b2b] text-white border-[#141b2b] font-bold"
                        : "bg-white hover:bg-black/5 text-[#141b2b] border-black/10"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters status indicators */}
            <div className="md:col-span-2 pt-4 border-t border-black/5 flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] text-[#575f65] font-bold">ACTIVE FILTER PROTOCOLS:</span>
                {selectedCategory !== "All" && (
                  <span className="font-mono text-[9px] bg-[#e9edff] text-[#141b2b] px-2.5 py-1 uppercase tracking-widest flex items-center gap-1">
                    Cat: {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("All")} />
                  </span>
                )}
                {selectedSize !== "All" && (
                  <span className="font-mono text-[9px] bg-[#e9edff] text-[#141b2b] px-2.5 py-1 uppercase tracking-widest flex items-center gap-1">
                    Size: {selectedSize}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSize("All")} />
                  </span>
                )}
                {searchQuery && (
                  <span className="font-mono text-[9px] bg-[#e9edff] text-[#141b2b] px-2.5 py-1 uppercase tracking-widest flex items-center gap-1">
                    Search: "{searchQuery}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </span>
                )}
                {selectedCategory === "All" && selectedSize === "All" && !searchQuery && (
                  <span className="font-mono text-[9px] text-[#575f65]/50 italic uppercase">NONE</span>
                )}
              </div>

              {(selectedCategory !== "All" || selectedSize !== "All" || searchQuery) && (
                <button
                  id="clear-all-filters-btn"
                  type="button"
                  onClick={handleClearFilters}
                  className="font-mono text-[10px] uppercase tracking-wider text-[#ba1a1a] hover:underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grid listing */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-black/10 p-8 space-y-3">
          <p className="font-display font-bold text-[#141b2b] uppercase tracking-wider text-lg">
            No Masterpieces Discovered
          </p>
          <p className="font-sans text-xs text-[#575f65] max-w-sm mx-auto leading-relaxed">
            Adjust your active category filter protocols or search terms to uncover Vault artifacts.
          </p>
          <button
            id="reset-search-btn"
            type="button"
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-[#141b2b] text-white font-mono text-[9px] uppercase tracking-widest transition-colors rounded-none mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredProducts.map((p) => {
            const isWishlisted = wishlist.some((item) => item.id === p.id);
            return (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={onViewDetails}
                isWishlisted={isWishlisted}
                onToggleWishlist={onToggleWishlist}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
