const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/user-controller.js');

/* GET home page. */
router.get('/', async function (req, res) {
  if (req.session.loggedin) {
    // receive alert when successul vote and then clean the variable
    var successfulVoteName = req.session.successfulVoteName;
    req.session.successfulVoteName = null;

    // receive alert when successul unvote and then clean the variable
    var successfulUnvoteName = req.session.successfulUnvoteName;
    req.session.successfulUnvoteName = null;

    let myVote = await userController.myVote(req, res);

    let myAllocatedVote = await userController.myAllocatedVote(req, res);

    let usersPromise = await userController.findSortedUsers(req, res);

    Promise.all([myVote, myAllocatedVote, usersPromise]).then((promises) => {
      res.render('candidateList.hbs', {
        items: promises[2],
        myVote: promises[0],
        myAllocatedVote: promises[1],
        userId: req.session.userId,
        successfulVoteName,
        successfulUnvoteName,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    res.render('index.hbs', { username: req.session.name, notLoggedin: true });
  }
});

/* GET introduction page. */
router.get('/intro', function (req, res) {
  if (req.session.loggedin) {
    res.render('intro.hbs', { username: req.session.name, userid: req.session.userId });
  } else {
    res.render('intro.hbs', { username: req.session.name, notLoggedin: true });
  }
});

/* GET sign in page. */
router.get('/signin', function (req, res, next) {
  // receive error and then clean the variable
  var errorMessage = req.session.signinError;
  req.session.signinError = null;

  if (req.session.loggedin != true)
    res.render('login.hbs', { errorMessage: errorMessage, notLoggedin: true });
  else res.redirect('/');
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  // receive error and then clean the variable
  var errorMessage = req.session.signupError;
  req.session.signupError = null;

  if (req.session.loggedin != true)
    res.render('signup.hbs', { errorMessage: errorMessage, notLoggedin: true });
  else res.redirect('/');
});

/* POST logout */
router.post('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

/* GET sort&search page. */
router.get('/search/:keyword', function (req, res) {
  if (req.session.loggedin)
    userController.getSearch(req, res).then(search => {
      res.render('searchPage.hbs', { items: search, userId: req.session.userId });
    });
  else {
    res.redirect('/');
  }
});

router.post('/linksearch', function (req, res, next) {
  res.redirect('/search/' + req.body.keyword);
});

router.post('/vote', function (req, res, next) {
  userController.voteForUser(req, res, next).then((voteToName) => {
    req.session.successfulVoteName = voteToName;
    res.redirect('/');
  });
});

router.post('/unvote', function (req, res, next) {
  userController.unvoteForUser(req, res, next).then((unvoteToName) => {
    req.session.successfulUnvoteName = unvoteToName;
    res.redirect('/');
  });
});

var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, req.session.userId);
  },
});

var upload = multer({ storage: storage });

router.post('/vote', userController.voteForUser);
router.post('/unvote', userController.unvoteForUser);
router.post('/nominate', userController.makeUserCandidate);
router.post('/unnominate', userController.removeUserCandidate);
router.post('/changeName', userController.changeName);
router.post('/changeBio', userController.changeBio);
router.post('/changePic', upload.single('image'), userController.changePic);

module.exports = router;
