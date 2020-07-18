const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: String,
    password: String,
    vote_to: String,
    votes_from: [{ type: String }],
    candidate: { type: Boolean, default: false },
    voteCount: { type: Number, default: 1 },
    votesAllocated: { type: Number, default: 1 },
    profilePic: { data: Buffer, contentType: String },
    bio: String,
    img: { type: String, default: 'candidate-placeholder.svg' },
  },
  {
    collection: 'Users',
  },
);

const User = mongoose.model('users', userSchema);
