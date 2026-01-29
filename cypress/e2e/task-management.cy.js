"use strict";
describe('Task Management', function () {
    beforeEach(function () {
        // Login before each test
        cy.login('test@example.com', 'password123');
    });
    it('should create a new task', function () {
        // Create a new task
        cy.createTask('Test Task', '2023-12-31');
        // Verify task was created
        cy.contains('Test Task').should('be.visible');
        cy.contains('Dec 31, 2023').should('be.visible');
    });
    it('should complete a task', function () {
        // Create a task first
        cy.createTask('Task to Complete');
        // Find and complete the task
        cy.contains('Task to Complete')
            .parent()
            .parent()
            .completeTask();
        // Verify task is marked as completed
        cy.contains('Task to Complete')
            .parent()
            .parent()
            .find('[data-testid="task-checkbox"]')
            .should('be.checked');
    });
    it('should filter tasks by tag', function () {
        // Create tasks with different tags
        cy.createTask('Work Task');
        cy.get('[data-testid="task-tag-select"]').click();
        cy.get('[data-testid="tag-Work"]').click();
        cy.get('[data-testid="save-task-button"]').click();
        cy.createTask('Personal Task');
        cy.get('[data-testid="task-tag-select"]').click();
        cy.get('[data-testid="tag-Personal"]').click();
        cy.get('[data-testid="save-task-button"]').click();
        // Navigate to tags view
        cy.get('[data-testid="tags-nav-item"]').click();
        // Click on Work tag
        cy.contains('Work').click();
        // Verify only work tasks are shown
        cy.contains('Work Task').should('be.visible');
        cy.contains('Personal Task').should('not.exist');
    });
    it('should search for tasks', function () {
        // Create tasks with different titles
        cy.createTask('Important Meeting');
        cy.createTask('Buy groceries');
        // Search for a task
        cy.get('[data-testid="search-input"]').type('Meeting');
        // Verify search results
        cy.contains('Important Meeting').should('be.visible');
        cy.contains('Buy groceries').should('not.exist');
    });
    it('should check accessibility', function () {
        // Visit the main page
        cy.visit('/');
        // Check accessibility
        cy.injectAxe();
        cy.checkA11y();
    });
    it('should check performance', function () {
        // Visit the main page
        cy.visit('/');
        // Check performance metrics
        cy.checkPerformance();
    });
});
