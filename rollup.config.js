import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/main.ts",
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [typescript(), terser()],
};

export default config;
