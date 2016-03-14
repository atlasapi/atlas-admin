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

            'app/app.module.js',
            'app/app.config.js',

            'app/presentation/applications/applications.module.js',
            'app/presentation/applications/applications.ctrl.js',
            'app/presentation/applications/createModal/applicationCreateModal.ctrl.js',
            'app/presentation/application/application.module.js',
            'app/presentation/application/application.ctrl.js',
            'app/presentation/application/sourcesRequestModal/applicationSourceRequestModal.ctrl.js',
            'app/presentation/requestSource/requestSource.module.js',
            'app/presentation/requestSource/requestSource.ctrl.js',
            'app/presentation/wishlist/wishlist.module.js',
            'app/presentation/wishlist/wishlist.ctrl.js',
            'app/presentation/wishlist/wishlistFeatures.ctrl.js',
            'app/presentation/wishlist/wishlistSources.ctrl.js',
            'app/presentation/wishlist/customFeatureRequestModal/customFeatureRequestModal.ctrl.js',
            'app/presentation/epg/epg.module.js',
            'app/presentation/epg/epg.ctrl.js',
            'app/presentation/scrubbables/scrubbables.module.js',
            'app/presentation/scrubbables/scrubbables.ctrl.js',
            'app/presentation/feeds/feeds.module.js',
            'app/presentation/feeds/feeds.ctrl.js',
            'app/presentation/feed/feed.module.js',
            'app/presentation/feed/feed.ctrl.js',
            'app/presentation/feed/actionsModal/actionsModal.ctrl.js',
            'app/presentation/feedBreakdown/feedBreakdown.module.js',
            'app/presentation/feedBreakdown/feedBreakdown.ctrl.js',
            'app/presentation/feedBreakdown/statusDetailModal/statusDetailModal.ctrl.js',
            'app/presentation/manageSources/manageSources.module.js',
            'app/presentation/manageSources/manageSources.ctrl.js',
            'app/presentation/manageSourcesReaders/manageSourcesReaders.module.js',
            'app/presentation/manageSourcesReaders/manageSourcesReaders.ctrl.js',
            'app/presentation/manageSourcesWriters/manageSourcesWriters.module.js',
            'app/presentation/manageSourcesWriters/manageSourcesWriters.ctrl.js',
            'app/presentation/manageSourcesWriters/addWriterModal/addWriterModal.ctrl.js',
            'app/presentation/manageRequests/manageRequests.module.js',
            'app/presentation/manageRequests/manageRequests.ctrl.js',
            'app/presentation/manageUsers/manageUsers.module.js',
            'app/presentation/manageUsers/manageUsers.ctrl.js',
            'app/presentation/manageUser/manageUser.module.js',
            'app/presentation/manageUser/manageUser.ctrl.js',
            'app/presentation/manageUsage/manageUsage.module.js',
            'app/presentation/manageUsage/manageUsage.ctrl.js',
            'app/presentation/manageWishList/manageWishList.module.js',
            'app/presentation/manageWishList/manageWishList.ctrl.js',
            'app/presentation/manageWishList/manageWishListFeatureRequests.ctrl.js',
            'app/presentation/manageWishList/manageWishListFeatures.ctrl.js',
            'app/presentation/manageWishList/manageWishListSourceRequests.ctrl.js',
            'app/presentation/manageWishList/manageWishListSources.ctrl.js',
            'app/presentation/manageWishList/newWishlistItemModal/newWishlistItemModal.ctrl.js',
            'app/presentation/login/login.module.js',
            'app/presentation/login/login.ctrl.js',
            'app/presentation/logout/logout.module.js',
            'app/presentation/logout/logout.ctrl.js',
            'app/presentation/auth/auth.module.js',
            'app/presentation/auth/auth.ctrl.js',
            'app/presentation/terms/terms.module.js',
            'app/presentation/terms/terms.ctrl.js',
            'app/presentation/profile/profile.module.js',
            'app/presentation/profile/profile.ctrl.js',
            'app/presentation/contact/contact.module.js',
            'app/presentation/contact/contact.ctrl.js',
            'app/presentation/videoSourceProviders/videoSourceProviders.module.js',
            'app/presentation/videoSourceProviders/videoSourceProviders.ctrl.js',
            'app/presentation/videoSourceConfig/videoSourceConfig.module.js',
            'app/presentation/videoSourceConfig/videoSourceConfig.ctrl.js',
            'app/presentation/error/error.module.js',
            'app/presentation/error/error.ctrl.js',
            'app/presentation/menu/menu.module.js',
            'app/presentation/menu/menu.ctrl.js',

            'app/components/config/atlasAdmin.config.js',

            'app/components/directives/orderable/orderable.module.js',
            'app/components/directives/orderable/orderable.directive.js',
            'app/components/directives/focus/focus.module.js',
            'app/components/directives/focus/focus.directive.js',
            'app/components/directives/activePath/activePath.module.js',
            'app/components/directives/activePath/activePath.directive.js',
            'app/components/directives/validUsage/validUsage.module.js',
            'app/components/directives/validUsage/validUsage.directive.js',
            'app/components/directives/inputMorph/inputMorph.module.js',
            'app/components/directives/inputMorph/inputMorph.directive.js',
            'app/components/directives/loadContent/loadContent.module.js',
            'app/components/directives/loadContent/loadContent.directive.js',
            'app/components/directives/scrubber/scrubber.module.js',
            'app/components/directives/scrubber/scrubber.directive.js',
            'app/components/directives/atlasSearch/atlasSearch.module.js',
            'app/components/directives/atlasSearch/atlasSearch.directive.js',
            'app/components/directives/reduxVideo/reduxVideo.module.js',
            'app/components/directives/reduxVideo/reduxVideo.directive.js',
            'app/components/directives/showSegments/showSegments.module.js',
            'app/components/directives/showSegments/showSegments.directive.js',
            'app/components/directives/preloader/preloader.module.js',
            'app/components/directives/preloader/preloader.directive.js',
            'app/components/directives/actionModal/actionModal.module.js',
            'app/components/directives/actionModal/actionModal.directive.js',
            'app/components/directives/deleteItem/deleteItem.module.js',
            'app/components/directives/deleteItem/deleteItem.directive.js',
            'app/components/directives/changeStatus/changeStatus.module.js',
            'app/components/directives/changeStatus/changeStatus.directive.js',

            'app/components/services/auth/auth.module.js',
            'app/components/services/auth/auth.service.js',
            'app/components/services/atlas/atlas.module.js',
            'app/components/services/atlas/atlas.service.js',
            'app/components/services/applications/applications.module.js',
            'app/components/services/applications/applications.service.js',
            'app/components/services/sources/sources.module.js',
            'app/components/services/sources/sources.service.js',
            'app/components/services/payments/payments.module.js',
            'app/components/services/payments/payments.service.js',
            'app/components/services/sourceRequests/sourceRequests.module.js',
            'app/components/services/sourceRequests/sourceRequests.service.js',
            'app/components/services/sourceLicenses/sourceLicenses.module.js',
            'app/components/services/sourceLicenses/sourceLicenses.service.js',
            'app/components/services/users/users.module.js',
            'app/components/services/users/users.service.js',
            'app/components/services/profileStatus/profileStatus.module.js',
            'app/components/services/profileStatus/profileStatus.service.js',
            'app/components/services/userVideoSources/userVideoSources.module.js',
            'app/components/services/userVideoSources/userVideoSources.service.js',
            'app/components/services/propositions/propositions.module.js',
            'app/components/services/propositions/propositions.service.js',
            'app/components/services/apiUsage/apiUsage.module.js',
            'app/components/services/apiUsage/apiUsage.service.js',
            'app/components/services/feeds/feeds.module.js',
            'app/components/services/feeds/feeds.service.js',
            'app/components/services/bbcRedux/bbcRedux.module.js',
            'app/components/services/bbcRedux/bbcRedux.service.js',
            'app/components/services/scrubbableHelpers/scrubbableHelpers.module.js',
            'app/components/services/scrubbableHelpers/scrubbableHelpers.service.js',
            'app/components/services/scrubbables/scrubbables.module.js',
            'app/components/services/scrubbables/scrubbables.service.js',
            'app/components/services/groups/groups.module.js',
            'app/components/services/groups/groups.service.js',
            'app/components/services/wishes/wishes.module.js',
            'app/components/services/wishes/wishes.service.js',

            'app/components/interceptors/auth/auth.module.js',
            'app/components/interceptors/auth/auth.interceptor.js',
            'app/components/interceptors/loading/loading.module.js',
            'app/components/interceptors/loading/loading.interceptor.js',
            'app/components/interceptors/profileComplete/profileComplete.module.js',
            'app/components/interceptors/profileComplete/profileComplete.interceptor.js',

            'app/components/filters/filters.module.js',
            'app/components/filters/filters.js'];

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
