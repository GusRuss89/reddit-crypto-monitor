import Snoowrap from 'snoowrap'

import { redditCredentials } from './credentials'
import { subreddits } from './config'

const r = new Snoowrap(redditCredentials)
r.config({
  requestDelay: 300
})

function getPosts () {
  return new Promise((resolve, reject) => {
    let promises = []
    for (let sr of subreddits) {
      promises.push(r.getTop(sr, { limit: 20, time: 'day' }))
    }
    Promise.all(promises)
      .then(values => {
        let posts = []
        for (let listing of values) {
          posts = posts.concat(listing)
        }
        return posts
      })
      .then(posts => {
        let commentPromises = []
        for (let post of posts) {
          commentPromises.push(post.expandReplies({ limit: 10, depth: 2 }))
        }
        Promise.all(commentPromises)
          .then(posts => {
            resolve(posts)
          })
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  getPosts
}
