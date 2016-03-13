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
            'node_modules/contact-us-form/dist/contact-us-form.js',
            'node_modules/highlight.js/lib/highlight.js',
            'node_modules/lodash/lodash.js',
            'node_modules/moment/moment.js',
            'node_modules/d3/d3.min.js',
            'js/app.js',



            'presentation/applications/applications.module.js',
            'presentation/applications/applications.ctrl.js',
            'presentation/applications/createModal/applicationCreateModal.ctrl.js',
            'presentation/application/application.module.js',
            'presentation/application/application.ctrl.js',
            'presentation/application/sourcesRequestModal/applicationSourceRequestModal.ctrl.js',
            'presentation/requestSource/requestSource.module.js',
            'presentation/requestSource/requestSource.ctrl.js',
            'presentation/wishlist/wishlist.module.js',
            'presentation/wishlist/wishlist.ctrl.js',
            'presentation/wishlist/wishlistFeatures.ctrl.js',
            'presentation/wishlist/wishlistSources.ctrl.js',
            'presentation/wishlist/customFeatureRequestModal/customFeatureRequestModal.ctrl.js',
            'presentation/epg/epg.module.js',
            'presentation/epg/epg.ctrl.js',
            'presentation/scrubbables/scrubbables.module.js',
            'presentation/scrubbables/scrubbables.ctrl.js',
            'presentation/feeds/feeds.module.js',
            'presentation/feeds/feeds.ctrl.js',
            'presentation/feed/feed.module.js',
            'presentation/feed/feed.ctrl.js',
            'presentation/feed/actionsModal/actionsModal.ctrl.js',
            'presentation/feedBreakdown/feedBreakdown.module.js',
            'presentation/feedBreakdown/feedBreakdown.ctrl.js',
            'presentation/feedBreakdown/statusDetailModal/statusDetailModal.ctrl.js',
            'presentation/manageSources/manageSources.module.js',
            'presentation/manageSources/manageSources.ctrl.js',
            'presentation/manageSourcesReaders/manageSourcesReaders.module.js',
            'presentation/manageSourcesReaders/manageSourcesReaders.ctrl.js',
            'presentation/manageSourcesWriters/manageSourcesWriters.module.js',
            'presentation/manageSourcesWriters/manageSourcesWriters.ctrl.js',
            'presentation/manageSourcesWriters/addWriterModal/addWriterModal.ctrl.js',
            'presentation/manageRequests/manageRequests.module.js',
            'presentation/manageRequests/manageRequests.ctrl.js',
            'presentation/manageUsers/manageUsers.module.js',
            'presentation/manageUsers/manageUsers.ctrl.js',
            'presentation/manageUser/manageUser.module.js',
            'presentation/manageUser/manageUser.ctrl.js',
            'presentation/manageUsage/manageUsage.module.js',
            'presentation/manageUsage/manageUsage.ctrl.js',
            'presentation/manageWishList/manageWishList.module.js',
            'presentation/manageWishList/manageWishList.ctrl.js',
            'presentation/manageWishList/manageWishListFeatureRequests.ctrl.js',
            'presentation/manageWishList/manageWishListFeatures.ctrl.js',
            'presentation/manageWishList/manageWishListSourceRequests.ctrl.js',
            'presentation/manageWishList/manageWishListSources.ctrl.js',
            'presentation/manageWishList/newWishlistItemModal/newWishlistItemModal.ctrl.js',
            'presentation/login/login.module.js',
            'presentation/login/login.ctrl.js',
            'presentation/logout/logout.module.js',
            'presentation/logout/logout.ctrl.js',
            'presentation/auth/auth.module.js',
            'presentation/auth/auth.ctrl.js',
            'presentation/terms/terms.module.js',
            'presentation/terms/terms.ctrl.js',
            'presentation/profile/profile.module.js',
            'presentation/profile/profile.ctrl.js',
            'presentation/contact/contact.module.js',
            'presentation/contact/contact.ctrl.js',
            'presentation/videoSourceProviders/videoSourceProviders.module.js',
            'presentation/videoSourceProviders/videoSourceProviders.ctrl.js',
            'presentation/videoSourceConfig/videoSourceConfig.module.js',
            'presentation/videoSourceConfig/videoSourceConfig.ctrl.js',
            'presentation/error/error.module.js',
            'presentation/error/error.ctrl.js',
            'presentation/menu/menu.module.js',
            'presentation/menu/menu.ctrl.js',

            'components/directives/orderable/orderable.module.js',
            'components/directives/orderable/orderable.directive.js',
            'components/directives/focus/focus.module.js',
            'components/directives/focus/focus.directive.js',
            'components/directives/activePath/activePath.module.js',
            'components/directives/activePath/activePath.directive.js',
            'components/directives/validUsage/validUsage.module.js',
            'components/directives/validUsage/validUsage.directive.js',
            'components/directives/inputMorph/inputMorph.module.js',
            'components/directives/inputMorph/inputMorph.directive.js',
            'components/directives/loadContent/loadContent.module.js',
            'components/directives/loadContent/loadContent.directive.js',
            'components/directives/scrubber/scrubber.module.js',
            'components/directives/scrubber/scrubber.directive.js',
            'components/directives/atlasSearch/atlasSearch.module.js',
            'components/directives/atlasSearch/atlasSearch.directive.js',
            'components/directives/reduxVideo/reduxVideo.module.js',
            'components/directives/reduxVideo/reduxVideo.directive.js',
            'components/directives/showSegments/showSegments.module.js',
            'components/directives/showSegments/showSegments.directive.js',
            'components/directives/preloader/preloader.module.js',
            'components/directives/preloader/preloader.directive.js',
            'components/directives/actionModal/actionModal.module.js',
            'components/directives/actionModal/actionModal.directive.js',
            'components/directives/deleteItem/deleteItem.module.js',
            'components/directives/deleteItem/deleteItem.directive.js',
            'components/directives/changeStatus/changeStatus.module.js',
            'components/directives/changeStatus/changeStatus.directive.js',

            'components/services/auth/auth.module.js',
            'components/services/auth/auth.service.js',
            'components/services/atlas/atlas.module.js',
            'components/services/atlas/atlas.service.js',
            'components/services/applications/applications.module.js',
            'components/services/applications/applications.service.js',
            'components/services/sources/sources.module.js',
            'components/services/sources/sources.service.js',
            'components/services/payments/payments.module.js',
            'components/services/payments/payments.service.js',
            'components/services/sourceRequests/sourceRequests.module.js',
            'components/services/sourceRequests/sourceRequests.service.js',
            'components/services/sourceLicenses/sourceLicenses.module.js',
            'components/services/sourceLicenses/sourceLicenses.service.js',
            'components/services/users/users.module.js',
            'components/services/users/users.service.js',
            'components/services/profileStatus/profileStatus.module.js',
            'components/services/profileStatus/profileStatus.service.js',
            'components/services/userVideoSources/userVideoSources.module.js',
            'components/services/userVideoSources/userVideoSources.service.js',
            'components/services/propositions/propositions.module.js',
            'components/services/propositions/propositions.service.js',
            'components/services/apiUsage/apiUsage.module.js',
            'components/services/apiUsage/apiUsage.service.js',
            'components/services/feeds/feeds.module.js',
            'components/services/feeds/feeds.service.js',
            'components/services/bbcRedux/bbcRedux.module.js',
            'components/services/bbcRedux/bbcRedux.service.js',
            'components/services/scrubbableHelpers/scrubbableHelpers.module.js',
            'components/services/scrubbableHelpers/scrubbableHelpers.service.js',
            'components/services/scrubbables/scrubbables.module.js',
            'components/services/scrubbables/scrubbables.service.js',
            'components/services/groups/groups.module.js',
            'components/services/groups/groups.service.js',
            'components/services/wishes/wishes.module.js',
            'components/services/wishes/wishes.service.js',

            'components/interceptors/auth/auth.module.js',
            'components/interceptors/auth/auth.interceptor.js',
            'components/interceptors/loading/loading.module.js',
            'components/interceptors/loading/loading.interceptor.js',
            'components/interceptors/profileComplete/profileComplete.module.js',
            'components/interceptors/profileComplete/profileComplete.interceptor.js',

            'components/filters/filters.module.js',
            'components/filters/filters.js'];

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
        .pipe(gulp.dest('js/dist'));
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
