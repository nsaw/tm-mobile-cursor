module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'react' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          'root': ['./'],
          'alias': {
            '@legacy': './src-reference',
            '@legacy/*': './src-reference/*'
          }
        }
      ],
    ],
    env: {
      test: {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    },
  };
}; 