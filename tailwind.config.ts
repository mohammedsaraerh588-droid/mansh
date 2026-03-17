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
        gold:    "var(--gold)",
        gold2:   "var(--gold2)",
        navy:    "var(--navy)",
        navy2:   "var(--navy2)",
        surface: "var(--surface)",
        bg:      "var(--bg)",
        bg2:     "var(--bg2)",
        bg3:     "var(--bg3)",
        border:  "var(--border)",
        border2: "var(--border2)",
        txt1:    "var(--txt1)",
        txt2:    "var(--txt2)",
        txt3:    "var(--txt3)",
        // legacy aliases so old code doesn't break
        primary:           "var(--gold)",
        "primary-light":   "var(--gold-bg)",
        "primary-dark":    "var(--gold)",
        secondary:         "var(--navy)",
        accent:            "var(--gold2)",
        "text-primary":    "var(--txt1)",
        "text-secondary":  "var(--txt2)",
        "text-muted":      "var(--txt3)",
        "surface-2":       "var(--bg2)",
        "surface-3":       "var(--bg3)",
        "border-dark":     "var(--border2)",
        warning:           "var(--gold)",
        success:           "#16a34a",
        danger:            "var(--red)",
      },
      fontFamily: { sans: ["Tajawal", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
