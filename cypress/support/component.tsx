import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { mount } from 'cypress/react18';
import 'cypress-real-events/support';
import { AuthProvider } from '../../src/contexts/AuthContext';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#5B7A9E' },
  },
});

Cypress.Commands.add('mount', (component, options = {}) => {
  return mount(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>{component}</AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>,
    options
  );
});