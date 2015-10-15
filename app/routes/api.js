var User = require('../models/user');
var Post = require('../models/post');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var multer = require('multer');
var fs = require('fs');
var util = require('util');

var secret = config.secret;

//app js creates app and express and adds these 
//module exports during initialization
//pass these to the routing function

//Assigning the below function to module exports
//now you can call with require('./app/routes/api')(app, express);
module.exports = function(app, express) {
	
		// get an instance of the express router
		var apiRouter = express.Router();
		
		// route for authenticating users
		// REM: BEFORE auth middleware! This way unauth users can get here
		apiRouter.post('/authenticate', function(req, res) {
			
			var authMessage = "Authentication Failed: ";	
			
			console.log("AUTH: " + req.body.username + " " + req.body.password);
				
			//if entered UN & PW
			if(req.body.username && req.body.password) {
				//Find User By ID
			User.findOne({
				username: req.body.username
				}).select('name username password role').exec(function(err, user){
					
					if (err) res.send("ERROR: " + err);
					
					// var authMessage = "Authentication Failed: ";
					
					//No user with that username found
					if (!user) {
						res.json({
							success: false,
							message: authMessage + "User Not Found"
						});
					} else if (user) {  //user found
						
						//check if request PW matches using Model static method!
						var validPW = user.comparePassword(req.body.password); 
						
						//if doesn't match
						if (!validPW) {
							res.send({
								success: false,
								message: authMessage + "Wrong Password"
							});
						} else { //valid password entered
						
						// console.log("user: " + JSON.stringify(user));
							
							//Create JWT Token
							//ARGS -> pass object with name, username
							// secret, expiration in minutes
							var token = jwt.sign({
									name: user.name,
									username: user.username,
									id: user._id,
									role: user.role
								}, secret, {expiresInMinutes: 1440}); //expire in 24 hours
							
							res.json({
								success: true,
								message: 'Enjoy your token!',
								token: token
							}); //Return token for future requests
							
						}
						
						
					}
					
				});
				} //end if
				else { //no un OR pw so auth failed by default
					
					res.send({
						success: false,
						message: authMessage + "Username AND Password Required"
					});
				}
		
		});
		
		//All API Middleware
		//Verify req's JWT token
		apiRouter.use(function(req, res, next) {
		console.log("New request to API");
		
		//retrieve token from body, arg, or header
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		
		//if passed, verify it
		if (token) {
			
			//use jwt library to decode (need token and secret to decode)
			jwt.verify(token, secret, function(err, decoded) {
				
				if (err) {
					res.status(403).send({
						success: false,
						message: "Failed to authenticate token."
					});
				} else { //token valid
				
					req.decoded = decoded; //save the token back to request for future use
					next(); //allow through to route
					
				}
			}); //end verify
			
			
		} else { //no token provided
			return res.status(403).send({
				success: false,
				message: "No token provided."
			});	
		}
		
		//next(); //allow to proceed with request
		});
		
		// test route to make sure everything is working 
		// accessed at GET http://localhost:8080/api
		apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
		});
		
		//api endpoint to get logged-in user information
		apiRouter.get('/me', function(req, res) {
		res.send(req.decoded); //return the decoded json token
		});
		
		//create route then apply new methods!
		apiRouter.route('/users')
		
		.post(function(req, res) {
			//create new user
			var user = new User();
			
			//set user info that came in req
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;
			user.role = req.body.role;
			
			console.log("Creating New User: " + 
							JSON.stringify(user));
			
			user.save(function(err) { //use built in save to send user to MDB
			
				console.log("ERROR: " + err);
				
				if (err) { //if error, handle appropriately
					if (err.code == 11000) { //tried to create duplicate entry
						return res.json({ success: false, message: 'A user with that username already exists. '});
					}
					else {
						return res.send(err);
					}
				
				}
				//no error, user created
				res.json({message: 'User Created!'});
				
			});
			
		}) //end POST
		
		.get(function(req, res) {
			//REM: mongoose model is collection object! 
			//you can run queries just using model name
			
			//find takes callback -> takes err object or list of 
			//docs returned from query
			User.find(function(err, users) {
				if (err) {
					res.send("ERROR: " + err);
				} else {
					res.json(users);
				}
			})
			
		});
		
		//Sample middleware for all routes with /:user_id
		apiRouter.param('user_id',function(req, res, next) {
		console.log("API Request For Particular User: " + req.params.user_id);
		
		//if id sent in request, proceed
		if (typeof req.params.user_id !== "undefined") {
			next();
		} else { //otherwise, alert in response
			res.json({
				status: false,
				message: "No Id Passed In Request"});
		}
		
		
		})
		
		apiRouter.route('/users/:user_id')
		
		//GET user with the id given
		.get(function(req, res) {
			
			//REM: mongoose model is collection object!
			//retrieve user by the user_id param in request object!
			User.findById(req.params.user_id, function(err, user) {
				
				if (err) {
					res.send("ERROR: " + err);
				} else {
					res.json(user);
				}
				
			});
			
		}) //end GET
		
		//PUT (update) user with id given
		.put(function(req, res) {
			
			console.log("Updating User: " + req.params.user_id);
			
			//get the user object id 
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send("ERROR: " + err);
				
				console.log("ERROR: " + err);
				
				
				if (user) {
					//update users info ONLY if new (if sent in request body)
					if(req.body.name) {user.name = req.body.name;}
					if(req.body.username) {user.username = req.body.username;}
					if(req.body.password) {user.password = req.body.password;}
					if(req.body.role) {user.role = req.body.role;}
				
					//save the user object 
					user.save (function(err) {
						if (err) res.send("ERROR: " + err);
						
						console.log("ERROR: " + err);
						
						res.json({message: "User Updated"});
					});
				} else {
					res.json({message: "User Not Found!"});
				}
								
			});
		})
		
		//DELETE user with given id
		.delete(function(req, res) {
			//REM: pass in json object for query -> match _id to req id
			User.remove({_id : req.params.user_id}, function(err, user) {
				if (err) res.send("ERROR: " + err);
				
				res.json({message: "User Deleted!"});
				
			})
		});
		
		
		//Route to create, find, delete user posts
		apiRouter.route('/posts')
		
		.post(function(req, res) {
			//create new user
			var post = new Post();
			
			//check that body meets length requirement
			if (req.body.body.length <= 140) {
				//set post info that came in req
				// user.name = req.body.name;
				// user.username = req.body.username;
				// user.password = req.body.password;
				
				post.subject = req.body.subject;
				post.body = req.body.body;
				post.userid = req.body.userid;
				post.username = req.body.username;
				post.read = false; //set to false by default on creation
				
				console.log("Creating New Post: " + 
								JSON.stringify(post));
				
				post.save(function(err) { //use built in save to send user to MDB
				
					console.log("ERROR: " + err);
					
					if (err) { //if error, handle appropriately
							return res.send(err);
					}
					//no error, user created
					res.json({message: 'Post Created!'});
					
				});
			} else { //doesn't meet 140 character requirement
				res.json({message: 'Post body may not be over 140 characters! Please try again!'});
			}
			

			
		}) //end POST
		
		.get(function(req, res) {
			//REM: mongoose model is collection object! 
			//you can run queries just using model name
			
			//find takes callback -> takes err object or list of 
			//docs returned from query
			Post.find(function(err, posts) {
				if (err) {
					res.send("ERROR: " + err);
				} else {
					// console.log("Posts Found: " + JSON.stringify(posts));
					res.json(posts);
				}
			})
			
		});
		
		apiRouter.route('/posts/:post_id')
		//multiple params /posts/:post_id/:post_name
		
		//update post to be read OR
		//update the contents if sent with request body
		.put(function(req, res) {
			
			//get the user object id 
			Post.findById(req.params.post_id, function(err, post) {
				if (err) res.send("ERROR: " + err);			
				
				//if found post to update
				if (post) {
					
					var updatingContent = false;
					
					//Check if body contains updates to subject body
					//if updating this content, set flag to true so it doesn't auto flip the read flag
					if(req.body.subject) {post.subject = req.body.subject; updatingContent = true;}
					if (req.body.body) {post.body = req.body.body; updatingContent = true;}	
				
					//flip read flag
				 	if(!updatingContent) {post.read = !post.read};
					 
					if (updatingContent && post.body.length > 140) { //fail 140 character limit check
						
						res.json({message: "Post body may not be over 140 characters! Please try again!"});
						
					} else { //if passes check, save post
						//save the user object 
						post.save (function(err) {
							if (err) res.send("ERROR: " + err);
							
							console.log("ERROR: " + err);
							
							res.json({message: "Post Updated"});
						});
					}
				
		
				} else {
					res.json({message: "Post Not Found!"});
				}
								
			});
			
			
		})
		
		.delete(function(req, res) {
			//REM: pass in json object for query -> match _id to req id
			Post.remove({_id : req.params.post_id}, function(err, user) {
				if (err) res.send("ERROR: " + err);
				
				res.json({message: "Post Deleted!"});
				
			})
		});
		
		apiRouter.route('/upload')
		
		//use multer middleware to handle multipart requests
		apiRouter.use(multer({
			dest:  './uploads'
		}).single())
		
		.post(function(req, res, next) {
			if (req.files) {
				console.log(util.inspect(req.files));
			}
		});
		

		//return apiRouter for use in main application		
		return apiRouter;
		
};