// import React, { useState, useEffect } from "react";
// import { Menu, ShoppingBag, Home, Search, Heart, User, ChevronRight, Check, LogOut, Settings } from "lucide-react";
// import GlacialOrb from "./components/GlacialOrb";
// import ProductCard from "./components/ProductCard";
// import ProductDetailsDrawer from "./components/ProductDetailsDrawer";
// import CartDrawer from "./components/CartDrawer";
// import SearchTab from "./components/SearchTab";
// import WishlistTab from "./components/WishlistTab";
// import ProfileTab from "./components/ProfileTab";
// import AuthTab from "./components/AuthTab";
// import ProductManager from "./components/ProductManager";
// import AdminApp from "../admin/App";
// import { PRODUCTS, PHILOSOPHY_QUOTE } from "../data";
// import { Product, CartItem, Order } from "./types";

// export default function App() {
//   const [activeTab, setActiveTab] = useState<"home" | "search" | "wishlist" | "profile" | "auth">("home");
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [wishlist, setWishlist] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
//   const [toastMessage, setToastMessage] = useState<string | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [userEmail, setUserEmail] = useState<string>("");
//   const [showProductManager, setShowProductManager] = useState<boolean>(false);

//   // Initialize state from LocalStorage on mount
//   useEffect(() => {
//     try {
//       const storedCart = localStorage.getItem("vault_cart");
//       if (storedCart) setCart(JSON.parse(storedCart));

//       const storedWishlist = localStorage.getItem("vault_wishlist");
//       if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

//       const storedOrders = localStorage.getItem("vault_orders");
//       if (storedOrders) setOrders(JSON.parse(storedOrders));

//       const authToken = localStorage.getItem("vault_auth_token");
//       const email = localStorage.getItem("vault_user_email");
//       if (authToken && email) {
//         setIsLoggedIn(true);
//         setUserEmail(email);
//       }
//     } catch (e) {
//       console.error("Failed to load local storage state", e);
//     }
//   }, []);

//   // Sync state to LocalStorage
//   const saveCart = (newCart: CartItem[]) => {
//     setCart(newCart);
//     localStorage.setItem("vault_cart", JSON.stringify(newCart));
//   };

//   const saveWishlist = (newWishlist: Product[]) => {
//     setWishlist(newWishlist);
//     localStorage.setItem("vault_wishlist", JSON.stringify(newWishlist));
//   };

//   const saveOrders = (newOrders: Order[]) => {
//     setOrders(newOrders);
//     localStorage.setItem("vault_orders", JSON.stringify(newOrders));
//   };

//   // Custom premium Toast triggering
//   const triggerToast = (msg: string) => {
//     setToastMessage(msg);
//     setTimeout(() => {
//       setToastMessage((prev) => (prev === msg ? null : prev));
//     }, 3500);
//   };

//   // Cart actions
//   const handleAddToCart = (product: Product, size: string) => {
//     const itemId = `${product.id}-${size}`;
//     const existingIndex = cart.findIndex((item) => item.id === itemId);

//     if (existingIndex >= 0) {
//       const updated = [...cart];
//       updated[existingIndex].quantity += 1;
//       saveCart(updated);
//     } else {
//       const newItem: CartItem = {
//         id: itemId,
//         product,
//         size,
//         quantity: 1,
//       };
//       saveCart([...cart, newItem]);
//     }

//     triggerToast(`ADDED TO BAG: ${product.name} (SIZE ${size})`);
//     setSelectedProduct(null); // Close details drawer
//   };

//   const handleUpdateQuantity = (itemId: string, delta: number) => {
//     const updated = cart
//       .map((item) => {
//         if (item.id === itemId) {
//           const nextQty = item.quantity + delta;
//           return { ...item, quantity: Math.max(1, nextQty) };
//         }
//         return item;
//       })
//       .filter((item) => item.quantity > 0);
//     saveCart(updated);
//   };

//   const handleRemoveCartItem = (itemId: string) => {
//     const itemToRemove = cart.find((i) => i.id === itemId);
//     const filtered = cart.filter((item) => item.id !== itemId);
//     saveCart(filtered);
//     if (itemToRemove) {
//       triggerToast(`REMOVED: ${itemToRemove.product.name}`);
//     }
//   };

//   // Wishlist actions
//   const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
//     if (e) e.stopPropagation();

//     const isWishlisted = wishlist.some((item) => item.id === product.id);
//     if (isWishlisted) {
//       const filtered = wishlist.filter((item) => item.id !== product.id);
//       saveWishlist(filtered);
//       triggerToast(`REMOVED FROM WISHLIST: ${product.name}`);
//     } else {
//       saveWishlist([...wishlist, product]);
//       triggerToast(`WISHLISTED: ${product.name}`);
//     }
//   };

//   // Checkout Protocol finalization
//   const handleCheckout = (address: string, promoCode: string) => {
//     const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
//     const promoApplied = promoCode.toUpperCase() === "GLACIER" || promoCode.toUpperCase() === "VAULT10";
//     const discountFactor = promoCode.toUpperCase() === "GLACIER" ? 0.15 : promoCode.toUpperCase() === "VAULT10" ? 0.10 : 0;
//     const discount = promoApplied ? subtotal * discountFactor : 0;
//     const shipping = subtotal > 400 ? 0 : 25;
//     const total = subtotal - discount + shipping;

//     const newOrder: Order = {
//       id: `VT-${Math.floor(100000 + Math.random() * 900000)}`,
//       date: new Date().toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       items: cart.map((item) => ({
//         productName: item.product.name,
//         size: item.size,
//         quantity: item.quantity,
//         price: item.product.price,
//       })),
//       total,
//       status: "Processing",
//     };

//     saveOrders([newOrder, ...orders]);
//     saveCart([]); // Clear cart
//     triggerToast("TRANSACTION COMPLETED SUCCESSFULLY");
//   };

//   const handleClearOrdersLedger = () => {
//     saveOrders([]);
//     triggerToast("TRANSACTION LEDGER SUCCESSFULLY CLEARED");
//   };

//   // Auth handlers
//   const handleAuthSuccess = (token: string, email: string) => {
//     setIsLoggedIn(true);
//     setUserEmail(email);
//     setActiveTab("home");
//     triggerToast("VAULT ACCESS GRANTED");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("vault_auth_token");
//     localStorage.removeItem("vault_user_email");
//     setIsLoggedIn(false);
//     setUserEmail("");
//     setActiveTab("auth");
//     triggerToast("VAULT ACCESS TERMINATED");
//   };

//   return (
//     <div className="min-h-screen bg-[#ffffff] text-[#141b2b] font-sans flex flex-col relative pb-28">
//       {/* Custom Toast Alert Banner */}
//       {toastMessage && (
//         <div
//           id="custom-toast-notification"
//           className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#141b2b] text-white px-6 py-4 flex items-center gap-3.5 shadow-2xl border border-white/10 animate-fade-in max-w-sm w-[90%] rounded-none"
//         >
//           <Check className="w-4.5 h-4.5 text-[#e9edff] shrink-0" />
//           <span className="font-mono text-[10px] tracking-widest uppercase font-semibold leading-none">
//             {toastMessage}
//           </span>
//         </div>
//       )}

