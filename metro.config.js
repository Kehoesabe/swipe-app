const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add path mapping for @/ imports
config.resolver.alias = {
  '@': './src',
};

module.exports = config;








