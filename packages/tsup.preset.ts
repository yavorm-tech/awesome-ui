import { defineConfig, type Options } from 'tsup';

interface PresetOptions {
  /** Prepend `"use client"` so the bundle works in React Server Component frameworks. */
  client?: boolean;
  entry?: Options['entry'];
}

/** Shared build preset: ESM + CJS + type declarations for every package. */
export function createPackageConfig({
  client = true,
  entry = ['src/index.ts'],
}: PresetOptions = {}) {
  return defineConfig({
    entry,
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2022',
    splitting: false,
    external: ['react', 'react-dom', 'react/jsx-runtime', /^@awesome-ui\//],
    ...(client ? { banner: { js: '"use client";' } } : {}),
  });
}
