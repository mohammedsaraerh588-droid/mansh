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
        brand:"var(--brand)","brand-h":"var(--brand-h)",
        "brand-l":"var(--brand-l)","brand-m":"var(--brand-m)",
        teal:"var(--teal)","teal-l":"var(--teal-l)",
        surface:"var(--surface)",bg:"var(--bg)",
        bg2:"var(--surface2)",bg3:"var(--surface3)",
        tx1:"var(--tx1)",tx2:"var(--tx2)",tx3:"var(--tx3)",
        ok:"var(--ok)",err:"var(--err)",
        /* legacy */
        navy:"var(--brand)",navy2:"var(--brand-h)",navy3:"#1D4ED8",
        ceil:"var(--brand)","ceil-soft":"var(--brand-l)","ceil-mid":"var(--brand-m)",
        gold:"var(--brand)",mint:"var(--brand-l)",
        primary:"var(--brand-l)","primary-light":"var(--brand-l)","primary-dark":"var(--brand-h)",
        secondary:"var(--brand-h)",accent:"var(--teal)",
        "text-primary":"var(--tx1)","text-secondary":"var(--tx2)","text-muted":"var(--tx3)",
        "surface-2":"var(--surface2)","surface-3":"var(--surface3)",
        border:"var(--brd)","border-dark":"var(--brd2)",
        warning:"var(--warn)",success:"var(--ok)",danger:"var(--err)",error:"var(--err)",
      },
      fontFamily: { sans: ["Tajawal","sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
