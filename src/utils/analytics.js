import { initialize, pageview, event } from 'react-ga4';

const TRACKING_ID = "G-8T6XLR1WPL";

// Initialize with more detailed configuration
export const initGA = () => {
  initialize(TRACKING_ID, {
    testMode: process.env.NODE_ENV === 'test', // Disable in test
    gaOptions: {
      anonymizeIp: true, // GDPR compliance
      cookieDomain: 'auto'
    }
  });
};

// Enhanced pageview tracking
export const trackPageView = (path) => {
  pageview(path, undefined, {
    page_title: document.title,
    page_location: window.location.href
  });
};

// Enhanced event tracking
export const trackEvent = (category, action, label, value) => {
  event({
    category,
    action,
    label,
    value
  });
};

// In your analytics.js
console.log(`Initializing GA in ${process.env.NODE_ENV} mode`);