'use-strict';

var gulp        = require('gulp');
var scss        = require('gulp-sass');
var autoprefix  = require('gulp-autoprefixer');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var assets      = {};

// Javascripts must be loaded in order, so hence the large array
assets.js = [
            'node_modules/contact-us-form/dist/contact-us-form.js',
            'js/vendor/highlight.js',
            'js/vendor/lodash.js',
            'js/vendor/moment.js',
            'js/vendor/d3.min.js',
            'js/app.js',
            'js/interceptors/authInterceptor.js',
            'js/interceptors/loadingInterceptor.js',
            'js/interceptors/profileCompleteInterceptor.js',
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
            'js/services/api-usage.js',
            'js/services/wishes.js',
            'js/services/groups.js',
            'js/services/feeds.js',
            'js/services/bbcScrubbables.js',
            'js/services/bbcRedux.js',
            'js/filters.js',
            'js/directives/preloader.js',
            'js/directives/orderable.js',
            'js/directives/focus.js',
            'js/directives/activePath.js',
            'js/directives/validUsage.js',
            'js/directives/inputMorph.js',
            'js/directives/loadContent.js',
            'js/directives/scrubber.js',
            'js/directives/showSegments.js',
            'js/directives/atlasSearch.js',
            'js/controllers/errors.js',
            'js/controllers/auth/auth.js',
            'js/controllers/auth/login.js',
            'js/controllers/auth/logout.js',
            'js/controllers/sources.js',
            'js/controllers/epgWidget.js',
            'js/controllers/sourceRequests.js',
            'js/controllers/requestSource.js',
            'js/controllers/userProfile.js',
            'js/controllers/contact.js',
            'js/controllers/userVideoSources.js',
            'js/controllers/userVideoSourcesYouTube.js',
            'js/controllers/feeds/feeds.js',
            'js/controllers/feeds/console.js',
            'js/controllers/feeds/breakdown.js',
            'js/controllers/applications/applicationView.js',
            'js/controllers/applications/applicationEdit.js',
            'js/controllers/applications/applicationCreateModal.js',
            'js/controllers/wishlist/wishlist.js',
            'js/controllers/wishlist/wishlistSources.js',
            'js/controllers/wishlist/wishlistFeatures.js',
            'js/controllers/bbcScrubbables/create.js',
            'js/controllers/admins/manageWishlist.js',
            'js/controllers/admins/manageSourceRequests.js',
            'js/controllers/admins/usage/requests.js',
            'js/controllers/viewTerms.js'];

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
//  to run: `$ gulp`
//
gulp.task('default', ['styles', 'javascripts', 'watch']);
