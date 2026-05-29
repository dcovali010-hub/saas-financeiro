"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn, UtensilsCrossed } from "lucide-react";

const DEMO_LOGINS = [
  { label: "Owner",   email: "admin@goldenfork.com",   color: "text-amber-400" },
  { label: "Manager", email: "gerente@goldenfork.com",  color: "text-purple-400" },
  { label: "Waiter",  email: "garcom@goldenfork.com",   color: "text-blue-400" },
  { label: "Kitchen", email: "cozinha@goldenfork.com",  color: "text-red-400" },
  { label: "Cashier", email: "caixa@goldenfork.com",    color: "text-emerald-400" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    if (ok) {
      toast.success("Welcome back!");
      router.push("/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xl leading-tight">Golden Fork</p>
              <p className="text-amber-400/70 text-xs">Restaurant System</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Staff Login</h1>
          <p className="text-gray-500 text-sm">Sign in to access your dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-7">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@goldenfork.com"
                required
                className="w-full bg-[#0a0f1e] border border-[#1f2937] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0a0f1e] border border-[#1f2937] rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn className="w-4 h-4" />Sign In</>
              )}
            </button>
          </form>

          {/* Demo logins */}
          <div className="mt-6 pt-6 border-t border-[#1f2937]">
            <p className="text-xs text-gray-600 text-center mb-3">Demo — click to fill (password: 123456)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_LOGINS.map((d) => (
                <button
                  key={d.email}
                  onClick={() => { setEmail(d.email); setPassword("123456"); }}
                  className="text-xs px-3 py-2.5 rounded-xl bg-[#0a0f1e] border border-[#1f2937] hover:border-amber-500/30 transition-colors text-left"
                >
                  <span className={`font-semibold ${d.color}`}>{d.label}</span>
                  <br />
                  <span className="text-gray-600 truncate block">{d.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guest access note */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <p className="text-amber-400/70 text-xs text-center">
              🍽️ Guests — scan the QR code at your table at{" "}
              <span className="font-mono text-amber-400">/mesa/[number]</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
