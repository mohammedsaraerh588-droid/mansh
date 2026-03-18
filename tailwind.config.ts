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
        teal:"var(--teal)", teal2:"var(--teal2)", teal3:"var(--teal3)",
        blue:"var(--blue)", blue2:"var(--blue2)",
        surface:"var(--surface)", bg:"var(--bg)", bg2:"var(--bg2)", bg3:"var(--bg3)",
        brd:"var(--border)", brd2:"var(--border2)",
        t1:"var(--txt1)", t2:"var(--txt2)", t3:"var(--txt3)",
        ok:"var(--ok)", err:"var(--err)",
        /* legacy */
        primary:"var(--teal)", "primary-light":"var(--teal-soft)", "primary-dark":"var(--teal)",
        secondary:"var(--txt1)", accent:"var(--teal2)",
        "text-primary":"var(--txt1)", "text-secondary":"var(--txt2)", "text-muted":"var(--txt3)",
        "surface-2":"var(--bg2)", "surface-3":"var(--bg3)", "border-dark":"var(--border2)",
        warning:"var(--warn)", success:"var(--ok)", danger:"var(--err)",
      },
      fontFamily: { sans:["Tajawal","sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
