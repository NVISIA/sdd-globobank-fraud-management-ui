/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // GloboBank Design System tokens will be configured here
            colors: {
                // Placeholder for GloboBank brand colors
                primary: {
                    50: '#f0f9ff',
                    500: '#3b82f6',
                    900: '#1e3a8a',
                },
                danger: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    900: '#7f1d1d',
                },
                success: {
                    50: '#f0fdf4',
                    500: '#22c55e',
                    900: '#14532d',
                },
            },
        },
    },
    plugins: [],
}