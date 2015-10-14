//3 factories into 1 angular service
angular.module('authService', []) 




//login, gets info
//$http for api call, $q for returning promise objects
//AuthToken factory to manage tokens
.factory('Auth', function($http, $q, AuthToken) {

	//create factory to return
	var authFactory = {};
	
	//handle login
	authFactory.login = function(username, password) {
	
		//POST creds to API auth endpoint
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		})
			
			.success(function(data) {
				//success could be success/failed login, pass token obj anyway
				AuthToken.setToken(data.token);
				return data; //login function returns the data
			});
		
	};
	
	//handle log out
	authFactory.logout = function() {
		//clear token
		AuthToken.setToken();
	};
	
	//check if logged in
	authFactory.isLoggedIn = function() {
		var loggedIn = false;
		if (AuthToken.getToken()) {
			loggedIn = true;	
		}
		
		return loggedIn;
	};
	
	//get current user info
	authFactory.getUser = function() {
		
		//if logged in, send api request with current token
		//to get user info
		if (AuthToken.getToken()) {
			console.log("token exists!");
			// return $http.get('/api/me', {cache: true});
			return $http.get('/api/me');
			//cache = true -> checks if response cached, if has use it
		} 
		else { //return generic promise object stating error message
			return $q.reject({message: 'User has no token.'});
		}
	};
	
	return authFactory;
	
})







//factory for token handling
// inject $window to store token client-side in local-storage
.factory('AuthToken', function($window) {
	
	var authTokenFactory = {};
	
	//get token from local-storage
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token'); //use 'token' as key to get value
	};
	
	//set token or clear token
	//if token passed, set. if none, clear.
	authTokenFactory.setToken = function(token) {
		if (token) {
			$window.localStorage.setItem('token', token);
		} else {
			$window.localStorage.removeItem('token', token);
		}
	};
	
	
	//set the token or clear the token
	
	return authTokenFactory;
	
})





	
	
//used to integrate tokens into requests
.factory('AuthInterceptor', function($q, $location, AuthToken){
	
	var interceptorFactory = {};
	
	//attach token to every outgoing API request
	//This will run on all HTTP requests
	interceptorFactory.request = function(config) { //config is for each req
		
		//fetch token
		var token = AuthToken.getToken();
		
		if (token) { //if exists, set header
			config.headers['x-access-token'] = token;	
		}
		
		
		return config;
	};
	
	//redirect to login if token not authenticated
	//Used if get 403 response (not auth)
	interceptorFactory.responseError = function(response) {
		
		if (response.status == 403) {
			AuthToken.setToken(); //clear token
			$location.path('/login'); //redirect to login view
		}
		
	};
	
	return interceptorFactory;
	
});
	