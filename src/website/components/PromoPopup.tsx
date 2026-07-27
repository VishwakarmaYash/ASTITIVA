import React, { useState, useEffect } from 'react';
import { X, Mail, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromoPopupProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  isActive: boolean;
  discountCode: string;
}

export default function PromoPopup({
  title,
  description,
  imageUrl,
  buttonText,
  isActive,
  discountCode,
}: PromoPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // Check if dismissed/seen during this session
    const hasSeen = sessionStorage.getItem('vault_promo_popup_seen');
    if (!hasSeen) {
      // 1.5s visual entry delay
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('vault_promo_popup_seen', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white border-2 border-black shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col md:flex-row max-h-[90vh] z-10 font-sans"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 p-1.5 bg-white border border-black hover:bg-neutral-100 rounded-none transition-colors cursor-pointer"
              title="Close popup"
            >
              <X className="w-4 h-4 text-black" />
            </button>

            {/* Left side Image block */}
            <div className="w-full md:w-5/12 bg-neutral-100 h-48 md:h-auto overflow-hidden relative shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <img
                referrerPolicy="no-referrer"
                src={imageUrl || '/images/astitva_white_tee.png'}
                alt="Promo promotion"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black text-white font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
                SECRET DROP
              </div>
            </div>

            {/* Right side form block */}
            <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-center space-y-5 bg-white text-black">
              {!isSubmitted ? (
                <>
                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-xl md:text-2xl tracking-wider uppercase leading-none">
                      {title || 'UNLOCK THE VAULT'}
                    </h3>
                    <p className="font-sans text-xs text-[#575f65] leading-relaxed">
                      {description ||
                        'Subscribe to receive priority updates on secret collection drops and active discounts.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border-2 border-black rounded-none pl-11 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-0"
                        placeholder="ENTER YOUR CORRESPONDENCE EMAIL"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#ccff00] text-black font-mono text-[10px] font-bold py-3.5 px-6 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-none transition-all cursor-pointer uppercase tracking-widest"
                    >
                      {buttonText || 'JOIN CLUB'}
                    </button>
                  </form>

                  <p className="text-[9px] text-[#6E6E73] font-mono leading-relaxed uppercase">
                    * By subscribing, you agree to receive priority alerts. Unsubscribe at any time.
                  </p>
                </>
              ) : (
                /* Post-subscription view revealing discount code */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-700 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-xl tracking-wider uppercase">
                      ACCESS GRANTED
                    </h3>
                    <p className="font-sans text-xs text-[#575f65]">
                      Use the active VIP discount code below at checkout to receive your credentials benefit.
                    </p>
                  </div>

                  {/* Copy code banner container */}
                  <div className="flex border-2 border-black shadow-[4px_4px_0px_#000] overflow-hidden max-w-sm mx-auto">
                    <div className="flex-grow bg-[#F5F5F7] font-mono text-sm font-bold flex items-center justify-center py-3 uppercase tracking-wider text-black">
                      {discountCode}
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="bg-black hover:bg-neutral-900 text-white px-5 py-3 flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          COPIED
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          COPY
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleClose}
                    className="text-xs font-mono font-bold text-[#6E6E73] hover:text-black transition-colors uppercase tracking-widest underline mt-4 cursor-pointer"
                  >
                    CONTINUE BROWSING
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
