import 'babel-polyfill'

import cmc from './cmc'
import reddit from './reddit'
import crunch from './crunch'
import jsondb from './jsondb'
import deploy from './deploy'
import mail from './mail'

mail.addToMsg('Getting coins and reddit posts')
let coinsPromise = cmc.getTopCoins(300)
let postsPromise = reddit.getPosts()
let dbPromise = jsondb.getDatabase()

Promise.all([coinsPromise, postsPromise, dbPromise])
  .then(values => {
    mail.addToMsg('Got them. Crunching...')
    let [coins, posts, db] = values
    coins = crunch.getMentions(coins, posts)

    mail.addToMsg('Crunched. Sorting and filtering...')
    let mentionedCoins = []
    for (let coin of coins) {
      if (coin.totalScore > 0) {
        mentionedCoins.push(coin)
      }
    }
    mentionedCoins.sort((a, b) => a.totalScore - b.totalScore)
    mentionedCoins.reverse()

    mail.addToMsg('Sorted. Updating JSON db...')
    db.dates.unshift({
      date: Date.now(),
      coins: mentionedCoins
    })
    db.dates.slice(0, 6)
    jsondb.writeDatabase(db)

    mail.addToMsg('Updated. Uploading via FTP...')
    deploy()
      .then(() => {
        mail.addToMsg('Deployed!')
        mail.success()
      })
      .catch(err => {
        mail.fail('Damn, so close! Something went wrong with the upload.', err)
      })
  })
  .catch(err => {
    mail.fail('A promise failed', err)
  })
