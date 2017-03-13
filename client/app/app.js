import angular from 'angular';

import './app.less';

import ngRoute    from '../components/angular-route';

import XLSXReaderService from './XLSXReaderService/XLSXReaderService.service.js';


import mainRouting from './main/main.js';
import MainCtrl from './main/main.controller.js';

const MODULE_NAME = 'jsxlsxApp';

angular.module(MODULE_NAME, [
  ngRoute,
  XLSXReaderService
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, $compileProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|blob|mailto|chrome-extension):/);
    $locationProvider.html5Mode(true);

  })

  .config(mainRouting)
  .controller('MainCtrl', MainCtrl);


export default MODULE_NAME;
