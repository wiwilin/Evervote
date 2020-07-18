const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = mongoose.model('users');

const login = function (req, res, next) {

  User.findOne({
    email: req.body.email,
  }, function (err, result) {
    if (err) {
      console.error('Error in the query');
    }

    // Finds entry
    if (result != null) {
      bcrypt.compare(req.body.password, result.password, function (err, match) {
        // Correct Password
        if (match) {
          req.session.loggedin = true;
          req.session.name = result.name;
          req.session.userId = result._id;
          res.redirect('/');
        }

        // Wrong password
        else {
          console.log('Wrong credentials');
          req.session.signinError = 'Wrong credentials';
          res.redirect('/signin');
        }
      });
    }

    // User not found
    else {
      console.log('User not found in db');
      req.session.signinError = 'No user associated with that email';
      res.redirect('/signin');
    }

  });
};

const signup = function (req, res, next) {
  User.findOne({
    email: req.body.email,
  }, function (err, result) {

    if (err) {
      console.error('Error in the query');
    }

    // User with that email already exists in db
    if (result != null) {
      req.session.signupError = 'Email already exists in database';
      res.redirect('/signup');
    }

    // Create new user
    else {
      // Passwords match
      if (req.body.password == req.body.password_confirm) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {

            var item = {
              name: req.body.name,
              email: req.body.email,
              password: hash,
              vote_to: '',
            };

            var user = new User(item);
            user.save(function () {
              console.log('User created successfully');
            });

            res.redirect('/signin');
          });
        });
      }

      // No match
      else {
        req.session.signupError = "Password don't match";
        res.redirect('/signup');
      }
    }
  });
};

module.exports.login = login;
module.exports.signup = signup;
