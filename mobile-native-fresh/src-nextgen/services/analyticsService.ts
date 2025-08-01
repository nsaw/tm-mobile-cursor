export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
  timestamp?: number;
}

export interface AnalyticsUser {
  id: string;
  properties?: Record<string, string | number | boolean>;
}

export class AnalyticsService {
  static trackEvent(event: AnalyticsEvent): void {
    // TODO: Implement real analytics tracking
    console.log('Analytics Event:', event);
  }

  static trackScreen(screenName: string, properties?: Record<string, string | number | boolean>): void {
    // TODO: Implement real screen tracking
    console.log('Screen View:', screenName, properties);
  }

  static setUser(user: AnalyticsUser): void {
    // TODO: Implement real user identification
    console.log('Set User:', user);
  }

  static setProperty(key: string, value: string | number | boolean): void {
    // TODO: Implement real property setting
    console.log('Set Property:', key, value);
  }
}

export const analyticsService = AnalyticsService; 