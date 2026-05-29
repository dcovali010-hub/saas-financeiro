"use client";

import { Bot } from "lucide-react";

export default function AIAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">AI Agent</h2>
        <p className="text-gray-400 text-sm mt-0.5">Automated responses & WhatsApp integration</p>
      </div>
      <div className="text-center py-20 bg-[#111827] border border-[#1f2937] rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-cyan-400" />
        </div>
        <p className="text-white font-semibold text-lg">Coming Soon</p>
        <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
          AI-powered agent for automated reservation confirmations and customer messaging.
        </p>
      </div>
    </div>
  );
}
