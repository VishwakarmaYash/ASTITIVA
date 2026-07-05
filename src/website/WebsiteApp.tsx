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
import GlacialOrb from "./components/GlacialOrb";
import ProductCard from "./components/ProductCard";
import ProductDetailsDrawer from "./components/ProductDetailsDrawer";
import CartDrawer from "./components/CartDrawer";
import SearchTab from "./components/SearchTab";
import WishlistTab from "./components/WishlistTab";
import ProfileTab from "./components/ProfileTab";
import AuthTab from "./components/AuthTab";
import { PRODUCTS, PHILOSOPHY_QUOTE } from "./data";
import { Product, CartItem, Order } from "./types";

export default function WebsiteApp() {
  const [activeTab, setActiveTab] = useState<"home" | "search" | "wishlist" | "profile" | "auth">("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  // Initialize state from LocalStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("vault_cart");
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem("vault_wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedOrders = localStorage.getItem("vault_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const authToken = localStorage.getItem("vault_auth_token");
      const email = localStorage.getItem("vault_user_email");
      if (authToken && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      }
    } catch (e) {
      console.error("Failed to load local storage state", e);
    }
  }, []);

  // Sync state to LocalStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("vault_cart", JSON.stringify(newCart));
  };

  const saveWishlist = (newWishlist: Product[]) => {
    setWishlist(newWishlist);
    localStorage.setItem("vault_wishlist", JSON.stringify(newWishlist));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("vault_orders", JSON.stringify(newOrders));
  };

  // Custom premium Toast triggering
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Cart actions
  const handleAddToCart = (product: Product, size: string) => {
    const itemId = `${product.id}-${size}`;
    const existingIndex = cart.findIndex((item) => item.id === itemId);

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        id: itemId,
        product,
        size,
        quantity: 1,
      };
      saveCart([...cart, newItem]);
    }

    triggerToast(`ADDED TO BAG: ${product.name} (SIZE ${size})`);
    setSelectedProduct(null); // Close details drawer
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === itemId) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, nextQty) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    saveCart(updated);
  };

  const handleRemoveCartItem = (itemId: string) => {
    const itemToRemove = cart.find((i) => i.id === itemId);
    const filtered = cart.filter((item) => item.id !== itemId);
    saveCart(filtered);
    if (itemToRemove) {
      triggerToast(`REMOVED: ${itemToRemove.product.name}`);
    }
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isWishlisted = wishlist.some((item) => item.id === product.id);
    if (isWishlisted) {
      const filtered = wishlist.filter((item) => item.id !== product.id);
      saveWishlist(filtered);
      triggerToast(`REMOVED FROM WISHLIST: ${product.name}`);
    } else {
      saveWishlist([...wishlist, product]);
      triggerToast(`WISHLISTED: ${product.name}`);
    }
  };

  // Checkout Protocol finalization
  const handleCheckout = (address: string, promoCode: string) => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const promoApplied = promoCode.toUpperCase() === "GLACIER" || promoCode.toUpperCase() === "VAULT10";
    const discountFactor = promoCode.toUpperCase() === "GLACIER" ? 0.15 : promoCode.toUpperCase() === "VAULT10" ? 0.10 : 0;
    const discount = promoApplied ? subtotal * discountFactor : 0;
    const shipping = subtotal > 400 ? 0 : 25;
    const total = subtotal - discount + shipping;

    const newOrder: Order = {
      id: `VT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: cart.map((item) => ({
        productName: item.product.name,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      status: "Processing",
    };

    saveOrders([newOrder, ...orders]);
    saveCart([]); // Clear cart
    triggerToast("TRANSACTION COMPLETED SUCCESSFULLY");
  };

  const handleClearOrdersLedger = () => {
    saveOrders([]);
    triggerToast("TRANSACTION LEDGER SUCCESSFULLY CLEARED");
  };

  // Auth handlers
  const handleAuthSuccess = (token: string, email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setActiveTab("home");
    triggerToast("VAULT ACCESS GRANTED");
  };

  const handleLogout = () => {
    localStorage.removeItem("vault_auth_token");
    localStorage.removeItem("vault_user_email");
    setIsLoggedIn(false);
    setUserEmail("");
    setActiveTab("auth");
    triggerToast("VAULT ACCESS TERMINATED");
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#141b2b] font-sans flex flex-col relative pb-28">
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

      {/* TopAppBar header */}
      <header className="fixed top-0 w-full z-40 bg-white/40 backdrop-blur-xl border-b border-white/50 flex justify-between items-center px-6 md:px-16 h-16 rounded-none">
        <button
          id="hamburger-menu-btn"
          onClick={() => triggerToast("MENU PROTOCOLS LOCKED DURING WINTER SEASON")}
          className="hover:opacity-75 transition-opacity active:scale-95 text-[#141b2b] p-1 rounded-none"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 stroke-[1.5]" />
        </button>

        <span
          id="brand-header-title"
          onClick={() => isLoggedIn && setActiveTab("home")}
          className="font-display font-extrabold text-2xl tracking-widest text-[#141b2b] uppercase cursor-pointer select-none"
        >
          VAULT
        </span>

        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <>
              <button
                onClick={() => {
                  const role = localStorage.getItem("vault_user_role");

                  if (role !== "admin") {
                    triggerToast("ADMIN ACCESS DENIED");
                    return;
                  }

                  // Navigate to the admin dashboard URL
                  window.location.href = "/admin";
                }}
                className="hover:opacity-75 transition-all active:scale-95 text-[#141b2b] p-1.5"
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                id="header-logout-btn"
                onClick={handleLogout}
                className="hover:opacity-75 transition-all active:scale-95 text-[#141b2b] p-1.5 rounded-none"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-5 h-5 stroke-[1.5]" />
              </button>
            </>
          )}
          <button
            id="header-bag-btn"
            onClick={() => isLoggedIn && setIsCartOpen(true)}
            className="relative hover:opacity-75 transition-all active:scale-95 text-[#141b2b] p-1.5 rounded-none"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {isLoggedIn && cart.length > 0 && (
              <span
                id="header-cart-badge"
                className="absolute -top-1 -right-1 bg-[#141b2b] text-white font-mono text-[9px] font-bold w-4 h-4 flex items-center justify-center border border-white rounded-none"
              >
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Dynamic Content Main Body */}
      <main className="pt-16 flex-grow">
        {!isLoggedIn && (
          <AuthTab onAuthSuccess={handleAuthSuccess} />
        )}

        {isLoggedIn && activeTab === "home" && (
          <div className="space-y-0">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] md:h-[750px] flex flex-col items-center justify-center overflow-hidden radial-glow px-6 py-24 border-b border-black/5">
              {/* Organic Morphing Canvas Orb background */}
              <GlacialOrb />

              {/* Centered content block */}
              <div className="relative z-10 text-center flex flex-col items-center max-w-3xl space-y-8 animate-fade-in">
                <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl text-[#141b2b] tracking-wider mb-2 uppercase leading-none">
                  GLACIER 01
                </h1>
                <button
                  id="discover-hero-btn"
                  onClick={() => {
                    setActiveTab("search");
                    triggerToast("TRANSITIONED TO SYSTEM CATALOG ARCHIVE");
                  }}
                  className="glass-card px-11 py-4.5 font-mono text-[11px] uppercase tracking-[0.3em] font-semibold text-[#141b2b] hover:bg-white/60 hover:border-[#141b2b]/20 transition-all duration-300 active:scale-95 rounded-none"
                >
                  DISCOVER
                </button>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 opacity-45 select-none pointer-events-none">
                <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#141b2b] font-semibold">
                  Scroll
                </span>
                <div className="w-px h-12 bg-[#141b2b]/15 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-[#141b2b] animate-scroll-line" />
                </div>
              </div>
            </section>

            {/* Product Section: NEW ARRIVALS */}
            <section className="py-24 md:py-36 px-6 md:px-16 max-w-7xl mx-auto space-y-16">
              <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-black/5 pb-6">
                <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#141b2b] uppercase tracking-widest leading-none">
                  NEW ARRIVALS
                </h2>
                <span className="font-mono text-[10px] text-[#575f65] tracking-[0.25em] font-bold uppercase leading-none">
                  SEASON 04 / WINTER
                </span>
              </div>

              {/* Products list grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PRODUCTS.map((p) => {
                  const isWishlisted = wishlist.some((item) => item.id === p.id);
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetails={setSelectedProduct}
                      isWishlisted={isWishlisted}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  );
                })}
              </div>
            </section>

            {/* Aesthetic Philosophy Interstitial */}
            <section className="h-[500px] relative overflow-hidden flex items-center justify-center bg-[#f9f9ff] border-t border-b border-black/5">
              <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(20,27,43,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,27,43,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
              </div>
              <div className="text-center px-6 z-10 max-w-3xl space-y-8">
                <span className="font-mono text-[10px] text-[#575f65] uppercase tracking-[0.45em] font-bold">
                  The Philosophy
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3.5xl text-[#141b2b] italic tracking-wide leading-relaxed">
                  &ldquo;{PHILOSOPHY_QUOTE}&rdquo;
                </h2>
                <div className="w-24 h-px bg-[#141b2b] mx-auto" />
              </div>
            </section>
          </div>
        )}

        {isLoggedIn && activeTab === "search" && (
          <SearchTab
            products={PRODUCTS}
            onViewDetails={setSelectedProduct}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {isLoggedIn && activeTab === "wishlist" && (
          <WishlistTab
            wishlist={wishlist}
            onRemoveFromWishlist={handleToggleWishlist}
            onViewDetails={setSelectedProduct}
            onGoToArchive={() => setActiveTab("search")}
          />
        )}

        {isLoggedIn && activeTab === "profile" && (
          <ProfileTab
            email={userEmail}
            orders={orders}
            onClearHistory={handleClearOrdersLedger}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative w-full border-t border-black/5 bg-[#f9f9ff] flex flex-col items-center py-16 px-6 text-center">
        <span className="font-display font-extrabold text-xl tracking-[0.3em] text-[#141b2b] uppercase">
          VAULT
        </span>
        <nav className="flex flex-wrap justify-center gap-8 my-8">
          {isLoggedIn && (
            <button
              id="footer-archive-link"
              onClick={() => {
                setActiveTab("search");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-mono text-[10px] uppercase tracking-widest text-[#575f65] hover:text-[#141b2b] hover:underline decoration-1 underline-offset-4 transition-all duration-300 rounded-none"
            >
              ARCHIVE
            </button>
          )}
          <button
            id="footer-terms-link"
            onClick={() => triggerToast("TERMS & REGISTRATION SCHEMAS ARE REGISTERED")}
            className="font-mono text-[10px] uppercase tracking-widest text-[#575f65] hover:text-[#141b2b] hover:underline decoration-1 underline-offset-4 transition-all duration-300 rounded-none"
          >
            TERMS
          </button>
          <button
            id="footer-contact-link"
            onClick={() => triggerToast("CONTACT SECURED AT SECURE@VAULT.STUDIOS")}
            className="font-mono text-[10px] uppercase tracking-widest text-[#575f65] hover:text-[#141b2b] hover:underline decoration-1 underline-offset-4 transition-all duration-300 rounded-none"
          >
            CONTACT
          </button>
        </nav>
        <p className="font-mono text-[9px] tracking-widest text-[#575f65]/60 uppercase">
          © 2026 VAULT STUDIOS. ALL RIGHTS RESERVED.
        </p>
      </footer>

      {/* BottomNavBar tab controls */}
      {isLoggedIn && (
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
      )}

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
      />
    </div>
  );
}