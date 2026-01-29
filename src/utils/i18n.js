import { format, formatDistance, formatRelative, parseISO } from 'date-fns';
import { enUS, es, fr, de, ja, zhCN } from 'date-fns/locale';
// Export supported languages with their names
export var supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
];
// Default language
export var DEFAULT_LANGUAGE = 'en';
// Map of language codes to date-fns locales
var dateLocales = {
    en: enUS,
    es: es,
    fr: fr,
    de: de,
    ja: ja,
    zh: zhCN,
};
// Translations object
var translations = {
    en: {
        // Common
        'app.name': '2DU Task Management',
        'app.description': 'A simple and efficient task management application',
        'app.loading': 'Loading...',
        'app.error': 'An error occurred',
        'app.retry': 'Retry',
        'app.cancel': 'Cancel',
        'app.save': 'Save',
        'app.delete': 'Delete',
        'app.edit': 'Edit',
        'app.create': 'Create',
        'app.search': 'Search',
        'app.filter': 'Filter',
        'app.sort': 'Sort',
        'app.clear': 'Clear',
        'app.confirm': 'Confirm',
        'app.close': 'Close',
        // Settings
        'settings.title': 'Settings',
        'settings.description': 'Configure your application preferences',
        'settings.tabsLabel': 'Settings sections',
        'settings.tabs.accessibility': 'Accessibility',
        'settings.tabs.language': 'Language',
        'settings.language': 'Language',
        'settings.language.select': 'Select Language',
        'settings.language.note': 'Changes will take effect immediately',
        'settings.accessibility': 'Accessibility',
        'settings.accessibility.description': 'Configure accessibility settings to improve your experience',
        'settings.accessibility.highContrast': 'High Contrast Mode',
        'settings.accessibility.highContrastDescription': 'Increase contrast for better visibility',
        'settings.accessibility.reducedMotion': 'Reduced Motion',
        'settings.accessibility.reducedMotionDescription': 'Reduce animations and motion effects',
        'settings.accessibility.fontSize': 'Font Size',
        'settings.accessibility.fontSizeDescription': 'Adjust the size of text throughout the application',
        'settings.accessibility.fontSize.increase': 'Increase Font Size',
        'settings.accessibility.fontSize.decrease': 'Decrease Font Size',
        'settings.accessibility.fontSize.reset': 'Reset Font Size',
        'settings.accessibility.focusVisible': 'Focus Visibility',
        'settings.accessibility.focusVisibleDescription': 'Enhance the visibility of focused elements',
        'settings.accessibility.screenReader': 'Screen Reader Mode',
        'settings.accessibility.screenReaderDescription': 'Optimize the application for screen readers',
        'settings.theme.toggle': 'Toggle Theme',
        // Sidebar
        'sidebar.today': 'Today',
        'sidebar.upcoming': 'Upcoming',
        'sidebar.calendar': 'Calendar',
        'sidebar.tags': 'Tags',
        'sidebar.completed': 'Completed',
        'sidebar.analytics': 'Analytics',
        'sidebar.settings': 'Settings',
        'sidebar.welcome': 'Welcome, {userName}',
        'sidebar.user': 'User',
        'sidebar.helpResources': 'Help & resources',
        'sidebar.keyboardShortcuts': 'Keyboard shortcuts',
        'sidebar.logout': 'Log out',
        // Shortcuts
        'shortcuts.title': 'Keyboard Shortcuts',
        // Authentication
        'auth.login': 'Login',
        'auth.signup': 'Sign Up',
        'auth.logout': 'Logout',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.confirmPassword': 'Confirm Password',
        'auth.forgotPassword': 'Forgot Password?',
        'auth.resetPassword': 'Reset Password',
        'auth.noAccount': 'Don\'t have an account?',
        'auth.haveAccount': 'Already have an account?',
        'auth.loginError': 'Login failed. Please check your credentials.',
        'auth.signupError': 'Sign up failed. Please try again.',
        'auth.passwordMismatch': 'Passwords do not match.',
        'auth.weakPassword': 'Password is too weak.',
        'auth.emailInUse': 'Email is already in use.',
        'auth.invalidEmail': 'Invalid email address.',
        // Tasks
        'task.title': 'Title',
        'task.description': 'Description',
        'task.dueDate': 'Due Date',
        'task.priority': 'Priority',
        'task.status': 'Status',
        'task.tags': 'Tags',
        'task.addTag': 'Add Tag',
        'task.removeTag': 'Remove Tag',
        'task.create': 'Create Task',
        'task.edit': 'Edit Task',
        'task.delete': 'Delete Task',
        'task.complete': 'Complete Task',
        'task.uncomplete': 'Uncomplete Task',
        'task.reorder': 'Reorder Tasks',
        'task.filterByStatus': 'Filter by Status',
        'task.filterByTag': 'Filter by Tag',
        'task.sortByDueDate': 'Sort by Due Date',
        'task.search': 'Search Tasks',
        'task.noTasks': 'No tasks found',
        'task.loading': 'Loading tasks...',
        'task.error': 'Error loading tasks',
        // Task Status
        'status.todo': 'To Do',
        'status.inProgress': 'In Progress',
        'status.completed': 'Completed',
        // Task Priority
        'priority.low': 'Low',
        'priority.medium': 'Medium',
        'priority.high': 'High',
        // Views
        'view.today': 'Today',
        'view.upcoming': 'Upcoming',
        'view.calendar': 'Calendar',
        'view.tags': 'Tags',
        'view.completed': 'Completed',
        // Accessibility
        'a11y.menuButton': 'Menu',
        'a11y.addTaskButton': 'Add Task',
        'a11y.taskItem': 'Task Item',
        'a11y.taskComplete': 'Mark task as complete',
        'a11y.taskUncomplete': 'Mark task as uncomplete',
        'a11y.taskEdit': 'Edit task',
        'a11y.taskDelete': 'Delete task',
        'a11y.taskDrag': 'Drag task to reorder',
        'a11y.taskDrop': 'Drop task to reorder',
        'a11y.enable': 'Enable',
        'a11y.increaseFontSize': 'Increase Font Size',
        'a11y.decreaseFontSize': 'Decrease Font Size',
        'a11y.resetFontSize': 'Reset Font Size',
        'a11y.highContrast': 'High Contrast',
        'a11y.reducedMotion': 'Reduced Motion',
        'a11y.fontSize': 'Font Size',
        'a11y.focusVisible': 'Focus Visible',
        'a11y.screenReaderOnly': 'Screen Reader Only',
        'a11y.resetAllSettings': 'Reset All Settings',
        // Error states
        'error.somethingWentWrong': 'Something went wrong',
        'error.unexpectedError': 'An unexpected error occurred',
        'error.reloadPage': 'Reload Page',
        'error.tryAgain': 'Try Again',
        'error.pageLoadFailed': 'Error loading page. Please refresh.',
        'common.loading': 'Loading...',
        'error.defaultError': 'An error occurred. Please try again.',
        // Task Dialog
        'task.dialog.titleRequired': 'Title is required',
        'task.dialog.description': 'Description (optional)',
        'task.dialog.taskTitle': 'Task Title',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
    },
    es: {
        // Spanish translations (partial example)
        'app.name': '2DU Gestión de Tareas',
        'app.description': 'Una aplicación simple y eficiente para la gestión de tareas',
        'app.loading': 'Cargando...',
        'app.error': 'Se produjo un error',
        'app.retry': 'Reintentar',
        'app.cancel': 'Cancelar',
        'app.save': 'Guardar',
        'app.delete': 'Eliminar',
        'app.edit': 'Editar',
        'app.create': 'Crear',
        'app.search': 'Buscar',
        'app.filter': 'Filtrar',
        'app.sort': 'Ordenar',
        'app.clear': 'Limpiar',
        'app.confirm': 'Confirmar',
        'app.close': 'Cerrar',
        // Sidebar
        'sidebar.today': 'Hoy',
        'sidebar.upcoming': 'Próximos',
        'sidebar.calendar': 'Calendario',
        'sidebar.tags': 'Etiquetas',
        'sidebar.completed': 'Completados',
        'sidebar.settings': 'Configuración',
        'sidebar.welcome': 'Bienvenido, {userName}',
        'sidebar.user': 'Usuario',
    },
    // Add more languages as needed
};
// Current language state
var currentLanguage = DEFAULT_LANGUAGE;
// Function to set the current language
export var setLanguage = function (language) {
    if (translations[language]) {
        currentLanguage = language;
        // Store the language preference in localStorage
        localStorage.setItem('language', language);
    }
};
// Function to get the current language
export var getLanguage = function () {
    return currentLanguage;
};
// Function to initialize the language from localStorage
export var initLanguage = function () {
    var savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    else {
        currentLanguage = DEFAULT_LANGUAGE;
    }
};
// Function to translate a key
export var t = function (key, params) {
    var _a, _b;
    var translation = ((_a = translations[currentLanguage]) === null || _a === void 0 ? void 0 : _a[key]) || ((_b = translations[DEFAULT_LANGUAGE]) === null || _b === void 0 ? void 0 : _b[key]) || key;
    if (params) {
        return Object.entries(params).reduce(function (result, _a) {
            var paramKey = _a[0], paramValue = _a[1];
            return result.replace("{".concat(paramKey, "}"), paramValue);
        }, translation);
    }
    return translation;
};
// Function to format a date
export var formatDate = function (date, formatStr) {
    if (formatStr === void 0) { formatStr = 'PP'; }
    var dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: dateLocales[currentLanguage] });
};
// Function to format a relative date
export var formatRelativeDate = function (date, baseDate) {
    if (baseDate === void 0) { baseDate = new Date(); }
    var dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatRelative(dateObj, baseDate, { locale: dateLocales[currentLanguage] });
};
// Function to format a distance date
export var formatDistanceDate = function (date, baseDate) {
    if (baseDate === void 0) { baseDate = new Date(); }
    var dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, baseDate, { locale: dateLocales[currentLanguage] });
};
// Function to format a number
export var formatNumber = function (number, options) {
    return new Intl.NumberFormat(currentLanguage, options).format(number);
};
// Function to format a currency
export var formatCurrency = function (amount, currency) {
    if (currency === void 0) { currency = 'USD'; }
    return new Intl.NumberFormat(currentLanguage, { style: 'currency', currency: currency }).format(amount);
};
// Initialize language on import
initLanguage();
