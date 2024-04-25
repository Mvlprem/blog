const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const Post = require('../models/post')

// Index Page
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const locals = {
      title: 'Blog - Mvlprem',
      description: 'Simple Blog created with Nodejs, Express & MongoDB.',
    }
    const posts = await Post.find()
    res.render('index', { locals, posts })
  })
)

// Single Post Page
router.get(
  '/post/:id',
  asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)

    if (post === null) {
      // No results.
      const err = new Error('Post not found')
      err.status = 404
      return next(err)
    }

    const locals = {
      title: post.title,
      description: post.summary,
    }

    res.render('post', { locals, post })
  })
)

module.exports = router
