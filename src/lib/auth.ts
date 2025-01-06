export function isAuthenticated(): boolean {
  //   const token = localStorage.getItem('authToken') || document.cookie.match(/authToken=([^;]*)/)?.[1]
  const token = true
  return Boolean(token)
}
