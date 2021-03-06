const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const passport = require('passport');
const Mentor = require('../models/Mentor.js');

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/fail',
    // successRedirect: '/user/success',
  }),
  (req, res) => {
    res.json(req.user);
  }
);
// (req, res) => {
//   console.log('you are signed in');
//   // res.json('signed in');
//   res.redirect('/user/auth/local');
// }

router.get(
  '/connect/google',
  passport.authorize('google-authz', { scope: ['profile'] })
);

router.get(
  '/connect/google/callback',
  passport.authorize('google-authz', { failureRedirect: '/fail' }),
  async (req, res) => {
    const user = req.user;
    user.googleId = req.account;
    await user.save();
    console.log('you have added google info');
    res.json('google acount connected');
  }
);

router.post(
  '/auth/local',
  passport.authenticate('local', {
    failureRedirect: '/fail',
    // successRedirect: '/user/success',
  }),
  async (req, res) => {
    if (
      req.body.lastName !== '' ||
      req.body.firstName !== '' ||
      req.body.mentors.length !== 0
    ) {
      const user = req.user;
      let firstName = user.firstName;
      let lastName = user.lastName;
      let mentors = user.mentors;
      if (req.body.mentors.length !== 0) {
        mentors = await Mentor.find({ _id: { $in: req.body.mentors } }, '_id');
      }
      if (req.body.lastName !== '') lastName = req.body.lastName;
      if (req.body.firstName !== '') firstName = req.body.firstName;
      try {
        await User.updateOne(
          { _id: user._id },
          {
            $addToSet: { mentors: mentors },
            $set: { lastName: lastName, firstName: firstName },
          }
        );
      } catch (err) {
        if (err.keyValue.googleId !== null) {
          console.log('ERROR', err, '\n We are going to ignore it for now');
        }
      }
    }
    console.log('you are signed in locally');
    const newUser = await User.findById(req.user._id);
    res.json(newUser);
  }
);

router.post(
  '/add/mentor',
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/user/auth/add/mentor');
    }
    next();
  },
  (req, res) => {
    req.session.user.push(req.body);
    res.json('mentor added to ip session');
  }
);

router.post('auth/add/mentor', async (req, res) => {
  await User.updateOne(
    { _id: req.user._id },
    { $addToSet: { mentors: req.body } }
  );
  res.json('mentor added successfully');
});

router.get(
  '/init',
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/user/auth/init');
    }
    next();
  },
  async (req, res) => {
    // const user = await User.findOne().populate('mentors');
    // res.json(user);
    res.status(515);
  }
);

router.get('/auth/init', async (req, res) => {
  res.json(req.user);
});

router.get('/logout', (req, res) => {
  if (!req.isAuthenticated()) {
    console.log('you are not allowed to see that');
    return res.json('not allowed');
  }
  console.log('you are about to log out');
  req.logout();
  console.log('you are logged out');
  res.json('signed out');
});

module.exports = router;
