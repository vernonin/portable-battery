const TOKEN_KEY = 'token'

/**
 * @param {*} token token
 */
export const SET_AUTH = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * @return token
 */
export const GET_AUTH =() => {
  return localStorage.getItem(TOKEN_KEY)
}

export const REMOVE_AUTH = () => {
  localStorage.removeItem(TOKEN_KEY)
}