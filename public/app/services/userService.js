angular.module('userService', []) 

	//inject the built-in $http module into
	//the user function
	.factory('User', function($http) {
		
		
		/*
		REM: If node server hosted else, MUST put URL ahead of the 
		api urls below!!!!! 
		*/
		
		//factory object to bind functions to
		var userFactory = {};
		
		//get single user (REM: returning promise object! no processing here)
		userFactory.get = function(id) {
			return $http.get('/api/users/' + id);
		};
		
		//get all users 
		userFactory.all = function() {
			return $http.get('/api/users/');
		};
		
		//create user, body is 2nd parameter
		userFactory.create = function (userData) {
			return $http.post('/api/users/', userData);
		};
		
		//update user, body is 2nd parameter
		userFactory.update = function(id, userData) {
			return $http.put('/api/users/' + id, userData);
		};
		
		//delete a user
		userFactory.delete = function(id) {
			return $http.delete('/api/users/' + id);
		};
		
		
		//return factory object
		//so it's fns may be used
		return userFactory;
	});