//       {/* TopAppBar header */}
//       <header className="fixed top-0 w-full z-40 bg-white/40 backdrop-blur-xl border-b border-white/50 flex justify-between items-center px-6 md:px-16 h-16 rounded-none">
//         <button
//           id="hamburger-menu-btn"
//           onClick={() => triggerToast("MENU PROTOCOLS LOCKED DURING WINTER SEASON")}
//           className="hover:opacity-75 transition-opacity active:scale-95 text-[#141b2b] p-1 rounded-none"
//           aria-label="Menu"
//         >
//           <Menu className="w-5 h-5 stroke-[1.5]" />
//         </button>

//         <span
//           id="brand-header-title"
//           onClick={() => isLoggedIn && setActiveTab("home")}
//           className="font-display font-extrabold text-2xl tracking-widest text-[#141b2b] uppercase cursor-pointer select-none"
//         >
//           VAULT
//         </span>

//         <div className="flex items-center gap-3">
//           {isLoggedIn && (
//             <>
//               <button
//                 onClick={() => {
//                   const role = localStorage.getItem("vault_user_role");

//                   if (role !== "admin") {
//                     triggerToast("ADMIN ACCESS DENIED");
//                     return;
//                   }

//                   setShowProductManager(true);
//                 }}
//                 className="hover:opacity-75 transition-all active:scale-95 text-[#141b2b] p-1.5"
//               >
//                 <Settings className="w-5 h-5" />
//               </button>
//               <button
//                 id="header-logout-btn"
//                 onClick={handleLogout}
//                 className="hover:opacity-75 transition-all active:scale-95 text-[#141b2b] p-1.5 rounded-none"
//                 aria-label="Logout"
//                 title="Logout"
//               >
//                 <LogOut className="w-5 h-5 stroke-[1.5]" />
//               </button>
//             </>
//           )}
//           <button
//             id="header-bag-btn"
//             onClick={() => isLoggedIn && setIsCartOpen(true)}
//             className="relative hover:opacity-75 transition-all active:scale-95 text-[#141b2b] p-1.5 rounded-none"
//             aria-label="Cart"
//           >
//             <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
//             {isLoggedIn && cart.length > 0 && (
//               <span
//                 id="header-cart-badge"
//                 className="absolute -top-1 -right-1 bg-[#141b2b] text-white font-mono text-[9px] font-bold w-4 h-4 flex items-center justify-center border border-white rounded-none"
//               >
//                 {cart.reduce((acc, i) => acc + i.quantity, 0)}
//               </span>
//             )}
//           </button>
//         </div>
//       </header>

//       {/* Dynamic Content Main Body */}
//       <main className="pt-16 flex-grow">
//         {!isLoggedIn && (
//           <AuthTab onAuthSuccess={handleAuthSuccess} />
//         )}

//         {isLoggedIn && activeTab === "home" && (
//           <div className="space-y-0">
//             {/* Hero Section */}
//             <section className="relative min-h-[60vh] md:h-[750px] flex flex-col items-center justify-center overflow-hidden radial-glow px-6 py-24 border-b border-black/5">
//               {/* Organic Morphing Canvas Orb background */}
//               <GlacialOrb />

//               {/* Centered content block */}
//               <div className="relative z-10 text-center flex flex-col items-center max-w-3xl space-y-8 animate-fade-in">
//                 <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl text-[#141b2b] tracking-wider mb-2 uppercase leading-none">
//                   GLACIER 01
//                 </h1>
//                 <button
//                   id="discover-hero-btn"
//                   onClick={() => {
//                     setActiveTab("search");
//                     triggerToast("TRANSITIONED TO SYSTEM CATALOG ARCHIVE");
//                   }}
//                   className="glass-card px-11 py-4.5 font-mono text-[11px] uppercase tracking-[0.3em] font-semibold text-[#141b2b] hover:bg-white/60 hover:border-[#141b2b]/20 transition-all duration-300 active:scale-95 rounded-none"
//                 >
//                   DISCOVER
//                 </button>
//               </div>

//               {/* Scroll Indicator */}
//               <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 opacity-45 select-none pointer-events-none">
//                 <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#141b2b] font-semibold">
//                   Scroll
//                 </span>
//                 <div className="w-px h-12 bg-[#141b2b]/15 relative overflow-hidden">
//                   <div className="absolute top-0 left-0 w-full h-1/2 bg-[#141b2b] animate-scroll-line" />
//                 </div>
//               </div>
//             </section>

//             {/* Product Section: NEW ARRIVALS */}
//             <section className="py-24 md:py-36 px-6 md:px-16 max-w-7xl mx-auto space-y-16">
//               <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-black/5 pb-6">
//                 <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#141b2b] uppercase tracking-widest leading-none">
//                   NEW ARRIVALS
//                 </h2>
//                 <span className="font-mono text-[10px] text-[#575f65] tracking-[0.25em] font-bold uppercase leading-none">
//                   SEASON 04 / WINTER
//                 </span>
//               </div>

//               {/* Products list grid (Centered matching design layout) */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {PRODUCTS.map((p) => {
//                   const isWishlisted = wishlist.some((item) => item.id === p.id);
//                   return (
//                     <ProductCard
//                       key={p.id}
//                       product={p}
//                       onViewDetails={setSelectedProduct}
//                       isWishlisted={isWishlisted}
//                       onToggleWishlist={handleToggleWishlist}
//                     />
//                   );
//                 })}
//               </div>
//             </section>

//             {/* Aesthetic Philosophy Interstitial */}
//             <section className="h-[500px] relative overflow-hidden flex items-center justify-center bg-[#f9f9ff] border-t border-b border-black/5">
//               <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
//                 <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(20,27,43,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,27,43,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
//               </div>
//               <div className="text-center px-6 z-10 max-w-3xl space-y-8">
//                 <span className="font-mono text-[10px] text-[#575f65] uppercase tracking-[0.45em] font-bold">
//                   The Philosophy
//                 </span>
//                 <h2 className="font-display font-bold text-2xl md:text-3.5xl text-[#141b2b] italic tracking-wide leading-relaxed">
//                   "{PHILOSOPHY_QUOTE}"
//                 </h2>
//                 <div className="w-24 h-px bg-[#141b2b] mx-auto" />
//               </div>
//             </section>
//           </div>
//         )}

//         {isLoggedIn && activeTab === "search" && (
//           <SearchTab
//             products={PRODUCTS}
//             onViewDetails={setSelectedProduct}
//             wishlist={wishlist}
//             onToggleWishlist={handleToggleWishlist}
//           />
//         )}

//         {isLoggedIn && activeTab === "wishlist" && (
//           <WishlistTab
//             wishlist={wishlist}
//             onRemoveFromWishlist={handleToggleWishlist}
//             onViewDetails={setSelectedProduct}
//             onGoToArchive={() => setActiveTab("search")}
//           />
//         )}

