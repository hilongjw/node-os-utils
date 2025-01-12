## Description

monitor vital signs of your server :

- CPU average usage
- Free and used drive space
- Free and used memory space
- Operating System
- All processes running
- TTY/SSH opened
- Total opened files
- Network speed (input and output)

# async-os-utils

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

An operating system utility library. Some methods are wrappers of node libraries and others are calculations made by the module.

[os-utils](https://github.com/oscmejia/os-utils) extended
[node-os-utils](https://github.com/oscmejia/os-utils) extended

## Installation

One line installation with [npm](http://npmjs.org).

```bash
$ npm install async-os-utils --save
```
Then in your code

## Example

```js
var osu = require('async-os-utils')
var cpu = osu.cpu

var count = cpu.count() // 8

cpu.usage()
  .then(cpuPercentage => {
    console.log(cpuPercentage) // 10.38
  })
  
var osCmd = osu.osCmd  

osCmd.whoami()
  .then(userName => {
    console.log(userName) // admin
  })
```

## Configuration

require('async-os-utils').options

Default settings:

- `NOT_SUPPORTED_VALUE` is `not supported`. os not supported, return value. 
- `INTERVAL` is `1000` millisecond. Represents the refresh of the cpu and network workers.

:warning: If this module uses too much CPU, set the `INTERVAL` value to 10000 or more.

## Info

If you have `not supported` in some categories, your OS configuration is not supported for this option.

## Usage
The following methods are available:

### require('async-os-utils').cpu

#### cpu.average():object

CPU average

```js
var osu = require('async-os-utils')
var cpu = osu.cpu

var info = cpu.average()

console.log(info)
```
```
{ totalIdle: 33526410,
  totalTick: 37460330,
  avgIdle: 4190801.25,
  avgTotal: 4682541.25 }
```

#### cpu.usage(interval):Promise(number)

CPU average usage

- [interval]: number - interval millisecond. defaulta: 1000

```js
var osu = require('async-os-utils')
var cpu = osu.cpu

cpu.usage()
  .then(info => {
    console.log(info)
  })
```
```
10.06
```

#### cpu.free(interval):Promise(number)

cpu free percentage

- [interval]: number - interval millisecond. defaulta: 1000

```js
var osu = require('async-os-utils')
var cpu = osu.cpu

cpu.free()
  .then(info => {
    console.log(info)
  })
```
```
89.26
```
#### cpu.count():number
#### cpu.model():string
#### cpu.loadavg():Array[number]
#### cpu.loadavgTime(time):number

- time: number - 1, 5 or 15 minutes, defaulta: 1

---

### require('async-os-utils').drive

#### drive.info():Promise(Object)

drive info

```js
var osu = require('async-os-utils')
var drive = osu.drive

drive.info()
  .then(info => {
    console.log(info)
  })

```
```
{ totalGb: '464.8',
  usedGb: '147.7',
  freeGb: '316.9',
  usedPercentage: '31.8',
  freePercentage: '68.2' }
```

#### drive.free():Promise(Object)
```
{ totalGb: '464.8', freeGb: '316.9', freePercentage: '68.2' }
```
#### drive.used():Promise(Object)
```
{ totalGb: '464.8', usedGb: '316.9', usedPercentage: '68.2' }
```

---

### require('async-os-utils').mem

#### mem.info():Promise(Object)

memory info

```js
var osu = require('async-os-utils')
var mem = osu.mem

mem.info()
  .then(info => {
    console.log(info)
  })

```
```
{ totalMemMb: 16384,
  usedMemMb: 13403.41,
  freeMemMb: 2980.59,
  freeMemPercentage: 18.19 }
```
#### mem.free():Promise(Object)
```
{ totalMemMb: 16384, freeMemMb: 3033.63 }
```
#### mem.used():Promise(Object)
```
{ totalMemMb: 16384, usedMemMb: 13421.15 }
```
#### mem.totalMem():number
```
17179869184
```

---

### require('async-os-utils').netstat

#### netstat.stats():Promise(Array[Object])
```js
var osu = require('async-os-utils')
var netstat = osu.netstat

netstat.stats()
  .then(info => {
    console.log(info)
  })

```
```
[ { interface: 'lo',
    inputBytes: '731508412',
    outputBytes: '731508412' },
  { interface: 'eth0',
    inputBytes: '1356471479',
    outputBytes: '26631036763' } ]
```

#### netstat.inOut(interval):Promise(Object)

- [interval]: number - interval millisecond. defaulta: 1000

```js
var osu = require('async-os-utils')
var netstat = osu.netstat

netstat.inOut()
  .then(info => {
    console.log(info)
  })

```
```
{ total: { inputMb: 0.02, outputMb: 1.22 },
  eth0: { inputMb: 0.02, outputMb: 1.22 } }
```

---

### require('async-os-utils').openfiles

#### openfiles.openFd():Promise(number)
Total opened files

```
1088
```

---

### require('async-os-utils').os

#### os.oos():Promise(string)

original operating system

```
Mac OS X 10.12.5
```
```
Red Hat 7.3
```

#### os.platform():string
#### os.uptime():number - (seconds)
#### os.ip():string
#### os.hostname():string
#### os.type():string
#### os.arch():string

---

### require('async-os-utils').proc

#### proc.totalProcesses():Promise(number)
#### proc.zombieProcesses():Promise(number)

---

### require('async-os-utils').users

#### users.openedCount():Promise(number)
TTY/SSH opened

---

### require('async-os-utils').osCmd

#### osCmd.topCpu():Promise(string)
#### osCmd.topMem():Promise(string)
#### osCmd.vmstats():Promise(string)
......

```js
var bucket = require('./bucket')

bucket.osCmd = {
  topCpu: bucket.exec('ps -eo pcpu,user,args --no-headers | sort -k 1 -n | tail -n 10 | sort -k 1 -nr | cut -c 1-70'),
  topMem: bucket.exec('ps -eo pmem,pid,cmd | sort -k 1 -n | tail -n 10 | sort -k 1 -nr | cut -c 1-70'),
  vmstats: bucket.exec('vmstat -S m'),
  processesUsers: bucket.exec('ps hax -o user | sort | uniq -c'),
  diskUsage: bucket.exec('df -h'),
  who: bucket.exec('who'),
  whoami: bucket.exec('whoami'),
  openPorts: bucket.exec('lsof -Pni4 | grep ESTABLISHED'),
  ifconfig: bucket.exec('ifconfig')
}
```


## License

[MIT](LICENSE). Copyright (c).

[npm-image]: https://img.shields.io/npm/v/async-os-utils.svg
[npm-url]: https://www.npmjs.com/package/async-os-utils
[downloads-image]: https://img.shields.io/npm/dt/async-os-utils.svg
[downloads-url]: https://npmjs.org/package/async-os-utils
