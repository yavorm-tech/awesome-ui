/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  // Lets the class sorter know the token utilities (needs `pnpm build` for tokens/theme.css).
  tailwindStylesheet: './apps/storybook/.storybook/preview.css',
  tailwindFunctions: ['tv', 'cn'],
};
