import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, HelpCircle } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (address: string, promoCode: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "success">("cart");
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const calculatedDiscount = promoApplied ? subtotal * discount : 0;
  const shipping = subtotal > 400 ? 0 : 25;
  const total = subtotal - calculatedDiscount + shipping;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "VAULT10") {
      setPromoApplied(true);
      setDiscount(0.1); // 10% off
    } else if (promoCode.toUpperCase() === "GLACIER") {
      setPromoApplied(true);
      setDiscount(0.15); // 15% off
    } else {
      alert("INVALID PROMO CODE. TRY 'GLACIER' FOR 15% OR 'VAULT10' FOR 10%.");
    }
  };

  const handleNextStep = () => {
    if (checkoutStep === "cart") {
      setCheckoutStep("shipping");
    } else if (checkoutStep === "shipping") {
      if (!shippingAddress.trim()) {
        alert("PLEASE PROVIDE A VALID SHIPPING ADDRESS");
        return;
      }
      onCheckout(shippingAddress, promoCode);
      setCheckoutStep("success");
    }
  };

  const handleClose = () => {
    setCheckoutStep("cart");
    setShippingAddress("");
    setPromoCode("");
    setPromoApplied(false);
    setDiscount(0);
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
              {checkoutStep === "cart" ? (
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
                            Size: {item.size} | {item.product.colorCode}
                          </p>
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
                            ${item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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

                  <div className="space-y-3">
                    <label className="font-mono text-[10px] tracking-[0.2em] text-[#575f65] uppercase font-bold">
                      Shipping Destination Address
                    </label>
                    <textarea
                      id="shipping-address-input"
                      rows={4}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="ENTER HOUSE, STREET, CITY, POSTAL CODE, AND COUNTRY..."
                      className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-4 font-mono text-xs text-[#141b2b] uppercase placeholder:text-[#575f65]/40 rounded-none focus:outline-none resize-none"
                    />
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
                  <span>${subtotal}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between font-mono text-xs text-[#ba1a1a]">
                    <span>PROMO DISCOUNT ({(discount * 100)}%)</span>
                    <span>-${calculatedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between font-mono text-xs text-[#575f65]">
                  <span>SECURED PRIORITY COURIER</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping}`}</span>
                </div>
                <div className="h-px bg-black/5 my-1" />
                <div className="flex justify-between font-mono text-sm font-bold text-[#141b2b]">
                  <span>TOTAL ESTIMATION</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  id="checkout-next-btn"
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-[#141b2b] hover:bg-[#2c3547] text-white py-4.5 font-mono text-[11px] uppercase tracking-[0.25em] font-bold transition-all active:scale-[0.98] rounded-none flex items-center justify-center gap-2"
                >
                  {checkoutStep === "cart" ? "PROCEED TO PROTOCOL" : "AUTHORIZE TRANSACTION & SECURE"}
                </button>
                {checkoutStep === "shipping" && (
                  <button
                    id="checkout-back-btn"
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className="w-full bg-transparent hover:bg-black/5 text-[#575f65] py-2 font-mono text-[9px] uppercase tracking-widest transition-all rounded-none"
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
