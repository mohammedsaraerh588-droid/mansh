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
        navy:"var(--navy)", navy2:"var(--navy2)", navy3:"var(--navy3)",
        blue:"var(--blue)", blue2:"var(--blue2)", blue3:"var(--blue3)",
        mint:"var(--mint)", mint2:"var(--mint2)",
        surface:"var(--surface)", bg:"var(--bg)", bg2:"var(--bg2)", bg3:"var(--bg3)",
        brd:"var(--border)", brd2:"var(--border2)",
        t1:"var(--txt1)", t2:"var(--txt2)", t3:"var(--txt3)",
        ok:"var(--ok)", err:"var(--err)",
        /* legacy */
        teal:"var(--blue)", teal2:"var(--blue2)",
        primary:"var(--navy)", "primary-light":"var(--blue-soft)", "primary-dark":"var(--navy)",
        secondary:"var(--navy2)", accent:"var(--blue2)",
        gold:"var(--blue)",
        "text-primary":"var(--txt1)", "text-secondary":"var(--txt2)", "text-muted":"var(--txt3)",
        "surface-2":"var(--bg2)", "surface-3":"var(--bg3)", "border-dark":"var(--border2)",
        warning:"var(--warn)", success:"var(--ok)", danger:"var(--err)", error:"var(--err)",
      },
      fontFamily: { sans:["Tajawal","sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