//         {isLoggedIn && activeTab === "profile" && (
//           <ProfileTab
//             email={userEmail}
//             orders={orders}
//             onClearHistory={handleClearOrdersLedger}
//             onLogout={handleLogout}
//           />
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="relative w-full border-t border-black/5 bg-[#f9f9ff] flex flex-col items-center py-16 px-6 text-center">
//         <span className="font-display font-extrabold text-xl tracking-[0.3em] text-[#141b2b] uppercase">
//           VAULT
//         </span>
//         <nav className="flex flex-wrap justify-center gap-8 my-8">
//           {isLoggedIn && (
//             <button
//               id="footer-archive-link"
//               onClick={() => {
//                 setActiveTab("search");
//                 window.scrollTo({ top: 0, behavior: "smooth" });
//               }}
//               className="font-mono text-[10px] uppercase tracking-widest text-[#575f65] hover:text-[#141b2b] hover:underline decoration-1 underline-offset-4 transition-all duration-300 rounded-none"
//             >
//               ARCHIVE
//             </button>
//           )}
//           <button
//             id="footer-terms-link"
//             onClick={() => triggerToast("TERMS & REGISTRATION SCHEMAS ARE REGISTERED")}
//             className="font-mono text-[10px] uppercase tracking-widest text-[#575f65] hover:text-[#141b2b] hover:underline decoration-1 underline-offset-4 transition-all duration-300 rounded-none"
//           >
//             TERMS
//           </button>
//           <button
//             id="footer-contact-link"
//             onClick={() => triggerToast("CONTACT SECURED AT SECURE@VAULT.STUDIOS")}
//             className="font-mono text-[10px] uppercase tracking-widest text-[#575f65] hover:text-[#141b2b] hover:underline decoration-1 underline-offset-4 transition-all duration-300 rounded-none"
//           >
//             CONTACT
//           </button>
//         </nav>
//         <p className="font-mono text-[9px] tracking-widest text-[#575f65]/60 uppercase">
//           © 2026 VAULT STUDIOS. ALL RIGHTS RESERVED.
//         </p>
//       </footer>

//       {/* BottomNavBar tab controls */}
//       {isLoggedIn && (
//         <nav className="fixed bottom-0 w-full z-40 bg-white/60 backdrop-blur-2xl border-t border-black/10 flex justify-around items-center h-20 pb-safe">
//           <button
//             id="bottom-nav-home"
//             type="button"
//             onClick={() => {
//               setActiveTab("home");
//               window.scrollTo({ top: 0, behavior: "smooth" });
//             }}
//             className="flex flex-col items-center group py-2"
//           >
//             <Home
//               className={`w-5.5 h-5.5 transition-all duration-300 active:scale-90 ${activeTab === "home" ? "text-[#141b2b] scale-105 stroke-[2]" : "text-[#575f65]/50 group-hover:text-[#141b2b]"
//                 }`}
//             />
//             <span
//               className={`font-mono text-[8px] mt-1.5 uppercase tracking-widest transition-colors ${activeTab === "home" ? "text-[#141b2b] font-bold" : "text-[#575f65]/50"
//                 }`}
//             >
//               Home
//             </span>
//           </button>

//           <button
//             id="bottom-nav-search"
//             type="button"
//             onClick={() => {
//               setActiveTab("search");
//               window.scrollTo({ top: 0, behavior: "smooth" });
//             }}
//             className="flex flex-col items-center group py-2"
//           >
//             <Search
//               className={`w-5.5 h-5.5 transition-all duration-300 active:scale-90 ${activeTab === "search" ? "text-[#141b2b] scale-105 stroke-[2]" : "text-[#575f65]/50 group-hover:text-[#141b2b]"
//                 }`}
//             />
//             <span
//               className={`font-mono text-[8px] mt-1.5 uppercase tracking-widest transition-colors ${activeTab === "search" ? "text-[#141b2b] font-bold" : "text-[#575f65]/50"
//                 }`}
//             >
//               Search
//             </span>
//           </button>

//           <button
//             id="bottom-nav-wishlist"
//             type="button"
//             onClick={() => {
//               setActiveTab("wishlist");
//               window.scrollTo({ top: 0, behavior: "smooth" });
//             }}
//             className="flex flex-col items-center group py-2"
//           >
//             <Heart
//               className={`w-5.5 h-5.5 transition-all duration-300 active:scale-90 ${activeTab === "wishlist" ? "text-[#ba1a1a] scale-105 stroke-[2] fill-[#ba1a1a]" : "text-[#575f65]/50 group-hover:text-[#141b2b]"
//                 }`}
//             />
//             <span
//               className={`font-mono text-[8px] mt-1.5 uppercase tracking-widest transition-colors ${activeTab === "wishlist" ? "text-[#141b2b] font-bold" : "text-[#575f65]/50"
//                 }`}
//             >
//               Wishlist
//             </span>
//           </button>

//           <button
//             id="bottom-nav-profile"
//             type="button"
//             onClick={() => {
//               setActiveTab("profile");
//               window.scrollTo({ top: 0, behavior: "smooth" });
//             }}
//             className="flex flex-col items-center group py-2"
//           >
//             <User
//               className={`w-5.5 h-5.5 transition-all duration-300 active:scale-90 ${activeTab === "profile" ? "text-[#141b2b] scale-105 stroke-[2]" : "text-[#575f65]/50 group-hover:text-[#141b2b]"
//                 }`}
//             />
//             <span
//               className={`font-mono text-[8px] mt-1.5 uppercase tracking-widest transition-colors ${activeTab === "profile" ? "text-[#141b2b] font-bold" : "text-[#575f65]/50"
//                 }`}
//             >
//               Profile
//             </span>
//           </button>
//         </nav>
//       )}

//       {/* Side Details Drawer */}
//       <ProductDetailsDrawer
//         product={selectedProduct}
//         isOpen={selectedProduct !== null}
//         onClose={() => setSelectedProduct(null)}
//         onAddToBag={handleAddToCart}
//         isWishlisted={selectedProduct ? wishlist.some((item) => item.id === selectedProduct.id) : false}
//         onToggleWishlist={handleToggleWishlist}
//       />

//       {/* Side Cart Drawer */}
//       <CartDrawer
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         cartItems={cart}
//         onUpdateQuantity={handleUpdateQuantity}
//         onRemoveItem={handleRemoveCartItem}
//         onCheckout={handleCheckout}
//       />

//       {/* Product Manager Modal */}
//       if (showProductManager) {
//         return <AdminApp />;
//       }


//     </div>
//   );
// }

