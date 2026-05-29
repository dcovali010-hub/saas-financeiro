"use client";

import { useState } from "react";
import { mockMenuItems, mockTables } from "@/lib/mock-data";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";
import type { MenuCategory, MenuItem } from "@/types";
import {
  Star, Plus, Minus, ShoppingBag, UtensilsCrossed,
  ChefHat, CheckCircle, X, Clock, Send, MessageSquare,
} from "lucide-react";

interface CartItem {
  item: MenuItem;
  quantity: number;
}

const CATEGORIES: MenuCategory[] = ["entradas", "pratos_principais", "sobremesas", "bebidas"];

const categoryEmoji: Record<MenuCategory, string> = {
  entradas: "🥗",
  pratos_principais: "🍽️",
  sobremesas: "🍮",
  bebidas: "🥤",
};

export default function TableMenuPage({ params }: { params: { numero: string } }) {
  const tableNumber = params.numero;
  const table = mockTables.find((t) => t.number === parseInt(tableNumber));

  const [activeCategory, setActiveCategory] = useState<MenuCategory | "todos">("todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const filtered = mockMenuItems.filter(
    (item) => item.available && (activeCategory === "todos" || item.category === activeCategory)
  );

  const byCategory = CATEGORIES.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = filtered.filter((i) => i.category === cat);
    return acc;
  }, {});

  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.quantity, 0);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) return prev.map((c) => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === itemId);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((c) => c.item.id !== itemId);
      return prev.map((c) => c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c);
    });
  };

  const getQty = (itemId: string) => cart.find((c) => c.item.id === itemId)?.quantity ?? 0;

  const placeOrder = () => {
    setCartOpen(false);
    setOrderPlaced(true);
    setCart([]);
  };

  const submitRating = () => {
    setRatingSubmitted(true);
  };

  if (!table) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6 text-center">
        <div>
          <UtensilsCrossed className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h1 className="text-white text-xl font-bold mb-2">Table not found</h1>
          <p className="text-gray-500 text-sm">Ask your waiter for the correct QR code.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0a0f1e]/95 backdrop-blur-sm border-b border-[#1f2937]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Golden Fork</p>
              <p className="text-amber-400 text-xs">Table {tableNumber}</p>
            </div>
          </div>
          <button
            onClick={() => setRatingOpen(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-400 transition-colors border border-[#1f2937] hover:border-amber-500/30 px-3 py-1.5 rounded-xl"
          >
            <Star className="w-3.5 h-3.5" />
            Rate us
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory("todos")}
            className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${activeCategory === "todos" ? "bg-amber-500 text-white" : "bg-[#111827] text-gray-400 border border-[#1f2937]"}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${activeCategory === cat ? "bg-amber-500 text-white" : "bg-[#111827] text-gray-400 border border-[#1f2937]"}`}
            >
              {categoryEmoji[cat]} {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </header>

      {/* ── Menu Content ──────────────────────────────────────────── */}
      <main className="px-4 pb-36 pt-4 max-w-2xl mx-auto space-y-8">
        {orderPlaced && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-white font-semibold">Order sent to kitchen!</p>
            <p className="text-gray-400 text-sm mt-1">Your waiter will bring it shortly.</p>
            <button
              onClick={() => setRatingOpen(true)}
              className="mt-3 text-amber-400 text-sm underline underline-offset-2"
            >
              Rate your experience →
            </button>
          </div>
        )}

        {CATEGORIES.map((cat) => {
          const items = byCategory[cat];
          if (!items || items.length === 0) return null;
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{categoryEmoji[cat]}</span>
                <h2 className="text-white font-bold text-lg">{getCategoryLabel(cat)}</h2>
              </div>
              <div className="space-y-3">
                {items.map((item) => {
                  const qty = getQty(item.id);
                  return (
                    <div key={item.id} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <p className="text-white font-semibold text-sm">{item.name}</p>
                              {item.popular && (
                                <span className="flex-shrink-0 text-[10px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-md">
                                  ⭐ Popular
                                </span>
                              )}
                            </div>
                            <p className="text-gray-500 text-xs line-clamp-2 mb-2">{item.description}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-amber-400 font-black">{formatCurrency(item.price)}</span>
                              <span className="text-gray-600 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />{item.prep_time}min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quantity control */}
                      <div className="flex-shrink-0">
                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(item)}
                            className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-5 h-5 text-white" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 rounded-xl bg-[#1f2937] hover:bg-[#2a3546] flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="text-white font-bold w-5 text-center">{qty}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {/* ── Floating Cart Bar ─────────────────────────────────────── */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#0a0f1e] to-transparent">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full max-w-2xl mx-auto flex items-center justify-between bg-amber-500 hover:bg-amber-400 transition-colors rounded-2xl px-5 py-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-black text-sm">
                {cartCount}
              </span>
              <span className="text-white font-semibold">View Order</span>
            </div>
            <span className="text-white font-black text-lg">{formatCurrency(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* ── Cart Modal ────────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-2xl mx-auto bg-[#111827] border border-[#1f2937] rounded-t-3xl p-6 pb-10 animate-slide-in max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">Your Order</h2>
              <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-xl bg-[#1f2937] flex items-center justify-center text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {cart.map((c) => (
                <div key={c.item.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#0a0f1e]">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{c.item.name}</p>
                    <p className="text-gray-500 text-xs">{formatCurrency(c.item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeFromCart(c.item.id)} className="w-7 h-7 rounded-lg bg-[#1f2937] flex items-center justify-center text-white hover:bg-[#2a3546]">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-white font-bold w-5 text-center">{c.quantity}</span>
                    <button onClick={() => addToCart(c.item)} className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 hover:bg-amber-500/30">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-white font-bold text-sm w-14 text-right">{formatCurrency(c.item.price * c.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-4 border-t border-[#1f2937] mb-6">
              <span className="text-gray-400">Total</span>
              <span className="text-white text-2xl font-black">{formatCurrency(cartTotal)}</span>
            </div>

            <div className="bg-[#0a0f1e] rounded-xl p-3 flex items-center gap-2 mb-6 text-xs text-gray-500">
              <ChefHat className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Your waiter will confirm and bring the order to Table {tableNumber}.</span>
            </div>

            <button
              onClick={placeOrder}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Order to Kitchen
            </button>
          </div>
        </div>
      )}

      {/* ── Rating Modal ──────────────────────────────────────────── */}
      {ratingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setRatingOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-[#111827] border border-[#1f2937] rounded-3xl p-7 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {ratingSubmitted ? (
              <div className="py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Thank you! 🙏</h3>
                <p className="text-gray-400 text-sm">Your feedback helps us serve you better.</p>
                <button
                  onClick={() => setRatingOpen(false)}
                  className="mt-6 w-full py-3 rounded-xl bg-[#1f2937] text-gray-300 text-sm font-medium hover:bg-[#2a3546] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setRatingOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-[#1f2937] flex items-center justify-center text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-white text-xl font-bold mb-1">Rate Your Experience</h3>
                <p className="text-gray-500 text-sm mb-6">How was your visit to Golden Fork?</p>

                {/* Stars */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${star <= (hoveredStar || rating) ? "fill-amber-400 text-amber-400" : "text-gray-600"}`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mb-5 h-4">
                  {(hoveredStar || rating) === 1 && "Poor 😞"}
                  {(hoveredStar || rating) === 2 && "Fair 😐"}
                  {(hoveredStar || rating) === 3 && "Good 🙂"}
                  {(hoveredStar || rating) === 4 && "Great 😊"}
                  {(hoveredStar || rating) === 5 && "Excellent! 🤩"}
                </p>

                {/* Comment */}
                <div className="relative mb-5">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="Tell us what you loved (or how we can improve)..."
                    rows={3}
                    className="w-full bg-[#0a0f1e] border border-[#1f2937] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <button
                  onClick={submitRating}
                  disabled={rating === 0}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Review
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
