const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const Post = require('../models/post')
const Admin = require('../models/admin')

const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// LocalStrategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const admin = await Admin.findOne({ username: username })
      if (!admin) return done(null, false, { message: 'Incorrect username' })

      const match = await bcrypt.compare(password, admin.password)
      if (!match) return done(null, false, { message: 'Incorrect password' })

      return done(null, admin)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser((admin, done) => {
  done(null, admin.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const admin = await Admin.findById(id)
    done(null, admin)
  } catch (err) {
    done(err)
  }
})

// Admin - Index Page
router.get(
  '/index',
  asyncHandler(async (req, res) => {
    const locals = {
      title: 'Admin',
      description: 'Simple Blog created with Nodejs, Express & MongoDB.',
    }

    !req.user
      ? res.render('admin/index', { locals })
      : res.redirect('/admin/dashboard')
  })
)

// Admin - Dashboard Page
router.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    const locals = {
      title: 'Admin - dashboard',
      description: 'Simple Blog created with Nodejs, Express & MongoDB.',
    }

    const posts = await Post.find()

    !req.user
      ? res.redirect('/admin/index')
      : res.render('admin/dashboard', { locals, posts })
  })
)

// Admin - Login
router.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/index',
  })
)

// Admin - Logout
router.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

// Add post
router.get(
  '/add-post',
  asyncHandler(async (req, res) => {
    const locals = {
      title: 'Add post',
      description: 'Simple Blog created with Nodejs, Express & MongoDB.',
    }

    !req.user
      ? res.redirect('/admin/index')
      : res.render('admin/add-post', { locals })
  })
)

router.post(
  '/add-post',
  asyncHandler(async (req, res) => {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
    })

    if (!req.user) {
      res.redirect('/admin/index')
    } else {
      await newPost.save()
      res.redirect('/admin/dashboard')
    }
  })
)

// Edit post
router.get(
  '/edit-post/:id',
  asyncHandler(async (req, res) => {
    const locals = {
      title: 'Edit post',
      description: 'Simple Blog created with Nodejs, Express & MongoDB.',
    }

    if (!req.user) res.redirect('/admin/index')

    const post = await Post.findById(req.params.id)
    res.render('admin/edit-post', { locals, post })
  })
)

router.post(
  '/edit-post/:id',
  asyncHandler(async (req, res) => {
    const newPost = new Post({
      _id: req.params.id,
      title: req.body.title,
      body: req.body.body,
    })

    if (!req.user) {
      res.redirect('/admin/index')
    } else {
      await Post.findByIdAndUpdate(req.params.id, newPost)
      res.redirect(`/post/${req.params.id}`)
    }
  })
)

// Delete Post
router.post(
  '/delete-post/:id',
  asyncHandler(async (req, res) => {
    if (!req.user) {
      res.redirect('/admin/index')
    } else {
      await Post.findByIdAndDelete(req.params.id)
      res.redirect('/admin/dashboard')
    }
  })
)

module.exports = router
