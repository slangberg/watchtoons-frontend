var watchtoons_controllers = angular.module('watchtoons.controllers', []);
var watchtoons_directives = angular.module('watchtoons.directives', []);
var watchtoons_factories = angular.module('watchtoons.factories', []);

var app = angular.module('watchtoons-app', ['LocalStorageModule','watchtoons.controllers','watchtoons.directives','watchtoons.factories','slick']);


