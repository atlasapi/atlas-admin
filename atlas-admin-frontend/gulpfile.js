'use-strict';

var gulp        = require('gulp'),
	scss        = require('gulp-sass'),
	autoprefix  = require('gulp-autoprefixer'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify');

var assets = {};

// Javascripts must me loaded in order, so hence the large array
assets.js = ['js/app.js',
             'js/services/auth.js',
             'js/services/atlas.js',
             'js/services/users.js',
             'js/services/applications.js',
             'js/services/sources.js',
             'js/services/sourceRequests/sourceRequests.js',
             'js/services/sourceRequests/factorySourceRequests.js',
             'js/services/sourceRequests/factorySourcePayments.js',
             'js/services/sourceLicenses.js',
             'js/services/userVideoSources.js',
             'js/services/userVideoSourcesYouTube.js',
             'js/services/propositions.js',
             'js/services/wishes.js',
             'js/filters.js',
             'js/directives/orderable.js',
             'js/directives/focus.js',
             'js/directives/activePath.js',
             'js/directives/validUsage.js',
             'js/directives/inputmorph.js',
             'js/controllers/errors.js',
             'js/controllers/auth.js',
             'js/controllers/sources.js',
             'js/controllers/sourceRequests.js',
             'js/controllers/requestSource.js',
             'js/controllers/userProfile.js',
             'js/controllers/userVideoSources.js',
             'js/controllers/userVideoSourcesYouTube.js',
             'js/controllers/applications/applicationView.js',
             'js/controllers/applications/applicationEdit.js',
             'js/controllers/applications/applicationCreateModal.js',
             'js/controllers/wishlist/wishlist.js',
             'js/controllers/wishlist/wishlistSources.js',
             'js/controllers/wishlist/wishlistFeatures.js',
             'js/controllers/admins/manageWishlist.js',
             'js/controllers/admins/manageSourceRequests.js',
             'js/controllers/viewTerms.js']

//  Styles
//
//  concatenate and compress stylesheets
//
gulp.task('styles', function() {
	gulp.src('scss/app.scss')
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
    gulp.src(assets.js)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('js/dist'));
});

//  Watch
//
//  watch for changes to the source files and run associated tasks
//
gulp.task('watch', function() {
	gulp.watch('scss/**/*.scss', ['styles']);
    gulp.watch('js/**/*.js', ['javascripts']);
});

//  Resgister the default task. 
//  to run:$ gulp
//
gulp.task('default', ['styles', 'javascripts', 'watch']);