/* Copyright (c) 2023 Coderich LLC. All Rights Reserved. */

module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
        // browsers: ['last 2 versions', 'safari >= 7'],
      },
    }],
  ],
  ignore: [
    '**/__mocks__/**',
  ],
  plugins: ['@babel/plugin-transform-modules-commonjs'],
};
