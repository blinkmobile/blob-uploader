// @flow
'use strict'

require('dotenv').config()
const Boom = require('boom')

const credentials = require('../../lib/credentials.js')

module.exports.get = function (
) /* :Promise<Object> */ {
  return credentials.getTemporaryCredentials()
    .catch((err) => {
      console.log('Error retrieving temporaryCredentials: ' + err)
      throw Boom.badImplementation('Internal Server error')
    })
}
