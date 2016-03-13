angular.module('atlasAdmin.directives.changeStatus')
  .directive('changestatus', ['$document', 'factoryPropositions',
      function factory($document, Propositions) {
      var definitionObj = {
          link: function(scope, $el, attr) {
              $el.on('click', function() {
                  var itemId = attr.id;
                  var status = attr.changestatus;
                  var parentClassRegex = new RegExp('\\b' + 'state-' + '.+?\\b', 'g');
                  if ('string' === typeof itemId && 'string' === typeof status) {
                      $el.parent().children().removeClass('active');
                      $el.addClass('active');
                      Propositions.updateStatus(itemId, status);
                  }
              })
          }
      }
      return definitionObj;
  }]);
