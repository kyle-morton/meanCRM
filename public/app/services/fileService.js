//used to upload, retrieve files from node js backend
angular.module('fileService', []) 

	//inject $http for API calls
	.factory('File', function($http, $upload){
		
		var fileFactory = {};
		
		fileFactory.upload = function(file){
			return $upload.upload({
				url: '/api/upload', //node js route
				file: file
			});
		};
		
		return fileFactory;
	});