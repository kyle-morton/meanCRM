angular.module ('fileCtrl', ['postService', 'fileService', 'angularFileUpload',
							  'avatarService']) 

//including the Auth factory!
.controller ('fileController', function($scope, $location, Auth, File, Avatar, FileUploader){
	
	var vm = this;
	vm.processing = false;
	
	//Get Currently Logged-In User Info
	Auth.getUser()
		.then(function(data) {
			vm.user = data.data;
			console.log(JSON.stringify(vm.user));
		});	
	
	//BEGIN Avatar Drop Logic//	
	

	jQuery.event.props.push('dataTransfer');
	
	$("body").on('drop', function(event) {
		
		console.log("DROPPED FILE!");
		
		event.preventDefault();
		
		var file = event.dataTransfer.files[0];
		
		if (file.type.match('image.*')) {
			vm.AvatarUpload(file);
			// swal("Success!", "You Dropped an Image!", "success");
		} else {
			swal("Error", "Only images may be uploaded!", "error");
		}
		
		
	});
	
	$("body").on("dragover", function(event) {
		// Required for drop to work
		return false;
	});
	
	//END Avatar Drop Logic//
	
	//used to handle files added to upload section
	$scope.uploadFile = function(event){
        var fileToUpload = event.target.files[0];
        console.log('FileCtrl file was selected: ' + fileToUpload.name + " " + fileToUpload.size + " " + fileToUpload.data);
		   
		//if image, upload to API
		if ((endsWith(fileToUpload.name, ".jpg") ||
			endsWith(fileToUpload.name, '.png'))) {
			vm.FileUpload(fileToUpload);
		} else {
			swal("Error", "Only images (jpg or png) may be uploaded!", "error");
		}

    };
	
	vm.FileUpload= function(initFile) {
		var reader = new FileReader();  
		
		//create onloadend subscriber to handle finished file
		reader.onloadend = function(evt) {
			var readFile = reader.result;
			vm.upload(readFile, initFile.name, initFile.size);
		};
		
		//read file
		reader.readAsBinaryString(initFile);
	};
	
	vm.AvatarUpload = function(initFile) {
		var reader = new FileReader();  
		
		//create onloadend subscriber to handle finished file
		reader.onloadend = function(evt) {
			var readFile = reader.result;
			vm.uploadAvatar(readFile, initFile.name, initFile.size);
		};
		
		//read file
		reader.readAsBinaryString(initFile);
	};
	
	vm.upload = function(readFile, fileName, fileSize) {
		var file = {
			data: readFile,
			name: fileName,
			size: fileSize
		};
				
		File.upload(file) 
			.then(function(data){
				var message = data.data.message;
				swal("Success!", message, "success");
			});
	};
	
	vm.uploadAvatar = function(readFile, fileName, fileSize) {
		var avatar = {
			data: readFile,
			name: fileName,
			size: fileSize,
			user: vm.user.id
		};
		
		console.log("USER: " + vm.user.id);
				
		Avatar.upload(avatar) 
			.then(function(data){
				var message = data.data.message;
				swal("Success!", message, "success");
			});
	};
	
});

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};