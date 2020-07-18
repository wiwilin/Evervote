const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller.js');
const authController = require('../controllers/authenticate.js');

/* GET users by id. */
router.get('/:id', (req, res) => {
  if (req.session.loggedin) {
    var selectedId = req.params.id;
    var userId = req.session.userId;

    // If the user selected the link to their own page they may edit it.
    if (userId == selectedId) {
      userPromise = userController.getUserByID(req, res);
      userPromise.then((user) => {
        res.render('editProfile.hbs', { item: user, userId: req.session.userId });
      });
    }

    // Enters other userPage
    else {
      let cycleVote = userController.checkCycleRecursive(selectedId, userId).then(result => result);

      userPromise = userController.getUserByID(req, res);
      loggedinPromise = userController.getLoggedIn(req, res);

      Promise.all([userPromise, loggedinPromise, cycleVote]).then((values) => {
        res.render('userPage.hbs', {
          item: values[0],
          loggedin: values[1],
          cycle: values[2],
          userId: req.session.userId,
        });
      }).catch((error) => {
        // if there's an error (i.e. id user doesn't exist) just redirect to home
        res.redirect('/');
      });
    }
  } else {
    res.redirect('/signin');
  }
});

/* POST login users. */
router.post('/login', authController.login);

/* POST sign up new users. */
router.post('/signup', authController.signup);

module.exports = router;
