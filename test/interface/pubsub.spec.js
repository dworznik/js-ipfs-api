/* eslint-env mocha */

'use strict'

const test = require('interface-ipfs-core')
const isNode = require('detect-node')

const parallel = require('async/parallel')

const IPFSApi = require('../../src')

const DaemonFactory = require('ipfsd-ctl')
const df = DaemonFactory.create()

if (isNode) {
  const nodes = []
  const common = {
    setup: function (callback) {
      callback(null, {
        spawnNode: (cb) => {
          df.spawn({ args: ['--enable-pubsub-experiment'] },
            (err, _ipfsd) => {
              if (err) {
                return cb(err)
              }

              nodes.push(_ipfsd)
              cb(null, IPFSApi(_ipfsd.apiAddr))
            })
        }
      })
    },
    teardown: function (callback) {
      parallel(nodes.map((node) => (cb) => node.stop(cb)), callback)
    }
  }

  test.pubsub(common)
}
