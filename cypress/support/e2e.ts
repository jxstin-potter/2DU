// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (app) {
  app.console.log = () => {};
}

// Prevent uncaught exception from failing tests
Cypress.on('uncaught:exception', (_err, _runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Add custom command to check accessibility
import 'cypress-axe';

// Add custom command to check performance
Cypress.Commands.add('checkPerformance', () => {
  cy.window().then((win) => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    // Log performance metrics
    cy.log('Page Load Time:', navigation.loadEventEnd - navigation.navigationStart);
    cy.log('First Paint:', paint.find(p => p.name === 'first-paint')?.startTime);
    cy.log('First Contentful Paint:', paint.find(p => p.name === 'first-contentful-paint')?.startTime);
  });
}); 