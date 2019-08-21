/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('webpack-merge');

const indexOf = process.argv.indexOf('--timeout');
const timeout = indexOf === -1 ? '2000' : process.argv[indexOf + 1];

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the src folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'test/open-wc/**/*.test.js', type: 'module' }
      ],
      esm: {
        nodeResolve: true
      },
      client: {
        mocha: {
          timeout
        }
      }
    })
  );
  return config;
};
