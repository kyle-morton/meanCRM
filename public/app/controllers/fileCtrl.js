angular.module ('fileCtrl', ['postService', 'fileService', 'angularFileUpload']) 

//including the Auth factory!
.controller ('fileController', function($scope, Auth, File, FileUploader){
	
	var vm = this;
	vm.processing = false;
	
	
	//used to handle files added to upload section
	$scope.uploadFile = function(event){
        var fileToUpload = event.target.files[0];
        console.log('FileCtrl file was selected: ' + fileToUpload.name + " " + fileToUpload.size + " " + fileToUpload.data);
   		vm.FileUpload(fileToUpload);
		
		   
		   
		// File.upload(fileToUpload)
		// 	.then(function(data) {
		// 		console.log(JSON.stringify(data));
		// 	});	
   
    };
	
	vm.FileUpload= function(initFile, File) {
		var reader = new FileReader();  
		
		//create onloadend subscriber to handle finished file
		reader.onloadend = function(evt) {
			var readFile = reader.result;
			vm.upload(readFile);
		};
		
		//read file
		reader.readAsBinaryString(initFile);
	}
	
	vm.upload = function(readFile) {
		console.log("in upload!");
		File.upload(readFile) 
			.then(function(data){
				console.log(JSON.stringify(data));
			});
	}
	
});