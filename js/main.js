import { gameData } from "./game_data.js";
import { keyData, addGameInputEvents } from "./game_inputs.js";
import { figureNextCommand } from "./game_inputs.js";
import { updatePlayer, updateEnnemies } from "./game_logic.js";
import { drawFrame } from "./game_graphics.js";

const PX_PER_UNIT = 20;
const FPS = 60;

function goNextFrame(gameWrapperSelector, pxPerUnit, gameData, keyData) {
    const nextCommand = figureNextCommand(keyData);
    updatePlayer(gameData, nextCommand);
    updateEnnemies(gameData);
    drawFrame(gameWrapperSelector, pxPerUnit, gameData);
}


addGameInputEvents(keyData);
setInterval(
    () => goNextFrame(".game-display-wrapper", PX_PER_UNIT, gameData, keyData),
    1 / FPS,
);
