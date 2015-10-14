var gulp = require('gulp');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon'); //used to start node server

//linting js task
gulp.task('js', function() {
	return gulp.src(['server.js',
					 'public/app/*.js',
					 'public/app/**/*.js'])
					 .pipe(jshint())
					 .pipe(jshint.reporter('default'));
});

//used to minify angular, node, etc js, concat, then save to dist folder as 1 js file
gulp.task('angular', function() {
	return gulp.src(['public/app/*.js',
					 'public/app/**/*.js'])
					 .pipe(jshint())                   //lint JS for errors
					 .pipe(jshint.reporter('default')) // " "
					 .pipe(ngAnnotate())			   //this minifies angular regardless of style
					 .pipe(concat('all.js'))		   //concat all js files together (all.js)
					 .pipe(uglify())				   //minify results
					 .pipe(gulp.dest('public/dist'));  //save in dist folder
});

//create gulp 'watch' task to sit and wait for changes to files, then run the tasks automatically
gulp.task('watch', function() {
	
	//watch the less file for changes
	gulp.watch('public/assets/css/style.less', ['css']); //2nd arg is array of tasks to run!
	
	//watch js files
	gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js'], //1st arg -> files to watch (array or single file)
			   ['js', 'angular']); //2nd arg -> tasks to run in order
	
	
});

//node task to start node server
gulp.task('nodemon', function() {
	nodemon({
		script: 'server.js', //starting scripts
		ext: 'js less html'  //types of files to watch for changes
	})
		//create event handlers for start, change, restart of server
		.on('start', ['watch']) //on start -> run watch task
		.on('change',['watch'])
		.on('restart', function() {
			console.log("restarted!");
		});
		
	
});

//Define main gulp task to run by default when you just type 'gulp'
gulp.task('default', ['nodemon']);

