const Boom = require('@hapi/boom')
const { promisify } = require('util')

module.exports = {
  auth: false,
  plugins: {
    'crumb': false
  },
  pre: [
    {
      method: async (request, h) => {
        const { saml } = request.pre
        const { SAMLRequest, SAMLResponse } = request.payload
        if (SAMLRequest) {
          return Boom.notAcceptable('SAMLRequest not supported')
        }

        if (SAMLResponse) {
          const profile = await promisify(saml.validatePostResponse).bind(saml)(request.payload)
          return profile.nameID
        }

        return Boom.notAcceptable('Invalid SAML format')
      },
      assign: 'userIdentifier'
    },
    {
      method: async (request, h) => {
        const {
          pre: {
            userIdentifier,
            login
          }
        } = request

        return Boolean(await login(request, userIdentifier))
      },
      assign: 'isLoginSuccessful'
    }
  ],
  handler: async (request, h) => {
    const { isLoginSuccessful, redirectUrlAfterSuccess, redirectUrlAfterFailure } = request.pre
    const { RelayState } = request.payload || {}
    const redirectUrlAfterSuccessFinal = RelayState || redirectUrlAfterSuccess
    const url = isLoginSuccessful ? redirectUrlAfterSuccessFinal : redirectUrlAfterFailure
    return h.redirect(url)
  },
  tags: ['api', 'saml'],
  description: 'SAML service provider callback',
  notes: 'SAML service provider callback'
}
