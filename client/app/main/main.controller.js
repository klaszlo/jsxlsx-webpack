import angular from 'angular';

export default class MainCtrl {

  constructor ($scope, $http, $location ) {
    $scope.date = new Date();
    $scope.isItAlive = 'YESSS at ' + $scope.date;
    $scope.path = $location.path();

  }
}
