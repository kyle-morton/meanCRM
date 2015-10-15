angular.module ('fileCtrl', ['postService', 'fileService', 'angularFileUpload']) 

//including the Auth factory!
.controller ('fileController', function($scope, Auth, File, FileUploader){
	
	var vm = this;
	
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
});