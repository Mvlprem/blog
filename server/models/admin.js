const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: 'admin' }
)

module.exports = mongoose.model('Admin', AdminSchema)
