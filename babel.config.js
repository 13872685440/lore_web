module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry'
      }
    ]
  ],
  env: {
    development: {
      plugins: ['dynamic-import-node']
    }
  },
}