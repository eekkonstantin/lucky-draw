module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry',
      polyfills: [
        'es6.promise', 'es7.promise.finally',
        'es6.symbol',
        // 'es6.array.iterator', 'es6.array.from', 'es6.array.includes',
        'es6.object.assign'
      ]
    }]
  ],
  plugins: [
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
