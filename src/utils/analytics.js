import ReactGA from 'react-ga4';

const TRACKING_ID = "G-8T6XLR1WPL";

export const initGA = () => {
  if (typeof window === 'undefined') return; // Skip during SSR
  
  // Initialize GA4
  ReactGA.initialize(TRACKING_ID, {
    testMode: process.env.NODE_ENV !== 'production', // Enable test mode in development
    gaOptions: {
      anonymizeIp: true, // GDPR compliance
      cookieDomain: 'auto'
    }
  });

  // Optional: Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[GA] Initialized with ID:', TRACKING_ID);
  }
};

export const trackPageView = (path) => {
  if (typeof window === 'undefined') return;
  
  // Send pageview using GA4 measurement protocol
  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: document.title,
    location: window.location.href
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[GA] Pageview tracked:', path);
  }
};

export const trackEvent = ({ category, action, label, value }) => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[GA] Event tracked:', { category, action, label, value });
  }
};