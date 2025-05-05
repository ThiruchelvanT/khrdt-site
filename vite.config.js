export default {
  darkMode: 'class', // <- add this
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  build: {
    minify: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'react-router-dom'],
        }
      }
    },
    sourcemap: false
  },
};

