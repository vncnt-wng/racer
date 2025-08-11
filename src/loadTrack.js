"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test1 = exports.parseTrack = void 0;
var parseTrack = function (track) {
    var startCoords;
    var backgrounds = [];
    var trackCoords = [];
    track.forEach(function (line, y) {
        line.split('').forEach(function (char, x) {
            switch (char) {
                case '0':
                    backgrounds.push({ x: x, y: y });
                    break;
                case 's':
                    startCoords = { x: x, y: y };
                case '1':
                    trackCoords.push({ x: x, y: y });
                    break;
                default:
                    break;
            }
        });
    });
    return {
        backgrounds: backgrounds,
        trackCoords: trackCoords,
        startCoords: startCoords,
        startAngle: -Math.PI / 2,
        asString: track,
        trackInterval: 200
    };
};
exports.parseTrack = parseTrack;
exports.test1 = [
    '00000000000000000000000',
    '01111111110001111100000',
    '01111111111001101100000',
    '01100000011111101100000',
    '0s100111100000001111110',
    '01100111110000000001110',
    '01111110111111110001110',
    '01111110011111111111100',
    '00000000000000000000000'
];
