import Cookies from 'js-cookie'

export const cookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  expires: 7 // 7 days
}

export const setCookie = (key: string, value: any) => {
  Cookies.set(key, typeof value === 'object' ? JSON.stringify(value) : value, {
    ...cookieOptions,
    sameSite: 'strict'
  })
}

export const getCookie = (key: string) => {
  const value = Cookies.get(key)
  try {
    return value ? JSON.parse(value) : null
  } catch {
    return value
  }
}

export const removeCookie = (key: string) => {
  Cookies.remove(key)
}
