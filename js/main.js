import { gameData } from "./game_data.js";
import { keyData, addGameInputEvents } from "./game_inputs.js";
import { figureNextCommand } from "./game_inputs.js";
import { play } from "./game_logic.js";
import { drawFrame } from "./game_graphics.js";

const PX_PER_UNIT = 20;
const FPS = 60;

function goNextFrame(gameWrapperSelector, pxPerUnit, gameData, keyData) {
    const nextCommand = figureNextCommand(keyData);
    play(gameData, nextCommand);
    drawFrame(gameWrapperSelector, pxPerUnit, gameData);
}


addGameInputEvents(keyData);

const intervalID = setInterval(() => {
        goNextFrame(".game-display-wrapper", PX_PER_UNIT, gameData, keyData);
        if (gameData.status === 'success')
            clearInterval(intervalID);
    },
    1 / FPS,
);
