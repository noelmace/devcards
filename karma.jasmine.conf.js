/*
 * derivative of @open-wc/testing-karma create-default-config.js (licensed under MIT)
 * https://github.com/open-wc/open-wc/blob/f21d435/packages/testing-karma/src/create-default-config.js
 */

function getCompatibility() {
  if (process.argv.find(arg => arg.includes('--legacy'))) {
    /* eslint-disable-next-line no-console */
    console.warn(`testing-karma --legacy flag has been renamed to --compatibility`);
    return 'all';
  }

  const indexOf = process.argv.indexOf('--compatibility');
  return indexOf === -1 ? 'none' : process.argv[indexOf + 1];
}

const compatibility = getCompatibility();
const coverage = process.argv.find(arg => arg.includes('--coverage'));

module.exports = config => {
  config.set({
    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },

    plugins: [
      // resolve plugins relative to this config so that they don't always need to exist
      // at the top level
      require.resolve('@open-wc/karma-esm'),
      require.resolve('karma-source-map-support'),
      require.resolve('karma-coverage-istanbul-reporter'),
      require.resolve('karma-chrome-launcher'),
      require.resolve('karma-jasmine'),
      require.resolve('karma-spec-reporter'),

      // fallback: resolve any karma- plugins
      'karma-*',
    ],

    frameworks: ['esm', 'source-map-support', 'jasmine'],

    esm: {
      coverage,
      compatibility,
      babelModernExclude: ['**/node_modules/jasmine/**/*', '**/node_modules/karma-jasmine/**/*'],
      polyfills: {
        webcomponents: true,
        fetch: true,
      },
      nodeResolve: true,
    },

    reporters: coverage ? ['spec', 'coverage-istanbul'] : ['spec'],

    restartOnFileChange: true,

    colors: true,

    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // ## code coverage config
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: 'coverage',
      combineBrowserReports: true,
      skipFilesWithNoCoverage: false,
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },

    files: [
      // runs all files ending with .test in the src folder,
      // can be overwritten by passing a --grep flag. examples:
      //
      // npm run test -- --grep test/foo/bar.test.js
      // npm run test -- --grep test/bar/*
      { pattern: config.grep ? config.grep : 'test/jasmine/**/*.test.js', type: 'module' },
    ],

    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
  });
};
