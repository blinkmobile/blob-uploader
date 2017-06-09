/* @flow */
'use strict'

const test = require('tape')
const boom = require('boom')
const lib = require('../../../lib/ensure-env-var.js')

test('Should throw Boom error if environment variable not set', (t) => {
  t.plan(1)
  try {
    lib('TEST')
  } catch (err) {
    t.deepEqual(err, boom.badImplementation('TEST environment variable is mandatory'))
  }
  t.end()
})

test('Should succeed when environment variable set', (t) => {
  t.plan(1)
  process.env.TEST = 'test'
  t.is(lib('TEST'), 'test')
  process.env.TEST = ''
  t.end()
})
