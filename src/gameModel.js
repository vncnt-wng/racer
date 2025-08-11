"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlingModel = exports.trackCharacters = void 0;
exports.trackCharacters = [
    '0',
    '1',
    's' // start
];
var HandlingModel;
(function (HandlingModel) {
    HandlingModel[HandlingModel["LAND"] = 0] = "LAND";
    HandlingModel[HandlingModel["WATER"] = 1] = "WATER";
    HandlingModel[HandlingModel["AIR"] = 2] = "AIR";
    HandlingModel[HandlingModel["SPACE"] = 3] = "SPACE";
})(HandlingModel = exports.HandlingModel || (exports.HandlingModel = {}));
