import { useState } from "react";
import { LogIn, Mail, Lock, AlertCircle, CheckCircle, Loader, Key, User, Phone } from "lucide-react";
import { authAPI } from "../../api/client";

interface AuthTabProps {
  onAuthSuccess: (token: string, email: string) => void;
}

type AuthState = 'login' | 'register' | 'forgot' | 'reset';

export default function AuthTab({ onAuthSuccess }: AuthTabProps) {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (authState === 'login' || authState === 'register') {
        // Validation
        if (!email || !password) {
          setMessage({ type: "error", text: "EMAIL AND PASSWORD REQUIRED" });
          setLoading(false);
          return;
        }

        if (authState === 'register') {
          if (!fullName.trim() || !phone.trim()) {
            setMessage({ type: "error", text: "FULL NAME AND PHONE NUMBER REQUIRED" });
            setLoading(false);
            return;
          }
          if (!/^[0-9]{10}$/.test(phone.trim())) {
            setMessage({ type: "error", text: "PHONE NUMBER MUST BE EXACTLY 10 DIGITS" });
            setLoading(false);
            return;
          }
          if (password !== confirmPassword) {
            setMessage({ type: "error", text: "PASSWORDS DO NOT MATCH" });
            setLoading(false);
            return;
          }
          if (password.length < 6) {
            setMessage({ type: "error", text: "PASSWORD MUST BE AT LEAST 6 CHARACTERS" });
            setLoading(false);
            return;
          }
        }

        // API call
        if (authState === 'login') {
          const response = await authAPI.login(email, password);
          setMessage({
            type: "success",
            text: "LOGIN SUCCESSFUL",
          });

          // Store login data
          localStorage.setItem("vault_auth_token", response.token);
          localStorage.setItem("vault_user_email", response.user.email);
          localStorage.setItem("vault_user_role", response.user.role);
          localStorage.setItem("vault_user_phone", response.user.phone || "");
          localStorage.setItem("vault_user_first_name", response.user.firstName || "");
          localStorage.setItem("vault_user_last_name", response.user.lastName || "");

          setTimeout(() => {
            onAuthSuccess(response.token, response.user.email);
          }, 1500);
        } else {
          await authAPI.register(email, password, fullName, phone);
          setMessage({
            type: "success",
            text: "REGISTRATION SUCCESSFUL. PLEASE LOG IN.",
          });

          setTimeout(() => {
            setAuthState('login');
            setPassword("");
            setConfirmPassword("");
            setFullName("");
            setPhone("");
            setMessage(null);
          }, 2000);
        }
      } 
      
      else if (authState === 'forgot') {
        if (!email) {
          setMessage({ type: "error", text: "EMAIL ADDRESS REQUIRED" });
          setLoading(false);
          return;
        }

        await authAPI.forgotPassword(email);

        setMessage({
          type: "success",
          text: "RESET TOKEN GENERATED. CHECK BACKEND SERVER LOGS.",
        });

        setTimeout(() => {
          setMessage(null);
          setAuthState('reset');
        }, 2000);
      } 
      
      else if (authState === 'reset') {
        if (!resetToken || !password) {
          setMessage({ type: "error", text: "RESET TOKEN AND NEW PASSWORD REQUIRED" });
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setMessage({ type: "error", text: "PASSWORDS DO NOT MATCH" });
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setMessage({ type: "error", text: "PASSWORD MUST BE AT LEAST 6 CHARACTERS" });
          setLoading(false);
          return;
        }

        await authAPI.resetPassword(email, resetToken, password);

        setMessage({
          type: "success",
          text: "PASSWORD RESET PROTOCOL SECURED. REDIRECTING...",
        });

        setTimeout(() => {
          setMessage(null);
          setPassword("");
          setConfirmPassword("");
          setResetToken("");
          setAuthState('login');
        }, 2000);
      }
    } catch (error: any) {
      const errorMsg = error.message || "AUTHENTICATION FAILED";
      setMessage({ type: "error", text: errorMsg.toUpperCase() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-6 md:px-16 max-w-7xl mx-auto space-y-8 min-h-[70vh] flex flex-col justify-center">
      {/* Header */}
      <div className="space-y-2 max-w-md mx-auto w-full">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#575f65] uppercase">
          AUTHENTICATION PROTOCOL
        </span>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#141b2b] uppercase tracking-widest">
          {authState === 'login' && "ASTITIVA ENTRY"}
          {authState === 'register' && "ASTITIVA MEMBERSHIP"}
          {authState === 'forgot' && "FORGOT ACCESS"}
          {authState === 'reset' && "RESET SECURITY"}
        </h2>
        <p className="font-mono text-[11px] text-[#575f65] mt-4 tracking-wide">
          {authState === 'login' && "EXISTING MEMBERS: ACCESS YOUR SECURED TERMINAL"}
          {authState === 'register' && "NEW MEMBERS: ESTABLISH YOUR ASTITIVA CREDENTIALS"}
          {authState === 'forgot' && "INITIATE ACCESS RECOVERY PROTOCOLS"}
          {authState === 'reset' && "ENTER THE SECURE DECRYPTION RESET CODE AND NEW CREDENTIALS"}
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message Alert */}
          {message && (
            <div
              className={`p-4 rounded-none border-l-4 flex gap-3 ${
                message.type === "success"
                  ? "bg-green-50 border-l-green-500 text-green-700"
                  : "bg-red-50 border-l-red-500 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <p className="font-mono text-[10px] tracking-widest uppercase font-semibold">
                {message.text}
              </p>
            </div>
          )}

          {/* Full Name Field (Register Only) */}
          {authState === 'register' && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-[#575f65] tracking-widest uppercase font-bold block">
                FULL NAME
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]" />
                <input
                  id="auth-fullname-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="JOHN DOE"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white/50 backdrop-blur-sm rounded-none focus:outline-none font-mono text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          )}

          {/* Phone Number Field (Register Only) */}
          {authState === 'register' && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-[#575f65] tracking-widest uppercase font-bold block">
                PHONE NUMBER
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]" />
                <input
                  id="auth-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white/50 backdrop-blur-sm rounded-none focus:outline-none font-mono text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-[#575f65] tracking-widest uppercase font-bold block">
              AUTHORIZED EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]" />
              <input
                id="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading || authState === 'reset'}
                className="w-full pl-12 pr-4 py-3 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white/50 backdrop-blur-sm rounded-none focus:outline-none font-mono text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>

          {/* Reset Code Field */}
          {authState === 'reset' && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-[#575f65] tracking-widest uppercase font-bold block">
                6-DIGIT DECRYPTION TOKEN
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]" />
                <input
                  id="auth-reset-token-input"
                  type="text"
                  maxLength={6}
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="e.g. 123456"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white/50 backdrop-blur-sm rounded-none focus:outline-none font-mono text-sm tracking-[0.25em] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          {authState !== 'forgot' && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-[#575f65] tracking-widest uppercase font-bold block">
                {authState === 'reset' ? "NEW SECURITY PROTOCOL" : "SECURITY PROTOCOL"}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]" />
                <input
                  id="auth-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white/50 backdrop-blur-sm rounded-none focus:outline-none font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          {(authState === 'register' || authState === 'reset') && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-[#575f65] tracking-widest uppercase font-bold block">
                CONFIRM PROTOCOL
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575f65]" />
                <input
                  id="auth-confirm-password-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white/50 backdrop-blur-sm rounded-none focus:outline-none font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-[#141b2b] hover:bg-[#1a2439] text-white py-3 px-4 rounded-none font-mono text-[11px] font-bold tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                PROCESSING...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                {authState === 'login' && "ENTER ASTITIVA"}
                {authState === 'register' && "CREATE ASTITIVA"}
                {authState === 'forgot' && "REQUEST DECRYPTION CODE"}
                {authState === 'reset' && "DECRYPT & UPDATE CREDENTIALS"}
              </>
            )}
          </button>

          {/* Link Controls */}
          <div className="space-y-3 text-center pt-2">
            {/* Forgot password link */}
            {authState === 'login' && (
              <div>
                <button
                  id="auth-forgot-btn"
                  type="button"
                  onClick={() => {
                    setAuthState('forgot');
                    setMessage(null);
                    setPassword("");
                  }}
                  disabled={loading}
                  className="font-mono text-[9px] text-[#81898e] hover:text-[#141b2b] tracking-widest uppercase transition-colors"
                >
                  FORGOT SECURITY PROTOCOL?
                </button>
              </div>
            )}

            {/* Toggle Auth Mode */}
            <div>
              <button
                id="auth-toggle-btn"
                type="button"
                onClick={() => {
                  if (authState === 'login') {
                    setAuthState('register');
                  } else {
                    setAuthState('login');
                  }
                  setMessage(null);
                  setPassword("");
                  setConfirmPassword("");
                  setResetToken("");
                }}
                disabled={loading}
                className="font-mono text-[10px] text-[#575f65] hover:text-[#141b2b] tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authState === 'login' && "NEW TO ASTITIVA? CREATE ACCOUNT"}
                {authState !== 'login' && "RETURN TO SECURITY ENTRY (SIGN IN)"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
