var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Calendar Integration
export var calendarService = {
    // Google Calendar
    googleCalendar: {
        addEvent: function (task) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                /*
                const event = {
                  summary: task.title,
                  description: task.description,
                  start: {
                    dateTime: task.dueDate.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  },
                  end: {
                    dateTime: new Date(task.dueDate.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  },
                };
          
                try {
                  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('google_token')}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(event),
                  });
          
                  if (!response.ok) {
                    throw new Error('Failed to add event to Google Calendar');
                  }
          
                  return await response.json();
                } catch (error) {
                  console.error('Google Calendar integration error:', error);
                  throw error;
                }
                */
                return [2 /*return*/, Promise.resolve({ success: true })];
            });
        }); },
    },
    // Microsoft Outlook Calendar
    outlookCalendar: {
        addEvent: function (task) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                /*
                const event = {
                  subject: task.title,
                  body: {
                    contentType: 'Text',
                    content: task.description || '',
                  },
                  start: {
                    dateTime: task.dueDate.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  },
                  end: {
                    dateTime: new Date(task.dueDate.getTime() + 60 * 60 * 1000).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  },
                };
          
                try {
                  const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('outlook_token')}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(event),
                  });
          
                  if (!response.ok) {
                    throw new Error('Failed to add event to Outlook Calendar');
                  }
          
                  return await response.json();
                } catch (error) {
                  console.error('Outlook Calendar integration error:', error);
                  throw error;
                }
                */
                return [2 /*return*/, Promise.resolve({ success: true })];
            });
        }); },
    },
};
// Email Integration
export var emailService = {
    // Send task reminder
    sendReminder: function (task, recipientEmail) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            /*
            const emailData = {
              to: recipientEmail,
              subject: `Reminder: ${task.title}`,
              text: `
        Task Reminder:
        Title: ${task.title}
        Description: ${task.description || 'No description'}
        Due Date: ${task.dueDate.toLocaleString()}
        ${task.tags.length > 0 ? `Tags: ${task.tags.join(', ')}` : ''}
              `.trim(),
              html: `
        <h2>Task Reminder</h2>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description || 'No description'}</p>
        <p><strong>Due Date:</strong> ${task.dueDate.toLocaleString()}</p>
        ${task.tags.length > 0 ? `<p><strong>Tags:</strong> ${task.tags.join(', ')}</p>` : ''}
              `.trim(),
            };
        
            try {
              const response = await fetch('/api/v1/email/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
              });
        
              if (!response.ok) {
                throw new Error('Failed to send email reminder');
              }
        
              return await response.json();
            } catch (error) {
              console.error('Email service error:', error);
              throw error;
            }
            */
            return [2 /*return*/, Promise.resolve({ success: true })];
        });
    }); },
};
// Notification Service
export var notificationService = {
    // Browser notifications
    requestPermission: function () { return __awaiter(void 0, void 0, void 0, function () {
        var permission;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('Notification' in window)) {
                        throw new Error('This browser does not support notifications');
                    }
                    return [4 /*yield*/, Notification.requestPermission()];
                case 1:
                    permission = _a.sent();
                    return [2 /*return*/, permission === 'granted'];
            }
        });
    }); },
    sendBrowserNotification: function (task) {
        if (!('Notification' in window)) {
            throw new Error('This browser does not support notifications');
        }
        if (Notification.permission === 'granted') {
            new Notification(task.title, {
                body: task.description || 'Task reminder',
                icon: '/logo192.png',
                data: { taskId: task.id },
            });
        }
    },
};
// Social Sharing
export var socialSharingService = {
    // Share on Twitter
    shareOnTwitter: function (task) {
        /*
        const text = encodeURIComponent(`Check out my task: ${task.title}`);
        const url = encodeURIComponent(window.location.origin);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        */
    },
    // Share on LinkedIn
    shareOnLinkedIn: function (task) {
        /*
        const url = encodeURIComponent(window.location.origin);
        const title = encodeURIComponent(`Task: ${task.title}`);
        const summary = encodeURIComponent(task.description || '');
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
          '_blank'
        );
        */
    },
    // Share via Email
    shareViaEmail: function (task, recipientEmail) {
        /*
        const subject = encodeURIComponent(`Shared Task: ${task.title}`);
        const body = encodeURIComponent(`
    Task Details:
    Title: ${task.title}
    Description: ${task.description || 'No description'}
    Due Date: ${task.dueDate.toLocaleString()}
    ${task.tags.length > 0 ? `Tags: ${task.tags.join(', ')}` : ''}
        `.trim());
        window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
        */
    },
    // Generate shareable link
    generateShareableLink: function (task) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            /*
            try {
              const response = await fetch('/api/v1/tasks/share', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId: task.id }),
              });
        
              if (!response.ok) {
                throw new Error('Failed to generate shareable link');
              }
        
              const { shareableLink } = await response.json();
              return shareableLink;
            } catch (error) {
              console.error('Shareable link generation error:', error);
              throw error;
            }
            */
            return [2 /*return*/, Promise.resolve('https://example.com/shared-task')];
        });
    }); },
};
export default notificationService;
