/**
 * author       : Sunil Wang
 * createTime   : 2017/7/9 20:17
 * description  :
 */
const bucket = require('./bucket')
const DISK_PATTERN = /^(\S+)\n?\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\n/mg

function createDiskInfo (headlineArgs, args) {
  var info = {}

  headlineArgs.forEach(function (h, i) {
    info[h] = args[i]
  })

  return info
}

function parseDfStdout (stdout) {
  var dfInfo = []
  var headline

  stdout.replace(DISK_PATTERN, function () {
    var args = Array.prototype.slice.call(arguments, 1, 7)

    if (arguments[7] === 0) {
      headline = args
      return
    }
    dfInfo.push(createDiskInfo(headline, args))
  })

  return dfInfo
}

const drive = {
  info: function (diskName) {
    if (!diskName) {
      diskName = '/'
    }

    return bucket.exec('df -kP')().then(function (out) {
      var diskInfo = null
      var main = null
      var lines = parseDfStdout(out)

      for (var i = 0; i < lines.length; i++) {
        if (lines[i]['Mounted on'] === diskName) {
          diskInfo = lines[i]
          continue
        }

        if (lines[i]['Mounted on'] === '/') {
          main = lines[i]
          continue
        }
      }

      if (diskInfo === null) {
        if (main === null) {
          throw new Error('disk name invalid and / not found')
        }

        console.info('disk name invalid, using / as default')
        diskInfo = main
      }

      var total = Math.ceil(((diskInfo['1K-blocks'] || diskInfo['1024-blocks']) * 1024) / Math.pow(1024, 2))
      var used = Math.ceil(diskInfo.Used * 1024 / Math.pow(1024, 2))
      var free = Math.ceil((diskInfo.Available || diskInfo.Avail) * 1024 / Math.pow(1024, 2))

      var totalGb = (total / 1024).toFixed(1)
      var usedGb = (used / 1024).toFixed(1)
      var freeGb = (free / 1024).toFixed(1)

      var usedPercentage = (100 * usedGb / totalGb).toFixed(1)
      var freePercentage = (100 * freeGb / totalGb).toFixed(1)

      return Promise.resolve({
        totalGb: totalGb,
        usedGb: usedGb,
        freeGb: freeGb,
        usedPercentage: usedPercentage,
        freePercentage: freePercentage
      })
    })
  },
  free: function (diskName) {
    var self = this

    return self.info(diskName)
      .then(function (res) {
        return Promise.resolve({
          totalGb: res.totalGb,
          freeGb: res.freeGb,
          freePercentage: res.freePercentage
        })
      })
  },
  used: function (diskName) {
    var self = this

    return self.info(diskName)
      .then(function (res) {
        return Promise.resolve({
          totalGb: res.totalGb,
          usedGb: res.freeGb,
          usedPercentage: res.freePercentage
        })
      })
  }
}

module.exports = drive
