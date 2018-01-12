import EasyFtp from 'easy-ftp'

import { ftpCredentials } from './credentials'

const ftp = new EasyFtp()

module.exports = function (runDate) {
  return new Promise((resolve, reject) => {
    ftp.connect(ftpCredentials)

    const remotePath = '/reddit-crypto.angusrussell.me/db/'
    const files = [
      { local: 'db/db.json', remote: `${remotePath}db.json`},
      { local: `db/db-${runDate}.json`, remote: `${remotePath}db-${runDate}.json` }
    ]
    ftp.upload(files, (err) => {
      if (err) reject(err)
      ftp.close()
      resolve()
    })
  })
}
