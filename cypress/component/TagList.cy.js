"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var TagList_1 = __importDefault(require("../../src/components/TagList"));
describe('TagList Component', function () {
    var mockTags = ['Work', 'Personal', 'Shopping', 'Health'];
    var mockSelectedTags = ['Work', 'Personal'];
    var mockOnTagSelect = cy.stub().as('onTagSelect');
    var mockOnTagCreate = cy.stub().as('onTagCreate');
    var mockOnTagDelete = cy.stub().as('onTagDelete');
    beforeEach(function () {
        cy.mount((0, jsx_runtime_1.jsx)(TagList_1.default, { tags: mockTags, selectedTags: mockSelectedTags, onTagSelect: mockOnTagSelect, onTagCreate: mockOnTagCreate, onTagDelete: mockOnTagDelete }));
    });
    it('renders all tags correctly', function () {
        // Check if all tags are rendered
        mockTags.forEach(function (tag) {
            cy.contains(tag).should('be.visible');
        });
    });
    it('highlights selected tags', function () {
        // Check if selected tags have the correct styling
        mockSelectedTags.forEach(function (tag) {
            cy.get("[data-testid=\"tag-".concat(tag, "\"]")).should('have.class', 'selected');
        });
        // Check if unselected tags don't have the selected styling
        var unselectedTags = mockTags.filter(function (tag) { return !mockSelectedTags.includes(tag); });
        unselectedTags.forEach(function (tag) {
            cy.get("[data-testid=\"tag-".concat(tag, "\"]")).should('not.have.class', 'selected');
        });
    });
    it('handles tag selection', function () {
        // Click on an unselected tag
        cy.get('[data-testid="tag-Shopping"]').click();
        // Verify onTagSelect was called with the correct tag
        cy.get('@onTagSelect').should('have.been.calledWith(', Shopping, '););
    });
    it('handles tag creation', function () {
        var newTag = 'NewTag';
        // Type new tag name and press enter
        cy.get('[data-testid="tag-input"]')
            .type("".concat(newTag, "{enter}"));
        // Verify onTagCreate was called with the new tag
        cy.get('@onTagCreate').should('have.been.calledWith(newTag););
    });
    it('handles tag deletion', function () {
        // Click delete button on a tag
        cy.get('[data-testid="tag-Work"]')
            .find('[data-testid="delete-tag"]')
            .click();
        // Verify onTagDelete was called with the correct tag
        cy.get('@onTagDelete').should('have.been.calledWith(', Work, '););
    });
    it('validates new tag input', function () {
        // Try to create an empty tag
        cy.get('[data-testid="tag-input"]')
            .type('{enter}');
        // Verify onTagCreate was not called
        cy.get('@onTagCreate').should('not.have.been.called');
        // Check for error message
        cy.contains('Tag name cannot be empty').should('be.visible');
    });
    it('prevents duplicate tag creation', function () {
        // Try to create an existing tag
        cy.get('[data-testid="tag-input"]')
            .type('Work{enter}');
        // Verify onTagCreate was not called
        cy.get('@onTagCreate').should('not.have.been.called');
        // Check for error message
        cy.contains('Tag already exists').should('be.visible');
    });
    it('handles tag search/filter', function () {
        // Type in search input
        cy.get('[data-testid="tag-search"]')
            .type('Work');
        // Verify only matching tags are visible
        cy.contains('Work').should('be.visible');
        cy.contains('Personal').should('not.be.visible');
        cy.contains('Shopping').should('not.be.visible');
        cy.contains('Health').should('not.be.visible');
    });
});
