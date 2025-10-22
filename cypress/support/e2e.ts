// ***********************************************************
// This example support/e2e.ts file is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add accessibility testing support
import 'cypress-axe';

// Custom commands for fraud management testing
declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to login as a fraud analyst
             * @example cy.loginAsFraudAnalyst('analyst@globobank.com', 'password')
             */
            loginAsFraudAnalyst(email: string, password: string): Chainable<Element>;

            /**
             * Custom command to check accessibility
             * @example cy.checkA11y()
             */
            checkA11y(): Chainable<Element>;

            /**
             * Custom command to wait for API response
             * @example cy.waitForApiResponse('@getFraudCases')
             */
            waitForApiResponse(alias: string): Chainable<Element>;
        }
    }
}