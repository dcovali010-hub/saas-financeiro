import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: "#0a0f1e",
          hover: "#111827",
          active: "#1d2d50",
          border: "#1f2937",
          text: "#9ca3af",
          "text-active": "#ffffff",
          "text-header": "#4b5563",
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        surface: {
          900: "#0a0f1e",
          800: "#0f172a",
          700: "#111827",
          600: "#1f2937",
          500: "#374151",
        },
      },
      backgroundImage: {
        "gradient-sidebar": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-active": "linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)",
        "gradient-card": "linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
