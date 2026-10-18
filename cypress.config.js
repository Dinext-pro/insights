export default {
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 90000,
  video: false,
  viewportWidth: 1440,
  viewportHeight: 1000,
  e2e: {
    specPattern: 'cypress/integration/**/*.js',
    supportFile: 'cypress/support/e2e.js',
    includeShadowDom: true,
  },
}
