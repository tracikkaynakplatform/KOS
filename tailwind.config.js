/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/react-app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				bianca: {
					50: "#f7f8f0",
					100: "#fdfef9",
					200: "#ffffff",
					300: "#ffffff",
					400: "#fffffa",
					500: "#f3efe0",
					600: "#d5c6af",
					700: "#ac8b76",
					800: "#7b4740",
					900: "#44171f",
				},
				blackPanther: {
					50: "#dedcd8",
					100: "#cac9c9",
					200: "#a2a2a2",
					300: "#7e7e7e",
					400: "#5e5e5e",
					500: "#434242",
					600: "#2f292a",
					700: "#21181b",
					800: "#170d12",
					900: "#10060d",
				},
				blackOut: {
					50: "#d9d7d4",
					100: "#c0c0c0",
					200: "#8f8f8f",
					300: "#646464",
					400: "#3e3e3e",
					500: "#222222",
					600: "#100e0f",
					700: "#070506",
					800: "#040203",
					900: "#060205",
				},
				baltic: {
					50: "#cbecd5",
					100: "#b1e6cb",
					200: "#81d9c6",
					300: "#59cac7",
					400: "#39b2b8",
					500: "#22a39f",
					600: "#148a6a",
					700: "#0d6d2f",
					800: "#134d09",
					900: "#232c06",
				},
			},
		},
	},
	plugins: [],
};
