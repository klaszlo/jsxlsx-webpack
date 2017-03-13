import angular from 'angular';
import XLSXReader from './xlsx-reader.js';
import XLSX from './vendor/xlsx.js';
console.log('XLSXReaderService-.servce.js', XLSXReader);

class XLSXReaderService {
  constructor($q, $rootScope) {
    var service = function(data) {
      angular.extend(this, data);
    };
    service.readFile = function(file, readCells, toJSON) {
        var deferred = $q.defer();
        console.log('XLSXReaderService -> service.readFile, file, readCells, toJSON', typeof file, readCells, toJSON);
        new XLSXReader(file, readCells, toJSON, function(data) {
          //$rootScope.$apply(function() { //results in: "Error: [$rootScope:inprog] $digest already in progress
          deferred.resolve(data);
          //  });
        });
        return deferred.promise;
    };
    return service;
  }
}

export default angular.module('services.xlsxreaderservice', [])
  .service('XLSXReaderService', XLSXReaderService)
  .name;
