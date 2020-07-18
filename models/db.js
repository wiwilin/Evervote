const mongoose = require('mongoose');

const uri = 'mongodb+srv://webinfo:webinfo@cluster0-0qbix.mongodb.net/evervote?retryWrites=true&w=majority';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },    // To solve version collision
  function (err) {
    if (!err) {
      console.log('Connected to mongo.');
    } else {
      console.log('Failed to connect to mongo!', err);
    }
  });

require('./user.js');
