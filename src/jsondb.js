import fs from 'fs-extra'

import mail from './mail'

const dataFile = './db/db.json'

function getDatabase () {
  let data
  try {
    data = fs.readFileSync(dataFile)
    return JSON.parse(data)
  } catch (err) {
    mail.fail('Failed to read db file', err)
  }
}

function writeDatabase (data, runDate) {
  fs.writeFileSync(dataFile, JSON.stringify(data))
  fs.copySync(dataFile, `./db/db-${runDate}.json`)
}

module.exports = {
  getDatabase,
  writeDatabase
}
