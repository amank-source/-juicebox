const express = require('express')
const tagsRouter = express.Router()
const { getAllTags, getPostsByTagName } = require('../db')
const { requireActiveUser } = require('./utils')

tagsRouter.use((req, res, next) => {
  console.log('A request is being made to /posts')

  next()
})

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags()

  res.send({
    tags: tags,
  })
})

tagsRouter.get('/:tagName/posts', requireActiveUser, async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params
  try {
    const allPosts = await getPostsByTagName(tagName)
    const posts = allPosts.filter((post) => {
      if (post.active && req.user && post.author.id === req.user.id) {
        return true
      }
      if (
        post.author.active ||
        (!post.author.active && req.user && post.author.id === req.user.id)
      ) {
        return true
      }
      return false
    })

    res.send({ posts: posts })
  } catch ({ name, message }) {
    next({ name, message })
  }
})
module.exports = tagsRouter
