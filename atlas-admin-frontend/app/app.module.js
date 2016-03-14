'use strict';

// Declare app level module which depends on filters, and services
angular.module('atlasAdmin',
   [
    'ui.bootstrap',
    'atlasAdmin.filters',
    'atlasAdmin.login',
    'atlasAdmin.logout',
    'atlasAdmin.auth',
    'atlasAdmin.applications',
    'atlasAdmin.application',
    'atlasAdmin.requestSource',
    'atlasAdmin.wishlist',
    'atlasAdmin.epg',
    'atlasAdmin.scrubbables',
    'atlasAdmin.feeds',
    'atlasAdmin.feed',
    'atlasAdmin.feedBreakdown',
    'atlasAdmin.manageSources',
    'atlasAdmin.manageSourcesReaders',
    'atlasAdmin.manageSourcesWriters',
    'atlasAdmin.manageRequests',
    'atlasAdmin.manageUsers',
    'atlasAdmin.manageUser',
    'atlasAdmin.manageUsage',
    'atlasAdmin.manageWishlist',
    'atlasAdmin.terms',
    'atlasAdmin.profile',
    'atlasAdmin.contact',
    'atlasAdmin.videoSourceProviders',
    'atlasAdmin.videoSourceConfig',
    'atlasAdmin.error',
    'atlasAdmin.menu',

    'atlasAdmin.directives.preloader',
    'atlasAdmin.directives.activePath',

    'atlasAdmin.services.auth',

    'atlasAdmin.interceptors.auth',
    'atlasAdmin.interceptors.loading',
    'atlasAdmin.interceptors.profileComplete',

    'ngResource',
    'ngRoute',
    'atlasAdminConfig'
  ]);
