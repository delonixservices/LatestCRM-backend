const mongoose = require('mongoose');
const Role = require('./roleModel'); // Assuming roleModel exports the Role model

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type : String,
    ref: 'Role',
  },
  
  },
 { timestamps: true });

const User  = mongoose.model('User', userSchema);

module.exports = User;

  