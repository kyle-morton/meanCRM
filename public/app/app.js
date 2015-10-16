var userApp = angular.module('userApp', ['ngAnimate', 'app.routes', 'authService', 
							'mainCtrl', 'userCtrl', 'userService', 
							'postCtrl', 'postService', 'fileCtrl',
							'fileService', 'angularFileUpload']);

// application configuration to integrate token into requests
userApp.config(function($httpProvider) {

	// attach our auth interceptor to ALL http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});

//custom directive to track changes to file input
userApp.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});


//userApp is the overall application, adding dependencies including controllers and services as
//needed!