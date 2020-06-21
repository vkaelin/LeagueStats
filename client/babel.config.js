module.exports = {
  presets: [
    '@vue/app'
  ],
  env: {
    production: {
        plugins: ['transform-remove-console']
    }
 }
}
