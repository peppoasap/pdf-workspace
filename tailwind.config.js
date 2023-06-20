module.exports = {
  prefix: 'pdf-editor-',
  important: true,
  purge: {
    enabled: true,
    content: [
      './projects//*.css',
      './projects//.tsx',
      './projects/**/.js',
      './projects/**/*.html'
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
