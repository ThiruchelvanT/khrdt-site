import { initialize, pageview, event } from 'react-ga4';

const TRACKING_ID = "G-8T6XLR1WPL"; // Replace with your Measurement ID

export const initGA = () => {
  initialize(TRACKING_ID);
};

export const trackPageView = (path) => {
  pageview(path);
};

export const trackEvent = (category, action, label) => {
  event({
    category: category,
    action: action,
    label: label
  });
};