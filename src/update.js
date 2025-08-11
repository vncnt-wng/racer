"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
var gameModel_1 = require("./gameModel");
var update = function (context, state) {
    updateCamera(context, state);
    updateCar(context, state);
};
exports.update = update;
var updateCamera = function (context, state) {
    // for now - car is always centered in screen. 
    // cameraX/cameraY is for the to left corner 
    state.cameraX = state.player.x - context.canvas.width / 2;
    state.cameraY = state.player.y - context.canvas.height / 2;
};
var updateCar = function (context, state) {
    var velocity = 0;
    if (state.handlingModel == gameModel_1.HandlingModel.LAND) {
        velocity = handleLand(context, state);
    }
    else if (state.handlingModel == gameModel_1.HandlingModel.AIR) {
        velocity = handleAir(context, state);
    }
    else if (state.handlingModel == gameModel_1.HandlingModel.SPACE) {
        velocity = handleSpace(context, state);
    }
    var low = [0, 200, 250];
    var high = [255, 50, 50];
    var colour = [
        linterp(low[0], high[0], 0, 15, velocity),
        linterp(low[1], high[1], 0, 15, velocity),
        linterp(low[2], high[2], 0, 15, velocity),
    ];
    state.player.color = "rgb(".concat(colour[0], ", ").concat(colour[1], ", ").concat(colour[2], ")");
};
var linterp = function (toMin, toMax, fromMin, fromMax, value) {
    var prop = Math.pow((value - fromMin) / (fromMax - fromMin), 2);
    return (prop * (toMax - toMin)) + toMin;
};
var handleLand = function (context, state) {
    var _a, _b, _c;
    var accel = 0.06;
    var maxSpeed = 14;
    var frictionCoeff = 0.05;
    var turnSpeed = 0.025;
    var player = state.player;
    var currentTrack = state.currentTrack;
    var keys = context.keys;
    var startingGridX = Math.floor(player.x / currentTrack.trackInterval);
    var startingGridY = Math.floor(player.y / currentTrack.trackInterval);
    var isOOB = false;
    if (startingGridX > 0 &&
        startingGridX < ((_a = currentTrack.asString[0].length) !== null && _a !== void 0 ? _a : 0) &&
        startingGridY > 0 &&
        startingGridY < ((_c = (_b = currentTrack.asString) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0)) {
        isOOB = currentTrack.asString[startingGridY][startingGridX] == '0';
        player.oob = isOOB;
    }
    // normal physics
    // Up/Down for acceleration/brake
    if (keys['ArrowUp'])
        state.player.velocity += accel;
    if (keys['ArrowDown'])
        player.velocity -= 1.2 * accel;
    // Left/Right for turning
    if (keys['ArrowLeft'])
        player.angle -= turnSpeed * (player.velocity !== 0 ? 1 : 0);
    if (keys['ArrowRight'])
        player.angle += turnSpeed * (player.velocity !== 0 ? 1 : 0);
    // Clamp speed
    player.velocity = Math.max(-maxSpeed, Math.min(maxSpeed, player.velocity));
    var friction = (frictionCoeff * (player.velocity / maxSpeed)) * (isOOB ? 4 : 1);
    // Friction
    // if (!keys['ArrowUp'] && !keys['ArrowDown']) {
    if (player.velocity > 0)
        player.velocity = Math.max(0, player.velocity - friction);
    // }
    // Move
    player.x += Math.cos(player.angle) * player.velocity;
    player.y += Math.sin(player.angle) * player.velocity;
    return player.velocity;
};
var handleAir = function (context, state) {
    var accel = 0.08;
    var angularAccel = 0.0015;
    var angularFriction = 0.01;
    var friction = 0.04;
    var player = state.player;
    var currentTrack = state.currentTrack;
    var keys = context.keys;
    // rotational
    // Up/Down for acceleration/brake
    var vM = Math.sqrt(Math.pow(player.vX, 2) + Math.pow(player.vY, 2));
    if (keys['ArrowUp']) {
        player.vX += Math.cos(player.angle) * accel;
        player.vY += Math.sin(player.angle) * accel;
    }
    else if (keys['ArrowDown']) {
        player.vX -= Math.cos(player.angle) * accel;
        player.vY -= Math.sin(player.angle) * accel;
    }
    else {
        var angleV = Math.atan(player.vY / player.vX);
        player.vX += Math.cos(player.angle) * (accel / 2);
        player.vY += Math.sin(player.angle) * (accel / 2);
    }
    // Left/Right for turning
    if (keys['ArrowLeft'])
        player.velocityRot -= angularAccel;
    if (keys['ArrowRight'])
        player.velocityRot += angularAccel;
    if (!(keys['ArrowLeft'] || keys['ArrowRight']) && Math.abs(player.velocityRot) > 0) {
        player.velocityRot -= Math.sign(player.velocityRot) * angularFriction;
    }
    player.angle += player.velocityRot;
    if (!(keys['ArrowUp'] || keys['ArrowDown']) && Math.abs(vM) > 0) {
        var frictionM = Math.abs(vM) - friction;
        var angleV = Math.atan(player.vY / player.vX);
        var updateAngle = angleV + player.angle / 2;
        var sign = player.vX < 0 ? -1 : 1;
        player.vX = sign * frictionM * Math.cos(updateAngle);
        player.vY = sign * frictionM * Math.sin(updateAngle);
    }
    // Move
    player.x += player.vX;
    player.y += player.vY;
    return vM;
};
var handleSpace = function (context, state) {
    var accel = 0.08;
    var angularAccel = 0.0015;
    var friction = 0.02;
    var player = state.player;
    var currentTrack = state.currentTrack;
    var keys = context.keys;
    // rotational
    // Up/Down for acceleration/brake
    var vM = Math.sqrt(Math.pow(player.vX, 2) + Math.pow(player.vY, 2));
    if (keys['ArrowUp']) {
        player.vX += Math.cos(player.angle) * accel;
        player.vY += Math.sin(player.angle) * accel;
    }
    if (keys['ArrowDown']) {
        player.vX -= Math.cos(player.angle) * accel;
        player.vY -= Math.sin(player.angle) * accel;
    }
    // Left/Right for turning
    if (keys['ArrowLeft'])
        player.velocityRot -= angularAccel;
    if (keys['ArrowRight'])
        player.velocityRot += angularAccel;
    player.angle += player.velocityRot;
    if (!(keys['ArrowUp'] || keys['ArrowDown']) && Math.abs(vM) > 0) {
        var frictionM = Math.abs(vM) - friction;
        var angleV = Math.atan(player.vY / player.vX);
        var sign = player.vX < 0 ? -1 : 1;
        player.vX = sign * frictionM * Math.cos(angleV);
        player.vY = sign * frictionM * Math.sin(angleV);
    }
    // Move
    player.x += player.vX;
    player.y += player.vY;
    return vM;
};
