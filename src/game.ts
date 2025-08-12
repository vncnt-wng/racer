import { Context, GameState } from './gameModel';
import { initialiseContext, initialiseGameState } from './initialise'
import { update } from './update'
import { draw } from './draw'
import { load } from './loadTiles'


const gameLoop = (context: Context, state: GameState)  => {
    update(context, state);
    draw(context, state);
    requestAnimationFrame(() => gameLoop(context, state));
}

const main = () => {
    var tileset = load().then((tiles) => {
        var context = initialiseContext();
        var state = initialiseGameState(context);
        state.currentTrack!.tileStore = tiles
        gameLoop(context, state);
    });
}

main()



const resizeCanvas = (canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


// const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
// const canvasCtx = canvas.getContext('2d')!;

// window.addEventListener('resize', () => resizeCanvas(canvas));
// resizeCanvas(canvas);


// var tiles = load()
//     .then((v) => {
//         canvasCtx!.imageSmoothingEnabled = false;
//         console.log(v.tiles);
//         // for (const tile in v) {

//         canvasCtx!.drawImage(
//             v.tiles[5], 
//             canvas.width/2, 
//             canvas.height / 2, 64, 64);
//         // }s
//     });
