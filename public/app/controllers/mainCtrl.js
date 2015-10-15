angular.module ('mainCtrl', ['postService', 'fileService', 'angularFileUpload']) 

//including the Auth factory!
.controller ('mainController', function($rootScope, $location, $scope, 
										Auth, Post, File, FileUploader){
	
	var vm = this;
	
	vm.processing = false;
	
	vm.postData = {};

	//set up file uploader
	vm.uploader = $scope.uploader 
						= new FileUploader({
							url: '/api/uploads'
						});
	
	vm.uploader.filters.push({
		name: 'imageFilter',
		fn: function(item /*{File|FileLikeObject}*/, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		}
	 });
	 
	 //callbacks for uploader
	 vm.uploader.onAfterAddingFile = function(fileItem) {
		console.info('onAfterAddingFile', fileItem);
		var file = fileItem._file;
		var fileData = {
			file: file
		};
		
		console.info("Upload File", fileData);
		

		
				//call file service to upload file
		File.upload(fileData)
			.then(function(data) {
				console.log("DATA: " + JSON.stringify(data));
			});
		
	 };
	 
	 vm.uploader.onBeforeUploadItem = function(item) {
		 console.log("Files: " + vm.uploader.queue);
	 };
	 
	 vm.uploader.uploadItem = function (item) {
		 
		var file = item._file;
		 
		console.log("File: " + file.size); 
		 
		//call file service to upload file
		File.upload(file)
			.then(function(data) {
				console.log("DATA: " + JSON.stringify(data));
			});
	 };
	
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
		
		//if form valid
		if (vm.loginData && vm.loginData.username &&
			vm.loginData.password) {
				
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
		} 
		else {
			vm.processing = false;
			vm.error = "Username & Password Required";
		}
	
		
		
	};
	
	//function to handle log out
	vm.doLogout = function() {
	
		Auth.logout();
		
		//reset user data
		vm.user = {};
		
		//redirect to login page
		$location.path('/login');
		
	};
	
	// vm.createPost = function() {
	// 		console.log("Values: " + vm.postData.subject + " " + vm.postData.body);
	// 		
	// 		//if both values are filled in
	// 		if (vm.postData.subject && vm.postData.body) {
	// 			
	// 			console.log(JSON.stringify(vm.user));
	// 			
	// 			//create body of API Request
	// 			var postData = {
	// 				subject : vm.postData.subject,
	// 				body : vm.postData.body,
	// 				userid : vm.user.id,
	// 				username : vm.user.username
	// 			};
	// 			
	// 			Post.create(postData)
	// 					.then(function(data) {
	// 						// console.log("DATA: " + JSON.stringify(data));
	// 						var message = data.data.message;
	// 						console.log("Message: " + message);
	// 						swal("Success!", message.toString(), "success");
	// 						vm.postData = {};
	// 					});	
	// 			
	// 		} else {
	// 			swal("Error!", "Post must have subject and body", "error");
	// 		}
	// 		
	// };
	
});