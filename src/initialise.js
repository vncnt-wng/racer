"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialiseGameState = exports.initialiseContext = void 0;
var gameModel_1 = require("./gameModel");
var loadTrack_1 = require("./loadTrack");
var resizeCanvas = function (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
var initialiseContext = function () {
    var canvas = document.getElementById('gameCanvas');
    var canvasCtx = canvas.getContext('2d');
    window.addEventListener('resize', function () { return resizeCanvas(canvas); });
    resizeCanvas(canvas);
    var keys = {};
    window.addEventListener('keydown', function (e) {
        keys[e.key] = true;
    });
    window.addEventListener('keyup', function (e) {
        keys[e.key] = false;
    });
    var overlayElements = {
        stats: document.getElementById('stats'),
        playerCoords: document.getElementById('playerCoords')
    };
    return {
        canvas: canvas,
        canvasCtx: canvasCtx,
        keys: keys,
        overlays: overlayElements
    };
};
exports.initialiseContext = initialiseContext;
var initialiseGameState = function (ctx) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var player = {
        x: ctx.canvas.width / 2,
        y: ctx.canvas.height / 2,
        width: 40,
        height: 22,
        color: '#ff4444',
        angle: 0,
        velocity: 0,
        vX: 0,
        vY: 0,
        velocityRot: 0,
        oob: false,
    };
    var game = {
        cameraX: 0,
        cameraY: 0,
        currentTrack: (0, loadTrack_1.parseTrack)(loadTrack_1.test1),
        handlingModel: gameModel_1.HandlingModel.LAND,
        player: player
    };
    player.x = ((_c = (_b = (_a = game.currentTrack) === null || _a === void 0 ? void 0 : _a.startCoords) === null || _b === void 0 ? void 0 : _b.x) !== null && _c !== void 0 ? _c : 0) *
        ((_e = (_d = game.currentTrack) === null || _d === void 0 ? void 0 : _d.trackInterval) !== null && _e !== void 0 ? _e : 0) +
        (((_g = (_f = game.currentTrack) === null || _f === void 0 ? void 0 : _f.trackInterval) !== null && _g !== void 0 ? _g : 0) / 2);
    player.y = ((_k = (_j = (_h = game.currentTrack) === null || _h === void 0 ? void 0 : _h.startCoords) === null || _j === void 0 ? void 0 : _j.y) !== null && _k !== void 0 ? _k : 0) *
        ((_m = (_l = game.currentTrack) === null || _l === void 0 ? void 0 : _l.trackInterval) !== null && _m !== void 0 ? _m : 0) +
        (((_p = (_o = game.currentTrack) === null || _o === void 0 ? void 0 : _o.trackInterval) !== null && _p !== void 0 ? _p : 0) / 2);
    player.angle = game.currentTrack.startAngle;
    game.cameraX = player.x - (ctx.canvas.width / 2);
    game.cameraY = player.y - (ctx.canvas.height / 2);
    return game;
};
exports.initialiseGameState = initialiseGameState;
