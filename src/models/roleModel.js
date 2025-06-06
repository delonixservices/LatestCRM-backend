const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    enum: [ "readOnly", "create", "Update", "delete"], 
    required: true ,
    default: "readOnly" // Default role
  }
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);
module.exports =  Role ;