import { useState } from "react";
import { User, ShieldAlert, Package, Calendar, MapPin, Sparkles, LogOut } from "lucide-react";
import { Order } from "../types";

interface ProfileTabProps {
  email: string;
  orders: Order[];
  onClearHistory: () => void;
  onLogout: () => void;
}

export default function ProfileTab({
  email,
  orders,
  onClearHistory,
  onLogout,
}: ProfileTabProps) {
  const [userName, setUserName] = useState<string>("Yash V.");
  const [phone, setPhone] = useState<string>("+1 (555) 019-2834");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <section className="py-12 px-6 md:px-16 max-w-7xl mx-auto space-y-8 min-h-[70vh]">
      {/* Header and Title */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#575f65] uppercase">
          SECURED CUSTOMER TERMINAL
        </span>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#141b2b] uppercase tracking-widest">
          CUSTOMER IDENTITY
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 md:p-8 bg-white/25 border-l-4 border-l-[#141b2b] space-y-6 rounded-none">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#141b2b] text-white flex items-center justify-center font-bold text-lg rounded-none">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#141b2b] uppercase tracking-wider">
                  {userName}
                </h3>
                <p className="font-mono text-[10px] text-[#575f65] tracking-widest">
                  VIP LOG PRIVILEGES
                </p>
              </div>
            </div>

            <div className="h-px bg-black/5" />

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[9px] text-[#575f65] font-bold tracking-widest uppercase">
                  AUTHORIZED EMAIL
                </span>
                <p className="text-[#141b2b] font-semibold select-all">
                  {email || "yash.v2136@gmail.com"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-[#575f65] font-bold tracking-widest uppercase">
                  TELECOMMUNICATION LINK
                </span>
                {isEditing ? (
                  <input
                    id="profile-phone-input"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2 font-mono text-xs text-[#141b2b] rounded-none focus:outline-none uppercase"
                  />
                ) : (
                  <p className="text-[#141b2b] font-medium">{phone}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-[#575f65] font-bold tracking-widest uppercase">
                  NAME ACCREDITATION
                </span>
                {isEditing ? (
                  <input
                    id="profile-name-input"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-[#f9f9ff] border border-black/15 focus:border-[#141b2b] focus:ring-0 p-2 font-mono text-xs text-[#141b2b] rounded-none focus:outline-none uppercase"
                  />
                ) : (
                  <p className="text-[#141b2b] font-medium uppercase">{userName}</p>
                )}
              </div>
            </div>

            <div className="h-px bg-black/5" />

            <button
              id="edit-profile-btn"
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-3 bg-[#141b2b] hover:bg-[#2c3547] text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all rounded-none"
            >
              {isEditing ? "SAVE REGISTRATION" : "MODIFY IDENTITY DATA"}
            </button>

            <button
              id="logout-profile-btn"
              type="button"
              onClick={onLogout}
              className="w-full py-3 bg-[#ba1a1a] hover:bg-[#8b1414] text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all rounded-none flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              TERMINATE SESSION
            </button>
          </div>

          {/* Secure token notification */}
          <div className="p-4 bg-[#f0f8ff] border border-[#dce2f7] flex items-start gap-3 rounded-none">
            <ShieldAlert className="w-5 h-5 text-[#5d5f5f] mt-0.5 shrink-0" />
            <div>
              <h5 className="font-mono text-[10px] font-bold text-[#141b2b] tracking-wider uppercase">
                INTEGRITY SECURITY
              </h5>
              <p className="font-sans text-xs text-[#404752] leading-relaxed mt-0.5">
                Vault accounts are bound by cryptographic signature checks. Purchases are dispatched with physical alloy verification markers.
              </p>
            </div>
          </div>
        </div>

        {/* Order History Listing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-black/5">
            <h3 className="font-display font-bold text-lg text-[#141b2b] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-5 h-5 text-[#141b2b]" />
              <span>TRANSACTION LEDGER</span>
            </h3>
            {orders.length > 0 && (
              <button
                id="clear-orders-btn"
                type="button"
                onClick={onClearHistory}
                className="font-mono text-[9px] uppercase tracking-widest text-[#ba1a1a] hover:underline"
              >
                Reset Ledger
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-black/10 p-8 space-y-3 rounded-none bg-[#f9f9ff]/30">
              <p className="font-display font-bold text-[#141b2b] uppercase tracking-wider text-base">
                Ledger Log Vacant
              </p>
              <p className="font-sans text-xs text-[#575f65] max-w-sm mx-auto leading-relaxed">
                No verified transactions have been registered on your account profile. Successfully finalize a shopping checkout sequence to generate a ledger.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-black/10 bg-white p-5 space-y-4 rounded-none"
                >
                  {/* Ledger header summary */}
                  <div className="flex justify-between items-start flex-wrap gap-2 pb-3.5 border-b border-black/5">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-[#141b2b]">
                        ID: {order.id}
                      </span>
                      <div className="flex items-center gap-1 text-[#575f65] font-mono text-[9px] tracking-widest">
                        <Calendar className="w-3 h-3" />
                        <span>{order.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] tracking-wider font-bold bg-[#e9edff] text-[#141b2b] px-2 py-0.5 uppercase">
                        {order.status}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#141b2b]">
                        ${order.total}
                      </span>
                    </div>
                  </div>

                  {/* Items purchased list */}
                  <div className="space-y-2.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-[#575f65]">({item.quantity}x)</span>
                          <span className="text-[#141b2b] uppercase font-semibold">{item.productName}</span>
                          <span className="text-[#575f65]/60">SIZE: {item.size}</span>
                        </div>
                        <span className="text-[#141b2b]">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer details (Security details) */}
                  <div className="pt-3 border-t border-black/5 flex items-center justify-between text-[9px] font-mono text-[#575f65]">
                    <div className="flex items-center gap-1.5 uppercase">
                      <MapPin className="w-3.5 h-3.5 text-[#5d5f5f]" />
                      <span className="truncate max-w-xs md:max-w-md">SHIPPED TO: {order.items[0] ? "SECURED LOGS" : "ADDRESS RECORDED"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#5d5f5f] uppercase">
                      <Sparkles className="w-3 h-3" />
                      <span>Sealed Cargo Packaging</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
