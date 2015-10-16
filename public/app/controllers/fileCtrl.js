angular.module ('fileCtrl', ['postService', 'fileService', 'angularFileUpload']) 

//including the Auth factory!
.controller ('fileController', function($scope, Auth, File, FileUploader){
	
	var vm = this;
	vm.processing = false;
	
	
	//used to handle files added to upload section
	$scope.uploadFile = function(event){
        var fileToUpload = event.target.files[0];
        console.log('FileCtrl file was selected: ' + fileToUpload.name + " " + fileToUpload.size 
				+ " " + fileToUpload.getAsDataUrl());
    };
	
});