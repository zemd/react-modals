import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  sourcemap: false,
  clean: true,
  dts: true,
  format: ["esm"],
  banner: '"use client";',
  tsconfig: "tsconfig.build.json",
  deps: {
    onlyBundle: [],
    neverBundle: ["react"],
  },
  target: "es2020",
});
