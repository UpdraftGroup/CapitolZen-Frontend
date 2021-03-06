const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    'ember-service-worker': {
      versionStrategy: 'every-build'
    },
    'esw-index': {
      version: '1'
    },
    'asset-cache': {
      include: ['assets/**/*', 'fonts/font-awesome.*'],
      version: '2'
    },
    'ember-bootstrap': {
      importBootstrapCSS: false,
      importBootstrapTheme: false,
      bootstrapVersion: 4,
      importBootstrapFont: false
    },
    sourcemaps: {
      enabled: EmberApp.env() !== 'production'
    },
    'ember-cli-babel': {
      // disable comments
      includePolyfill: true
    },
    fingerprint: {
      enabled: EmberApp.env() === 'production' || EmberApp.env() === 'qa'
    },
    'ember-font-awesome': {
      // Keep false... doesn't work.
      removeUnusedIcons: false
    },
    'ember-power-select': {
      theme: 'bootstrap'
    },
    sassOptions: {
      includePaths: ['vendor', 'node_modules/bootstrap/scss']
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
