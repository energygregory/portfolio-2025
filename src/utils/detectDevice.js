/**
 * Lightweight device detection utility.
 * Returns a device name string that can be matched to presets.
 * Combines User-Agent parsing, platform hints, and DPR for accuracy.
 */

export function detectDevice() {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const dpr = window.devicePixelRatio || 1;
  const w = window.screen.width;
  const h = window.screen.height;
  const maxDim = Math.max(w, h);
  const minDim = Math.min(w, h);

  // iOS devices
  if (/iPhone/.test(ua)) {
    // iPhone detection by screen + DPR
    if (maxDim >= 932 && dpr >= 3) return 'iPhone 14 Pro Max';
    if (maxDim >= 896 && dpr >= 3) return 'iPhone 14 Pro';
    if (maxDim >= 926 && dpr >= 3) return 'iPhone 13 Pro Max';
    if (maxDim >= 844 && dpr >= 3) return 'iPhone 12 Pro';
    if (maxDim >= 896 && dpr >= 2) return 'iPhone XR';
    if (maxDim >= 812 && dpr >= 3) return 'iPhone X';
    if (maxDim >= 736 && dpr >= 3) return 'iPhone 6/7/8 Plus';
    if (maxDim >= 667 && dpr >= 2) return 'iPhone SE';
    if (maxDim >= 568) return 'iPhone 5/SE';
    return 'iPhone 4';
  }

  // iPad detection (iPadOS 13+ reports as Mac, so check touch + screen size)
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) {
    if (maxDim >= 1366) return 'iPad Pro';
    if (maxDim >= 1180) return 'iPad Air';
    if (maxDim >= 1024) return 'iPad Mini';
    return 'iPad';
  }

  // Android devices
  if (/Android/.test(ua)) {
    // Samsung Galaxy
    if (/SM-F9|Galaxy.*Fold/i.test(ua)) return 'Galaxy Z Fold 5';
    if (/SM-S9|Galaxy S21/i.test(ua)) return 'Galaxy S21';
    if (/SM-S908|Galaxy S22 Ultra/i.test(ua)) return 'Galaxy S22 Ultra';
    if (/SM-G98|Galaxy S20/i.test(ua)) return 'Galaxy S20';
    if (/SM-G95|Galaxy S8/i.test(ua)) return 'Samsung Galaxy S8+';
    if (/SM-A[57]1/i.test(ua)) return 'Samsung Galaxy A51/71';
    if (/SM-T|Galaxy Tab/i.test(ua)) return 'Galaxy Tab S4';
    
    // Google Pixel
    if (/Pixel 7/i.test(ua)) return 'Pixel 7';
    if (/Pixel 6/i.test(ua)) return 'Pixel 6';
    if (/Pixel 5/i.test(ua)) return 'Pixel 5';
    if (/Pixel 4/i.test(ua)) return 'Pixel 4';
    if (/Pixel 3/i.test(ua)) return 'Pixel 3';
    if (/Pixel 2 XL/i.test(ua)) return 'Pixel 2 XL';
    if (/Pixel 2/i.test(ua)) return 'Pixel 2';
    if (/Pixel/i.test(ua)) return 'Pixel';

    // Nexus
    if (/Nexus 10/i.test(ua)) return 'Nexus 10';
    if (/Nexus 7/i.test(ua)) return 'Nexus 7';
    if (/Nexus 6P/i.test(ua)) return 'Nexus 6P';
    if (/Nexus 5X/i.test(ua)) return 'Nexus 5X';
    if (/Nexus 5/i.test(ua)) return 'Nexus 5';
    if (/Nexus 4/i.test(ua)) return 'Nexus 4';

    // OnePlus
    if (/OnePlus/i.test(ua)) return 'OnePlus';

    // Generic Android tablet vs phone
    if (minDim >= 600) return 'Android Tablet';
    return 'Android Phone';
  }

  // Windows devices
  if (/Windows/.test(ua)) {
    if (/Surface Duo/i.test(ua)) return 'Surface Duo';
    if (/Surface/i.test(ua) || (minDim >= 900 && navigator.maxTouchPoints > 0)) return 'Surface Pro 7';
    return 'Windows Desktop';
  }

  // Mac
  if (/Macintosh|MacIntel/.test(platform)) {
    if (maxDim >= 1440) return 'MacBook Pro';
    return 'Mac Desktop';
  }

  // Linux
  if (/Linux/.test(platform)) {
    if (navigator.maxTouchPoints > 0) return 'Linux Tablet';
    return 'Linux Desktop';
  }

  // Smart displays
  if (/CrKey|Chromecast/i.test(ua)) return 'Chromecast';
  if (/Nest Hub/i.test(ua)) {
    if (maxDim >= 1280) return 'Nest Hub Max';
    return 'Nest Hub';
  }

  // Fallback: classify by screen size
  if (minDim <= 480) return 'Small Phone';
  if (minDim <= 768) return 'Phone/Tablet';
  if (minDim <= 1024) return 'Tablet';
  return 'Desktop';
}

/**
 * Get device category (phone, tablet, desktop) for broader styling decisions.
 */
export function getDeviceCategory() {
  const device = detectDevice();
  
  if (/iPhone|Pixel|Galaxy S|Nexus [456]|Android Phone|Small Phone|OnePlus/i.test(device)) {
    return 'phone';
  }
  if (/iPad|Tab|Surface|Nest|Android Tablet|Tablet/i.test(device)) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Check if device is touch-capable.
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
