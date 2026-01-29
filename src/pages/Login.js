import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Typography, Box } from '@mui/material';
import AuthForm from '../components/forms/AuthForm';
var Login = function () {
    return (_jsx(Container, { maxWidth: "sm", children: _jsxs(Box, { sx: {
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }, children: [_jsx(Typography, { component: "h1", variant: "h4", sx: {
                        mb: 4,
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #4a90e2 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }, children: "2DU Task Manager" }), _jsx(AuthForm, {})] }) }));
};
export default Login;
