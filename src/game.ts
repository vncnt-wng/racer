import { Context, GameState } from './gameModel';
import { initialiseContext, initialiseGameState } from './initialise'
import { update } from './update'
import { draw } from './draw'



const gameLoop = (context: Context, state: GameState)  => {
    update(context, state);
    draw(context, state);
    requestAnimationFrame(() => gameLoop(context, state));
}

const main = () => {
    var context = initialiseContext();
    var state = initialiseGameState(context);
    gameLoop(context, state);
}

main();