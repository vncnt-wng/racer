"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draw = void 0;
var gameModel_1 = require("./gameModel");
var draw = function (context, state) {
    context.canvasCtx.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvasCtx.save();
    drawRefGrid(context, state);
    drawTrack(context, state);
    drawCar(context, state);
    drawStats(context, state);
    context.canvasCtx.restore();
};
exports.draw = draw;
function drawCar(context, game) {
    var ctx = context.canvasCtx;
    var player = game.player;
    var keys = context.keys;
    ctx.translate(context.canvas.width / 2, context.canvas.height / 2);
    ctx.rotate(player.angle);
    ctx.fillStyle = player.color;
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    if (game.handlingModel == gameModel_1.HandlingModel.LAND) {
        ctx.fillStyle = 'black';
        ctx.fillRect(player.width / 4, (-player.height / 2) - 2, 10, 2);
        ctx.fillRect(player.width / 4, (player.height / 2), 10, 2);
        ctx.fillRect(-player.width / 4 - 10, (-player.height / 2) - 2, 10, 2);
        ctx.fillRect(-player.width / 4 - 10, (player.height / 2), 10, 2);
    }
    if (game.handlingModel == gameModel_1.HandlingModel.SPACE) {
        ctx.fillStyle = 'orange';
        if (keys['ArrowUp'])
            ctx.fillRect(-player.width, (-player.height / 2) + 7, 20, 8);
        if (keys['ArrowDown'])
            ctx.fillRect(player.width / 2, (-player.height / 2) + 7, 20, 8);
        if (keys['ArrowRight']) {
            ctx.fillRect(player.width / 4, (-player.height / 2) - 10, 6, 10);
            ctx.fillRect(-player.width / 4 - 6, (player.height / 2), 6, 10);
        }
        if (keys['ArrowLeft']) {
            ctx.fillRect(player.width / 4, (player.height / 2), 6, 10);
            ctx.fillRect(-player.width / 4 - 6, (-player.height / 2) - 10, 6, 10);
        }
    }
}
function drawRefGrid(context, game) {
    var canvas = context.canvas, canvasCtx = context.canvasCtx;
    // find bounding box of grid to draw 
    // draw 100px grid
    // 0,0 - 100, 100 is grey
    //   0 1 2 3
    // 0 g w g w
    // 1 w g w g
    var lenX = Math.ceil(canvas.width / 100) + 1;
    var lenY = Math.ceil(canvas.height / 100) + 1;
    var startingGridX = Math.floor(game.cameraX / 100);
    var startingGridY = Math.floor(game.cameraY / 100);
    context.overlays.playerCoords.innerText = "\n\n         (".concat(startingGridX.toFixed(0).toString(), ", ").concat(startingGridY.toFixed(0).toString(), ") \n\n    ");
    for (var y = 0; y < lenY; y++) {
        for (var x = 0; x < lenX; x++) {
            canvasCtx.fillStyle = (startingGridX + startingGridY + x + y) % 2 == 0 ? 'lightgray' : 'white';
            canvasCtx.fillRect(((startingGridX + x) * 100) - game.cameraX, ((startingGridY + y) * 100) - game.cameraY, 100, 100);
        }
    }
}
var drawTrack = function (context, game) {
    var _a, _b, _c, _d, _e;
    var canvas = context.canvas, canvasCtx = context.canvasCtx;
    var trackInterval = game.currentTrack.trackInterval;
    var intervalWidth = (_b = (_a = game.currentTrack) === null || _a === void 0 ? void 0 : _a.asString[0].length) !== null && _b !== void 0 ? _b : 0;
    var intervalHeight = (_d = (_c = game.currentTrack) === null || _c === void 0 ? void 0 : _c.asString.length) !== null && _d !== void 0 ? _d : 0;
    var lenX = Math.ceil(canvas.width / trackInterval) + 1;
    var lenY = Math.ceil(canvas.height / trackInterval) + 1;
    // 100 interval grid point
    var startingGridX = Math.floor(game.cameraX / trackInterval);
    var startingGridY = Math.floor(game.cameraY / trackInterval);
    // for each square to be displayed, check if has overlap with track coords, continue if not
    for (var y = startingGridY; y < startingGridY + lenY; y++) {
        if (y < 0 || y >= intervalHeight) {
            continue;
        }
        for (var x = startingGridX; x < startingGridX + lenX; x++) {
            if (x < 0 || x >= intervalWidth) {
                continue;
            }
            switch ((_e = game.currentTrack) === null || _e === void 0 ? void 0 : _e.asString[y][x]) {
                case '0':
                    canvasCtx.fillStyle = 'green';
                    break;
                case 's':
                case '1':
                    canvasCtx.fillStyle = 'darkgray';
                    break;
            }
            canvasCtx.fillRect((x * trackInterval) - game.cameraX, (y * trackInterval) - game.cameraY, trackInterval, trackInterval);
        }
    }
};
function drawStats(context, game) {
    var _a = context.overlays, stats = _a.stats, playerCoords = _a.playerCoords;
    var player = game.player;
    if (game.handlingModel == gameModel_1.HandlingModel.LAND) {
        stats.innerText = "".concat(player.oob ? '<' : '').concat(player.velocity.toFixed(1).toString()).concat(player.oob ? '>' : '');
    }
    else if (game.handlingModel == gameModel_1.HandlingModel.SPACE) {
        stats.innerText = "(".concat(player.vX.toFixed(1).toString(), ", ").concat(player.vY.toFixed(1).toString(), ")");
    }
    playerCoords.innerText += "\n        player (".concat(player.x.toFixed(0).toString(), ", ").concat(player.y.toFixed(0).toString(), ") \n\n        camera (").concat(game.cameraX.toFixed(0).toString(), ", ").concat(game.cameraY.toFixed(0).toString(), ")\n    ");
}
