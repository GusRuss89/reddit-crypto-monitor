import rp from 'request-promise-native'

function getTopCoins (numToGet = 100, start = 0) {
  return new Promise((resolve, reject) => {
    let uri = `https://api.coinmarketcap.com/v1/ticker/?limit=${numToGet}&start=${start}`
    rp({ uri, json: true })
      .then(response => {
        let coins = []
        for (let coin of response) {
          coins.push(Object.assign({}, coin, {
            postMentions: 0,
            postsScore: 0,
            commentMentions: 0,
            commentsScore: 0,
            totalScore: 0,
            posts: [],
            comments: []
          }))
        }
        resolve(coins)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  getTopCoins
}
