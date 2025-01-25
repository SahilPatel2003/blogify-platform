const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
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
  isRegisterd:{
      type:Boolean
  },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
