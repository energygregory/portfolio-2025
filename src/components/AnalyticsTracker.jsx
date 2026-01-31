import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

// Determine backend URL (production vs local)
const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://replace-with-your-production-backend.com'; 

const initShopifyPixel = () => {
  // Avoid duplicate injection
  if (document.querySelector('script[src*="shopify-pixels-customer-events"]')) return;

  const script = document.createElement('script');
  script.src = "https://cdn.shopify.com/shopifycloud/shopify-pixels-customer-events/v1/sdk.js";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    // Initialize the event queue as requested
    window.shopifyEvents = window.shopifyEvents || [];
    window.publishCustomEvent = (name, data) => {
      window.shopifyEvents.push({ name, data });
    };
  };
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize the pixel SDK on mount
    initShopifyPixel();
  }, []);

  useEffect(() => {
    // 1. Report to Custom Real-Time Backend
    const socket = io(BACKEND_URL);
    socket.emit('visitor_hit');

    // Cleanup socket on unmount or route change (optional, but good for connection hygiene)
    // If we want persistent connection, declare socket outside. 
    // But for simple "hit" tracking, connect/emit/disconnect is fine, though slight overhead.
    // Better: keep connection open? 
    // Actually, for a single page app, we might want one socket instance.
    // For now, let's just fire and forget to ensure the hit is registered.

    // 2. Trigger the "Pulse" on route change for Shopify
    // Using simple timeout to ensure window objects are ready if script just loaded
    const triggerEvent = () => {
        // Try the method specific to the user's snippet 2 (if window.shopify exists)
        if (window.shopify && typeof window.shopify.extend === 'function') {
            window.shopify.extend('page_viewed', {
                page_url: window.location.href,
                referrer: document.referrer,
            });
        } 
        // Also try the custom event publisher from snippet 1
        if (window.publishCustomEvent) {
             window.publishCustomEvent('page_viewed', {
                page_url: window.location.href,
                referrer: document.referrer,
            });
        }
    };

    triggerEvent();
    
    // Retry shortly after if potential race condition with script load
    const timer = setTimeout(triggerEvent, 1000);
    return () => clearTimeout(timer);

  }, [location]);

  return null;
};

export default AnalyticsTracker;
