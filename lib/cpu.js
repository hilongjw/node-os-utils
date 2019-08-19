/**
 * author       : Sunil Wang
 * createTime   : 2017/7/9 19:39
 * description  :
 */
const bucket = require('./bucket')
const os = require('os')

const cpuUtils = {
  average: function () {
    let totalIdle = 0
    let totalTick = 0
    const cpus = os.cpus()

    for (let i = 0, len = cpus.length; i < len; i++) {
      let cpu = cpus[i]
      Object.keys(cpu.times).forEach(type => {
        totalTick += cpu.times[type]
      })
      totalIdle += cpu.times.idle
    }

    return {
      totalIdle: totalIdle,
      totalTick: totalTick,
      avgIdle: (totalIdle / cpus.length),
      avgTotal: (totalTick / cpus.length)
    }
  },
  usage: (interval) => {
    if (!interval) {
      interval = bucket.options.INTERVAL
    }
    return new Promise((resolve) => {
      if (typeof interval !== 'number') {
        throw new TypeError('interval must be a number!')
      }

      const startMeasure = cpuUtils.average()

      setTimeout(() => {
        const endMeasure = cpuUtils.average()
        const idleDifference = endMeasure.avgIdle - startMeasure.avgIdle
        const totalDifference = endMeasure.avgTotal - startMeasure.avgTotal
        const cpuPercentage = (10000 - Math.round(10000 * idleDifference / totalDifference)) / 100

        return resolve(cpuPercentage)
      }, interval)
    })
  },
  free: (interval) => {
    if (!interval) {
      interval = bucket.options.INTERVAL
    }
    return new Promise((resolve) => {
      if (typeof interval !== 'number') {
        throw new TypeError('interval must be a number!')
      }
      this.usage(interval)
        .then(function (cpuPercentage) {
          return resolve(100 - cpuPercentage)
        })
    })
  },
  count: function () {
    return os.cpus().length
  },
  model: function () {
    return os.cpus()[0].model
  },
  loadavg: function () {
    return os.loadavg()
  },
  loadavgTime: (time) => {
    time = parseInt(time, 10)

    const loads = os.loadavg()

    switch (time) {
      case 5:
        return loads[1]
      case 15:
        return loads[2]
      default: return loads[0]
    }
  }
}

module.exports = cpuUtils