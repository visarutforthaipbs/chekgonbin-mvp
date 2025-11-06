// theme/theme.js
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  cssVarsRoot: ":where(:root, :host)",
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f4f8" },
          100: { value: "#c0e3ed" },
          200: { value: "#96d0e1" },
          300: { value: "#6cbdd5" },
          400: { value: "#4daecc" },
          500: { value: "#227e9e" },
          600: { value: "#1e7290" },
          700: { value: "#196380" },
          800: { value: "#145571" },
          900: { value: "#0d3e54" },
        },
        danger: {
          50: { value: "#fdeeed" },
          100: { value: "#f9d0cc" },
          200: { value: "#f5b0a9" },
          300: { value: "#f19086" },
          400: { value: "#ed706c" },
          500: { value: "#e5472e" },
          600: { value: "#d94029" },
          700: { value: "#c93823" },
          800: { value: "#b9301d" },
          900: { value: "#9f2212" },
        },
      },
      fonts: {
        body: { value: '"DB Helvethaica X", Arial, Helvetica, sans-serif' },
        heading: { value: '"DB Helvethaica X", Arial, Helvetica, sans-serif' },
      },
    },
    semanticTokens: {
      colors: {
        "chakra-body-bg": { value: "#ffffff" },
        "chakra-body-text": { value: "#171717" },
      },
    },
  },
  globalCss: {
    "html, body": {
      fontSize: "16px",
      lineHeight: "1.6",
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
