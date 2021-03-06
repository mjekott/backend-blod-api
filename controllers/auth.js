const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

exports.signup = (req, res, next) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken',
      });
    }

    const { name, email, password } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    let newUser = new User({ name, email, password, profile, username });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json({
        message: 'Signup Success! Please signin',
      });
    });
  });
};

exports.signin = (req, res, next) => {
  const { email, password } = req.body;
  //check id user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid Login' });
    }
    //aunthenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({ error: 'Invalid Login' });
    }
    //genearate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.cookie('token', token, { expiresIn: '1d' });
    const { _id, username, name, email, role } = user;
    return res.json({ token, user: { _id, username, name, email, role } });
  });
};

exports.signout = (req, res, next) => {
  res.clearCookie('token');
  res.json({
    message: 'Sign out success',
  });
};

exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'User not found' });
    }

    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (user.role !== 1) {
      return res.status(400).json({ error: 'Admin resource.Access denied' });
    }

    req.profile = user;
    next();
  });
};
