/* eslint-env es6 */

/** @type {import("prettier").Config} */
const config = {
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: true,
  bracketSpacing: true,
  arrowParens: 'avoid',
  trailingComma: 'es5',
  bracketSameLine: true,
  endOfLine: 'lf',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
