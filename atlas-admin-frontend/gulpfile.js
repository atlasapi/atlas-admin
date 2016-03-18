'use-strict';

const gulp = require('gulp');
const scss = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');
const gulpProtractorAngular = require('gulp-angular-protractor');
const templateCache = require('gulp-angular-templatecache');
const jsSources = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/angular/angular.min.js',
    'node_modules/angular-resource/angular-resource.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/contact-us-form/dist/contact-us-form.js',
    'node_modules/highlight.js/lib/highlight.js',
    'node_modules/lodash/lodash.js',
    'node_modules/moment/moment.js',
    'node_modules/d3/d3.min.js',
    'app/**/*.module.js',
    'app/**/*.js'
  ];

// Task inits
gulp.task('styles', build_styles);
gulp.task('javascripts', build_scripts);
gulp.task('index', build_index_file);
gulp.task('images', build_images);
gulp.task('templates', build_templates);
gulp.task('server', run_server);
gulp.task('watch', watch_tasks);
gulp.task('protractor', run_protractor);
gulp.task('dev', ['build', 'watch', 'server']);
gulp.task('build', ['styles', 'javascripts', 'index', 'images', 'templates']);

//
// Task functions
//

// Styles
function build_styles() {
	return gulp.src('scss/base.scss')
        		 .pipe(scss({
    		        outputStyle: 'compressed'
    			    }))
        		 .pipe(autoprefix('last 2 versions'))
        		 .pipe(gulp.dest('dist/assets/css'));
};

// Javascripts
function build_scripts() {
  return gulp.src(jsSources)
      .pipe(concat('scripts.js'))
      //.pipe(uglify())
      .pipe(gulp.dest('dist/assets/js'));
};

// Index
function build_index_file() {
   return gulp.src(['index.html','unsupported.html'])
              .pipe(gulp.dest('dist'));
}

// Images
function build_images() {
  return gulp.src('img/**/*.*')
             .pipe(gulp.dest('dist/assets/img'));
}

// Templates
function build_templates() {
  return gulp.src('app/**/*.tpl.html')
             .pipe( templateCache({
               standalone: true
             }))
             .pipe( gulp.dest('dist/assets/js') );
}

// Server
function run_server() {
  return gulp.src('dist/')
             .pipe(webserver({
               port: 8080,
               directoryListing: false
             }));
};

//  Watch
function watch_tasks() {
	gulp.watch('scss/**/*.scss', ['build']);
  gulp.watch('app/**/*.js', ['build']);
};

function wrapPipe(taskFn) {
  return function(done) {
    var onSuccess = function() {
      done();
    };
    var onError = function(err) {
      done(err);
    }
    var outStream = taskFn(onSuccess, onError);
    if(outStream && typeof outStream.on === 'function') {
      outStream.on('end', onSuccess);
    }
  }
}

// E2E Tests
function run_protractor() {
  return gulp.src([
        'tests/login/login.e2e.js',
        'tests/applications/applications.e2e.js',
        'tests/application/application.e2e.js',
        'tests/wishlist/wishlist.e2e.js',
        'tests/epg/epg.e2e.js',
        'tests/feeds/feeds.e2e.js',
        'tests/sources/sources.e2e.js',
        'tests/requests/requests.e2e.js',
        'tests/users/users.e2e.js',
        'tests/wishlistManager/wishlistManager.e2e.js',
        'tests/terms/terms.e2e.js',
        'tests/contact/contact.e2e.js'
      ])
      .pipe(
        gulpProtractorAngular({
          'configFile': 'protractor.conf.js',
          'debug': false,
          'autoStartStopServer': true
        })
        .on('error', function(e) {
          throw e
        })
      );
};
