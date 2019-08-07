/* eslint-disable import/no-extraneous-dependencies */
// See https://open-wc.org/testing/testing-karma-bs.html
const merge = require('webpack-merge');
const bsSettings = require('@open-wc/testing-karma-bs/bs-settings.js');
const createBaseConfig = require('./karma.owc.conf.js');

module.exports = config => {
  config.set(
    merge(bsSettings(config), createBaseConfig(config), {
      browserStack: {
        // project: 'BS worker project name',
      },
    }),
  );

  return config;
};
