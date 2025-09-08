import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Replay } from '@sentry/replay';

export function initializeMonitoring() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          tracePropagationTargets: ['localhost', /^https:\/\/momta\.ai/],
        }),
        new Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    });

    // Web Vitals Monitoring
    if ('addEventListener' in window) {
      window.addEventListener('load', () => {
        let firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0];
        let largestContentfulPaint = performance.getEntriesByName('largest-contentful-paint')[0];
        
        Sentry.setTag('fcp', firstContentfulPaint?.startTime);
        Sentry.setTag('lcp', largestContentfulPaint?.startTime);

        // Monitor for CLS
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.hadRecentInput) continue;
            Sentry.setTag('cls', entry.value);
          }
        }).observe({ type: 'layout-shift', buffered: true });

        // Monitor for Long Tasks
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            Sentry.addBreadcrumb({
              category: 'performance',
              message: 'Long Task detected',
              data: {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              }
            });
          }
        }).observe({ entryTypes: ['longtask'] });
      });
    }
  }
}

export function trackError(error: Error, context?: Record<string, any>) {
  console.error(error);
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context
    });
  }
}

export function trackEvent(name: string, data?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(name, {
      level: 'info',
      extra: data
    });
  }
}
