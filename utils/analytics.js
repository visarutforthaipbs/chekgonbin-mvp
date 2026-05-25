export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;

  const gtag = window.gtag;
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...params });
  }
}
