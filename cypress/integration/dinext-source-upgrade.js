describe('Insights selected-release regression', () => {
  let fixture
  before(() => {
    const password = Cypress.env('adminPassword')
    expect(password, 'isolated site admin password').to.be.a('string').and.not.be.empty
    cy.loginUpgrade('Administrator', password)
    cy.callUpgrade('insights.tests.dinext_upgrade.prepare').then((response) => {
      fixture = response.body.message
      cy.loginUpgrade(fixture.user, fixture.password)
    })
  })

  after(() => {
    cy.leaveUpgradeApp()
    cy.loginUpgrade('Administrator', Cypress.env('adminPassword'))
    cy.callUpgrade('insights.tests.dinext_upgrade.cleanup')
  })

  it('loads the upgraded application with its synthetic fixture', () => {
    cy.visit('/insights/workbook/' + encodeURIComponent(fixture.workbook))
    cy.contains(fixture.title).should('be.visible')
    cy.get('body').should('not.contain.text', 'Internal Server Error')
  })
})
