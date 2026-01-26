import React from 'react';
import DateRangePicker from '../../src/components/DateRangePicker';

describe('DateRangePicker Component', () => {
  const mockOnDateRangeChange = cy.stub().as('onDateRangeChange');
  const defaultStartDate = new Date('2023-12-01');
  const defaultEndDate = new Date('2023-12-31');

  beforeEach(() => {
    cy.mount(
      <DateRangePicker
        startDate={defaultStartDate}
        endDate={defaultEndDate}
        onDateRangeChange={mockOnDateRangeChange}
      />
    );
  });

  it('renders date range picker correctly', () => {
    // Check if date inputs are rendered
    cy.get('[data-testid="start-date-input"]').should('be.visible');
    cy.get('[data-testid="end-date-input"]').should('be.visible');
    
    // Check if default dates are displayed
    cy.get('[data-testid="start-date-input"]').should('have.value', '2023-12-01');
    cy.get('[data-testid="end-date-input"]').should('have.value', '2023-12-31');
  });

  it('handles start date change', () => {
    const newStartDate = '2023-12-15';
    
    // Change start date
    cy.get('[data-testid="start-date-input"]')
      .clear()
      .type(newStartDate);
    
    // Verify onDateRangeChange was called with updated dates
    cy.get('@onDateRangeChange').should('have.been.calledWith', {
      startDate: new Date(newStartDate),
      endDate: defaultEndDate
    });
  });

  it('handles end date change', () => {
    const newEndDate = '2024-01-15';
    
    // Change end date
    cy.get('[data-testid="end-date-input"]')
      .clear()
      .type(newEndDate);
    
    // Verify onDateRangeChange was called with updated dates
    cy.get('@onDateRangeChange').should('have.been.calledWith', {
      startDate: defaultStartDate,
      endDate: new Date(newEndDate)
    });
  });

  it('validates date range', () => {
    // Try to set end date before start date
    cy.get('[data-testid="end-date-input"]')
      .clear()
      .type('2023-11-30');
    
    // Check for error message
    cy.contains('End date must be after start date').should('be.visible');
    
    // Verify onDateRangeChange was not called
    cy.get('@onDateRangeChange').should('not.have.been.called');
  });

  it('handles preset date ranges', () => {
    // Click on "Last 7 days" preset
    cy.get('[data-testid="preset-last-7-days"]').click();
    
    // Verify onDateRangeChange was called with correct date range
    cy.get('@onDateRangeChange').should('have.been.called');
    
    // Verify date inputs are updated
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    cy.get('[data-testid="start-date-input"]')
      .should('have.value', sevenDaysAgo.toISOString().split('T')[0]);
    cy.get('[data-testid="end-date-input"]')
      .should('have.value', today.toISOString().split('T')[0]);
  });

  it('handles custom date range input', () => {
    // Click on custom range option
    cy.get('[data-testid="custom-range"]').click();
    
    // Verify date inputs are enabled
    cy.get('[data-testid="start-date-input"]').should('not.be.disabled');
    cy.get('[data-testid="end-date-input"]').should('not.be.disabled');
  });

  it('formats dates correctly', () => {
    // Change dates to different formats
    cy.get('[data-testid="start-date-input"]')
      .clear()
      .type('12/01/2023');
    cy.get('[data-testid="end-date-input"]')
      .clear()
      .type('12/31/2023');
    
    // Verify dates are normalized to ISO format
    cy.get('[data-testid="start-date-input"]').should('have.value', '2023-12-01');
    cy.get('[data-testid="end-date-input"]').should('have.value', '2023-12-31');
  });

  it('handles keyboard navigation', () => {
    // Focus start date input
    cy.get('[data-testid="start-date-input"]').focus();
    
    // Press Tab to move to end date input
    cy.get('[data-testid="start-date-input"]').realPress('Tab');
    
    // Verify end date input is focused
    cy.get('[data-testid="end-date-input"]').should('be.focused');
  });
}); 