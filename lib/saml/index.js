const Saml = require('passport-saml/lib/passport-saml/saml')

const createSAML = (options = {}) => {
  const instance = new Saml.SAML(options)
  instance.decryptionCert = options.decryptionCert
  return instance
}

module.exports = createSAML
