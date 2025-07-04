import { initialize, pageview, event } from 'react-ga4';

const TRACKING_ID = "G-8T6XLR1WPL";

export const initGA = () => {
  if (typeof window === 'undefined') return; // SSR safety
  
  console.log(`[GA] Initializing in ${process.env.NODE_ENV} mode`);
  initialize(TRACKING_ID, {
    testMode: process.env.NODE_ENV !== 'production',
    gaOptions: {
      anonymizeIp: true,
      cookieDomain: 'auto',
      debug_mode: process.env.NODE_ENV !== 'production'
    }
  });
};

export const trackPageView = (path) => {
  if (typeof window === 'undefined') return;
  
  console.log(`[GA] Tracking pageview: ${path}`);
  pageview(path, undefined, {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path
  });
};

export const trackEvent = (category, action, label, value) => {
  console.log(`[GA] Event: ${category} - ${action}`);
  event({
    category,
    action,
    label,
    value: value || undefined
  });
};