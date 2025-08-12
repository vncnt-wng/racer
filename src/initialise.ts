import { Context, GameState, HandlingModel, Sprite } from "./gameModel";
import { parseTrack, test1 } from './loadTrack'

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


    const game: GameState = {
        cameraX: 0,
        cameraY: 0,
        currentTrack: parseTrack(test1),
        handlingModel: HandlingModel.LAND,
        player: player,
        laps: {
            lapStartTime: null,
            prevLapTimes: [],
            bestTime: null,
            lapStarted: false
        }
    }

    player.x = (game.currentTrack?.startCoords?.x ?? 0) * 
        (game.currentTrack?.trackInterval ?? 0) +
        ((game.currentTrack?.trackInterval ?? 0) / 2);
    player.y = (game.currentTrack?.startCoords?.y ?? 0) * 
        (game.currentTrack?.trackInterval ?? 0)  + 
        ((game.currentTrack?.trackInterval ?? 0) / 2);
    player.angle = game.currentTrack!.startAngle;
    game.cameraX = player.x - (ctx.canvas.width / 2);
    game.cameraY = player.y - (ctx.canvas.height / 2);

    return game;
}