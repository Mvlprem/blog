const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true },
  { collection: 'posts' }
)

// Virtual for post's URL
PostSchema.virtual('url').get(function () {
  return `/post/${this._id}`
})

// Virtual for post's publish date
PostSchema.virtual('publish__date').get(function () {
  return this.createdAt.toDateString().substring(4)
})

// Virtual for post's summary
PostSchema.virtual('summary').get(function () {
  if (this.body.length <= 123) return this.body
  return this.body.substring(0, 123) + '...'
})

module.exports = mongoose.model('Post', PostSchema)
