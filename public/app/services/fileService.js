//used to upload, retrieve files from node js backend
angular.module('fileService', []) 

	//inject $http for API calls
	.factory('File', function($http){
		
		var fileFactory = {};
		
		fileFactory.upload = function(file){
			return $http.post('/api/upload', file);
		};
		
		return fileFactory;
	});