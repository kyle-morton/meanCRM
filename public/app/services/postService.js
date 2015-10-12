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
		
		return postFactory;
	})