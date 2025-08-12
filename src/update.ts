import { Context, GameState } from './gameModel'
import { HandlingModel } from './gameModel'; 

export const update = (context: Context, state: GameState) => {
    
    checkSpecialKeyPresses(context, state);

    if (!state.paused)
    {
        updateCamera(context, state);
        updateCar(context, state); 
    }   
}

const checkSpecialKeyPresses = (context: Context, state: GameState) => {
    if (context.keys['p']) {
        state.paused = true;
    }
}

const updateCamera = (context: Context, state: GameState) => {
    // for now - car is always centered in screen. 
    // cameraX/cameraY is for the to left corner 
    state.cameraX = state.player.x - context.canvas.width / 2;
    state.cameraY = state.player.y - context.canvas.height / 2;
}

const updateCar = (context: Context, state: GameState) => {
    var velocity = 0;
    if (state.handlingModel == HandlingModel.LAND) {
        velocity = handleLand(context, state);
    }
    else if (state.handlingModel == HandlingModel.AIR) {
        velocity = handleAir(context, state);
    }
    else if (state.handlingModel == HandlingModel.SPACE) {
        velocity = handleSpace(context, state);
    }

    var low = [0, 200, 250]
    var high = [255, 50, 50]
    var colour = [
        linterp(low[0], high[0], 0, 15, velocity),
        linterp(low[1], high[1], 0, 15, velocity),
        linterp(low[2], high[2], 0, 15, velocity),
    ]

    state.player.color = `rgb(${colour[0]}, ${colour[1]}, ${colour[2]})`
}


const linterp = (toMin: number, toMax: number, fromMin: number, fromMax: number, value: number) => {
    const prop = Math.pow((value - fromMin) / (fromMax - fromMin), 2);
    return (prop * (toMax - toMin)) + toMin;
}

const handleCurrentTerrain = (startingGridX: number, startingGridY: number, context: Context, state: GameState) => {
    const player = state.player;
    const currentTrack = state.currentTrack!;

    if (startingGridX < 0 || 
        startingGridX >= (currentTrack.asString[0].length ?? 0) ||
        startingGridY < 0 ||
        startingGridY >= (currentTrack.asString?.length ?? 0))
    {
        return;
    }

    player.oob = currentTrack.asString[startingGridY][startingGridX] == '0';

    if (currentTrack.asString[startingGridY][startingGridX] == 'f' && state.laps.lapStarted) {
        if (state.laps.lapStartTime != null) {
            const newLap = (Date.now() - state.laps.lapStartTime);
            state.laps.prevLapTimes.push(newLap);
            if (state.laps.bestTime == null) {
                state.laps.bestTime = newLap;
            } 
            else {
                state.laps.bestTime = Math.min(newLap, state.laps.bestTime);
            }
        }
        state.laps.lapStartTime = Date.now();
        state.laps.lapStarted = false;
    }
    else if (currentTrack.asString[startingGridY][startingGridX] != 'f') {
        state.laps.lapStarted = true;
    }
}

const handleLand = (context: Context, state: GameState): number => {
    const accel = 0.06;
    const maxSpeed = 14;
    const frictionCoeff = 0.05;
    const turnSpeed = 0.025;
    
    const player = state.player;
    const currentTrack =  state.currentTrack!;
    const keys = context.keys;

    const startingGridX = Math.floor(player.x / currentTrack.trackInterval);
    const startingGridY = Math.floor(player.y / currentTrack.trackInterval);

    var isOOB = false;
    handleCurrentTerrain(startingGridX, startingGridY, context, state);

    // normal physics
    // Up/Down for acceleration/brake
    if (keys['ArrowUp']) state.player.velocity += accel;
    if (keys['ArrowDown']) player.velocity -= 1.2 * accel;
    // Left/Right for turning
    if (keys['ArrowLeft']) player.angle -= turnSpeed * (player.velocity !== 0 ? 1 : 0);
    if (keys['ArrowRight']) player.angle += turnSpeed * (player.velocity !== 0 ? 1 : 0);
    // Clamp speed
    player.velocity = Math.max(-maxSpeed, Math.min(maxSpeed, player.velocity));

    var friction = (frictionCoeff * (player.velocity / maxSpeed)) * (player.oob ? 4 : 1);

    // Friction
    // if (!keys['ArrowUp'] && !keys['ArrowDown']) {
        if (player.velocity > 0) player.velocity = Math.max(0, player.velocity - friction);
    // }
    // Move
    player.x += Math.cos(player.angle) * player.velocity;
    player.y += Math.sin(player.angle) * player.velocity;
    return player.velocity;
}


