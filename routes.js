'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const Poll = require('./models').Poll;
const Option = require('./models').Option;

router.get('/', (req, res, next) => {
	Poll.find({},(err, polls)=>{
		if(err) return next(err);
		res.render('index', {polls: polls, user: req.user});
	});
});

router.get('/new_poll', (req,res, next) =>{
	res.render('new_poll', { user: req.user});
});

router.get('/chart/:pollId', (req, res, next)=>{
	Poll.findById(req.params.pollId, (err, poll) => {
		if(err) return next(err);
		res.json(poll);
	});
});

router.get('/my_polls', (req, res, next)=> {
		Poll.find({ creator : req.user.name}, (err, polls) => {
			if(err) return next(err);
			res.render('my_polls', {polls: polls, user:req.user});
		});
});

router.get('/auth/login/github',
  passport.authenticate('github'));

router.get('/auth/github/return', 
  passport.authenticate('github', { failureRedirect: '/polls/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/polls/my_polls');
  });

router.get('/auth/logout', (req,res)=>{
	req.logout();
	res.redirect('/polls/');
});


router.get('/:pollId', (req, res, next) =>{
	Poll.findById(req.params.pollId, (err, poll) => {
		if(err) return next(err);
		res.render('voting_page', {poll:poll, user:req.user});
	});
});

router.post('/new_poll', (req, res, next) => {
	
	let question = req.body.question;
	//TODO : handle creator based on authentification
	let creator = req.user.name;
	//create each options from request string
	let options = req.body.options.split(',');
	let optSchemas = options.map( (opt) => {
		return new Option({
			text : opt
		});
	});
	let poll = new Poll({
		question : question,
		creator : creator,
		options : optSchemas
	});
	poll.save((err)=>{
		if(err) return next(err);
		res.redirect('/polls/');
	});
});



router.put('/:pollId/:pollAnswer', (req, res, next) => {
	let answer = req.params.pollAnswer.replace('_', ' ');
	console.log(answer);
	Poll.findById(req.params.pollId , (err, poll)=>{
		if(err) return next(err);
		poll.options.map((opt)=>{
			console.log(opt.text);
			if(opt.text == answer){
				console.log('match');
				opt.votes += 1
			}
		});
		poll.save((err)=>{
			if(err) return next(err);
		});
		res.send('Your vote has been counted');
	});
});

router.put('/:pollId/addAnswer/:customAnswer', (req, res, next) => {
	Poll.findById(req.params.pollId, (err, poll)=> {
		if(err) return next(err);
		let option = new Option({
			text : req.params.customAnswer
		});
		poll.options.push(option);
		poll.save();
		res.send('You answer has been added!');
	});
})

router.delete('/:pollId', (req, res, next) => {
	Poll.remove({_id : req.params.pollId}, (err, poll)=> {
		if(err) return next(err);
		res.json(poll);
	});
});



module.exports = router;