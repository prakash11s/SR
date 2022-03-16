Cypress.Commands.add('CallForward', () => {
   window.localStorage.setItem('token', Cypress.env("TOKEN"));
    cy.visit('');
    cy.url().should('eq', '')
    cy.title().should('eq', '')
 });

Cypress.Commands.add('CallWhisper', () => {
  window.localStorage.setItem('token', Cypress.env("TOKEN"));
   cy.visit('');
   cy.url().should('eq', '')
   cy.title().should('eq', '')
});

Cypress.Commands.add('SigninQueue', () => {
  window.localStorage.setItem('token', Cypress.env("TOKEN"));
   cy.visit('');
   cy.url().should('eq', '')
   cy.title().should('eq', '')
});

Cypress.Commands.add('SignoutQueue', () => {
  window.localStorage.setItem('token', Cypress.env("TOKEN"));
   cy.visit('');
   cy.url().should('eq', '')
   cy.title().should('eq', '')
});

Cypress.Commands.add('DialMultipleNumbers', () => {
  window.localStorage.setItem('token', Cypress.env("TOKEN"));
   cy.visit('');
   cy.url().should('eq', '')
   cy.title().should('eq', '')
});

Cypress.Commands.add('SwitchExtension', () => {
  window.localStorage.setItem('token', Cypress.env("TOKEN"));
   cy.visit('');
   cy.url().should('eq', '')
   cy.title().should('eq', '')
});