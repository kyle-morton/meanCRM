angular.module('postCtrl', ['postService'])

//needs AUTH for currently logged in user-info API request
.controller('postController', function (Post, Auth) {
	
	var vm = this;
	vm.processing = true;
	vm.type = "create";
	
	// $('#postTable').tablesorter();
	
	//used to retrieve all user posts in database
	vm.loadPosts = function(){
		Post.all()
			.success(function(data) {
				vm.processingPosts = false;
				vm.posts = data;
				if (vm.posts.length > 5) {
					$('#postTableDiv').addClass('scrollTable');
				} else {
					$('#postTableDiv').removeClass('scrollTable');
				}
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
		
		console.log("Length: " + vm.postData.body.length);
		
		//if both values are filled in
		if (vm.postData.subject && vm.postData.body) {
			
			if (vm.postData.body.length <= 140) {
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
			} else { //over the 140 character limit
				swal("Oops!", "Post body has a 140 character limit! Please try again!", "error");
			}
			

			
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
	};
	
	vm.openEditModal = function (post) {
		console.log("POST: " + JSON.stringify(post));
		vm.type = "edit";
		vm.editPostData = JSON.parse(JSON.stringify(post)); //copying data into editPostData
															//to avoid referencing table post
		$('#editPostModal').modal('show');
	};
	
	vm.updatePostContent = function () {
		console.log("POST CONTENT: " + JSON.stringify(vm.editPostData) + " " 
		+ vm.editPostData.body.length);
		
		if (vm.editPostData.body.length <= 140) { //impose 140 character limit on body
					Post.update(vm.editPostData)
			.then(function(data){
				var message = data.data.message;
				swal("Success!", message.toString(), "success");
				
				//reset form, reload posts
				vm.editPostData = {};
				vm.loadPosts();
				
				//close modal
				$('#editPostModal').modal('hide');
				
			});
		} else {
			swal("Oops!", "Post body has a 140 character limit! Please try again!", "error");
		}
		

	};
	
	vm.deletePost = function(id) {
		swal({   
			title: "Are you sure?",   
			text: "You will not be able to recover this post!",   
			type: "warning",   
			showCancelButton: true,   
			confirmButtonColor: "#DD6B55",   
			confirmButtonText: "Yes, delete it!",   
			closeOnConfirm: true,
			closeOnCancel: true }
			, function(){   
				
				//if confirm, delete user
				vm.processing = true;
	
				//call User Factory to delete user
				Post.delete(id)
					.success(function(data) {
						
						//refetch user's after return
						vm.loadPosts();
						
					});
			
				//comment
			
			});
	};
	
});