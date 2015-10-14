angular.module("userApp",["ngAnimate","app.routes","authService","mainCtrl","userCtrl","userService","postCtrl","postService","anguFixedHeaderTable"]).config(["$httpProvider",function(e){e.interceptors.push("AuthInterceptor")}]),angular.module("app.routes",["ngRoute"]).config(["$routeProvider","$locationProvider",function(e,t){e.when("/",{templateUrl:"app/views/pages/home.html"}).when("/login",{templateUrl:"app/views/pages/login.html",controller:"mainController",controllerAs:"login"}).when("/users",{templateUrl:"app/views/pages/users/all.html",controller:"userController",controllerAs:"user"}).when("/users/create",{templateUrl:"app/views/pages/users/single.html",controller:"userCreateController",controllerAs:"user"}).when("/users/:user_id",{templateUrl:"app/views/pages/users/single.html",controller:"userEditController",controllerAs:"user"}),t.html5Mode(!0)}]),angular.module("mainCtrl",["postService"]).controller("mainController",["$rootScope","$location","Auth","Post",function(e,t,o,s){var r=this;r.processing=!1,r.postData={},e.$on("$routeChangeStart",function(){r.loggedIn=o.isLoggedIn(),o.getUser().then(function(e){r.user=e.data})}),r.doLogin=function(){r.processing=!0,r.error="",r.loginData&&r.loginData.username&&r.loginData.password?o.login(r.loginData.username,r.loginData.password).success(function(e){r.processing=!1,e.success?t.path("/users"):r.error=e.message}):(r.processing=!1,r.error="Username & Password Required")},r.doLogout=function(){o.logout(),r.user={},t.path("/login")}}]),angular.module("postCtrl",["postService"]).controller("postController",["Post","Auth",function(e,t){var o=this;o.processing=!0,o.type="create",o.loadPosts=function(){e.all().success(function(e){o.processingPosts=!1,o.posts=e})},o.loadPosts(),t.getUser().then(function(e){o.user=e.data}),o.createPost=function(){if(console.log("Length: "+o.postData.body.length),o.postData.subject&&o.postData.body)if(o.postData.body.length<=140){var t={subject:o.postData.subject,body:o.postData.body,userid:o.user.id,username:o.user.username};e.create(t).then(function(e){var t=e.data.message;swal("Success!",t.toString(),"success"),o.postData={},o.loadPosts()})}else swal("Oops!","Post body has a 140 character limit! Please try again!","error");else swal("Error!","Post must have subject and body","error")},o.updatePostStatus=function(t){e.status(t).then(function(e){o.loadPosts()})},o.openEditModal=function(e){console.log("POST: "+JSON.stringify(e)),o.type="edit",o.editPostData=JSON.parse(JSON.stringify(e)),$("#editPostModal").modal("show")},o.updatePostContent=function(){console.log("POST CONTENT: "+JSON.stringify(o.editPostData)+" "+o.editPostData.body.length),o.editPostData.body.length<=140?e.update(o.editPostData).then(function(e){var t=e.data.message;swal("Success!",t.toString(),"success"),o.editPostData={},o.loadPosts(),$("#editPostModal").modal("hide")}):swal("Oops!","Post body has a 140 character limit! Please try again!","error")}}]),angular.module("userCtrl",["userService","postService"]).controller("userController",["User","Post",function(e,t){var o=this;o.processing=!0,o.processingPosts=!0,o.loadUsers=function(){e.all().success(function(e){o.processing=!1,o.users=e})},o.loadUsers(),o.deleteUser=function(t){o.processing=!0,e["delete"](t).success(function(e){o.loadUsers()})}}]).controller("userCreateController",["User",function(e){var t=this;t.type="create",t.roles=["admin","manager","user"],t.saveUser=function(){t.processing=!0,t.message="",console.log("Creating new user!"),e.create(t.userData).success(function(e){console.log("Created New User!"),t.processing=!1,t.userData={},t.message=e.message})}}]).controller("userEditController",["$routeParams","User",function(e,t){var o=this;o.type="edit",o.roles=["admin","manager","user"],t.get(e.user_id).success(function(e){o.userData=e}),o.saveUser=function(){o.processing=!0,o.message="",t.update(e.user_id,o.userData).success(function(e){o.processing=!1,o.userData={},o.message=e.message})}}]),angular.module("authService",[]).factory("Auth",["$http","$q","AuthToken",function(e,t,o){var s={};return s.login=function(t,s){return e.post("/api/authenticate",{username:t,password:s}).success(function(e){return o.setToken(e.token),e})},s.logout=function(){o.setToken()},s.isLoggedIn=function(){var e=!1;return o.getToken()&&(e=!0),e},s.getUser=function(){return o.getToken()?(console.log("token exists!"),e.get("/api/me")):t.reject({message:"User has no token."})},s}]).factory("AuthToken",["$window",function(e){var t={};return t.getToken=function(){return e.localStorage.getItem("token")},t.setToken=function(t){t?e.localStorage.setItem("token",t):e.localStorage.removeItem("token",t)},t}]).factory("AuthInterceptor",["$q","$location","AuthToken",function(e,t,o){var s={};return s.request=function(e){var t=o.getToken();return t&&(e.headers["x-access-token"]=t),e},s.responseError=function(e){403==e.status&&(o.setToken(),t.path("/login"))},s}]),angular.module("postService",[]).factory("Post",["$http",function(e){var t={};return t.create=function(t){return console.log("Creating Post"),e.post("/api/posts/",t)},t.all=function(){return console.log("Retrieving Posts"),e.get("/api/posts")},t.status=function(t){return console.log("Updating Post Read Flag For: "+t),e.put("/api/posts/"+t)},t.update=function(t){return console.log("Updating Post Content For: "+t._id),e.put("/api/posts/"+t._id,t)},t}]),angular.module("userService",[]).factory("User",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/users/"+t)},t.all=function(){return e.get("/api/users/")},t.create=function(t){return e.post("/api/users/",t)},t.update=function(t,o){return e.put("/api/users/"+t,o)},t["delete"]=function(t){return e["delete"]("/api/users/"+t)},t}]);