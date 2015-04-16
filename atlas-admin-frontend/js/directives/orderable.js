'use strict';

/* Directives */

var app = angular.module('atlasAdmin.directives.orderable', []);

app.directive('orderable', function () {
    return {
        link: function (scope, element) {
            // this gives us the native JS object
            var el = element[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function (e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Text', this.id);
                    this.setAttribute('data-y', e.pageY);
                    this.classList.add('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function (e) {
                    this.classList.remove('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragenter',
                function (e) {
                    e.preventDefault();
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragover',
                function (e) {
                    e.preventDefault();
                    return false;
                },
                false
            );

             // removed dragover
            el.addEventListener(
                'dragleave',
                function (e) {
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
                function (e) {
                    var item = document.getElementById(e.dataTransfer.getData('Text'));
                    var isDown = item.getAttribute('data-y') < e.pageY;
                    var movedSourceId = item.id.replace('source-','');
                    var movedSource;
                    var reads = [];

                    if (e.preventDefault) { e.preventDefault(); }
                    // Stops some browsers from redirecting.
                    if (e.preventDefault) { e.preventDefault(); } // Stops FF from redirecting
                    if (e.stopPropagation) { e.stopPropagation(); }

                    item.removeAttribute('data-y');

                    if (isDown) {
                        // insert after
                        this.parentNode.insertBefore(item, this.nextSibling);
                    }
                    else {
                        // insert before
                        this.parentNode.insertBefore(item, this.nextSibling.previousSibling);
                    }

                    for (var i in scope.app.application.sources.reads) {
                        if (scope.app.application.sources.reads[i].id === movedSourceId) {
                            movedSource = scope.app.application.sources.reads[i];
                        }
                    }

                    for (var j in scope.app.application.sources.reads) {
                        var source = scope.app.application.sources.reads[j];

                        if (source.id === scope.source.id) {
                            if (isDown) {
                                reads.push(source, movedSource);
                            }
                            else {
                                reads.push(movedSource, source);
                            }
                        }
                        else if (source.id !== movedSourceId) {
                            reads.push(source);
                        }
                    }

                    scope.app.application.sources.reads = reads;

                    // we've updated the precedence order, so tell
                    // the controller about that
                    scope.$emit('precedenceOrder');

                    return false;
                },
                false
            );
        }
    };
});
