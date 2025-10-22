// ***********************************************
// This example commands.ts file shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

// Custom command for fraud analyst login
Cypress.Commands.add('loginAsFraudAnalyst', (email: string, password: string) => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();

    // Wait for successful login redirect
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
});

// Custom command for accessibility testing
Cypress.Commands.add('checkA11y', () => {
    // Basic accessibility check without cypress-axe for now
    // TODO: Implement full a11y testing with cypress-axe once properly configured
    cy.get('body').should('be.visible');

    // Check for basic accessibility attributes
    cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
    });

    // Check for proper heading structure
    cy.get('h1, h2, h3, h4, h5, h6').should('exist');
});

// Custom command to wait for API responses
Cypress.Commands.add('waitForApiResponse', (alias: string) => {
    cy.wait(alias).then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201, 204]);
    });
});

// Declare the custom commands for TypeScript
export { };

declare global {
    namespace Cypress {
        interface Chainable {
            loginAsFraudAnalyst(email: string, password: string): Chainable;
            checkA11y(): Chainable;
            waitForApiResponse(alias: string): Chainable;
        }
    }
}