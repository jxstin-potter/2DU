"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var DateRangePicker_1 = __importDefault(require("../../src/components/DateRangePicker"));
describe('DateRangePicker Component', function () {
    var mockOnDateRangeChange = cy.stub().as('onDateRangeChange');
    var defaultStartDate = new Date('2023-12-01');
    var defaultEndDate = new Date('2023-12-31');
    beforeEach(function () {
        cy.mount((0, jsx_runtime_1.jsx)(DateRangePicker_1.default, { startDate: defaultStartDate, endDate: defaultEndDate, onDateRangeChange: mockOnDateRangeChange }));
    });
    it('renders date range picker correctly', function () {
        // Check if date inputs are rendered
        cy.get('[data-testid="start-date-input"]').should('be.visible');
        cy.get('[data-testid="end-date-input"]').should('be.visible');
        // Check if default dates are displayed
        cy.get('[data-testid="start-date-input"]').should('have.value', '2023-12-01');
        cy.get('[data-testid="end-date-input"]').should('have.value', '2023-12-31');
    });
    it('handles start date change', function () {
        var newStartDate = '2023-12-15';
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
    it('handles end date change', function () {
        var newEndDate = '2024-01-15';
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
    it('validates date range', function () {
        // Try to set end date before start date
        cy.get('[data-testid="end-date-input"]')
            .clear()
            .type('2023-11-30');
        // Check for error message
        cy.contains('End date must be after start date').should('be.visible');
        // Verify onDateRangeChange was not called
        cy.get('@onDateRangeChange').should('not.have.been.called');
    });
    it('handles preset date ranges', function () {
        // Click on "Last 7 days" preset
        cy.get('[data-testid="preset-last-7-days"]').click();
        // Verify onDateRangeChange was called with correct date range
        cy.get('@onDateRangeChange').should('have.been.called');
        // Verify date inputs are updated
        var today = new Date();
        var sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        cy.get('[data-testid="start-date-input"]')
            .should('have.value', sevenDaysAgo.toISOString().split('T')[0]);
        cy.get('[data-testid="end-date-input"]')
            .should('have.value', today.toISOString().split('T')[0]);
    });
    it('handles custom date range input', function () {
        // Click on custom range option
        cy.get('[data-testid="custom-range"]').click();
        // Verify date inputs are enabled
        cy.get('[data-testid="start-date-input"]').should('not.be.disabled');
        cy.get('[data-testid="end-date-input"]').should('not.be.disabled');
    });
    it('formats dates correctly', function () {
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
    it('handles keyboard navigation', function () {
        // Focus start date input
        cy.get('[data-testid="start-date-input"]').focus();
        // Press Tab to move to end date input
        cy.get('[data-testid="start-date-input"]').realPress('Tab');
        // Verify end date input is focused
        cy.get('[data-testid="end-date-input"]').should('be.focused');
    });
});
