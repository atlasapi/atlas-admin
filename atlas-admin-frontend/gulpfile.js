'use-strict';

var gulp = require('gulp');
var scss = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var assets = {};
var gulpProtractorAngular = require('gulp-angular-protractor');

// Javascripts must be loaded in order, so hence the large array
assets.js = [
            'app/**/*.module.js',
            'app/**/*.js'
          ];

//  Styles
//
//  concatenate and compress stylesheets
//
gulp.task('styles', function() {
	gulp.src('scss/base.scss')
		.pipe(scss({
			outputStyle: 'compressed'
			}))
		.pipe(autoprefix('last 2 versions'))
		.pipe(gulp.dest('css'));
});

//  Javascripts
//
//  concatenate and compress javascripts
//
gulp.task('javascripts', function() {
    return gulp.src(assets.js)
        .pipe(concat('scripts.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('dist'));
});

//  Tests
gulp.task('protractor', function() {
    gulp.src([
          'tests/login/login.e2e.js',
          'tests/applications/applications.e2e.js',
          'tests/application/application.e2e.js',
          'tests/wishlist/wishlist.e2e.js',
          'tests/epg/epg.e2e.js',
          'tests/feeds/feeds.e2e.js',
          'tests/sources/sources.e2e.js',
          'tests/requests/requests.e2e.js',
          'tests/users/users.e2e.js',
          'tests/wishlistManager/wishlistManager.e2e.js'
        ])
        .pipe(gulpProtractorAngular({
            'configFile': 'protractor.conf.js',
            'debug': false,
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            console.log(e);
        });
});

// Server
gulp.task('server', function() {
  gulp.src('./')
    .pipe(webserver({
      port: 8080,
      directoryListing: false
    }));
});

//  Watch
//
//  watch for changes to the source files and run associated tasks
//
gulp.task('watch', function() {
	gulp.watch('scss/**/*.scss', ['styles']);
  gulp.watch('js/**/*.js', ['javascripts']);
});

// Dev
gulp.task('dev', ['styles', 'javascripts', 'watch', 'server']);
