function endsWith(e,t){return-1!==e.indexOf(t,e.length-t.length)}var userApp=angular.module("userApp",["ngAnimate","app.routes","authService","mainCtrl","userCtrl","userService","postCtrl","postService","fileCtrl","fileService","angularFileUpload"]);userApp.config(["$httpProvider",function(e){e.interceptors.push("AuthInterceptor")}]),userApp.directive("customOnChange",function(){return{restrict:"A",link:function(e,t,o){var s=e.$eval(o.customOnChange);t.bind("change",s)}}}),angular.module("app.routes",["ngRoute"]).config(["$routeProvider","$locationProvider",function(e,t){e.when("/",{templateUrl:"app/views/pages/home.html"}).when("/login",{templateUrl:"app/views/pages/login.html",controller:"mainController",controllerAs:"login"}).when("/upload",{templateUrl:"app/views/pages/upload.html",controller:"fileController",controllerAs:"file"}).when("/users",{templateUrl:"app/views/pages/users/all.html",controller:"userController",controllerAs:"user"}).when("/users/create",{templateUrl:"app/views/pages/users/single.html",controller:"userCreateController",controllerAs:"user"}).when("/users/:user_id",{templateUrl:"app/views/pages/users/single.html",controller:"userEditController",controllerAs:"user"}),t.html5Mode(!0)}]),angular.module("fileCtrl",["postService","fileService","angularFileUpload"]).controller("fileController",["$scope","$location","Auth","File","FileUploader",function(e,t,o,s,r){var n=this;n.processing=!1,jQuery.event.props.push("dataTransfer"),console.log("Setting up file drop!"),$("body").on("drop",function(e){console.log("DROPPED FILE!"),e.preventDefault();var t=e.dataTransfer.files[0];t.type.match("image.*")?n.FileUpload(t):swal("Error","Only images may be uploaded!","error")}),$("body").on("dragover",function(e){return!1}),e.uploadFile=function(e){var t=e.target.files[0];console.log("FileCtrl file was selected: "+t.name+" "+t.size+" "+t.data),endsWith(t.name,".jpg")||endsWith(t.name,".png")?n.FileUpload(t):swal("Error","Only images (jpg or png) may be uploaded!","error")},n.FileUpload=function(e){var t=new FileReader;t.onloadend=function(o){var s=t.result;n.upload(s,e.name,e.size)},t.readAsBinaryString(e)},n.upload=function(e,t,o){var r={data:e,name:t,size:o};s.upload(r).then(function(e){var t=e.data.message;swal("Success!",t,"success")})}}]),angular.module("mainCtrl",["postService","fileService","angularFileUpload"]).controller("mainController",["$rootScope","$location","$scope","Auth","Post","File","FileUploader",function(e,t,o,s,r,n,a){var l=this;l.processing=!1,l.postData={},e.$on("$routeChangeStart",function(){l.loggedIn=s.isLoggedIn(),s.getUser().then(function(e){l.user=e.data})}),l.doLogin=function(){l.processing=!0,l.error="",l.loginData&&l.loginData.username&&l.loginData.password?s.login(l.loginData.username,l.loginData.password).success(function(e){l.processing=!1,e.success?t.path("/users"):l.error=e.message}):(l.processing=!1,l.error="Username & Password Required")},l.doLogout=function(){s.logout(),l.user={},t.path("/login")}}]),angular.module("postCtrl",["postService"]).controller("postController",["Post","Auth",function(e,t){var o=this;o.processing=!0,o.type="create",o.loadPosts=function(){e.all().success(function(e){o.processingPosts=!1,o.posts=e,o.posts.length>5?$("#postTableDiv").addClass("scrollTable"):$("#postTableDiv").removeClass("scrollTable")})},o.loadPosts(),t.getUser().then(function(e){o.user=e.data}),o.createPost=function(){if(console.log("Length: "+o.postData.body.length),o.postData.subject&&o.postData.body)if(o.postData.body.length<=140){var t={subject:o.postData.subject,body:o.postData.body,userid:o.user.id,username:o.user.username};e.create(t).then(function(e){var t=e.data.message;swal("Success!",t.toString(),"success"),o.postData={},o.loadPosts()})}else swal("Oops!","Post body has a 140 character limit! Please try again!","error");else swal("Error!","Post must have subject and body","error")},o.updatePostStatus=function(t){e.status(t).then(function(e){o.loadPosts()})},o.openEditModal=function(e){console.log("POST: "+JSON.stringify(e)),o.type="edit",o.editPostData=JSON.parse(JSON.stringify(e)),$("#editPostModal").modal("show")},o.updatePostContent=function(){console.log("POST CONTENT: "+JSON.stringify(o.editPostData)+" "+o.editPostData.body.length),o.editPostData.body.length<=140?e.update(o.editPostData).then(function(e){var t=e.data.message;swal("Success!",t.toString(),"success"),o.editPostData={},o.loadPosts(),$("#editPostModal").modal("hide")}):swal("Oops!","Post body has a 140 character limit! Please try again!","error")},o.deletePost=function(t){swal({title:"Are you sure?",text:"You will not be able to recover this post!",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it!",closeOnConfirm:!0,closeOnCancel:!0},function(){o.processing=!0,e["delete"](t).success(function(e){o.loadPosts()})})}}]),angular.module("userCtrl",["userService","postService"]).controller("userController",["User","Post",function(e,t){var o=this;o.processing=!0,o.processingPosts=!0,o.loadUsers=function(){e.all().success(function(e){o.processing=!1,o.users=e,o.users.length>=6?$("#userTableDiv").addClass("scrollTable"):$("#userTableDiv").removeClass("scrollTable")})},o.loadUsers(),o.deleteUser=function(t){swal({title:"Are you sure?",text:"You will not be able to recover this user!",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it!",closeOnConfirm:!0,closeOnCancel:!0},function(){o.processing=!0,e["delete"](t).success(function(e){o.loadUsers()})})}}]).controller("userCreateController",["User",function(e){var t=this;t.type="create",t.roles=["admin","manager","user"],t.saveUser=function(){t.processing=!0,t.message="",console.log("Creating new user!"),e.create(t.userData).success(function(e){console.log("Created New User!"),t.processing=!1,t.userData={},t.message=e.message})}}]).controller("userEditController",["$routeParams","User",function(e,t){var o=this;o.type="edit",o.roles=["admin","manager","user"],t.get(e.user_id).success(function(e){o.userData=e}),o.saveUser=function(){o.processing=!0,o.message="",t.update(e.user_id,o.userData).success(function(e){o.processing=!1,o.userData={},o.message=e.message})}}]),angular.module("authService",[]).factory("Auth",["$http","$q","AuthToken",function(e,t,o){var s={};return s.login=function(t,s){return e.post("/api/authenticate",{username:t,password:s}).success(function(e){return o.setToken(e.token),e})},s.logout=function(){o.setToken()},s.isLoggedIn=function(){var e=!1;return o.getToken()&&(e=!0),e},s.getUser=function(){return o.getToken()?(console.log("token exists!"),e.get("/api/me")):t.reject({message:"User has no token."})},s}]).factory("AuthToken",["$window",function(e){var t={};return t.getToken=function(){return e.localStorage.getItem("token")},t.setToken=function(t){t?e.localStorage.setItem("token",t):e.localStorage.removeItem("token",t)},t}]).factory("AuthInterceptor",["$q","$location","AuthToken",function(e,t,o){var s={};return s.request=function(e){var t=o.getToken();return t&&(e.headers["x-access-token"]=t),e},s.responseError=function(e){403==e.status&&(o.setToken(),t.path("/login"))},s}]),angular.module("fileService",[]).factory("File",["$http",function(e){var t={};return t.upload=function(t){return e.post("/api/upload",t)},t}]),angular.module("postService",[]).factory("Post",["$http",function(e){var t={};return t.create=function(t){return console.log("Creating Post"),e.post("/api/posts/",t)},t.all=function(){return console.log("Retrieving Posts"),e.get("/api/posts")},t.status=function(t){return console.log("Updating Post Read Flag For: "+t),e.put("/api/posts/"+t)},t.update=function(t){return console.log("Updating Post Content For: "+t._id),e.put("/api/posts/"+t._id,t)},t["delete"]=function(t){return e["delete"]("/api/posts/"+t)},t}]),angular.module("userService",[]).factory("User",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/users/"+t)},t.all=function(){return e.get("/api/users/")},t.create=function(t){return e.post("/api/users/",t)},t.update=function(t,o){return e.put("/api/users/"+t,o)},t["delete"]=function(t){return e["delete"]("/api/users/"+t)},t}]);