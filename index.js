'use strict';

const express = require('express');
const mongoose = require('mongoose');
const jsonParser = require('body-parser').json;
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./models').User;

const app = express();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/polls/auth/github/return"
  },
  function(accessToken, refreshToken, profile, done) {
    if(profile.emails){
    User.findOneAndUpdate({ email: profile.emails[0].value },
    {
    	email: profile.emails[0].value,
    	name: profile.displayName
    },
    {
    	upsert: true
    }, done);
  }else{
    const mailError = new Error('You need to enable email in github');
    done(mailError);
  }
    }
));

passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(userId, done){
  User.findById(userId, done);
});

const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/votingdb');
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on("error", function(err){
	console.error("connection error:", err);
});

db.once("open", function(){
	console.log("db connection successful");
});

var sessionOptions = {
  secret: "this is a super secret dadada",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
};

app.use(session(sessionOptions));

//initialize passport
app.use(passport.initialize());

//Restore Session
app.use(passport.session());



app.use(logger("dev"));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With , Content-Type, Accept");
	if(req.method === "OPTIONS"){
		res.header("Acccess-Control-Allow-Methods", "PUT, POST, DELETE");
		return res.status(200).json({});
	}
	next();
});

app.use(cookieParser());
app.use(jsonParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
const routes = require('./routes');

app.use('/polls', routes);

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views/');
app.use('/polls',express.static('views'));




app.use(function(req, res, next){
	const err = new Error('Not found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) =>{
	res.status(err.status || 500);
	res.render({
		error : {
			message : err.message
		}
	});
});


app.listen(port, (req, res) => {
	console.log('App listening on port ' + port);
});