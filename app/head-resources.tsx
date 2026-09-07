'use client'

import ReactDOM from 'react-dom'

export function HeadResources() {
  ReactDOM.preconnect('https://fonts.googleapis.com')
  ReactDOM.preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' })
  ReactDOM.prefetchDNS('https://www.facebook.com')
  ReactDOM.prefetchDNS('https://www.instagram.com')
  ReactDOM.prefetchDNS('https://wa.me')

  return null
}
