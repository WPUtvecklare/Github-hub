const setCookie = (value) => {
  const date = new Date()
  date.setTime(date.getTime() + (1 * 60 * 60 * 1000))
  document.cookie = 'token=' + value + '; expires=' + date.toUTCString()
}

const getCookie = (value) => {
  const cookie = {}
  document.cookie.split(';').forEach((el) => {
    const [k, v] = el.split('=')
    cookie[k.trim()] = v
  })
  return cookie.token
}

module.exports = {
  setCookie,
  getCookie
}