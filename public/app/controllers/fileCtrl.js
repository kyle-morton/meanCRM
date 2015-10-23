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
	
});