/**
 * author       : Sunil Wang
 * createTime   : 2017/7/9 18:29
 * description  :
 */

const bucket = require('./lib/bucket')

const cpu = require('./lib/cpu')
const mem = require('./lib/mem')

require('./lib/drive')
require('./lib/netstat')
require('./lib/openfiles')
require('./lib/osCmd')
require('./lib/os')
require('./lib/proc')
require('./lib/users')

bucket.cpu = cpu
bucket.mem = mem

module.exports = bucket
