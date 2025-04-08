// Analytics utility for tracking user interactions and events

export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  FEATURE_USED = 'feature_used',
  ERROR = 'error',
  USER_ACTION = 'user_action',
}

interface AnalyticsEvent {
  type: AnalyticsEventType;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  // Track a page view
  trackPageView(path: string, title?: string) {
    this.trackEvent(AnalyticsEventType.PAGE_VIEW, {
      path,
      title: title || document.title,
    });
  }

  // Track a feature usage
  trackFeatureUsed(featureName: string, properties?: Record<string, any>) {
    this.trackEvent(AnalyticsEventType.FEATURE_USED, {
      featureName,
      ...properties,
    });
  }

  // Track an error
  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent(AnalyticsEventType.ERROR, {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  // Track a user action
  trackUserAction(action: string, properties?: Record<string, any>) {
    this.trackEvent(AnalyticsEventType.USER_ACTION, {
      action,
      ...properties,
    });
  }

  // Generic event tracking
  trackEvent(type: AnalyticsEventType, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      type,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);
    this.logEvent(event);
  }

  // Log event to console in development
  private logEvent(event: AnalyticsEvent) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  }

  // Get all tracked events
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear all events
  clearEvents() {
    this.events = [];
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

// Export a singleton instance
export const analytics = new Analytics(); 