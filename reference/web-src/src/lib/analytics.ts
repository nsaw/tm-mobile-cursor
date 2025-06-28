// Comprehensive analytics and tracking system
import posthog from 'posthog-js';
import * as Sentry from '@sentry/react';

// React hook for analytics
import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

class Analytics {
  private sessionId: string;
  private userId: string | null = null;
  private isEnabled: boolean = false;
  private startTime: number = Date.now();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeServices();
    this.setupErrorTracking();
    this.trackPageLoad();
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private initializeServices() {
    // Initialize PostHog
    if (import.meta.env.VITE_POSTHOG_API_KEY) {
      posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
        api_host: 'https://app.posthog.com',
        autocapture: false, // We'll manually track specific events
        capture_pageview: false, // Manual page view tracking
        disable_session_recording: false,
        session_recording: {
          maskAllInputs: true,
          maskInputOptions: {
            password: true,
            email: false
          }
        },
        persistence: 'localStorage+cookie',
        cross_subdomain_cookie: false,
        secure_cookie: true
      });
      this.isEnabled = true;
    }

    // Initialize Sentry
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        tracesSampleRate: 0.1,
        beforeSend(event) {
          // Filter out non-critical errors
          if (event.exception) {
            const error = event.exception.values?.[0];
            if (error?.type === 'ChunkLoadError') return null;
            if (error?.value?.includes('Non-Error promise rejection')) return null;
          }
          return event;
        },
        beforeBreadcrumb(breadcrumb) {
          // Filter sensitive data from breadcrumbs
          if (breadcrumb.category === 'fetch' && breadcrumb.data?.url?.includes('/api/')) {
            delete breadcrumb.data.response;
          }
          return breadcrumb;
        }
      });
    }
  }

  private setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'unhandled_promise_rejection',
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    });

    // Track broken links and dead clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') || target.closest('[role="button"]');
      
      if (link) {
        const href = link.getAttribute('href');
        const onClick = link.getAttribute('onclick');
        
        // Track broken links
        if (href === '#' || href === '' || href === 'javascript:void(0)') {
          this.trackEvent('dead_click', {
            element: target.tagName.toLowerCase(),
            text: target.textContent?.slice(0, 50),
            classes: target.className,
            href: href,
            has_onclick: !!onClick
          });
        }
      }
    });
  }

  private trackPageLoad() {
    // Track page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      this.trackEvent('page_load_performance', {
        load_time: navigation.loadEventEnd - navigation.loadEventStart,
        dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        first_paint: paint.find(p => p.name === 'first-paint')?.startTime,
        first_contentful_paint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        page_size: document.documentElement.outerHTML.length
      });
    });
  }

  setUserId(userId: string) {
    this.userId = userId;
    if (this.isEnabled) {
      posthog.identify(userId);
      Sentry.setUser({ id: userId });
    }
  }

  trackEvent(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const enrichedProperties = {
      ...properties,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now(),
      url: window.location.href,
      pathname: window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      screen_width: screen.width,
      screen_height: screen.height,
      device_pixel_ratio: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };

    // Send to PostHog
    posthog.capture(event, enrichedProperties);

    // Send to backend for additional processing
    this.sendToBackend(event, enrichedProperties);

    console.log('📊 Analytics Event:', event, enrichedProperties);
  }

  trackPageView(path?: string) {
    const currentPath = path || window.location.pathname;
    
    this.trackEvent('page_view', {
      path: currentPath,
      title: document.title,
      search: window.location.search,
      hash: window.location.hash
    });

    if (this.isEnabled) {
      posthog.capture('$pageview', {
        $current_url: window.location.href
      });
    }
  }

  trackNavigation(from: string, to: string, method: 'click' | 'programmatic' = 'click') {
    this.trackEvent('navigation', {
      from_path: from,
      to_path: to,
      navigation_method: method,
      session_duration: Date.now() - this.startTime
    });
  }

  trackButtonClick(buttonText: string, buttonId?: string, context?: string) {
    this.trackEvent('button_click', {
      button_text: buttonText,
      button_id: buttonId,
      context: context,
      element_type: 'button'
    });
  }

  trackFormInteraction(formName: string, action: 'start' | 'submit' | 'abandon', fieldName?: string) {
    this.trackEvent('form_interaction', {
      form_name: formName,
      action: action,
      field_name: fieldName,
      timestamp: Date.now()
    });
  }

  trackFeatureUsage(feature: string, action: string, metadata?: Record<string, any>) {
    this.trackEvent('feature_usage', {
      feature_name: feature,
      action: action,
      ...metadata
    });
  }

  trackError(error: {
    type: string;
    message?: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    reason?: string;
  }) {
    const errorEvent = {
      ...error,
      session_id: this.sessionId,
      user_id: this.userId,
      url: window.location.href,
      user_agent: navigator.userAgent,
      timestamp: Date.now()
    };

    // Send to PostHog
    if (this.isEnabled) {
      posthog.capture('error_occurred', errorEvent);
    }

    // Send to Sentry
    Sentry.captureException(new Error(error.message || error.reason || 'Unknown error'), {
      extra: errorEvent,
      tags: {
        error_type: error.type
      }
    });

    // Send to backend
    this.sendToBackend('error_occurred', errorEvent);

    console.error('🚨 Error tracked:', errorEvent);
  }

  trackAPICall(endpoint: string, method: string, status: number, duration: number, error?: string) {
    this.trackEvent('api_call', {
      endpoint: endpoint,
      method: method,
      status_code: status,
      duration_ms: duration,
      success: status >= 200 && status < 300,
      error_message: error
    });
  }

  trackDropOff(page: string, section: string, reason?: string) {
    this.trackEvent('drop_off', {
      page: page,
      section: section,
      reason: reason,
      time_on_page: Date.now() - this.startTime
    });
  }

  trackSearchQuery(query: string, results: number, source: 'main_search' | 'ai_search') {
    this.trackEvent('search_performed', {
      query_length: query.length,
      query_hash: this.hashString(query), // Don't store actual query for privacy
      results_count: results,
      search_source: source
    });
  }

  private hashString(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private async sendToBackend(event: string, properties: Record<string, any>) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          properties: this.sanitizeProperties(properties)
        })
      });
    } catch (error) {
      console.warn('Failed to send analytics to backend:', error);
    }
  }

  private sanitizeProperties(properties: Record<string, any>): Record<string, any> {
    const sanitized = { ...properties };
    
    // Remove sensitive data
    delete sanitized.password;
    delete sanitized.email;
    delete sanitized.auth_token;
    delete sanitized.api_key;
    
    // Truncate long strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 1000) {
        sanitized[key] = sanitized[key].substring(0, 1000) + '...';
      }
    });

    return sanitized;
  }

  // Session management
  startSession() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.trackEvent('session_start');
  }

  endSession() {
    this.trackEvent('session_end', {
      session_duration: Date.now() - this.startTime
    });
  }

  // Privacy controls
  enableTracking() {
    this.isEnabled = true;
    localStorage.setItem('analytics_enabled', 'true');
  }

  disableTracking() {
    this.isEnabled = false;
    localStorage.setItem('analytics_enabled', 'false');
    if (posthog) {
      posthog.opt_out_capturing();
    }
  }

  isTrackingEnabled(): boolean {
    return this.isEnabled;
  }
}

// Create global analytics instance
export const analytics = new Analytics();

export const useAnalytics = () => {
  const [location] = useLocation();

  useEffect(() => {
    analytics.trackPageView(location);
  }, [location]);

  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    analytics.trackEvent(event, properties);
  }, []);

  const trackButtonClick = useCallback((buttonText: string, buttonId?: string, context?: string) => {
    analytics.trackButtonClick(buttonText, buttonId, context);
  }, []);

  const trackFeatureUsage = useCallback((feature: string, action: string, metadata?: Record<string, any>) => {
    analytics.trackFeatureUsage(feature, action, metadata);
  }, []);

  return {
    trackEvent,
    trackButtonClick,
    trackFeatureUsage,
    trackNavigation: analytics.trackNavigation.bind(analytics),
    trackFormInteraction: analytics.trackFormInteraction.bind(analytics),
    trackDropOff: analytics.trackDropOff.bind(analytics),
    trackSearchQuery: analytics.trackSearchQuery.bind(analytics)
  };
};

// Higher-order component for automatic page tracking
export const withAnalytics = (Component: any) => {
  return function AnalyticsWrapper(props: any) {
    useAnalytics();
    return Component(props);
  };
};

export default analytics;