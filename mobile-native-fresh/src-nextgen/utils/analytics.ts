/**
 * Analytics utility functions for tracking user events and app usage
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsUser {
  id: string;
  email?: string;
  properties?: Record<string, any>;
}

export interface AnalyticsSession {
  id: string;
  startTime: string;
  endTime?: string;
  properties?: Record<string, any>;
}

/**
 * Analytics event categories
 */
export const AnalyticsCategories = {
  AUTHENTICATION: 'authentication',
  NAVIGATION: 'navigation',
  FEATURE_USAGE: 'feature_usage',
  ERROR: 'error',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  USER_ENGAGEMENT: 'user_engagement',
} as const;

/**
 * Analytics event names
 */
export const AnalyticsEvents = {
  // Authentication events
  SIGN_IN_ATTEMPT: 'sign_in_attempt',
  SIGN_IN_SUCCESS: 'sign_in_success',
  SIGN_IN_FAILED: 'sign_in_failed',
  SIGN_UP_ATTEMPT: 'sign_up_attempt',
  SIGN_UP_SUCCESS: 'sign_up_success',
  SIGN_UP_FAILED: 'sign_up_failed',
  SIGN_OUT: 'sign_out',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'password_reset_completed',
  PASSWORD_CHANGED: 'password_changed',

  // Navigation events
  SCREEN_VIEW: 'screen_view',
  NAVIGATION: 'navigation',
  DEEP_LINK: 'deep_link',

  // Feature usage events
  FEATURE_USED: 'feature_used',
  BUTTON_CLICKED: 'button_clicked',
  FORM_SUBMITTED: 'form_submitted',
  FORM_VALIDATION_FAILED: 'form_validation_failed',

  // Error events
  ERROR_OCCURRED: 'error_occurred',
  CRASH_REPORTED: 'crash_reported',
  NETWORK_ERROR: 'network_error',

  // Performance events
  PERFORMANCE_METRIC: 'performance_metric',
  LOAD_TIME: 'load_time',
  RENDER_TIME: 'render_time',

  // Security events
  SECURITY_EVENT: 'security_event',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',

  // User engagement events
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  USER_ACTION: 'user_action',
} as const;

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  batchSize: number;
  flushInterval: number;
  endpoint?: string;
}

/**
 * Default analytics configuration
 */
const defaultConfig: AnalyticsConfig = {
  enabled: true,
  debug: false,
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
};

/**
 * Analytics service class
 */
class AnalyticsService {
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private user?: AnalyticsUser;
  private session?: AnalyticsSession;
  private flushTimer?: ReturnType<typeof setInterval>;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initializeSession();
    this.startFlushTimer();
  }

  /**
   * Initialize a new session
   */
  private initializeSession(): void {
    this.session = {
      id: this.generateSessionId(),
      startTime: new Date().toISOString(),
      properties: {
        platform: 'mobile',
        appVersion: '1.0.0', // In a real app, get from app config
        deviceInfo: this.getDeviceInfo(),
      },
    };
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): Record<string, any> {
    return {
      platform: 'React Native',
      // In a real implementation, you would get actual device info
      // using react-native-device-info or similar
      deviceId: 'mobile-device',
      osVersion: 'unknown',
      appVersion: '1.0.0',
    };
  }

  /**
   * Start the flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Set user information
   */
  setUser(user: AnalyticsUser): void {
    this.user = user;
  }

  /**
   * Clear user information
   */
  clearUser(): void {
    this.user = undefined;
  }

  /**
   * Track an event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.config.enabled) {
      return;
    }

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.session?.id,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
      userId: this.user?.id,
      sessionId: this.session?.id,
    };

    this.events.push(event);

    if (this.config.debug) {
      console.log('Analytics Event:', event);
    }

    // Flush if we've reached the batch size
    if (this.events.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Track a screen view
   */
  trackScreenView(screenName: string, properties?: Record<string, any>): void {
    this.track(AnalyticsEvents.SCREEN_VIEW, {
      screen_name: screenName,
      ...properties,
    });
  }

  /**
   * Track a button click
   */
  trackButtonClick(buttonName: string, properties?: Record<string, any>): void {
    this.track(AnalyticsEvents.BUTTON_CLICKED, {
      button_name: buttonName,
      ...properties,
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmission(formName: string, success: boolean, properties?: Record<string, any>): void {
    this.track(success ? AnalyticsEvents.FORM_SUBMITTED : AnalyticsEvents.FORM_VALIDATION_FAILED, {
      form_name: formName,
      success,
      ...properties,
    });
  }

  /**
   * Track an error
   */
  trackError(error: Error, properties?: Record<string, any>): void {
    this.track(AnalyticsEvents.ERROR_OCCURRED, {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...properties,
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metricName: string, value: number, unit = 'ms', properties?: Record<string, any>): void {
    this.track(AnalyticsEvents.PERFORMANCE_METRIC, {
      metric_name: metricName,
      value,
      unit,
      ...properties,
    });
  }

  /**
   * Flush events to the server
   */
  async flush(): Promise<void> {
    if (this.events.length === 0) {
      return;
    }

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      if (this.config.endpoint) {
        await this.sendEvents(eventsToSend);
      } else {
        // In development, just log the events
        console.log('Analytics Events (would send to server):', eventsToSend);
      }
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to the queue for retry
      this.events.unshift(...eventsToSend);
    }
  }

  /**
   * Send events to the server
   */
  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.endpoint) {
      return;
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        user: this.user,
        session: this.session,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Analytics request failed: ${response.status}`);
    }
  }

  /**
   * End the current session
   */
  endSession(): void {
    if (this.session) {
      this.session.endTime = new Date().toISOString();
      this.track(AnalyticsEvents.SESSION_END, {
        session_duration: this.getSessionDuration(),
      });
    }

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }

  /**
   * Get session duration in milliseconds
   */
  private getSessionDuration(): number {
    if (!this.session?.startTime) {
      return 0;
    }

    const endTime = this.session.endTime || new Date().toISOString();
    return new Date(endTime).getTime() - new Date(this.session.startTime).getTime();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    this.startFlushTimer();
  }

  /**
   * Enable analytics
   */
  enable(): void {
    this.config.enabled = true;
  }

  /**
   * Disable analytics
   */
  disable(): void {
    this.config.enabled = false;
  }
}

/**
 * Global analytics instance
 */
export const analytics = new AnalyticsService();

/**
 * Convenience functions for common analytics events
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>): void => {
  analytics.track(eventName, properties);
};

export const trackScreen = (screenName: string, properties?: Record<string, any>): void => {
  analytics.trackScreenView(screenName, properties);
};

export const trackButton = (buttonName: string, properties?: Record<string, any>): void => {
  analytics.trackButtonClick(buttonName, properties);
};

export const trackForm = (formName: string, success: boolean, properties?: Record<string, any>): void => {
  analytics.trackFormSubmission(formName, success, properties);
};

export const trackError = (error: Error, properties?: Record<string, any>): void => {
  analytics.trackError(error, properties);
};

export const trackPerformance = (metricName: string, value: number, unit?: string, properties?: Record<string, any>): void => {
  analytics.trackPerformance(metricName, value, unit, properties);
};

export default analytics; 