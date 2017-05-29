/* @flow */
'use strict'

const test = require('blue-tape')
const boom = require('boom')
const lib = require('../../lib/ensure-env-var.js')

test('Should throw Boom error if environment variable not set', function(t){
    t.plan(1)
    try{
        lib('TEST')
    } catch (err) {
        t.deepEqual(err,boom.badImplementation('TEST environment variable is mandatory'))
    }
})