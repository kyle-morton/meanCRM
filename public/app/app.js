angular.module('userApp', ['ngAnimate', 'app.routes', 'authService', 
							'mainCtrl', 'userCtrl', 'userService', 
							'postCtrl', 'postService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to ALL http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});


//userApp is the overall application, adding dependencies including controllers and services as
//needed!