const handleAir = (context: Context, state: GameState): number => {
    const accel = 0.08;
    const angularAccel = 0.0015;
    const angularFriction = 0.01;
    const friction = 0.04;

    const player = state.player;
    const currentTrack =  state.currentTrack!;
    const keys = context.keys;

    // rotational
    // Up/Down for acceleration/brake
    const vM = Math.sqrt(Math.pow(player.vX, 2) + Math.pow(player.vY, 2))
    

    if (keys['ArrowUp']) {
        player.vX += Math.cos(player.angle) * accel;
        player.vY += Math.sin(player.angle) * accel;
    }
    else if (keys['ArrowDown']) {
        player.vX -= Math.cos(player.angle) * accel;
        player.vY -= Math.sin(player.angle) * accel;
    }
    else {
        const angleV = Math.atan(player.vY / player.vX);
        player.vX += Math.cos(player.angle) * (accel / 2);
        player.vY += Math.sin(player.angle) * (accel / 2);
    }
    

    // Left/Right for turning
    if (keys['ArrowLeft']) player.velocityRot -= angularAccel;
    if (keys['ArrowRight']) player.velocityRot += angularAccel;

    if (!(keys['ArrowLeft'] || keys['ArrowRight']) && Math.abs(player.velocityRot) > 0) {
        player.velocityRot -= Math.sign(player.velocityRot) * angularFriction
    }

    player.angle += player.velocityRot;

    if (!(keys['ArrowUp'] || keys['ArrowDown']) && Math.abs(vM) > 0) {
        const frictionM = Math.abs(vM) - friction;
        const angleV = Math.atan(player.vY / player.vX);
        const updateAngle = angleV + player.angle / 2
        const sign = player.vX < 0 ? -1 : 1;
        player.vX = sign * frictionM * Math.cos(updateAngle);
        player.vY = sign * frictionM * Math.sin(updateAngle);
    }

    // Move
    player.x += player.vX;
    player.y += player.vY;

    return vM;
}

const handleSpace = (context: Context, state: GameState): number => {
    const accel = 0.08;
    const angularAccel = 0.0015;
    const friction = 0.02;

    const player = state.player;
    const currentTrack =  state.currentTrack!;
    const keys = context.keys;

    // rotational
    // Up/Down for acceleration/brake
    const vM = Math.sqrt(Math.pow(player.vX, 2) + Math.pow(player.vY, 2))

    if (keys['ArrowUp']) {
        player.vX += Math.cos(player.angle) * accel;
        player.vY += Math.sin(player.angle) * accel;
    }
    if (keys['ArrowDown']) {
        player.vX -= Math.cos(player.angle) * accel;
        player.vY -= Math.sin(player.angle) * accel;
    }
    // Left/Right for turning
    if (keys['ArrowLeft']) player.velocityRot -= angularAccel;
    if (keys['ArrowRight']) player.velocityRot += angularAccel;

    player.angle += player.velocityRot;

    if (!(keys['ArrowUp'] || keys['ArrowDown']) && Math.abs(vM) > 0) {
        const frictionM = Math.abs(vM) - friction;
        const angleV = Math.atan(player.vY / player.vX);
        const sign = player.vX < 0 ? -1 : 1;
        player.vX = sign * frictionM * Math.cos(angleV);
        player.vY = sign * frictionM * Math.sin(angleV);
    }

    // Move
    player.x += player.vX;
    player.y += player.vY;

    return vM;
}