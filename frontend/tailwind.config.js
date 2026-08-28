/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tycoon: {
          yellow: "#FFDE4D",
          sky: "#A0DEFF",
          purple: "#6C5CE7",
          purpleDark: "#5F27CD",
          pink: "#FF7675",
          green: "#00E676",
          orange: "#FF9F43",
          road: "#4A4D52",
          asphalt: "#343A40"
        }
      },
      fontFamily: {
        sans: ['Fredoka', 'Outfit', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
        display: ['Fredoka', 'sans-serif']
      },
      boxShadow: {
        pop: '4px 4px 0px #000',
        'pop-lg': '6px 6px 0px #000',
        'pop-xl': '8px 8px 0px #000',
        'pop-sm': '2px 2px 0px #000',
        'pop-inner': 'inset 3px 3px 0px rgba(0,0,0,0.2)'
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px'
      },
      animation: {
        'drive-in': 'driveIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'drive-out': 'driveOut 0.7s ease-in forwards',
        'shake': 'shake 0.4s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        driveIn: {
          '0%': { transform: 'translateX(-400px) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' }
        },
        driveOut: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateX(650px) scale(0.6)', opacity: '0' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-10px)' },
          '40%, 80%': { transform: 'translateX(10px)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        }
      }
    },
  },
  plugins: [],
}
