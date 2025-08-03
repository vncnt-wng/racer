import { TrackInfo, parseTrack, test1 } from './loadTrack'

// game.ts
// Initial game logic setup

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const stats = document.getElementById('stats') as HTMLDivElement;
const playerCoords = document.getElementById('playerCoords') as HTMLDivElement;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- Basic topdown RPG event loop and movement ---

interface Sprite {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    angle: number;
    velocity: number;
}

interface GameState {
    cameraX: number,
    cameraY: number,
    currentTrack: TrackInfo | null
}


const ctx = canvas.getContext('2d')!;



const player: Sprite = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 22,
    color: '#ff4444',
    angle: 0,
    velocity: 0,
};

const game: GameState = {
    cameraX: 0,
    cameraY: 0,
    currentTrack: null
}

const keys: Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function update() {
    updateCamera();
    const accel = 0.03;
    const maxSpeed = 14;
    const friction = 0.03;
    const turnSpeed = 0.02;
    // Up/Down for acceleration/brake
    if (keys['ArrowUp']) player.velocity += accel;
    if (keys['ArrowDown']) player.velocity -= accel * 1.5;
    // Left/Right for turning
    if (keys['ArrowLeft']) player.angle -= turnSpeed * (player.velocity !== 0 ? 1 : 0);
    if (keys['ArrowRight']) player.angle += turnSpeed * (player.velocity !== 0 ? 1 : 0);
    // Clamp speed
    player.velocity = Math.max(-maxSpeed, Math.min(maxSpeed, player.velocity));
    // Friction
    if (!keys['ArrowUp'] && !keys['ArrowDown']) {
        if (player.velocity > 0) player.velocity = Math.max(0, player.velocity - friction);
        else if (player.velocity < 0) player.velocity = Math.min(0, player.velocity + friction);
    }
    // Move
    player.x += Math.cos(player.angle) * player.velocity;
    player.y += Math.sin(player.angle) * player.velocity;
}

function updateCamera() {
    // for now - car is always centered in screen. 
    // cameraX/cameraY is for the to left corner 
    game.cameraX = player.x - canvas.width / 2;
    game.cameraY = player.y - canvas.height / 2;
}

function draw() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    drawRefGrid();
    drawTrack();
    drawCar();
    drawStats();
    ctx.restore();
}

function drawCar() {
    // ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    // ctx.rotate(player.angle);
    // ctx.fillStyle = player.color;
    // ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(player.angle);
    ctx.fillStyle = player.color;
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
}

function drawRefGrid() {
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
    playerCoords.innerText = `\n
         (${startingGridX.toFixed(0).toString()}, ${startingGridY.toFixed(0).toString()}) \n
    `
    for (var y = 0; y < lenY; y++) {
        for (var x = 0; x < lenX; x++) {
            ctx.fillStyle = (startingGridX + startingGridY + x + y) % 2 == 0 ? 'lightgray' : 'white';
            ctx.fillRect(
                ((startingGridX + x) * 100) - game.cameraX, 
                ((startingGridY + y) * 100) - game.cameraY, 
                100, 
                100
            );
        }
    }
}

const drawTrack = () => {
    const interval = 100;

    const intervalWidth = game.currentTrack?.asString[0].length ?? 0;
    const intervalHeight = game.currentTrack?.asString.length ?? 0;
    const lenX = Math.ceil(canvas.width / 100) + 1;
    const lenY = Math.ceil(canvas.height / 100) + 1;
    const startingGridX = Math.floor(game.cameraX / 100);
    const startingGridY = Math.floor(game.cameraY / 100);

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
                    ctx.fillStyle = 'green';
                    break;
                case 's':
                case '1':
                    ctx.fillStyle = 'darkgray';
                    break;
            
            }
            ctx.fillRect(
                ((startingGridX + x) * 100) - game.cameraX, 
                ((startingGridY + y) * 100) - game.cameraY, 
                100, 
                100
            );
        }
    }
}

function drawStats() {
    stats.innerText = `${player.velocity.toFixed(1).toString()}`
    playerCoords.innerText += `
        player (${player.x.toFixed(0).toString()}, ${player.y.toFixed(0).toString()}) \n
        camera (${game.cameraX.toFixed(0).toString()}, ${game.cameraY.toFixed(0).toString()})
    `
}

const initialise = () => {
    game.currentTrack = parseTrack(test1);

    // initialise track 
    const interval = 100;
    player.x = (game.currentTrack?.startCoords?.x ?? 0) * interval + (interval / 2);
    player.y = (game.currentTrack?.startCoords?.y ?? 0) * interval + (interval / 2);
    game.cameraX = player.x - (canvas.width / 2);
    game.cameraY = player.y - (canvas.height / 2);
}

function gameLoop() {
    console.log(player.x, player.y)
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

initialise();
gameLoop();

