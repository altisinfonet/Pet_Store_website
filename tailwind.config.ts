import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // "./pages/**/*.{js,ts,jsx,tsx}",
    // "./components/**/*.{js,ts,jsx,tsx}",
    "./src/Admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: false,
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        desktophd: '1920px',
        tabView: '769px',
      },
      boxShadow: {
        'ppa-6xl': '0px 0px 6px 0px rgba(0,0,0,0.5)',
        'ppa-8xl': '0px 0px 8px 0px rgba(0,0,0,0.25);'
      },
      colors: {
        'offWhite-01': '#f0f0f1',
        'offWhite-02': '#dddddd',
        'offWhite-03': '#f6f7f7',
        'offWhite-04': '#eeeeee',
        'linkBlue-01': "#2271b1",
        'linkBlue-02': "#0000EE",
        "color-pink-1": "#d8428c",
        "color-pink-2": "#c22674",
        "color-pink-3": "#e4509e",
        "color-gray-1": "#c9c9c9",
        'white': '#ffffff',
        'black': '#000000',
        'pending': "#FE9705",
        'sucess': "#3AC430",
        'failed': "#D11313",
        'onHold': "#ffc000",
        'completed': "#00FF00",
        'boderclr': "#e0e0e0",
        'terms-01': "#746AB050",
        'terms-02': "#746AB0"
      }
    },
  },
  plugins: [],
};
export default config;
