import { redditWeights } from './config'

function getRegex (coin) {
  return new RegExp('\\b(' + coin.symbol + '|' + coin.name + ')\\b')
}

// Returns the number of upvotes a post has IF it mentions the coin
function postMentionsCoin (post, coin) {
  let re = getRegex(coin)
  // Title
  if (post.title.match(re)) {
    return parseInt(post.score, 10)
  }
  // Self text
  if (post.is_self && typeof post.selftext_html === 'string') {
    if (post.selftext_html.match(re)) {
      return parseInt(post.score, 10)
    }
  }
  return 0
}

function commentMentionsCoin (comment, coin) {
  let re = getRegex(coin)
  // Body
  if (comment.body.match(re)) {
    return parseInt(comment.score, 10)
  }
  return 0
}

function getMentions (coins, posts) {
  for (let post of posts) {
    for (let coin of coins) {
      // Post mentions
      let upvotes = postMentionsCoin(post, coin)
      if (upvotes > 0) {
        coin.postMentions += 1
        coin.postsScore += upvotes
        coin.totalScore += upvotes * redditWeights.post
        coin.posts.push({
          title: post.title,
          url: `https://reddit.com${post.permalink}`
        })
      }
      // First level of comments
      for (let comment of post.comments) {
        let cUpvotes = commentMentionsCoin(comment, coin)
        if (cUpvotes > 0) {
          coin.commentMentions += 1
          coin.commentsScore += cUpvotes
          coin.totalScore += cUpvotes * redditWeights.comment
          coin.comments.push({
            title: comment.body,
            url: `https://reddit.com${comment.permalink}`
          })
        }
        // First level of comment replies
        for (let reply of comment.replies) {
          let rUpvotes = commentMentionsCoin(reply, coin)
          if (rUpvotes > 0) {
            coin.commentMentions += 1
            coin.commentsScore += rUpvotes
            coin.totalScore += rUpvotes * redditWeights.commentReply
            coin.comments.push({
              title: reply.body,
              url: `https://reddit.com${reply.permalink}`
            })
          }
        }
      }
    }
  }
  return coins
}

module.exports = {
  getMentions
}
