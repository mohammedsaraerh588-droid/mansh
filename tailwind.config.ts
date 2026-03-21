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
        brand:"var(--brand)", "brand-2":"var(--brand-2)",
        surface:"var(--surface)", bg:"var(--bg)",
        bg2:"var(--surface2)", bg3:"var(--surface3)",
        tx1:"var(--tx1)", tx2:"var(--tx2)", tx3:"var(--tx3)",
        ok:"var(--ok)", err:"var(--err)",
        /* legacy */
        navy:"var(--brand)", navy2:"var(--brand-hover)", navy3:"var(--brand-2)",
        ceil:"var(--brand)", "ceil-soft":"var(--brand-light)", "ceil-mid":"var(--brand-mid)",
        teal:"var(--brand)", teal2:"var(--brand-2)",
        gold:"var(--brand)", mint:"var(--brand-light)",
        primary:"var(--brand-light)", "primary-light":"var(--brand-light)",
        "primary-dark":"var(--brand-hover)", secondary:"var(--brand-hover)",
        accent:"var(--brand)", "text-primary":"var(--tx1)",
        "text-secondary":"var(--tx2)", "text-muted":"var(--tx3)",
        "surface-2":"var(--surface2)", "surface-3":"var(--surface3)",
        border:"var(--brd)", "border-dark":"var(--brd2)",
        warning:"var(--warn)", success:"var(--ok)", danger:"var(--err)",
      },
      fontFamily: { sans: ["Tajawal", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
