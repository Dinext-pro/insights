Cypress.Commands.add('loginUpgrade', (user, password) => {
  cy.request({ method: 'POST', url: '/api/method/login', body: { usr: user, pwd: password }, log: false })
  cy.request('/api/method/frappe.auth.get_logged_user').its('body.message').should('eq', user)
})

Cypress.Commands.add('callUpgrade', (method, args = {}) => {
  return cy.request({ url: '/api/method/insights.tests.dinext_upgrade.csrf', log: false }).then((response) => {
    return cy.request({
      method: 'POST', url: '/api/method/' + method, body: args, log: false,
      headers: { 'X-Frappe-CSRF-Token': response.body.message },
    })
  })
})

Cypress.Commands.add('leaveUpgradeApp', () => {
  cy.intercept('GET', '/__dinext_upgrade_blank', {
    statusCode: 200,
    headers: { 'content-type': 'text/html' },
    body: '<!doctype html><html><body>Upgrade test teardown</body></html>',
  })
  cy.visit('/__dinext_upgrade_blank')
})
