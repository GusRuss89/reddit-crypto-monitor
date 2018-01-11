import EasyFtp from 'easy-ftp'

import { ftpCredentials } from './credentials'

const ftp = new EasyFtp()

module.exports = function () {
  return new Promise((resolve, reject) => {
    ftp.connect(ftpCredentials)

    ftp.upload('db/db.json', '/reddit-crypto.angusrussell.me/db/db.json', (err) => {
      if (err) reject(err)
      ftp.close()
      resolve()
    })
  })
}
