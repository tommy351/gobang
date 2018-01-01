module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-mixins": {},
    "postcss-css-variables": {},
    "postcss-nested": {},
    "postcss-cssnext": {
      features: {
        customProperties: false,
        nesting: false
      }
    }
  }
};
