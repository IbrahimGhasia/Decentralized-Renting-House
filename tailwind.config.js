/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./node_modules/flowbite/**/*.js",
        "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "TEAL-BLUE": "#388087",
                "MOONSTONE-BLUE": "#6FB3B8",
                "POWDER-BLUE": "#BADFE7",
                "MAGIC-MINT": "#C2EDCE",
                "WHITE-SMOKE": "#F6F6F2",

                purple: "#9b5de5",
                pink: "#f15bb5",
                yellow: "#fee440",
                skyblue: "#00bbf9",
                blue: "#118ab2",
                cyan: "#00f5d4",
                orange: "#ff7d00",
            },
        },
    },
    plugins: [require("flowbite/plugin")],
}
