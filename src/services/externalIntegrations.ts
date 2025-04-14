import { Task } from '../types';

// Calendar Integration
export const calendarService = {
  // Google Calendar
  googleCalendar: {
    addEvent: async (task: Task) => {
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
      console.log('Google Calendar integration temporarily disabled', task);
      return Promise.resolve({ success: true });
    },
  },

  // Microsoft Outlook Calendar
  outlookCalendar: {
    addEvent: async (task: Task) => {
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
      console.log('Outlook Calendar integration temporarily disabled', task);
      return Promise.resolve({ success: true });
    },
  },
};

// Email Integration
export const emailService = {
  // Send task reminder
  sendReminder: async (task: Task, recipientEmail: string) => {
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
    console.log('Email reminder service temporarily disabled', task, recipientEmail);
    return Promise.resolve({ success: true });
  },
};

// Notification Service
export const notificationService = {
  // Browser notifications
  requestPermission: async () => {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  sendBrowserNotification: (task: Task) => {
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
export const socialSharingService = {
  // Share on Twitter
  shareOnTwitter: (task: Task) => {
    /*
    const text = encodeURIComponent(`Check out my task: ${task.title}`);
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    */
    console.log('Twitter sharing temporarily disabled', task);
  },

  // Share on LinkedIn
  shareOnLinkedIn: (task: Task) => {
    /*
    const url = encodeURIComponent(window.location.origin);
    const title = encodeURIComponent(`Task: ${task.title}`);
    const summary = encodeURIComponent(task.description || '');
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
      '_blank'
    );
    */
    console.log('LinkedIn sharing temporarily disabled', task);
  },

  // Share via Email
  shareViaEmail: (task: Task, recipientEmail: string) => {
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
    console.log('Email sharing temporarily disabled', task, recipientEmail);
  },

  // Generate shareable link
  generateShareableLink: async (task: Task) => {
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
    console.log('Shareable link generation temporarily disabled', task);
    return Promise.resolve('https://example.com/shared-task');
  },
};

export default notificationService; 