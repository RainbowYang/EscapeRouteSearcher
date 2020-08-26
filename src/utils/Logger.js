const moment = require('moment')
const { blue, green } = require('chalk')

let surround = text => '[' + text + ']'
let now = () => moment().format('YYYY/MM/DD HH:mm:ss.SSS')
let INFO = blue('[INFO]')

class Logger {
  constructor (name) {
    this.name = name
    this.info = (...msg) => console.log(surround(now()), INFO, green(surround(this.name)), ...msg)
  }
}

module.exports = { Logger }
