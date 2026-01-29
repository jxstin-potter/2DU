"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var styles_1 = require("@mui/material/styles");
// Create a default theme for testing
var theme = (0, styles_1.createTheme)({
    palette: {
        mode: 'light',
        primary: { main: '#4a90e2' },
    },
});
// Custom mount command that wraps components with providers
Cypress.Commands.add('mount', function (component, options) {
    if (options === void 0) { options = {}; }
    var wrappedComponent = theme = { theme: theme } >
        dateAdapter, AdapterDateFns = (void 0).AdapterDateFns;
     >
        { component: component }
        < /AuthProvider>
        < /LocalizationProvider>
        < /ThemeProvider>;
});
return (0, react18_1.mount)(wrappedComponent, options);
;
