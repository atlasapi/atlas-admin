angular.module('atlasAdmin.directives.reduxVideo')
  .directive('reduxVideo', ['$document', 'GroupsService', '$q', '$http', 'bbcRedux',
    function($document, Groups, $q, $http, bbcRedux) {

    var getEpisode = function(crid) {
    }

    var controller = function($scope, $el, $attr) {
      bbcRedux.getToken().then(function(res) {
        console.log(res);
      });
    }

    return {
      template: '<div class="scrubbables-video"></div>',
      link: controller,
      scope: false
    }
  }]);
