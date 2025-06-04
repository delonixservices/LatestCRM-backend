const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });


const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    enum: [ "readOnly", "readAndWrite", "admin" ], // Example roles
     // Array of permission names
    // If you want to reference the Permission model instead, uncomment the following line:
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Permission',
    required: true ,
    default: "readOnly" // Default role
  }
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);
module.exports =  Role ;