// coords on 50 px grid 
export interface TrackCoord {
    x: number,
    y: number
}

export interface TrackInfo {
    backgrounds: TrackCoord[]
    trackCoords: TrackCoord[],
    startCoords?: TrackCoord,
    startAngle: number,
    asString: string[],
    trackInterval: number
}

export const trackCharacters = [
    '0', // oob 
    '1', // track
    's' // start
]

export interface Sprite {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    angle: number;
    velocity: number;
    vX: number;
    vY: number;
    velocityRot: number;
    oob: boolean
}

export enum HandlingModel {
    LAND,
    WATER,
    AIR,
    SPACE
}

export interface GameState {
    cameraX: number,
    cameraY: number,
    currentTrack: TrackInfo | null,
    handlingModel: HandlingModel | null
    player: Sprite
}

export interface OverlayElements {
    stats: HTMLDivElement,
    playerCoords: HTMLDivElement
}

export interface Context {
    canvas:  HTMLCanvasElement,
    canvasCtx: CanvasRenderingContext2D,
    keys: Record<string, boolean> 
    overlays: OverlayElements
}
