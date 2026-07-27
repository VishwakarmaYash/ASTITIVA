import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, HelpCircle, LogIn, Mail, Lock, AlertCircle, CheckCircle, Loader, User, Phone } from "lucide-react";
import { CartItem } from "../types";
import { authAPI } from "../../api/client";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (address: string, promoCode: string) => void;
  isLoggedIn: boolean;
  onAuthSuccess: (token: string, email: string) => void;
  shippingConfig: any;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isLoggedIn,
  onAuthSuccess,
  shippingConfig = {},
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "auth" | "shipping" | "success">("cart");
  const [houseFlat, setHouseFlat] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [areaLocality, setAreaLocality] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [stateProvince, setStateProvince] = useState<string>("");
  const [pinZipCode, setPinZipCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);

  // Auth Form State inside Cart Drawer
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState<string>("");
  const [authFullName, setAuthFullName] = useState<string>("");
  const [authPhone, setAuthPhone] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const calculatedDiscount = promoApplied ? subtotal * discount : 0;
  const shipping = subtotal >= shippingConfig.freeShippingThreshold ? 0 : shippingConfig.baseShippingFee;
  const total = subtotal - calculatedDiscount + shipping;

  const handleApplyPromo = () => {
    const codeUpper = promoCode.toUpperCase();
    const activeCouponCode = (shippingConfig.couponCode || "ASTITIVA10").toUpperCase();
    const activePopupCode = (shippingConfig.popupDiscountCode || "VAULT10").toUpperCase();

    if (codeUpper === activeCouponCode || codeUpper === activePopupCode) {
      setPromoApplied(true);
      setDiscount(0.1); // 10% off
    } else if (codeUpper === "GLACIER") {
      setPromoApplied(true);
      setDiscount(0.15); // 15% off
    } else {
      alert(`INVALID PROMO CODE. Try '${activeCouponCode}' or '${activePopupCode}'.`);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    setAuthLoading(true);

    try {
      if (!authEmail || !authPassword) {
        setAuthMessage({ type: "error", text: "EMAIL AND PASSWORD REQUIRED" });
        setAuthLoading(false);
        return;
      }

      if (authMode === "register") {
        if (!authFullName.trim() || !authPhone.trim()) {
          setAuthMessage({ type: "error", text: "FULL NAME AND PHONE NUMBER REQUIRED" });
          setAuthLoading(false);
          return;
        }
        if (!/^[0-9]{10}$/.test(authPhone.trim())) {
          setAuthMessage({ type: "error", text: "PHONE NUMBER MUST BE EXACTLY 10 DIGITS" });
          setAuthLoading(false);
          return;
        }
        if (authPassword !== authConfirmPassword) {
          setAuthMessage({ type: "error", text: "PASSWORDS DO NOT MATCH" });
          setAuthLoading(false);
          return;
        }
        if (authPassword.length < 6) {
          setAuthMessage({ type: "error", text: "PASSWORD MUST BE AT LEAST 6 CHARACTERS" });
          setAuthLoading(false);
          return;
        }
      }

      if (authMode === "login") {
        const response = await authAPI.login(authEmail, authPassword);
        setAuthMessage({
          type: "success",
          text: "LOGIN SUCCESSFUL",
        });

        // Save token & credentials
        localStorage.setItem("vault_auth_token", response.token);
        localStorage.setItem("vault_user_email", response.user.email);
        localStorage.setItem("vault_user_role", response.user.role || 'user');
        localStorage.setItem("vault_user_phone", response.user.phone || "");
        localStorage.setItem("vault_user_first_name", response.user.firstName || "");
        localStorage.setItem("vault_user_last_name", response.user.lastName || "");

        setTimeout(() => {
          onAuthSuccess(response.token, response.user.email);
          setCheckoutStep("shipping");
          // Clear auth fields
          setAuthEmail("");
          setAuthPassword("");
          setAuthConfirmPassword("");
          setAuthFullName("");
          setAuthPhone("");
          setAuthMessage(null);
        }, 1500);
      } else {
        await authAPI.register(authEmail, authPassword, authFullName, authPhone);
        setAuthMessage({
          type: "success",
          text: "REGISTRATION SUCCESSFUL. PLEASE LOG IN.",
        });

        setTimeout(() => {
          setAuthMode("login");
          setAuthPassword("");
          setAuthConfirmPassword("");
          setAuthFullName("");
          setAuthPhone("");
          setAuthMessage(null);
        }, 2000);
      }
    } catch (error: any) {
      const errorMsg = error.message || "AUTHENTICATION FAILED";
      setAuthMessage({ type: "error", text: errorMsg.toUpperCase() });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleNextStep = () => {
    if (checkoutStep === "cart") {
      if (isLoggedIn) {
        setCheckoutStep("shipping");
      } else {
        setCheckoutStep("auth");
      }
    } else if (checkoutStep === "shipping") {
      if (!houseFlat.trim() || !streetAddress.trim() || !areaLocality.trim() || !city.trim() || !stateProvince.trim() || !pinZipCode.trim() || !country.trim()) {
        alert("SHIPPING PROTOCOL REQUIRES ALL LOCATION FIELDS EXCEPT LANDMARK");
        return;
      }
      const fullAddressObj = {
        houseFlat: houseFlat.trim(),
        streetAddress: streetAddress.trim(),
        areaLocality: areaLocality.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        stateProvince: stateProvince.trim(),
        pinZipCode: pinZipCode.trim(),
        country: country.trim()
      };
      onCheckout(JSON.stringify(fullAddressObj), promoCode);
      setCheckoutStep("success");
    }
  };

  const handleClose = () => {
    setCheckoutStep("cart");
    setHouseFlat("");
    setStreetAddress("");
    setAreaLocality("");
    setLandmark("");
    setCity("");
    setStateProvince("");
    setPinZipCode("");
    setCountry("");
    setPromoCode("");
    setPromoApplied(false);
    setDiscount(0);
    setAuthEmail("");
    setAuthPassword("");
    setAuthConfirmPassword("");
    setAuthFullName("");
    setAuthPhone("");
    setAuthMessage(null);
    onClose();
  };

  return (
    <div
      id="cart-backdrop"
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Black backdrop overlay */}
      <div
        id="cart-overlay"
        onClick={handleClose}
        className="absolute inset-0 bg-[#141b2b]/50 backdrop-blur-sm"
      />

      {/* Cart side panel */}
      <div
        id="cart-panel"
        className={`absolute top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl border-l border-black/10 flex flex-col z-10 transition-transform duration-500 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } rounded-none`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-black/5 bg-[#f9f9ff]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#141b2b]" />
            <span className="font-display font-extrabold tracking-wider text-lg uppercase text-[#141b2b]">
              {checkoutStep === "success" ? "TRANSACTION SECURED" : "YOUR BAG"}
            </span>
            {cartItems.length > 0 && checkoutStep !== "success" && (
              <span className="font-mono text-[10px] bg-[#141b2b] text-white px-2 py-0.5 font-bold">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} ITEMS
              </span>
            )}
          </div>
          <button
            id="close-cart-btn"
            onClick={handleClose}
            className="p-1.5 hover:bg-black/5 text-[#141b2b] transition-colors rounded-none"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic checkout steps content */}
        {checkoutStep === "success" ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#e9edff] flex items-center justify-center border border-[#141b2b]/10">
              <ShieldCheck className="w-8 h-8 text-[#5d5f5f]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-xl text-[#141b2b] tracking-wider uppercase">
                ORDER AUTHENTICATED
              </h3>
              <p className="font-mono text-[10px] tracking-widest text-[#575f65]">
                TRANSACTION ID: VT-{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>
            <p className="font-sans text-sm text-[#444748] max-w-md leading-relaxed">
              Your order has been authorized. Vault packaging seals have been prepared. A tracking link will be transmitted upon dispatch.
            </p>
            <button
              id="continue-shopping-btn"
              type="button"
              onClick={handleClose}
              className="px-8 py-4 bg-[#141b2b] hover:bg-[#2c3547] text-white font-mono text-[10px] uppercase tracking-[0.25em] font-bold transition-all rounded-none"
            >
              Continue Exploration
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="text-[#575f65]/40 p-4 border border-dashed border-black/10">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-[#141b2b] uppercase tracking-wider">
                YOUR BAG IS VACANT
              </p>
              <p className="font-sans text-xs text-[#575f65] mt-1">
                No items have been assigned to your collection list yet.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable list & forms */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-6">
              {checkoutStep === "cart" && (
                /* Item list */
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-[#f9f9ff] border border-black/5 rounded-none"
                    >
                      <div className="w-20 h-24 bg-white border border-black/5 overflow-hidden shrink-0">
                        <img
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          src={item.product.image}
                          alt={item.product.name}
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-display font-extrabold text-sm text-[#141b2b] uppercase tracking-wider">
                              {item.product.name}
                            </h4>
                            <button
                              id={`remove-cart-item-${item.id}`}
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-[#575f65] hover:text-[#ba1a1a] transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-mono text-[10px] text-[#575f65] mt-0.5 uppercase tracking-widest">
                            Size: {item.size} {item.product.colorCode ? `| ${item.product.colorCode}` : ''}
                          </p>
                          {item.customization && (
                            <div className="mt-1.5 bg-black/5 p-1.5 border border-dashed border-black/10">
                              <span className="block text-[8px] font-mono text-[#575f65] uppercase font-bold tracking-widest">
                                Custom Print: {item.customization.placement?.toUpperCase()}
                              </span>
                              {item.customization.customText && (
                                <span className="block text-[8px] font-mono text-black font-semibold truncate mt-0.5">
                                  Text: "{item.customization.customText}"
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-black/10 bg-white">
                            <button
                              id={`decrease-qty-${item.id}`}
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-black/5 text-[#141b2b] transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 font-mono text-xs font-bold text-[#141b2b]">
                              {item.quantity}
                            </span>
                            <button
                              id={`increase-qty-${item.id}`}
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-black/5 text-[#141b2b] transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#141b2b]">
                            Rs. {item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {checkoutStep === "auth" && (
                /* Compact Auth Form inside Cart Drawer */
                <div className="space-y-6 py-2">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#575f65] uppercase font-bold block">
                      CHECKOUT PROTOCOL REQUIRED
                    </span>
                    <h3 className="font-display font-bold text-lg text-[#141b2b] uppercase tracking-wider">
                      {authMode === "login" ? "AUTHENTICATE SESSION" : "ESTABLISH SECURITY ACCOUNT"}
                    </h3>
                    <p className="font-sans text-xs text-[#575f65] leading-relaxed">
                      You must enter your credentials or register an account to record your shipment log and proceed to checkout.
                    </p>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMessage && (
                      <div className={`p-3.5 border-l-4 font-mono text-[9px] tracking-wider uppercase font-semibold flex gap-2 items-center ${
                        authMessage.type === "success" 
                          ? "bg-green-50 border-l-green-500 text-green-700" 
                          : "bg-red-50 border-l-red-500 text-red-700"
                      }`}>
                        {authMessage.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{authMessage.text}</span>
                      </div>
                    )}

                    {authMode === "register" && (
                      <>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                            FULL NAME
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]/60" />
                            <input
                              type="text"
                              value={authFullName}
                              onChange={(e) => setAuthFullName(e.target.value)}
                              placeholder="JOHN DOE"
                              disabled={authLoading}
                              className="w-full pl-10 pr-4 py-2.5 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white rounded-none focus:outline-none font-mono text-xs uppercase disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                            PHONE NUMBER
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]/60" />
                            <input
                              type="tel"
                              value={authPhone}
                              onChange={(e) => setAuthPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              disabled={authLoading}
                              className="w-full pl-10 pr-4 py-2.5 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white rounded-none focus:outline-none font-mono text-xs uppercase disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                        EMAIL ADDRESS
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]/60" />
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="YOUR@EMAIL.COM"
                          disabled={authLoading}
                          className="w-full pl-10 pr-4 py-2.5 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white rounded-none focus:outline-none font-mono text-xs uppercase disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                        PASSWORD
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]/60" />
                        <input
                          type="password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          disabled={authLoading}
                          className="w-full pl-10 pr-4 py-2.5 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white rounded-none focus:outline-none font-mono text-xs disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {authMode === "register" && (
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                          CONFIRM PASSWORD
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]/60" />
                          <input
                            type="password"
                            value={authConfirmPassword}
                            onChange={(e) => setAuthConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={authLoading}
                            className="w-full pl-10 pr-4 py-2.5 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white rounded-none focus:outline-none font-mono text-xs disabled:opacity-50"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-[#141b2b] hover:bg-[#2c3547] text-white py-3 px-4 rounded-none font-mono text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {authLoading ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                          PROCESSING PROTOCOL...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-3.5 h-3.5" />
                          {authMode === "login" ? "SECURE ACCESS (SIGN IN)" : "REGISTER MEMBERSHIP"}
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === "login" ? "register" : "login");
                        setAuthMessage(null);
                        setAuthPassword("");
                        setAuthConfirmPassword("");
                      }}
                      disabled={authLoading}
                      className="font-mono text-[10px] text-[#575f65] hover:text-[#141b2b] tracking-widest uppercase transition-colors cursor-pointer"
                    >
                      {authMode === "login" ? "NEW MEMBER? ESTABLISH CREDENTIALS" : "RETURN TO SIGN IN"}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === "shipping" && (
                /* Shipping Address step */
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-[#141b2b] uppercase tracking-wider">
                      DELIVERY PROTOCOL
                    </h3>
                    <p className="font-sans text-xs text-[#575f65] leading-relaxed">
                      Provide a physical destination address to authorized courier logs. We deliver via sealed, custom insulated temperature-stabilized cases.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                          House/Flat Number *
                        </label>
                        <input
                          id="shipping-house-input"
                          type="text"
                          value={houseFlat}
                          onChange={(e) => setHouseFlat(e.target.value)}
                          placeholder="e.g. FLAT 4B"
                          className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2.5 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                          Street Address *
                        </label>
                        <input
                          id="shipping-street-input"
                          type="text"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="e.g. 5TH AVENUE"
                          className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2.5 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                        Area/Locality *
                      </label>
                      <input
                        id="shipping-area-input"
                        type="text"
                        value={areaLocality}
                        onChange={(e) => setAreaLocality(e.target.value)}
                        placeholder="e.g. GREEN HEIGHTS"
                        className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2.5 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                        Landmark (Optional)
                      </label>
                      <input
                        id="shipping-landmark-input"
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. NEAR CENTRAL PARK"
                        className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2.5 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                          City *
                        </label>
                        <input
                          id="shipping-city-input"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. NEW YORK"
                          className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2.5 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                          State/Province *
                        </label>
                        <input
                          id="shipping-state-input"
                          type="text"
                          value={stateProvince}
                          onChange={(e) => setStateProvince(e.target.value)}
                          placeholder="e.g. NY"
                          className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2.5 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                          PIN/ZIP Code *
                        </label>
                        <input
                          id="shipping-pin-input"
                          type="text"
                          value={pinZipCode}
                          onChange={(e) => setPinZipCode(e.target.value)}
                          placeholder="e.g. 10001"
                          className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2.5 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold block">
                          Country *
                        </label>
                        <input
                          id="shipping-country-input"
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. UNITED STATES"
                          className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2.5 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vault delivery service assurances */}
                  <div className="border border-[#dce2f7] bg-[#f0f8ff] p-4 space-y-3">
                    <h5 className="font-mono text-[10px] font-bold text-[#141b2b] tracking-wider uppercase">
                      DELIVERY GUARANTEES
                    </h5>
                    <ul className="space-y-2 font-sans text-xs text-[#404752]">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#5d5f5f]"></span>
                        <span>Sealed, secure temperature-controlled cargo container packaging.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#5d5f5f]"></span>
                        <span>Full tracking telemetry dispatch via SMS/Email.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#5d5f5f]"></span>
                        <span>Direct delivery signature validation required.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom calculation summary */}
            <div className="p-6 border-t border-black/5 bg-[#f9f9ff] space-y-5">
              {checkoutStep === "cart" && (
                /* Promo Codes input */
                <div className="flex gap-2">
                  <input
                    id="promo-code-input"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="ENTER CODE (e.g. GLACIER)"
                    disabled={promoApplied}
                    className="flex-grow bg-white border border-black/15 focus:border-[#141b2b] focus:ring-0 px-4 py-3 font-mono text-[11px] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none"
                  />
                  <button
                    id="apply-promo-btn"
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode.trim()}
                    className="px-6 py-3 bg-[#141b2b] hover:bg-[#2c3547] text-white font-mono text-[10px] uppercase tracking-widest font-bold disabled:bg-[#575f65]/30 rounded-none shrink-0 transition-colors"
                  >
                    {promoApplied ? "APPLIED" : "APPLY"}
                  </button>
                </div>
              )}

              {/* Price list */}
              <div className="space-y-2.5">
                <div className="flex justify-between font-mono text-xs text-[#575f65]">
                  <span>SUBTOTAL</span>
                  <span>Rs. {subtotal}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between font-mono text-xs text-[#ba1a1a]">
                    <span>PROMO DISCOUNT ({(discount * 100)}%)</span>
                    <span>-Rs. {calculatedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between font-mono text-xs text-[#575f65]">
                  <span>SECURED PRIORITY COURIER</span>
                  <span>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span>
                </div>
                <div className="h-px bg-black/5 my-1" />
                <div className="flex justify-between font-mono text-sm font-bold text-[#141b2b]">
                  <span>TOTAL ESTIMATION</span>
                  <span>Rs. {total}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                {checkoutStep !== "auth" && (
                  <button
                    id="checkout-next-btn"
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-[#141b2b] hover:bg-[#2c3547] text-white py-4.5 font-mono text-[11px] uppercase tracking-[0.25em] font-bold transition-all active:scale-[0.98] rounded-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {checkoutStep === "cart" ? "PROCEED TO PROTOCOL" : "AUTHORIZE TRANSACTION & SECURE"}
                  </button>
                )}
                {checkoutStep === "auth" && (
                  <button
                    id="checkout-back-btn-auth"
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className="w-full bg-[#141b2b]/10 hover:bg-[#141b2b]/20 text-[#141b2b] py-4 font-mono text-[11px] uppercase tracking-widest font-bold transition-all rounded-none cursor-pointer"
                  >
                    Back to Bag Content
                  </button>
                )}
                {checkoutStep === "shipping" && (
                  <button
                    id="checkout-back-btn"
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className="w-full bg-transparent hover:bg-black/5 text-[#575f65] py-2 font-mono text-[9px] uppercase tracking-widest transition-all rounded-none cursor-pointer"
                  >
                    Back to Bag Content
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
