declare global {
  interface Window {
    _paq?: unknown[][]
  }
}

export function initMatomo() {
  const url = import.meta.env.VITE_MATOMO_URL
  const siteId = import.meta.env.VITE_MATOMO_SITE_ID
  if (!url || !siteId) return

  const trackerBase = url.endsWith('/') ? url : `${url}/`
  const _paq = (window._paq = window._paq || [])
  // Cookieless tracking keeps the site exempt from a consent banner (CNIL / GDPR).
  _paq.push(['disableCookies'])
  _paq.push(['trackPageView'])
  _paq.push(['enableLinkTracking'])
  _paq.push(['setTrackerUrl', `${trackerBase}matomo.php`])
  _paq.push(['setSiteId', siteId])

  const script = document.createElement('script')
  script.async = true
  script.src = `${trackerBase}matomo.js`
  document.head.appendChild(script)
}

export function trackEvent(category: string, action: string, name?: string, value?: number) {
  window._paq?.push(['trackEvent', category, action, name, value])
}
