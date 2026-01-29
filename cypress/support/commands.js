"use strict";
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/cypress/add-commands");
require("cypress-real-events");
// -- This is a parent command --
Cypress.Commands.add('login', function (email, password) {
    cy.visit('/auth');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
});
// -- This is a child command --
Cypress.Commands.add('createTask', function (title, dueDate) {
    cy.get('[data-testid="add-task-button"]').click();
    cy.get('[data-testid="task-title-input"]').type(title);
    if (dueDate) {
        cy.get('[data-testid="task-due-date-input"]').type(dueDate);
    }
    cy.get('[data-testid="save-task-button"]').click();
});
// -- This is a dual command --
Cypress.Commands.add('completeTask', { prevSubject: 'element' }, function (subject) {
    cy.wrap(subject).find('[data-testid="task-checkbox"]').click();
});
