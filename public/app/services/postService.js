angular.module('postService', [])

	//inject $http for API calls
	.factory('Post', function($http){
		
		var postFactory = {};
		
		//create user post
		postFactory.create= function(postData) {
			console.log("Creating Post");
			return $http.post('/api/posts/', postData); //return promise object
		};
		
		//retrieve all posts from API
		postFactory.all= function() {
			console.log("Retrieving Posts");
			return $http.get('/api/posts');
		};
		
		postFactory.status= function(id) {
			console.log("Updating Post Read Flag For: " + id);
			return $http.put('/api/posts/' + id);
		};
		
		postFactory.update= function(postData) {
			console.log("Updating Post Content For: " + postData._id);
			return $http.put('/api/posts/' + postData._id, postData);
		};
		
		return postFactory;
	});