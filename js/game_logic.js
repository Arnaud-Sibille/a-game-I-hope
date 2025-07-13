import { isSegmentinSegment, isRectInRect, doesRectOverlapRect } from "./utils.js";

function updateEnnemies(gameData) {
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

function isInGrid(x, width, y, height, grid) {
    return isRectInRect(x, width, y, height, 0, grid.width, 0, grid.height);
}

function isPlayerPosOk(x, y, gameData) {
    if (!isInGrid(x, gameData.player.width, y, gameData.player.height, gameData.grid))
        return false;

    for (let wall of gameData.walls) {
        const player = gameData.player;
        if (doesRectOverlapRect(x, player.width, y, player.height, wall.x, wall.width, wall.y, wall.height))
            return false;
    }

    return true;
}

function updatePlayer(gameData, nextCommand) {
    const player = gameData.player;

    if (player.waitTilNextMove > 0) {
        player.waitTilNextMove--;
        return;
    }

    if (!nextCommand)
        return;

    const newPos = getNewPlayerPos(player.x, player.y, nextCommand);
    const newX = newPos[0];
    const newY = newPos[1];

    if (!isPlayerPosOk(newX, newY, gameData))
        return;

    player.x = newX;
    player.y = newY;
    player.waitTilNextMove = player.delayBetweenMoves;
}

function checkLostCondition(gameData) {
    const player = gameData.player
    for (let ennemy of gameData.ennemies) {
        if(doesRectOverlapRect(
            player.x, player.width, player.y, player.height,
            ennemy.x, ennemy.width, ennemy.y, ennemy.height
        ))
            gameData.status = 'failure';
    }
}

function checkWinCondition(gameData) {
    const player = gameData.player;
    const objective = gameData.objective;
    if (isRectInRect(
        player.x, player.width, player.y, player.height,
        objective.x, objective.width, objective.y, objective.height
    ))
        gameData.status = 'success';
}

export function play(gameData, nextCommand) {
    updatePlayer(gameData, nextCommand);
    updateEnnemies(gameData);
    checkLostCondition(gameData);
    checkWinCondition(gameData);
}
