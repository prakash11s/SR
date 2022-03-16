 Cypress.Commands.add('logInBypass', () => {
   window.localStorage.setItem('token', Cypress.env("TOKEN"));
   cy.visit('/support/orders')
   cy.title().should('eq', 'ServiceRight - Admin Dashboard')
});