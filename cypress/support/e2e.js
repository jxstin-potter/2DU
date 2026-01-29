"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import commands.js using ES2015 syntax:
require("./commands");
// Alternatively you can use CommonJS syntax:
// require('./commands')
// Hide fetch/XHR requests from command log
var app = window.top;
if (app) {
    app.console.log = function () { };
}
// Prevent uncaught exception from failing tests
Cypress.on('uncaught:exception', function (err, runnable) {
    // returning false here prevents Cypress from failing the test
    return false;
});
// Add custom command to check accessibility
require("cypress-axe");
// Add custom command to check performance
Cypress.Commands.add('checkPerformance', function () {
    cy.window().then(function (win) {
        var _a, _b;
        var performance = win.performance;
        var navigation = performance.getEntriesByType('navigation')[0];
        var paint = performance.getEntriesByType('paint');
        // Log performance metrics
        cy.log('Page Load Time:', navigation.loadEventEnd - navigation.navigationStart);
        cy.log('First Paint:', (_a = paint.find(function (p) { return p.name === 'first-paint'; })) === null || _a === void 0 ? void 0 : _a.startTime);
        cy.log('First Contentful Paint:', (_b = paint.find(function (p) { return p.name === 'first-contentful-paint'; })) === null || _b === void 0 ? void 0 : _b.startTime);
    });
});
