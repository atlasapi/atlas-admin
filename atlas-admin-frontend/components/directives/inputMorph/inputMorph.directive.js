angular.module('atlasAdmin.inputMorph')
  .directive('inputMorph', ['$document', function($document) {
    return function(scope, $el, attr) {
        var title = attr.title;
        var id = attr.inputMorph;

        // template
        $el.html( '<span class="button-state button medium stroke">I want this</span>'+
                      '<div class="form-state">'+
                          '<input type="text" name="reason" class="flush-right" placeholder="Briefly, why do you want access to '+title+'?">'+
                          '<span class="button small left-flush">ok</span>'+
                      '</div>' );

        // switch state on click
        $('.button-state', $el).on('click', function() {
            $('.button-to-input').removeClass('input-mode');
            $(this).parent().addClass('input-mode');
            $('input', this).focus();
        })

        // submit request
        $('.form-state .button', $el).on('click', function() {
            var reason = $('.form-state input', $el).val() || '';
            if (reason.length > 1) {
                scope.$parent.make_wish(id, reason);
            }else{
                console.error('Reason not long enough')
            }
        })
    }
}]);
