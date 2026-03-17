import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        p:  "var(--c-p)",  p2: "var(--c-p2)",  p3: "var(--c-p3)",
        acc:"var(--c-acc)", acc2:"var(--c-acc2)",
        surface:"var(--c-surface)",
        bg: "var(--c-bg)", bg2:"var(--c-bg2)", bg3:"var(--c-bg3)",
        brd:"var(--c-border)", brd2:"var(--c-border2)",
        t1: "var(--c-txt1)", t2:"var(--c-txt2)", t3:"var(--c-txt3)",
        ok: "var(--c-ok)",  err:"var(--c-err)",
        /* legacy aliases — keeps old pages working */
        primary:          "var(--c-p)",
        "primary-light":  "var(--c-p-light)",
        "primary-dark":   "var(--c-p)",
        secondary:        "var(--c-navy)",
        accent:           "var(--c-acc)",
        "text-primary":   "var(--c-txt1)",
        "text-secondary": "var(--c-txt2)",
        "text-muted":     "var(--c-txt3)",
        "surface-2":      "var(--c-bg2)",
        "surface-3":      "var(--c-bg3)",
        "border-dark":    "var(--c-border2)",
        warning: "var(--c-warn)",
        success: "var(--c-ok)",
        danger:  "var(--c-err)",
      },
      fontFamily: { sans: ["Tajawal","sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
