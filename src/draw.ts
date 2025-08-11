import { Context, GameState } from './gameModel'
import { HandlingModel } from './gameModel';

export const draw = (context: Context, state: GameState) => { 
    context.canvasCtx.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvasCtx.save();
    drawRefGrid(context, state);
    drawTrack(context, state);
    drawCar(context, state);
    drawStats(context, state);
    context.canvasCtx.restore();
}

function drawCar(context: Context, game: GameState) {
    const ctx = context.canvasCtx;
    const player = game.player;
    const keys = context.keys;

    ctx.translate(context.canvas.width / 2, context.canvas.height / 2);
    ctx.rotate(player.angle);
    ctx.fillStyle = player.color;
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);

    if (game.handlingModel == HandlingModel.LAND) {
        ctx.fillStyle = 'black'
        ctx.fillRect(player.width / 4, (-player.height / 2) - 2, 10, 2);
        ctx.fillRect(player.width / 4, (player.height / 2), 10, 2);
        ctx.fillRect(- player.width / 4 - 10, (-player.height / 2) - 2, 10, 2);
        ctx.fillRect(- player.width / 4 - 10, (player.height / 2), 10, 2);
    }

    if (game.handlingModel == HandlingModel.SPACE) {
        ctx.fillStyle = 'orange'
        if (keys['ArrowUp']) ctx.fillRect(-player.width, (-player.height / 2) + 7, 20, 8);
        if (keys['ArrowDown']) ctx.fillRect(player.width / 2, (-player.height / 2) + 7, 20, 8);
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

function drawRefGrid(context: Context, game: GameState) {
    const {canvas, canvasCtx } = context;
    // find bounding box of grid to draw 
    // draw 100px grid
    // 0,0 - 100, 100 is grey
    //   0 1 2 3
    // 0 g w g w
    // 1 w g w g
    const lenX = Math.ceil(canvas.width / 100) + 1;
    const lenY = Math.ceil(canvas.height / 100) + 1;
    const startingGridX = Math.floor(game.cameraX / 100);
    const startingGridY = Math.floor(game.cameraY / 100);
    context.overlays.playerCoords.innerText = `\n
         (${startingGridX.toFixed(0).toString()}, ${startingGridY.toFixed(0).toString()}) \n
    `
    for (var y = 0; y < lenY; y++) {
        for (var x = 0; x < lenX; x++) {
            canvasCtx.fillStyle = (startingGridX + startingGridY + x + y) % 2 == 0 ? 'lightgray' : 'white';
            canvasCtx.fillRect(
                ((startingGridX + x) * 100) - game.cameraX, 
                ((startingGridY + y) * 100) - game.cameraY, 
                100, 
                100
            );
        }
    }
}

const drawTrack = (context: Context, game: GameState) => {
    const { canvas, canvasCtx } = context;

    const trackInterval = game.currentTrack!.trackInterval;

    const intervalWidth = game.currentTrack?.asString[0].length ?? 0;
    const intervalHeight = game.currentTrack?.asString.length ?? 0;
    const lenX = Math.ceil(canvas.width / trackInterval) + 1;
    const lenY = Math.ceil(canvas.height / trackInterval) + 1;
    // 100 interval grid point
    const startingGridX = Math.floor(game.cameraX / trackInterval);
    const startingGridY = Math.floor(game.cameraY / trackInterval);

    // for each square to be displayed, check if has overlap with track coords, continue if not
    for (var y = startingGridY; y < startingGridY + lenY; y++) {
        if (y < 0 || y >= intervalHeight) {
            continue;
        }
        for (var x = startingGridX; x < startingGridX + lenX; x++) {
            if (x < 0 || x >= intervalWidth) {
                continue;
            }
            switch(game.currentTrack?.asString[y][x]) {
                case '0':
                    canvasCtx.fillStyle = 'green';
                    break;
                case 's':
                case '1':
                    canvasCtx.fillStyle = 'darkgray';
                    break;
            
            }
            canvasCtx.fillRect(
                (x * trackInterval) - game.cameraX, 
                (y * trackInterval) - game.cameraY, 
                trackInterval, 
                trackInterval
            );
        }
    }
}

function drawStats(context: Context, game: GameState) {
    const { stats, playerCoords } = context.overlays;
    const player = game.player;

    if (game.handlingModel == HandlingModel.LAND) {
        stats.innerText = `${player.oob ? '<' : ''}${player.velocity.toFixed(1).toString()}${player.oob ? '>' : ''}`
    }
    else if (game.handlingModel == HandlingModel.SPACE) {
        stats.innerText = `(${player.vX.toFixed(1).toString()}, ${player.vY.toFixed(1).toString()})`
    }
    playerCoords.innerText += `
        player (${player.x.toFixed(0).toString()}, ${player.y.toFixed(0).toString()}) \n
        camera (${game.cameraX.toFixed(0).toString()}, ${game.cameraY.toFixed(0).toString()})
    `
}