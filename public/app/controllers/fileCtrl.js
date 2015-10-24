angular.module ('fileCtrl', ['postService', 'fileService', 'angularFileUpload']) 

//including the Auth factory!
.controller ('fileController', function($scope, $location, Auth, File, FileUploader){
	
	var vm = this;
	vm.processing = false;
	
	
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
				$location.path( "/users" );
			});
	};
	
});

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};