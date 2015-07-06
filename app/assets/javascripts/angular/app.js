var senktus_controllers = angular.module('senktus.controllers', []);
var senktus_directives = angular.module('senktus.directives', []);
var senktus_factories = angular.module('senktus.factories', []);

var app = angular.module('senktus-app', ['LocalStorageModule','senktus.controllers','senktus.directives','senktus.factories','slick']);


