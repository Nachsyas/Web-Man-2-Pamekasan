/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Pengaturan Warna (Primary Emerald)
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Hijau Utama (Emerald)
          600: '#059669', // Hover
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Menimpa warna biru bawaan menjadi emerald
        blue: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
        }
      },
      // 2. Pengaturan Keyframes Animasi (Dipisah dengan benar)
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100px)' },
          '50%': { transform: 'translateY(100px)' },
        }
      },
      // 3. Pengaturan Custom Animation
      animation: {
        scan: 'scan 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}