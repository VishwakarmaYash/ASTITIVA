import { useState } from "react";
import { LogIn, Mail, Lock, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { authAPI } from "../../api/client";
// import { getUserByEmail } from "@/server/models/user";

interface AuthTabProps {
  onAuthSuccess: (token: string, email: string) => void;
}

export default function AuthTab({ onAuthSuccess }: AuthTabProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Validation
      if (!email || !password) {
        setMessage({ type: "error", text: "EMAIL AND PASSWORD REQUIRED" });
        setLoading(false);
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        setMessage({ type: "error", text: "PASSWORDS DO NOT MATCH" });
        setLoading(false);
        return;
      }

      if (!isLogin && password.length < 6) {
        setMessage({ type: "error", text: "PASSWORD MUST BE AT LEAST 6 CHARACTERS" });
        setLoading(false);
        return;
      }

      // API call
      let response;
      if (isLogin) {
        response = await authAPI.login(email, password);
      } else {
        response = await authAPI.register(email, password);
      }

      // Success
      setMessage({
        type: "success",
        text: isLogin ? "LOGIN SUCCESSFUL" : "REGISTRATION SUCCESSFUL",
      });

      // Store token and trigger callback
      // Store login data
      localStorage.setItem("vault_auth_token", response.token);
      localStorage.setItem("vault_user_email", response.user.email);
      localStorage.setItem("vault_user_role", response.user.role);

      setTimeout(() => {
        onAuthSuccess(response.token, response.user.email);
      }, 1500);
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
          {isLogin ? "VAULT ENTRY" : "VAULT MEMBERSHIP"}
        </h2>
        <p className="font-mono text-[11px] text-[#575f65] mt-4 tracking-wide">
          {isLogin ? "EXISTING MEMBERS: ACCESS YOUR SECURED TERMINAL" : "NEW MEMBERS: ESTABLISH YOUR VAULT CREDENTIALS"}
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
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 border border-black/10 focus:border-[#141b2b] focus:ring-0 bg-white/50 backdrop-blur-sm rounded-none focus:outline-none font-mono text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-[#575f65] tracking-widest uppercase font-bold block">
              SECURITY PROTOCOL
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

          {/* Confirm Password (Register Only) */}
          {!isLogin && (
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
                {isLogin ? "ENTER VAULT" : "CREATE VAULT"}
              </>
            )}
          </button>

          {/* Toggle Auth Mode */}
          <div className="text-center pt-2">
            <button
              id="auth-toggle-btn"
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage(null);
                setPassword("");
                setConfirmPassword("");
              }}
              disabled={loading}
              className="font-mono text-[10px] text-[#575f65] hover:text-[#141b2b] tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin ? "NEW TO VAULT? CREATE ACCOUNT" : "ALREADY A MEMBER? SIGN IN"}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-10 p-4 bg-[#f9f9ff] border border-black/5 rounded-none space-y-2">
          <p className="font-mono text-[9px] text-[#575f65] tracking-widest uppercase font-bold">
            TEST CREDENTIALS
          </p>
          <p className="font-mono text-[10px] text-[#141b2b]">
            Email: <span className="font-semibold">test@vault.com</span>
          </p>
          <p className="font-mono text-[10px] text-[#141b2b]">
            Password: <span className="font-semibold">test123</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// const user = await getUserByEmail(email);

// console.log("================================");
// console.log("Email entered:", email);
// console.log("User from DB:", user);
