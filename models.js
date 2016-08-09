'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Options Schema
const OptionSchema = new Schema({
	text: String,
	votes : {type: Number, default: 0}
});

OptionSchema.method('vote', (updates, callback) => {
	this.votes += 1;
});


const PollSchema = new Schema({
	question : String,
	creator : String,
	options : [OptionSchema]
});

const UserSchema = new Schema({
	name: String,
	email: String
});

const Poll = mongoose.model('Poll', PollSchema);
const Option = mongoose.model('Option', OptionSchema);
const User = mongoose.model('User', UserSchema);

module.exports.Poll = Poll;
module.exports.Option = Option;
module.exports.User = User;