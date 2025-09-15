import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        "surface-variant": "hsl(var(--surface-variant))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow: "hsl(var(--secondary-glow))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        // 2025 Visionary Colors
        "quantum-emerald": "hsl(var(--quantum-emerald))",
        "neural-coral": "hsl(var(--neural-coral))",
        "void-depth": "hsl(var(--void-depth))",
        "plasma-glow": "hsl(var(--plasma-glow))",
        "aurora-mint": "hsl(var(--aurora-mint))",
        "solar-amber": "hsl(var(--solar-amber))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) * 2)",
        "2xl": "calc(var(--radius) * 3)",
        "3xl": "calc(var(--radius) * 4)",
      },
      backgroundImage: {
        "gradient-neural": "var(--gradient-neural)",
        "gradient-plasma": "var(--gradient-plasma)",
        "gradient-aurora": "var(--gradient-aurora)",
        "gradient-void": "var(--gradient-void)",
      },
      boxShadow: {
        neural: "var(--shadow-neural)",
        plasma: "var(--shadow-plasma)",
        void: "var(--shadow-void)",
        glow: "var(--shadow-glow)",
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "Inter", 
          "-apple-system", 
          "BlinkMacSystemFont", 
          "Segoe UI", 
          "Roboto", 
          "Oxygen", 
          "Ubuntu", 
          "Cantarell", 
          "Fira Sans", 
          "Droid Sans", 
          "Helvetica Neue", 
          "sans-serif"
        ],
        display: [
          "Cal Sans",
          "Inter Variable",
          "Inter", 
          "system-ui", 
          "sans-serif"
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-neural": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 hsl(var(--primary) / 0.4)"
          },
          "50%": { 
            boxShadow: "0 0 0 20px hsl(var(--primary) / 0)"
          }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        },
        "slide-in-blur": {
          from: { 
            transform: "translateX(-100px)",
            filter: "blur(10px)",
            opacity: "0"
          },
          to: { 
            transform: "translateX(0)",
            filter: "blur(0px)",
            opacity: "1"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-neural": "pulse-neural 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-in-blur": "slide-in-blur 0.8s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
