import React from 'react';
import TagList from '../../src/components/TagList';

describe('TagList Component', () => {
  const mockTags = ['Work', 'Personal', 'Shopping', 'Health'];
  const mockSelectedTags = ['Work', 'Personal'];
  const mockOnTagSelect = cy.stub().as('onTagSelect');
  const mockOnTagCreate = cy.stub().as('onTagCreate');
  const mockOnTagDelete = cy.stub().as('onTagDelete');

  beforeEach(() => {
    cy.mount(
      <TagList
        tags={mockTags}
        selectedTags={mockSelectedTags}
        onTagSelect={mockOnTagSelect}
        onTagCreate={mockOnTagCreate}
        onTagDelete={mockOnTagDelete}
      />
    );
  });

  it('renders all tags correctly', () => {
    // Check if all tags are rendered
    mockTags.forEach(tag => {
      cy.contains(tag).should('be.visible');
    });
  });

  it('highlights selected tags', () => {
    // Check if selected tags have the correct styling
    mockSelectedTags.forEach(tag => {
      cy.get(`[data-testid="tag-${tag}"]`).should('have.class', 'selected');
    });

    // Check if unselected tags don't have the selected styling
    const unselectedTags = mockTags.filter(tag => !mockSelectedTags.includes(tag));
    unselectedTags.forEach(tag => {
      cy.get(`[data-testid="tag-${tag}"]`).should('not.have.class', 'selected');
    });
  });

  it('handles tag selection', () => {
    // Click on an unselected tag
    cy.get('[data-testid="tag-Shopping"]').click();
    
    // Verify onTagSelect was called with the correct tag
    cy.get('@onTagSelect').should('have.been.calledWith', 'Shopping');
  });

  it('handles tag creation', () => {
    const newTag = 'NewTag';
    
    // Type new tag name and press enter
    cy.get('[data-testid="tag-input"]')
      .type(`${newTag}{enter}`);
    
    // Verify onTagCreate was called with the new tag
    cy.get('@onTagCreate').should('have.been.calledWith', newTag);
  });

  it('handles tag deletion', () => {
    // Click delete button on a tag
    cy.get('[data-testid="tag-Work"]')
      .find('[data-testid="delete-tag"]')
      .click();
    
    // Verify onTagDelete was called with the correct tag
    cy.get('@onTagDelete').should('have.been.calledWith', 'Work');
  });

  it('validates new tag input', () => {
    // Try to create an empty tag
    cy.get('[data-testid="tag-input"]')
      .type('{enter}');
    
    // Verify onTagCreate was not called
    cy.get('@onTagCreate').should('not.have.been.called');
    
    // Check for error message
    cy.contains('Tag name cannot be empty').should('be.visible');
  });

  it('prevents duplicate tag creation', () => {
    // Try to create an existing tag
    cy.get('[data-testid="tag-input"]')
      .type('Work{enter}');
    
    // Verify onTagCreate was not called
    cy.get('@onTagCreate').should('not.have.been.called');
    
    // Check for error message
    cy.contains('Tag already exists').should('be.visible');
  });

  it('handles tag search/filter', () => {
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