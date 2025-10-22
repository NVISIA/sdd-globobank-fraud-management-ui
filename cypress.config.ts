import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: 'cypress/support/e2e.ts',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        viewportWidth: 1280,
        viewportHeight: 720,
        video: true,
        screenshotOnRunFailure: true,
        chromeWebSecurity: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
        supportFile: 'cypress/support/component.ts',
        specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    },
    env: {
        // Environment variables for testing
        API_BASE_URL: 'http://localhost:8080',
    },
});