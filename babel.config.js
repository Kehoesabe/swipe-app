module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
    ],
    plugins: [],
    env: {
      test: {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          ['@babel/preset-typescript', { allowDeclareFields: true }],
        ],
        plugins: [
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      },
    },
  };
};
