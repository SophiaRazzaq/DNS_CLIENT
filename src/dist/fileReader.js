"use strict";
exports.__esModule = true;
exports.FileReader = void 0;
var fs_1 = require("fs");
var FileReader = /** @class */ (function () {
    function FileReader() {
    }
    FileReader.readFile = function (filePath) {
        return fs_1["default"].readFileSync(filePath);
    };
    return FileReader;
}());
exports.FileReader = FileReader;
