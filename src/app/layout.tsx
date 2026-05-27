import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AgênciaSaaS | Sistema Financeiro",
  description: "Sistema de gestão financeira para agências digitais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111827",
                color: "#e5e7eb",
                border: "1px solid #1f2937",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
