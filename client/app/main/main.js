import MainHtml from './main.html';

mainRouting.$inject = ['$routeProvider'];

export default function mainRouting($routeProvider) {
  $routeProvider
    .when('/', {
      template: MainHtml,
      controller: 'MainCtrl',
      authenticate: false // main page authentication
    });
}
