/* eslint-disable no-undef */
/**
 * author       : Sunil Wang
 * createTime   : 2017/7/10 14:51
 * description  :
 */

var osu = require('../')
var assert = require('assert')

describe('cpu', function () {
  it('returns cpu average and count', function (done) {
    this.timeout(5000)

    var cpu = osu.cpu
    var info = cpu.average()
    var count = cpu.count()
    assert.ok(count > 0)
    assert.ok(Object.keys(info).length > 0)
    done()
  })

  it('returns cpu usage', function (done) {
    this.timeout(5000)

    var cpu = osu.cpu

    cpu.usage().then(num => {
      assert.ok(num > 0)
      done()
    })
  })
})

describe('mem', function () {
  it('returns mem info', function (done) {
    var mem = osu.mem
    mem.info().then(info => {
      assert.ok(Object.keys(info).length > 0)
      done()
    })
  })
})

describe('drive', function () {
  it('returns drive info', function (done) {
    var drive = osu.drive

    drive.info().then(info => {
      assert.ok(Object.keys(info).length > 0)
      done()
    })
  })
})

describe('netstat', function () {
  it('returns stats', function (done) {
    const netstat = osu.netstat
    netstat.stats().then(info => {
      assert.ok(Object.keys(info).length > 0)
      done()
    })
  })
})

describe('os', function () {
  it('returns ip', function () {
    const ip = osu.os.ip()
    assert.ok(ip)
  })
  it('returns hostname', function () {
    const result = osu.os.hostname()
    assert.ok(result)
  })
})
