angular.module('postCtrl', ['postService'])

//needs AUTH for currently logged in user-info API request
.controller('postController', function (Post, Auth) {
	
	var vm = this;
	vm.processing = true;
	vm.type = "create";
	
	//used to retrieve all user posts in database
	vm.loadPosts = function(){
		Post.all()
			.success(function(data) {
				vm.processingPosts = false;
				vm.posts = data;
			});
	};
	
	//load user posts
	vm.loadPosts();
	
	//Get Currently Logged-In User Info
	Auth.getUser()
		.then(function(data) {
			vm.user = data.data;
		});	
	
	
	vm.createPost = function() {
		
		//if both values are filled in
		if (vm.postData.subject && vm.postData.body) {
			
			//create body of API Request
			var postData = {
				subject : vm.postData.subject,
				body : vm.postData.body,
				userid : vm.user.id,
				username : vm.user.username
			};
			
			Post.create(postData)
					.then(function(data) {
						// console.log("DATA: " + JSON.stringify(data));
						var message = data.data.message;
						swal("Success!", message.toString(), "success");

						//reset form, reload posts
						vm.postData = {};
						vm.loadPosts();
					});	
			
		} else {
			swal("Error!", "Post must have subject and body", "error");
		}
			
	};
	
	vm.updatePostStatus = function(id) {
		Post.status(id)
			.then(function(data){
				//if success reload table
				vm.loadPosts();
			});
	}
	
	vm.openEditModal = function (post) {
		console.log("POST: " + JSON.stringify(post));
		vm.type = "edit";
		vm.postData = post;
		$('#postModal').modal('show');
	}
	
});