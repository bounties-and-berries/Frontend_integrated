module.exports = function (api) {
  api.cache(true);
  
  const plugins = [];
  
  // Strip console logs from production bundles to enhance security and performance
  if (process.env.NODE_ENV === 'production' || process.env.BABEL_ENV === 'production') {
    plugins.push('transform-remove-console');
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: plugins
  };
};
