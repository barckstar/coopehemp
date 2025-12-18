/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'coope-green': {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c5eed2',
                    300: '#99deaf',
                    400: '#66c584',
                    500: '#42a862',
                    600: '#2f884a',
                    700: '#276d3d',
                    800: '#235633',
                    900: '#1e472d',
                    950: '#0d2716',
                },
                'coope-earth': {
                    50: '#fbf7f1',
                    100: '#f5eddd',
                    200: '#ebd9bc',
                    300: '#dec092',
                    400: '#d1a36a',
                    500: '#c7884a',
                    600: '#ba6e3e',
                    700: '#9b5634',
                    800: '#7f4530',
                    900: '#67392a',
                    950: '#371c14',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
