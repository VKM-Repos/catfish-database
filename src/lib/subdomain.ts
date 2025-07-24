// src/utils/subdomain.js

export function getCurrentSubdomain() {
  const hostname = window.location.hostname

  if (hostname === 'localhost') {
    return 'dev'
  }

  const parts = hostname.split('.')

  if (parts[0] === 'www') {
    parts.shift()
  }

  return parts[0]
}
