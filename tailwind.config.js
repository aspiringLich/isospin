/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {},
	},
	plugins: [
		require("postcss-nesting"),
		require("@tailwindcss/typography"),
		require("tailwindcss"),
		require("autoprefixer"),
	],
};
