import { isSegmentinSegment, isRectInRect, doesRectOverlapRect } from "./utils.js";

export function updateEnnemies(gameData) {
    for (let ennemy of gameData.ennemies) {
        if (ennemy.waitTilNextMove > 0) {
            ennemy.waitTilNextMove--;
            continue;
        }
        if (!isSegmentinSegment(ennemy.x + ennemy.deltaX, ennemy.width, 0, gameData.grid.width))
            ennemy.deltaX = -ennemy.deltaX;
        if (!isSegmentinSegment(ennemy.y + ennemy.deltaY, ennemy.height, 0, gameData.grid.height))
            ennemy.deltaY = -ennemy.deltaY;

        ennemy.x += ennemy.deltaX;
        ennemy.y += ennemy.deltaY;
        ennemy.waitTilNextMove = ennemy.delayBetweenMoves;
    }
}

function getNewPlayerPos(currentX, currentY, nextCommand) {
    let newX = currentX;
    let newY = currentY;

    if (nextCommand == 'ArrowLeft')
        newX -= 1;
    else if (nextCommand == 'ArrowRight')
        newX += 1;
    else if (nextCommand == 'ArrowUp')
        newY -= 1;
    else if (nextCommand == 'ArrowDown')
        newY += 1;

    return [newX, newY];
}

function isInGrid(x, width, y, height, gridData) {
    return isRectInRect(x, width, y, height, 0, gridData.width, 0, gridData.height);
}

function isPlayerPosOk(x, y, gameData) {
    if (!isInGrid(x, gameData.player.width, y, gameData.player.height, gameData.grid))
        return false;

    for (let wallData of gameData.walls) {
        const playerData = gameData.player;
        if (doesRectOverlapRect(x, playerData.width, y, playerData.height, wallData.x, wallData.width, wallData.y, wallData.height))
            return false;
    }

    return true;
}

export function updatePlayer(gameData, nextCommand) {
    const playerData = gameData.player;

    if (playerData.waitTilNextMove > 0) {
        playerData.waitTilNextMove--;
        return;
    }

    if (!nextCommand)
        return;

    const newPos = getNewPlayerPos(playerData.x, playerData.y, nextCommand);
    const newX = newPos[0];
    const newY = newPos[1];

    if (!isPlayerPosOk(newX, newY, gameData))
        return;

    playerData.x = newX;
    playerData.y = newY;
    playerData.waitTilNextMove = playerData.delayBetweenMoves;
}
