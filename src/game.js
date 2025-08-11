"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initialise_1 = require("./initialise");
var update_1 = require("./update");
var draw_1 = require("./draw");
var gameLoop = function (context, state) {
    (0, update_1.update)(context, state);
    (0, draw_1.draw)(context, state);
    requestAnimationFrame(function () { return gameLoop(context, state); });
};
var main = function () {
    var context = (0, initialise_1.initialiseContext)();
    var state = (0, initialise_1.initialiseGameState)(context);
    gameLoop(context, state);
};
main();
