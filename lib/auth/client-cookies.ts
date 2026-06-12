// import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/auth/session-edge'
//
// const REFRESH_MAX_AGE = 60 * 60 * 24 * 30 // 30 days, matches backend refresh token lifetime
//
// function setCookie(name: string, value: string, maxAge: number) {
//   const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; secure' : ''
//   document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax${secure}`
// }
//
// function clearCookie(name: string) {
//   document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
// }
//
// export function setAuthCookies(accessToken: string, refreshToken: string, expiresIn: number) {
//   setCookie(ACCESS_COOKIE, accessToken, expiresIn)
//   setCookie(REFRESH_COOKIE, refreshToken, REFRESH_MAX_AGE)
// }
//
// export function clearAuthCookies() {
//   clearCookie(ACCESS_COOKIE)
//   clearCookie(REFRESH_COOKIE)
// }
