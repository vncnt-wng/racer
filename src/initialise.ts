import { Context, GameState, HandlingModel, Sprite } from "./gameModel";
import { parseTrack, test1 } from './loadTrack'

const GAME_WIDTH = 1440;
const GAME_HEIGHT = 800;

const resizeCanvas = (canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

export const initialiseContext = (): Context => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d')!;

    window.addEventListener('resize', () => resizeCanvas(canvas));
    resizeCanvas(canvas);

    const keys: Record<string, boolean> = {};

    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    const overlayElements = {
        stats: document.getElementById('stats') as HTMLDivElement,
        timer: document.getElementById('timer') as HTMLDivElement,
        prevTimes: document.getElementById('prevTimes') as HTMLDivElement,
        playerCoords: document.getElementById('playerCoords') as HTMLDivElement
    }

    return {
        canvas: canvas,
        canvasCtx: canvasCtx,
        keys: keys,
        overlays: overlayElements
    }
}

export const initialiseGameState = (ctx: Context): GameState => {
    const player: Sprite = {
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

    // var trackv2 = { tileIndicies: [
    //     [1, 48, 7, 8, 8],
    //     [48, 6, 0, 0, 0],
    //     [52, 0, 44, 22, 22],
    //     [51, 42, 0, 0, 0],
    //     [1, 51, 19, 20, 20]
    // ]}
    var tileIndicies = [
[1, 1, 1, 1, 1, 1, 1, 48, 53, 53, 53, 49, 1],
[1, 1, 1, 1, 1, 1, 48, 6, 0, 0, 0, 18, 49],
[1, 48, 7, 8, 8, 8, 5, 28, 20, 20, 33, 0, 55],
[48, 6, 0, 0, 0, 0, 30, 50, 1, 1, 24, 0, 55],
[52, 0, 44, 22, 22, 22, 53, 53, 53, 53, 45, 0, 55],
[51, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 50],
[1, 51, 19, 20, 20, 20, 21, 54, 54, 54, 54, 50, 1],
        ]
    

    var trackv2 = {
        tileIndicies: tileIndicies
    }

    const game: GameState = {
        cameraX: 0,
        cameraY: 0,
        currentTrack: trackv2,//parseTrack(test1),
        handlingModel: HandlingModel.LAND,
        player: player,
        laps: {
            lapStartTime: null,
            prevLapTimes: [],
            bestTime: null,
            lapStarted: false
        },
        prevPaused: false,
        paused: false
    }

    // player.x = (game.currentTrack?.startCoords?.x ?? 0) * 
    //     (game.currentTrack?.trackInterval ?? 0) +
    //     ((game.currentTrack?.trackInterval ?? 0) / 2);
    // player.y = (game.currentTrack?.startCoords?.y ?? 0) * 
    //     (game.currentTrack?.trackInterval ?? 0)  + 
    //     ((game.currentTrack?.trackInterval ?? 0) / 2);
    // player.angle = game.currentTrack!.startAngle;
    // game.cameraX = player.x - (ctx.canvas.width / 2);
    // game.cameraY = player.y - (ctx.canvas.height / 2);

    return game;
}