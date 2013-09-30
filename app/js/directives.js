'use strict';

/* Directives */


var app = angular.module('atlasAdmin.directives', []);

app.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);


app.directive('orderable', function() {
   return function(scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                e.dataTransfer.setData('y', e.pageY);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
       el.addEventListener(
            'dragover',
            function(e) {
              e.dataTransfer.dropEffect = 'move';
              // allows us to drop
              e.preventDefault();
              this.classList.add('over');
              return false;
            },
            false
      );
      el.addEventListener(
            'dragleave',
            function(e) {
              e.dataTransfer.dropEffect = 'move';
              // allows us to drop
              if (e.preventDefault) e.preventDefault();
                this.classList.remove('over');
                return false;
              },
              false
          );
     el.addEventListener(
         'drop',
         function(e) {
           // Stops some browsers from redirecting.
           if (e.preventDefault) e.preventDefault(); // Stops FF from redirecting
           if (e.stopPropagation) e.stopPropagation();
              this.classList.remove('over');
              var item = document.getElementById(e.dataTransfer.getData('Text'));
              var isDown = e.dataTransfer.getData('y') < e.pageY;
              if (isDown) {
                // insert after
                this.parentNode.insertBefore(item, this.nextSibling);
              } else {
                // insert before
                this.parentNode.insertBefore(item, item.previousSibling);
              }
              return false;
         },
         false
     );
       
   }    
});
