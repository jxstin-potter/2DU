import { Task } from '../types';
export declare const calendarService: {
    googleCalendar: {
        addEvent: (task: Task) => Promise<{
            success: boolean;
        }>;
    };
    outlookCalendar: {
        addEvent: (task: Task) => Promise<{
            success: boolean;
        }>;
    };
};
export declare const emailService: {
    sendReminder: (task: Task, recipientEmail: string) => Promise<{
        success: boolean;
    }>;
};
export declare const notificationService: {
    requestPermission: () => Promise<boolean>;
    sendBrowserNotification: (task: Task) => void;
};
export declare const socialSharingService: {
    shareOnTwitter: (task: Task) => void;
    shareOnLinkedIn: (task: Task) => void;
    shareViaEmail: (task: Task, recipientEmail: string) => void;
    generateShareableLink: (task: Task) => Promise<string>;
};
export default notificationService;
