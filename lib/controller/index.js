const callback = require('./handlers/callback')
const login = require('./handlers/login')
const logout = require('./handlers/logout')
const metadata = require('./handlers/metadata')

module.exports = {
  callback,
  login,
  logout,
  metadata
}
