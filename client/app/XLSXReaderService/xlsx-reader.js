/* global FileReader, File */

import XLSX from './vendor/xlsx.js';
import _ from 'lodash';

class XLSXReaderClass {
  constructor(file, readCells, toJSON, cb) {
    console.log('constructorban xlsx:', XLSX);
    this.VERSION = '0.0.1'; // Current version.
    // Check if dependecies are available.
    if (typeof XLSX === 'undefined') {
        console.log('xlsx.js is required. Get it from https://github.com/SheetJS/js-xlsx');
        return;
    }

    if (typeof _ === 'undefined') {
        console.log('Lodash.js is required. Get it from http://lodash.com/');
        return;
    }

    this.utils = {
      'initializeFromFile': function(file, readCells, toJSON, cb) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            this.sheets = this.parseWorkbook(workbook, readCells, toJSON);
            cb(this);
        };

        reader.readAsBinaryString(file);
      },
        'initializeFromVariable': function(data, readCells, toJSON, cb) {
          console.log('XLSX valtozo:', XLSX);
            var workbook = XLSX.read(data, {type: 'binary'} );
            console.log('this.sheets', this);
            this.sheets = this.parseWorkbook(workbook, readCells, toJSON);
            cb(this);
        },
        'parseWorkbook': function(workbook, readCells, toJSON) {
          console.log('inside parseWorkbook this', this);
            if (toJSON === true) {
                return this.to_json(workbook);
            }

            var sheets = {};

            _.forEachRight(workbook.SheetNames, function(sheetName) {
                var sheet = workbook.Sheets[sheetName];
                sheets[sheetName] = this.utils.parseSheet(sheet, readCells);
            });

            return sheets;
        },
        'parseSheet': function(sheet, readCells) {
            var range = XLSX.utils.decode_range(sheet['!ref']);
            var sheetData = [];

            if (readCells === true) {
                _.forEachRight(_.range(range.s.r, range.e.r + 1), function(row) {
                    var rowData = [];
                    _.forEachRight(_.range(range.s.c, range.e.c + 1), function(column) {
                        var cellIndex = XLSX.utils.encode_cell({
                            'c': column,
                            'r': row
                        });
                        var cell = sheet[cellIndex];
                        rowData[column] = cell ? cell.v : undefined;
                    });
                    sheetData[row] = rowData;
                });
            }

                return {
                    'data': sheetData,
                    'name': sheet.name,
                    'col_size': range.e.c + 1,
                    'row_size': range.e.r + 1
                };
            },
            to_json: function(workbook) {
              console.log('to_joson, workbook:', workbook);
                var result = {};
                workbook.SheetNames.forEach(function(sheetName) {
                  console.log('sheetname: ', sheetName, workbook.Sheets);
                  console.log('XLSX.utils:', XLSX.utils);
                    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if (roa.length > 0) {
                        result[sheetName] = roa;
                    }
                });
                return result;
            }
        };

    if (file instanceof File) {
      this.utils.initializeFromFile(file, readCells, toJSON, cb);
    } else {
      console.log('initializeFromVariable');
      this.utils.initializeFromVariable(file, readCells, toJSON, cb);
    }

  }


}

export default XLSXReaderClass;
