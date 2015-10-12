angular.module ('mainCtrl', []) 

//including the Auth factory!
.controller ('mainController', function($rootScope, $location, Auth){

	//TEST of SweetAlert	
	// swal({   
	// 	title: "Error!",   
	// 	text: "Here's my error message!",   
	// 	type: "error",   
	// 	confirmButtonText: "Cool" });

	
	var vm = this;
	
	vm.processing = false;
	
	vm.postData = {};

	
	//check if user logged in on EACH request
	//subscribing to rootScope objects changeStart event!
	//when new request sent, it fires
	$rootScope.$on('$routeChangeStart', function() {
		
		
		//make sure logged in
		vm.loggedIn = Auth.isLoggedIn();
		
		//get user info on route change to display
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});	

	});
	
	//handle login form submission
	vm.doLogin = function() {
		
		//set to processing, clear previous error msg
		vm.processing = true;
		vm.error = '';
	
		//call Auth.login() with form data
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;			

				// if a user successfully logs in, redirect to users page
				if (data.success)			
					$location.path('/users');
				else 
					vm.error = data.message;
				
			});
		
	};
	
	//function to handle log out
	vm.doLogout = function() {
	
		Auth.logout();
		
		//reset user data
		vm.user = {};
		
		//redirect to login page
		$location.path('/login');
		
	};
	
	vm.createPost = function() {
			console.log("Values: " + vm.postData.subject + " " + vm.postData.body);
	};
	
	
	// 
	// 	<div class="form-group">
	// 	<label for="exampleInputEmail1">Subject</label>
	// 	<input type="text" class="form-control" id="postSubject" 
	// 		ng-model="main.postData.subject" placeholder="subject">
	// </div>
	// <div class="form-group">
	// 	<label for="postBody">Post Body</label>
	// 	<textarea rows="3" class="form-control" id="postBody"
	// 	 ng-model="main.postData.body" placeholder="body">
	// </div>
	
});