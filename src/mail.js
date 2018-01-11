import mailgun from 'mailgun-js'

import { mailgunConfig } from './credentials'
import { emails } from './config'

const mg = mailgun(mailgunConfig)

let msg = ''

module.exports.addToMsg = (content, obj = '') => {
  console.log(content, obj)
  msg += `${content} <br />`
  if (obj) {
    msg += `${JSON.stringify(obj, null, 2)} <br />`
  }
}

const prependMsg = (content) => {
  msg = content + msg
}

const notification = (subject, to, cb = () => null) => {
  const sendData = {
    from: 'Crypto Bot <cryptobot@manyquotes.com.au>',
    to: to,
    subject: subject,
    html: msg
  }
  mg.messages().send(sendData, function (error, body) {
    console.log(error, body)
    cb()
  })
}

module.exports.success = () => {
  prependMsg('<p><a href="http://reddit-crypto.angusrussell.me/">View the updated monitor</a></p><h2>Log</h2>')
  notification('Reddit Crypto Monitor Updated Successfully', emails.success)
}

module.exports.fail = (content, obj = '') => {
  prependMsg('<h2>Log</h2>')
  module.exports.addToMsg(content, obj)
  notification('Reddit Crypto Monitor Failed', emails.fail, () => process.exit())
}
