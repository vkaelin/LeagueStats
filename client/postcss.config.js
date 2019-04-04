const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const purgecss = require("@fullhuman/postcss-purgecss");
const postcssImport = require('postcss-import')

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  plugins: [
    postcssImport,
    tailwindcss('./tailwind.config.js'),

    // --- !!! purgecss not working !!! ---

    // purgecss({
    //   content: ['./src/**/*.vue'],
    //   whitelist: ['html', 'body'],
    //   extractors: [
    //     {
    //       extractor: TailwindExtractor,

    //       extensions: ['html', 'js', 'vue']
    //     }
    //   ]
    // }),
    autoprefixer
  ]
}
