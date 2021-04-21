const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: 'string',
      trim: true,
      required: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: 'string',
      trim: true,
      required: true,
      max: 60,
      lowercase: true,
    },
    email: {
      type: 'string',
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    profile: {
      type: 'string',
      required: true,
    },
    hashed_password: {
      type: String,
      require: true,
    },
    salt: String,
    about: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    resetPasswordLink: {
      type: String,
      default: '',
    },
  },
  { timestamp: true }
);

userSchema
  .virtual('password')
  .set(function (password) {
    //create a temp password
    this._password = password;
    //generate salt and
    this.salt = this.makeSalt();
    //encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (password) {
    return this.encryptPassword(password) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (error) {
      return '';
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
};
module.exports = mongoose.model('User', userSchema);