// src/website/App.tsx
import React, { useState, useEffect } from "react";
import { Menu, ShoppingBag, Home, Search, Heart, User, ChevronRight, Check, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import GlacialOrb from "./components/GlacialOrb";
import ProductCard from "./components/ProductCard";
import ProductDetailsDrawer from "./components/ProductDetailsDrawer";
import CartDrawer from "./components/CartDrawer";
import SearchTab from "./components/SearchTab";
import WishlistTab from "./components/WishlistTab";
import ProfileTab from "./components/ProfileTab";
import AuthTab from "./components/AuthTab";
import AnnouncementBar from "./components/AnnouncementBar";
import PromoPopup from "./components/PromoPopup";
import CouponTicket from "./components/CouponTicket";
import CustomStudio from "./components/CustomStudio";
import FeaturesBanner from "./components/FeaturesBanner";
import { PRODUCTS, PHILOSOPHY_QUOTE } from "./data";
import { Product, CartItem, Order, Banner } from "./types";
import { productsAPI, cartAPI, ordersAPI, wishlistAPI, bannersAPI, shippingAPI } from "../api/client";

export default function WebsiteApp() {
  const [activeTab, setActiveTab] = useState<"home" | "search" | "wishlist" | "profile" | "auth" | "custom">("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [promoBanners, setPromoBanners] = useState<Banner[]>([]);
  const [shippingConfig, setShippingConfig] = useState<any>({
    baseShippingFee: 50.00,
    freeShippingThreshold: 1000.00,
  });

  // Sync state from Database
  const fetchDatabaseState = async () => {
    try {
      // 1. Fetch products
      const prodsData = await productsAPI.getAll();
      const formattedProds = prodsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
        description: p.description || "",
        category: p.category,
        image: p.image || "",
        colorCode: p.color_code || "",
        features: p.features || [],
        specs: p.specs || [],
        sizes: p.sizes || [],
        images: p.images || []
      }));
      setProducts(formattedProds.length > 0 ? formattedProds : PRODUCTS);

      // 1.5 Fetch banners
      try {
        const bannersData = await bannersAPI.getActive('homepage');
        setBanners(bannersData || []);
      } catch (err) {
        console.error("Failed to load active banners:", err);
      }

      // 1.6 Fetch promo banners
      try {
        const promoBannersData = await bannersAPI.getActive('promo_banner');
        setPromoBanners(promoBannersData || []);
      } catch (err) {
        console.error("Failed to load active promo banners:", err);
      }

      // 1.7 Fetch shipping configurations
      try {
        const shpConfig = await shippingAPI.getConfig();
        if (shpConfig) {
          setShippingConfig(shpConfig);
        }
      } catch (err) {
        console.error("Failed to load active shipping config:", err);
      }

      // If logged in, fetch user's cart, wishlist, orders
      const authToken = localStorage.getItem("vault_auth_token");
      if (authToken) {
        // 2. Fetch cart
        const cartData = await cartAPI.get();
        const formattedCart = (cartData.items || [])
          .filter((item: any) => item.products !== null && item.products !== undefined)
          .map((item: any) => ({
            id: item.id, // DB UUID
            product: {
              id: item.products.id,
              name: item.products.name,
              price: Number(item.products.price),
              description: item.products.description || "",
              category: item.products.category,
              image: item.products.image || "",
              colorCode: item.products.color_code || "",
              features: item.products.features || [],
              specs: item.products.specs || [],
              sizes: item.products.sizes || [],
              images: item.products.images || []
            },
            size: item.size,
            quantity: item.quantity
          }));
        setCart(formattedCart);

        // 3. Fetch wishlist
        const wishlistData = await wishlistAPI.get();
        const formattedWishlist = wishlistData
          .filter((item: any) => item.products !== null && item.products !== undefined)
          .map((item: any) => ({
            id: item.products.id,
            name: item.products.name,
            price: Number(item.products.price),
            description: item.products.description || "",
            category: item.products.category,
            image: item.products.image || "",
            colorCode: item.products.color_code || "",
            features: item.products.features || [],
            specs: item.products.specs || [],
            sizes: item.products.sizes || [],
            images: item.products.images || []
          }));
        setWishlist(formattedWishlist);

        // 4. Fetch orders
        const ordersData = await ordersAPI.getAll();
        const formattedOrders = ordersData.map((ord: any) => ({
          id: ord.id,
          date: new Date(ord.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          items: (ord.order_items || []).map((item: any) => ({
            productName: item.product_name,
            size: item.size,
            quantity: item.quantity,
            price: Number(item.price),
          })),
          total: Number(ord.total),
          status: ord.status === "pending" || ord.status === "processing" ? "Processing" : 
                  ord.status === "shipped" ? "Shipped" : "Delivered"
        }));
        setOrders(formattedOrders);
      } else {
        // Guest mode - fetch cart from localStorage
        const guestCartStr = localStorage.getItem("vault_guest_cart");
        if (guestCartStr) {
          try {
            setCart(JSON.parse(guestCartStr));
          } catch (_) {
            setCart([]);
          }
        } else {
          setCart([]);
        }
        setWishlist([]);
        setOrders([]);
      }
    } catch (e) {
      console.error("Failed to load database state:", e);
    }
  };

  // Run on mount and auth state changes
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      setLoading(true);
      const authToken = localStorage.getItem("vault_auth_token");
      const email = localStorage.getItem("vault_user_email");
      if (authToken && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
      }
      await fetchDatabaseState();
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [isLoggedIn]);

  // Auto-play banners cycle
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  // Custom premium Toast triggering
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Cart actions
  const handleAddToCart = async (product: Product, size: string) => {
    const authToken = localStorage.getItem("vault_auth_token");
    if (authToken) {
      try {
        await cartAPI.add(product.id, size, 1);
        triggerToast(`ADDED TO BAG: ${product.name} (SIZE ${size})`);
        setSelectedProduct(null); // Close details drawer
        await fetchDatabaseState();
      } catch (e: any) {
        triggerToast("FAILED TO ADD TO BAG: " + e.message.toUpperCase());
      }
    } else {
      // Guest cart additions
      const existingItemIndex = cart.findIndex((item) => item.product.id === product.id && item.size === size);
      let updatedCart = [...cart];
      if (existingItemIndex > -1) {
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart.push({
          id: `guest-${product.id}-${size}-${Date.now()}`,
          product,
          size,
          quantity: 1,
        });
      }
      setCart(updatedCart);
      localStorage.setItem("vault_guest_cart", JSON.stringify(updatedCart));
      triggerToast(`ADDED TO BAG (GUEST): ${product.name} (SIZE ${size})`);
      setSelectedProduct(null); // Close details drawer
    }
  };

  const handleAddCustomToCart = async (customItem: {
    apparelType: 'tee' | 'hoodie';
    size: string;
    color: 'black' | 'white';
    designImage: string;
    customText: string;
    fontFamily: string;
    textColor: string;
    placement: 'front' | 'back';
    price: number;
  }) => {
    const customProduct: Product = {
      id: "custom-apparel",
      name: `Custom Studio ${customItem.apparelType === 'tee' ? 'T-Shirt' : 'Hoodie'} (${customItem.color === 'black' ? 'Obsidian Black' : 'Pure White'})`,
      price: customItem.price,
      description: `Custom 1-of-1 streetwear piece. Print: ${customItem.placement.toUpperCase()}. Text: "${customItem.customText}".`,
      image: customItem.designImage || "/images/astitva_white_tee.png",
      category: "Customs",
      sizes: [customItem.size],
      inventory: 9999
    };

    const customization = {
      apparelType: customItem.apparelType,
      color: customItem.color,
      designImage: customItem.designImage,
      customText: customItem.customText,
      fontFamily: customItem.fontFamily,
      textColor: customItem.textColor,
      placement: customItem.placement
    };

    const authToken = localStorage.getItem("vault_auth_token");
    if (authToken) {
      try {
        await cartAPI.add("custom-apparel", customItem.size, 1, customization);
        triggerToast("CUSTOM DESIGN ADDED TO BAG!");
        setActiveTab("home");
        await fetchDatabaseState();
      } catch (e: any) {
        triggerToast("FAILED TO ADD CUSTOM DESIGN: " + e.message.toUpperCase());
      }
    } else {
      const guestItemId = `guest-custom-${Date.now()}`;
      const newGuestItem: CartItem = {
        id: guestItemId,
        product: customProduct,
        size: customItem.size,
        quantity: 1,
        customization
      };
      const updatedCart = [...cart, newGuestItem];
      setCart(updatedCart);
      localStorage.setItem("vault_guest_cart", JSON.stringify(updatedCart));
      triggerToast("CUSTOM DESIGN ADDED TO BAG (GUEST)!");
      setActiveTab("home");
    }
  };

  const handleUpdateQuantity = async (itemId: string, delta: number) => {
    const authToken = localStorage.getItem("vault_auth_token");
    if (authToken) {
      const item = cart.find(i => i.id === itemId);
      if (!item) return;
      try {
        const newQty = item.quantity + delta;
        await cartAPI.update(itemId, newQty);
        await fetchDatabaseState();
      } catch (e: any) {
        triggerToast("FAILED TO UPDATE QUANTITY: " + e.message.toUpperCase());
      }
    } else {
      // Guest cart quantity modifications
      const updatedCart = cart.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      setCart(updatedCart);
      localStorage.setItem("vault_guest_cart", JSON.stringify(updatedCart));
    }
  };

  const handleRemoveCartItem = async (itemId: string) => {
    const authToken = localStorage.getItem("vault_auth_token");
    const itemToRemove = cart.find((i) => i.id === itemId);
    if (authToken) {
      try {
        await cartAPI.remove(itemId);
        if (itemToRemove) {
          triggerToast(`REMOVED: ${itemToRemove.product.name}`);
        }
        await fetchDatabaseState();
      } catch (e: any) {
        triggerToast("FAILED TO REMOVE ITEM: " + e.message.toUpperCase());
      }
    } else {
      // Guest cart item removal
      const updatedCart = cart.filter((item) => item.id !== itemId);
      setCart(updatedCart);
      localStorage.setItem("vault_guest_cart", JSON.stringify(updatedCart));
      if (itemToRemove) {
        triggerToast(`REMOVED (GUEST): ${itemToRemove.product.name}`);
      }
    }
  };

  // Wishlist actions
  const handleToggleWishlist = async (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const authToken = localStorage.getItem("vault_auth_token");
    if (!authToken) {
      triggerToast("PLEASE SIGN IN TO WISHLIST ITEMS");
      return;
    }

    const isWishlisted = wishlist.some((item) => item.id === product.id);
    try {
      if (isWishlisted) {
        await wishlistAPI.remove(product.id);
        triggerToast(`REMOVED FROM WISHLIST: ${product.name}`);
      } else {
        await wishlistAPI.add(product.id);
        triggerToast(`WISHLISTED: ${product.name}`);
      }
      await fetchDatabaseState();
    } catch (e: any) {
      triggerToast("FAILED TO UPDATE WISHLIST: " + e.message.toUpperCase());
    }
  };

  // Checkout Protocol finalization
  const handleCheckout = async (address: string, promoCode: string) => {
    try {
      const apiCartItems = cart.map(item => ({
        product_id: item.product.id,
        size: item.size,
        quantity: item.quantity,
        products: {
          name: item.product.name,
          price: item.product.price
        }
      }));

      const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      const activeCoupon = (shippingConfig.couponCode || "ASTITIVA10").toUpperCase();
      const activePopup = (shippingConfig.popupDiscountCode || "VAULT10").toUpperCase();
      const promoApplied = promoCode.toUpperCase() === "GLACIER" || promoCode.toUpperCase() === activeCoupon || promoCode.toUpperCase() === activePopup;
      const discountFactor = promoCode.toUpperCase() === "GLACIER" ? 0.15 : (promoCode.toUpperCase() === activeCoupon || promoCode.toUpperCase() === activePopup) ? 0.10 : 0;
      const discount = promoApplied ? subtotal * discountFactor : 0;
      const shipping = subtotal >= shippingConfig.freeShippingThreshold ? 0 : shippingConfig.baseShippingFee;
      const total = subtotal - discount + shipping;

      await ordersAPI.checkout(apiCartItems, address || 'No Address Provided');
      await cartAPI.clear();
      
      triggerToast("TRANSACTION COMPLETED SUCCESSFULLY");
      await fetchDatabaseState();
    } catch (e: any) {
      triggerToast("CHECKOUT FAILED: " + e.message.toUpperCase());
    }
  };

  const handleClearOrdersLedger = () => {
    triggerToast("TRANSACTION LEDGER IS SECURED FOR SECURITY AUDITING");
  };

  // Auth handlers
  const mergeGuestCart = async () => {
    const guestCartStr = localStorage.getItem("vault_guest_cart");
    if (!guestCartStr) return;

    try {
      const guestCart = JSON.parse(guestCartStr);
      if (guestCart && guestCart.length > 0) {
        triggerToast("SYNCING BAG COLLECTION...");
        // Add each item in guest cart to backend cart
        for (const item of guestCart) {
          try {
            await cartAPI.add(item.product.id, item.size, item.quantity);
          } catch (err) {
            console.error("Failed to sync guest cart item:", item, err);
          }
        }
        localStorage.removeItem("vault_guest_cart");
      }
    } catch (e) {
      console.error("Failed to merge guest cart:", e);
    }
  };

  const handleAuthSuccess = async (token: string, email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    await mergeGuestCart();
    await fetchDatabaseState();
    setActiveTab("home");
    triggerToast("ASTITIVA ACCESS GRANTED");
  };

  const handleLogout = () => {
    localStorage.removeItem("vault_auth_token");
    localStorage.removeItem("vault_user_email");
    localStorage.removeItem("vault_user_role");
    localStorage.removeItem("vault_user_phone");
    localStorage.removeItem("vault_user_first_name");
    localStorage.removeItem("vault_user_last_name");
    setIsLoggedIn(false);
    setUserEmail("");
    setActiveTab("home");
    triggerToast("ASTITIVA ACCESS TERMINATED");
  };

  return (
    <div className="min-h-screen bg-[#ffdfac] text-[#141b2b] font-sans flex flex-col relative pb-28">
      {/* Custom Toast Alert Banner */}
      {toastMessage && (
        <div
          id="custom-toast-notification"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#141b2b] text-white px-6 py-4 flex items-center gap-3.5 shadow-2xl border border-white/10 animate-fade-in max-w-sm w-[90%] rounded-none"
        >
          <Check className="w-4.5 h-4.5 text-[#e9edff] shrink-0" />
          <span className="font-mono text-[10px] tracking-widest uppercase font-semibold leading-none">
            {toastMessage}
          </span>
        </div>
      )}

      {/* Sticky Top Bar & Navigation Header */}
      <div className="sticky top-0 w-full z-45 flex flex-col">
        <AnnouncementBar
          text={shippingConfig.announcementText}
          bgColor={shippingConfig.announcementBgColor}
          textColor={shippingConfig.announcementTextColor}
          isActive={shippingConfig.announcementIsActive}
        />
        <header className="w-full bg-[#008080] border-b border-[#008080] flex justify-between items-center px-6 md:px-16 h-16 rounded-none shadow-md">
          <button
            id="hamburger-menu-btn"
            onClick={() => triggerToast("MENU PROTOCOLS LOCKED DURING WINTER SEASON")}
            className="hover:opacity-75 transition-opacity active:scale-95 text-white p-1 rounded-none cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          <span
            id="brand-header-title"
            onClick={() => isLoggedIn && setActiveTab("home")}
            className="font-display font-extrabold text-2xl tracking-widest text-white uppercase cursor-pointer select-none"
          >
            ASTITIVA
          </span>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <>
                {localStorage.getItem("vault_user_role") === "admin" && (
                  <button
                    onClick={() => {
                      window.location.href = "/admin";
                    }}
                    className="hover:opacity-75 transition-all active:scale-95 text-white p-1.5 cursor-pointer"
                    aria-label="Admin Dashboard"
                    title="Admin Dashboard"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                )}
                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  className="hover:opacity-75 transition-all active:scale-95 text-white p-1.5 rounded-none cursor-pointer"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 stroke-[1.5]" />
                </button>
              </>
            )}
            <button
              id="header-bag-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative hover:opacity-75 transition-all active:scale-95 text-white p-1.5 rounded-none cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cart.length > 0 && (
                <span
                  id="header-cart-badge"
                  className="absolute -top-1 -right-1 bg-white text-[#008080] font-mono text-[9px] font-bold w-4 h-4 flex items-center justify-center border border-[#008080] rounded-none"
                >
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>
      </div>

      <main className="pt-0 flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-0"
            >
              {/* Dynamic Hero Section Banner Carousel */}
              {banners.length === 0 ? (
                <motion.section 
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full aspect-[16/9] bg-cover bg-center bg-no-repeat border-b border-black/5 shadow-sm overflow-hidden"
                  style={{
                    backgroundImage: "url('/images/astitva_hero_banner.jpg')"
                  }}
                >
                  {/* Responsive SHOP NOW Overlay Button */}
                  <motion.button
                    id="discover-hero-btn"
                    onClick={() => {
                      document.getElementById("new-arrivals-section")?.scrollIntoView({ behavior: "smooth" });
                      triggerToast("TRANSITIONED TO SYSTEM CATALOG ARCHIVE");
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="absolute left-[3.66%] top-[74.6%] w-[13.5%] h-[6.2%] bg-white text-black font-sans font-extrabold text-[clamp(7px,1.1vw,16px)] flex items-center justify-center rounded-[4px] shadow-sm cursor-pointer hover:bg-neutral-100 uppercase tracking-wider"
                  >
                    SHOP NOW
                  </motion.button>
                </motion.section>
              ) : (
                <section className="relative w-full aspect-[16/9] border-b border-black/5 shadow-sm overflow-hidden bg-gray-150">
                  <AnimatePresence mode="wait">
                    {banners.map((banner, idx) => {
                      if (idx !== currentBannerIndex) return null;
                      return (
                        <motion.div
                          key={banner.id || idx}
                          initial={{ opacity: 0, scale: 1.01 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat flex flex-col justify-end"
                          style={{
                            backgroundImage: `url('${banner.imageUrl}')`
                          }}
                        >
                          {/* Rich glassmorphic overlay for title & description */}
                          {(!banner.title && !banner.description) ? (
                            <motion.button
                              onClick={() => {
                                if (banner.buttonLink && banner.buttonLink.startsWith('#')) {
                                  document.getElementById(banner.buttonLink.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                  document.getElementById("new-arrivals-section")?.scrollIntoView({ behavior: "smooth" });
                                }
                                triggerToast(`TRANSITIONED TO ${banner.buttonText.toUpperCase()}`);
                              }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="absolute left-[3.66%] top-[74.6%] w-[13.5%] h-[6.2%] bg-white text-black font-sans font-extrabold text-[clamp(7px,1.1vw,16px)] flex items-center justify-center rounded-[4px] shadow-sm cursor-pointer hover:bg-neutral-100 uppercase tracking-wider"
                            >
                              {banner.buttonText}
                            </motion.button>
                          ) : (
                            <div className="absolute left-[3.66%] bottom-[8%] max-w-sm md:max-w-md bg-[#141b2b]/85 backdrop-blur-md p-6 border-2 border-black shadow-[4px_4px_0px_#ccff00] text-white space-y-4">
                              {banner.title && (
                                <h2 className="font-display font-extrabold text-lg md:text-2xl uppercase tracking-widest leading-none">
                                  {banner.title}
                                </h2>
                              )}
                              {banner.description && (
                                <p className="font-sans text-xs text-white/85 leading-relaxed">
                                  {banner.description}
                                </p>
                              )}
                              <motion.button
                                onClick={() => {
                                  if (banner.buttonLink && banner.buttonLink.startsWith('#')) {
                                    document.getElementById(banner.buttonLink.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                                  } else {
                                    document.getElementById("new-arrivals-section")?.scrollIntoView({ behavior: "smooth" });
                                  }
                                  triggerToast(`TRANSITIONED TO ${banner.buttonText.toUpperCase()}`);
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-5 py-2.5 bg-[#ccff00] text-black font-mono font-bold text-[10px] uppercase tracking-wider cursor-pointer border border-black hover:opacity-90 active:scale-95 transition-all duration-150"
                              >
                                {banner.buttonText}
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {/* Slider Indicators dot matrix */}
                  {banners.length > 1 && (
                    <div className="absolute bottom-4 right-6 flex items-center gap-2 z-10">
                      {banners.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentBannerIndex(idx)}
                          className={`w-2.5 h-2.5 rounded-full border border-black/40 transition-all ${
                            idx === currentBannerIndex ? 'bg-white scale-110 shadow-xs' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Dynamic Voucher Coupon Ticket Banner */}
              <CouponTicket
                title={shippingConfig.couponTitle}
                subtitle={shippingConfig.couponSubtitle}
                code={shippingConfig.couponCode}
                description={shippingConfig.couponDescription}
                isActive={shippingConfig.couponIsActive}
                onCopySuccess={triggerToast}
              />

              {/* Featured Campaigns Grid */}
              {promoBanners.length > 0 ? (
                <section className="py-16 md:py-24 px-6 md:px-16 max-w-7xl mx-auto">
                  <div className={`grid grid-cols-1 md:grid-cols-${Math.min(3, promoBanners.length)} gap-8 md:gap-10`}>
                    {promoBanners.slice(0, 3).map((banner, index) => (
                      <motion.div
                        key={banner.id || index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
                        className="flex flex-col bg-white border border-black/5 overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                          <img
                            referrerPolicy="no-referrer"
                            src={banner.imageUrl}
                            alt={banner.title || 'Campaign'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute top-4 left-4 bg-black text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                            CAMPAIGN DROP
                          </div>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col justify-between flex-grow space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-display font-extrabold text-xl text-[#141b2b] tracking-wider uppercase truncate max-w-[70%]">
                                {banner.title || 'ASTITVA DROP'}
                              </h3>
                              <span className="font-mono text-[10px] text-[#ba1a1a] font-bold tracking-widest uppercase">
                                PROMO
                              </span>
                            </div>
                            <p className="font-sans text-xs text-[#575f65] leading-relaxed line-clamp-3">
                              {banner.description || 'Exclusive drop featuring raw signatures and tailored urban fits.'}
                            </p>
                          </div>
                          <div>
                            <motion.button
                              onClick={() => {
                                if (banner.buttonLink && banner.buttonLink.startsWith('#')) {
                                  document.getElementById(banner.buttonLink.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                  document.getElementById("new-arrivals-section")?.scrollIntoView({ behavior: "smooth" });
                                }
                                triggerToast(`LOADING: ${banner.buttonText.toUpperCase()}`);
                              }}
                              whileHover={{ scale: 1.01, y: -2 }}
                              whileTap={{ scale: 0.99, y: 2 }}
                              className="w-full bg-[#ba1a1a] text-white font-mono text-[10px] font-bold py-4 px-6 border-2 border-black shadow-[4px_4px_0px_#141b2b] cursor-pointer text-center uppercase tracking-widest"
                            >
                              {banner.buttonText}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="py-16 md:py-24 px-6 md:px-16 max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {/* Campaign 1: ASTITVA Signature Collection */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="flex flex-col bg-white border border-black/5 overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img 
                          src="/images/astitva_rider.jpg" 
                          alt="ASTITVA Signature Campaign" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute top-4 left-4 bg-black text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                          FLAGSHIP CAMPAIGN
                        </div>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow space-y-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-display font-extrabold text-2xl text-[#141b2b] tracking-wider uppercase">
                              अस्तित्व / ASTITVA
                            </h3>
                            <span className="font-mono text-[10px] text-[#ba1a1a] font-bold tracking-widest uppercase">
                              SIGNATURE
                            </span>
                          </div>
                          <p className="font-sans text-xs text-[#575f65] leading-relaxed">
                            Identity defined by existence. Heavyweight 300GSM drop featuring the raw red-on-black signature tee. Express your core.
                          </p>
                        </div>
                        <div>
                          <motion.button
                            onClick={() => {
                              const sigProd = products.find(p => p.id === "astitva-signature-tee") || PRODUCTS.find(p => p.id === "astitva-signature-tee");
                              if (sigProd) {
                                setSelectedProduct(sigProd);
                                triggerToast("LOADING SIGNATURE CUSTOMS DETAIL");
                              } else {
                                triggerToast("SIGNATURE PRODUCT ACCESS PENDING");
                              }
                            }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            whileTap={{ scale: 0.99, y: 2 }}
                            className="w-full bg-[#ba1a1a] text-white font-mono text-[10px] font-bold py-4 px-6 border-2 border-black shadow-[4px_4px_0px_#141b2b] cursor-pointer text-center uppercase tracking-widest"
                          >
                            SHOP SIGNATURE TEE
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Campaign 2: ASTITVA Graphic Edit */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                      className="flex flex-col bg-white border border-black/5 overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img 
                          src="/images/collusion_collab.png" 
                          alt="ASTITVA Back Graphic Campaign" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute top-4 left-4 bg-[#ccff00] text-black font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                          GRAPHIC DROP
                        </div>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow space-y-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-display font-extrabold text-2xl text-[#141b2b] tracking-wider uppercase">
                              ASTITVA BACK GRAPHIC
                            </h3>
                            <span className="font-mono text-[10px] text-[#008080] font-bold tracking-widest uppercase">
                              STREETWEAR
                            </span>
                          </div>
                          <p className="font-sans text-xs text-[#575f65] leading-relaxed">
                            Oversized streetwear fits. Heavyweight organic cotton featuring our signature custom fire back-graphic print and relaxed urban tailoring.
                          </p>
                        </div>
                        <div>
                          <motion.button
                            onClick={() => {
                              document.getElementById("new-arrivals-section")?.scrollIntoView({ behavior: "smooth" });
                              triggerToast("SCROLLING TO SYSTEM CATALOG");
                            }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            whileTap={{ scale: 0.99, y: 2 }}
                            className="w-full bg-[#ccff00] text-black font-mono text-[10px] font-bold py-4 px-6 border-2 border-black shadow-[4px_4px_0px_#141b2b] cursor-pointer text-center uppercase tracking-widest"
                          >
                            CHECK NEW ARRIVALS
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Campaign 3: ASTITVA White Edit */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      className="flex flex-col bg-white border border-black/5 overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img 
                          src="/images/astitva_white_tee.png" 
                          alt="ASTITVA White Edit Campaign" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute top-4 left-4 bg-black text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                          WHITE EDIT
                        </div>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow space-y-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-display font-extrabold text-2xl text-[#141b2b] tracking-wider uppercase">
                              ASTITVA WHITE TEE
                            </h3>
                            <span className="font-mono text-[10px] text-[#575f65] font-bold tracking-widest uppercase">
                              ESSENTIALS
                            </span>
                          </div>
                          <p className="font-sans text-xs text-[#575f65] leading-relaxed">
                            A minimalist counterpart to our signature edit. Ultra-heavyweight organic cotton featuring clean branding and relaxed boxy tailoring.
                          </p>
                        </div>
                        <div>
                          <motion.button
                            onClick={() => {
                              document.getElementById("new-arrivals-section")?.scrollIntoView({ behavior: "smooth" });
                              triggerToast("SCROLLING TO SYSTEM CATALOG");
                            }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            whileTap={{ scale: 0.99, y: 2 }}
                            className="w-full bg-black text-white font-mono text-[10px] font-bold py-4 px-6 border-2 border-black shadow-[4px_4px_0px_#141b2b] cursor-pointer text-center uppercase tracking-widest"
                          >
                            DISCOVER ESSENTIALS
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </section>
              )}

              {/* Product Section: NEW ARRIVALS */}
              <section id="new-arrivals-section" className="py-24 md:py-36 px-6 md:px-16 max-w-7xl mx-auto space-y-16">
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-black/5 pb-6">
                  <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#141b2b] uppercase tracking-widest leading-none">
                    NEW ARRIVALS
                  </h2>
                  <span className="font-mono text-[10px] text-[#575f65] tracking-[0.25em] font-bold uppercase leading-none">
                    SEASON 04 / WINTER
                  </span>
                </div>

                {/* Products list grid */}
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {products.map((p) => {
                    const isWishlisted = wishlist.some((item) => item.id === p.id);
                    return (
                      <motion.div
                        key={p.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                        }}
                      >
                        <ProductCard
                          product={p}
                          onViewDetails={setSelectedProduct}
                          isWishlisted={isWishlisted}
                          onToggleWishlist={handleToggleWishlist}
                        />
                      </motion.div>
                    );
                  })}
                 </motion.div>
              </section>

              {/* Dynamic Embedded Custom Studio Section */}
              <section className="bg-white/40 border-t-2 border-black py-16">
                {isLoggedIn ? (
                  <CustomStudio
                    onAddCustomToCart={handleAddCustomToCart}
                    onNavigateHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  />
                ) : (
                  <div className="max-w-lg mx-auto py-12 px-6 text-center border-2 border-black bg-white shadow-[6px_6px_0px_#000]">
                    <span className="font-mono text-xs text-[#575f65] uppercase tracking-widest font-bold">
                      ACCESS PROTOCOL REQUIRED
                    </span>
                    <p className="text-xs text-[#575f65] mt-1 mb-6">
                      Please sign in to access the Custom Print Studio and design your piece.
                    </p>
                    <AuthTab onAuthSuccess={handleAuthSuccess} />
                  </div>
                )}
              </section>

              {/* Aesthetic Philosophy Interstitial */}
              <section className="h-[460px] relative overflow-hidden flex items-center justify-center bg-[#ffdfac] border-t-2 border-black">
                <div className="absolute inset-0 opacity-25 pointer-events-none select-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>
                
                {/* Floating Neobrutalist Philosophy Card */}
                <div className="relative z-10 max-w-2xl mx-6 bg-white border-2 border-black p-8 md:p-12 shadow-[6px_6px_0px_#000] text-center space-y-6 transform rotate-[-0.5deg]">
                  {/* Decorative corner tags */}
                  <span className="absolute top-2 left-3 font-mono text-[8px] font-bold text-[#6E6E73] uppercase tracking-wider">
                    ASTITIVA // PROTOCOL_01
                  </span>
                  <span className="absolute bottom-2 right-3 font-mono text-[8px] font-bold text-[#6E6E73] uppercase tracking-wider">
                    SYSTEMS SECURED
                  </span>

                  <div className="space-y-4 pt-2">
                    <span className="font-mono text-[10px] text-[#575f65] uppercase tracking-[0.45em] font-bold block">
                      The Philosophy
                    </span>
                    <h2 className="font-sans font-black text-lg md:text-2xl text-black italic tracking-wide leading-relaxed">
                      &ldquo;{PHILOSOPHY_QUOTE}&rdquo;
                    </h2>
                  </div>
                  <div className="w-16 h-0.5 bg-black mx-auto" />
                </div>
              </section>

              <FeaturesBanner />
            </motion.div>
          )}

          {activeTab === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <SearchTab
                products={products}
                onViewDetails={setSelectedProduct}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            </motion.div>
          )}

          {activeTab === "wishlist" && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {isLoggedIn ? (
                <WishlistTab
                  wishlist={wishlist}
                  onRemoveFromWishlist={handleToggleWishlist}
                  onViewDetails={setSelectedProduct}
                  onGoToArchive={() => setActiveTab("search")}
                />
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <span className="font-mono text-xs text-[#575f65] uppercase tracking-widest font-bold">
                      ACCESS PROTOCOL REQUIRED
                    </span>
                    <p className="text-xs text-[#575f65] mt-1">Please sign in to view your secured wishlist logs.</p>
                  </div>
                  <AuthTab onAuthSuccess={handleAuthSuccess} />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {isLoggedIn ? (
                <ProfileTab
                  email={userEmail}
                  orders={orders}
                  onClearHistory={handleClearOrdersLedger}
                  onLogout={handleLogout}
                />
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <span className="font-mono text-xs text-[#575f65] uppercase tracking-widest font-bold">
                      ACCESS PROTOCOL REQUIRED
                    </span>
                    <p className="text-xs text-[#575f65] mt-1">Please sign in to view your profile and order ledger.</p>
                  </div>
                  <AuthTab onAuthSuccess={handleAuthSuccess} />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "custom" && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {isLoggedIn ? (
                <CustomStudio
                  onAddCustomToCart={handleAddCustomToCart}
                  onNavigateHome={() => setActiveTab("home")}
                />
              ) : (
                <div className="space-y-4 max-w-lg mx-auto py-12">
                  <div className="text-center py-6">
                    <span className="font-mono text-xs text-[#575f65] uppercase tracking-widest font-bold">
                      ACCESS PROTOCOL REQUIRED
                    </span>
                    <p className="text-xs text-[#575f65] mt-1">Please sign in to access the Custom Print Studio.</p>
                  </div>
                  <AuthTab onAuthSuccess={handleAuthSuccess} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative w-full border-t border-black/5 bg-[#f9f9ff] flex flex-col items-center py-16 px-6 text-center">
        <span className="font-display font-extrabold text-xl tracking-[0.3em] text-[#141b2b] uppercase">
          ASTITIVA
        </span>
        <nav className="flex flex-wrap justify-center gap-8 my-8">
          <button
            id="footer-archive-link"
            onClick={() => {
              setActiveTab("search");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-mono text-[10px] uppercase tracking-widest text-[#575f65] hover:text-[#141b2b] hover:underline decoration-1 underline-offset-4 transition-all duration-300 rounded-none cursor-pointer"
          >
            ARCHIVE
          </button>
          <button
            id="footer-terms-link"
            onClick={() => triggerToast("TERMS & REGISTRATION SCHEMAS ARE REGISTERED")}
            className="font-mono text-[10px] uppercase tracking-widest text-[#575f65] hover:text-[#141b2b] hover:underline decoration-1 underline-offset-4 transition-all duration-300 rounded-none"
          >
            TERMS
          </button>
          <button
            id="footer-contact-link"
            onClick={() => triggerToast("CONTACT SECURED AT SECURE@ASTITIVA.STUDIOS")}
            className="font-mono text-[10px] uppercase tracking-widest text-[#575f65] hover:text-[#141b2b] hover:underline decoration-1 underline-offset-4 transition-all duration-300 rounded-none"
          >
            CONTACT
          </button>
        </nav>
        <p className="font-mono text-[9px] tracking-widest text-[#575f65]/60 uppercase">
          © 2026 ASTITIVA STUDIOS. ALL RIGHTS RESERVED.
        </p>
      </footer>

      {/* BottomNavBar tab controls */}
      <nav className="fixed bottom-0 w-full z-40 bg-white/60 backdrop-blur-2xl border-t border-black/10 flex justify-around items-center h-20 pb-safe">
        <button
          id="bottom-nav-home"
          type="button"
          onClick={() => {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center group py-2"
        >
          <Home
            className={`w-5.5 h-5.5 transition-all duration-300 active:scale-90 ${activeTab === "home" ? "text-[#141b2b] scale-105 stroke-[2]" : "text-[#575f65]/50 group-hover:text-[#141b2b]"}`}
          />
          <span
            className={`font-mono text-[8px] mt-1.5 uppercase tracking-widest transition-colors ${activeTab === "home" ? "text-[#141b2b] font-bold" : "text-[#575f65]/50"}`}
          >
            Home
          </span>
        </button>

        <button
          id="bottom-nav-search"
          type="button"
          onClick={() => {
            setActiveTab("search");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center group py-2"
        >
          <Search
            className={`w-5.5 h-5.5 transition-all duration-300 active:scale-90 ${activeTab === "search" ? "text-[#141b2b] scale-105 stroke-[2]" : "text-[#575f65]/50 group-hover:text-[#141b2b]"}`}
          />
          <span
            className={`font-mono text-[8px] mt-1.5 uppercase tracking-widest transition-colors ${activeTab === "search" ? "text-[#141b2b] font-bold" : "text-[#575f65]/50"}`}
          >
            Search
          </span>
        </button>

        <button
          id="bottom-nav-wishlist"
          type="button"
          onClick={() => {
            setActiveTab("wishlist");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center group py-2"
        >
          <Heart
            className={`w-5.5 h-5.5 transition-all duration-300 active:scale-90 ${activeTab === "wishlist" ? "text-[#ba1a1a] scale-105 stroke-[2] fill-[#ba1a1a]" : "text-[#575f65]/50 group-hover:text-[#141b2b]"}`}
          />
          <span
            className={`font-mono text-[8px] mt-1.5 uppercase tracking-widest transition-colors ${activeTab === "wishlist" ? "text-[#141b2b] font-bold" : "text-[#575f65]/50"}`}
          >
            Wishlist
          </span>
        </button>

        <button
          id="bottom-nav-profile"
          type="button"
          onClick={() => {
            setActiveTab("profile");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center group py-2"
        >
          <User
            className={`w-5.5 h-5.5 transition-all duration-300 active:scale-90 ${activeTab === "profile" ? "text-[#141b2b] scale-105 stroke-[2]" : "text-[#575f65]/50 group-hover:text-[#141b2b]"}`}
          />
          <span
            className={`font-mono text-[8px] mt-1.5 uppercase tracking-widest transition-colors ${activeTab === "profile" ? "text-[#141b2b] font-bold" : "text-[#575f65]/50"}`}
          >
            Profile
          </span>
        </button>
      </nav>

      {/* Side Details Drawer */}
      <ProductDetailsDrawer
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToBag={handleAddToCart}
        isWishlisted={selectedProduct ? wishlist.some((item) => item.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Side Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        isLoggedIn={isLoggedIn}
        onAuthSuccess={handleAuthSuccess}
        shippingConfig={shippingConfig}
      />

      {/* Dynamic Newsletter Promo Popup Overlay */}
      <PromoPopup
        title={shippingConfig.popupTitle}
        description={shippingConfig.popupDescription}
        imageUrl={shippingConfig.popupImageUrl}
        buttonText={shippingConfig.popupButtonText}
        isActive={shippingConfig.popupIsActive}
        discountCode={shippingConfig.popupDiscountCode}
      />
    </div>
  );
}