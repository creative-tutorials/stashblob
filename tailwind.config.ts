/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      whitebg: "#f6f7f9",
      darkestbg: "#1a1b1e",
      borderbtm: "#3B3B43",
      hashtext: "#a6a6b1",
      darkbtn: "#393c44",
      secondpro: "#27272a",
      thirdprop: "#1f1f23",
      darkbtnhover: "#2a2c32",
      hovergrey: "#2c2c30",
      darkmxbtn: "#141416",
      black: "#000000",
      blackmid: "#121213",
      purplebtn: "#7048FC",
      royalblue: "#2559c0",
      royalglue: "#235789",
      blueborder: "#a5c5f6",
      containerBG: "#2473c8",
      fileicon: "#749ae4",
      gradedtext: "#87a7e8",
      linkclr: "#80a2e7",
      darkerblue: "#03081B",
      purpleborder: "#9C86E8",
      lightpurple: "#b49efd",
      midwhite: "#DBE2EB",
      midwhite2: "#e3eef9",
      whiteos: "#DFEAEA",
      actionpurple: "#6c47ff",
      lightgrey: "#d0d0d0",
      danger_red: "#EE1739",
      fire: "#E10C22",
      danger_forground: "#feb9c3"
    },
    fontFamily: {
      Noto: "Noto Sans JP, sans-serif",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
