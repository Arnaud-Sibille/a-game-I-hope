const PX_PER_UNIT = 20;
const FPS = 60;
const DELAY_BETWEEN_MOVES = 15;

const gameData = {
    grid: {
        width: 30,
        height: 20,
    },
    player: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        waitTilNextMove: 0,
    },
    objective: {
        x: 29,
        y: 19,
        width: 1,
        height: 1,
    },
    walls: [
        {
            x: 2,
            y: 1,
            width: 1,
            height: 1,
        }, {
            x: 5,
            y: 3,
            width: 2,
            height: 2,
        }, {
            x: 15,
            y: 10,
            width: 5,
            height: 8,
        },
    ],
}

const keyData = {
    pressData: {
        'ArrowLeft': false,
        'ArrowRight': false,
        'ArrowUp': false,
        'ArrowDown': false,
    },
    current: false,
    maxPriority: 0,
}

function unitToPxStr(nbUnit, pxPerUnit) {
    return `${nbUnit * pxPerUnit}px`;
}

function drawGrid(parentEl, pxPerUnit, gridData) {
    if (gridData.dom)
        return gridData.dom;

    const tableEl = document.createElement("table");
    for (let y = 0; y < gridData.height; y++) {
        const rowEl = document.createElement("tr");
        tableEl.appendChild(rowEl);
        for (let x = 0; x < gridData.width; x++) {
            const cellEl = document.createElement("td");
            cellEl.width = unitToPxStr(1, pxPerUnit);
            cellEl.height = unitToPxStr(1, pxPerUnit);
            rowEl.appendChild(cellEl);
        }
    }
    parentEl.appendChild(tableEl);
    gridData.dom = tableEl;

    return tableEl;
}

function drawObjective(parentEl, pxPerUnit, objectiveData) {
    if (objectiveData.dom)
        return objectiveData.dom;

    const objectiveEl = document.createElement("div");
    objectiveEl.setAttribute("class", "objective");
    objectiveEl.style.left = unitToPxStr(objectiveData.x, pxPerUnit);
    objectiveEl.style.top = unitToPxStr(objectiveData.y, pxPerUnit);
    objectiveEl.style.width = unitToPxStr(objectiveData.width, pxPerUnit);
    objectiveEl.style.height = unitToPxStr(objectiveData.height, pxPerUnit);
    parentEl.appendChild(objectiveEl);

    objectiveData.dom = objectiveEl;

    return objectiveEl;
}

function drawWalls(parentEl, pxPerUnit, wallsData) {
    for (let wallData of wallsData) {
        if (wallData.dom)
            continue;

        const wallEl = document.createElement("div");

        wallEl.setAttribute("class", "wall");
        wallEl.style.left = unitToPxStr(wallData.x, pxPerUnit);
        wallEl.style.top = unitToPxStr(wallData.y, pxPerUnit);
        wallEl.style.width = unitToPxStr(wallData.width, pxPerUnit);
        wallEl.style.height = unitToPxStr(wallData.height, pxPerUnit);
        parentEl.appendChild(wallEl);

        wallData.dom = wallEl;
    }
}

function drawPlayer(parentEl, pxPerUnit, playerData) {
    let playerEl = playerData.dom;
    if (!playerEl) {
        playerEl = document.createElement("div");
        playerEl.setAttribute("class", "player");
        playerEl.style.width = unitToPxStr(playerData.width, pxPerUnit);
        playerEl.style.height = unitToPxStr(playerData.height, pxPerUnit);
        parentEl.appendChild(playerEl);
        playerData.dom = playerEl;
    }
    playerEl.style.left = unitToPxStr(playerData.x, pxPerUnit);
    playerEl.style.top = unitToPxStr(playerData.y, pxPerUnit);

    return playerEl;
}

function drawFrame(gameWrapperSelector, pxPerUnit, gameData) {
    tableEl = drawGrid(document.querySelector(gameWrapperSelector), pxPerUnit, gameData.grid);
    drawObjective(tableEl, pxPerUnit, gameData.objective)
    drawWalls(tableEl, pxPerUnit, gameData.walls);
    drawPlayer(tableEl, pxPerUnit, gameData.player);
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

function isOverlap(x1, y1, width1, height1, x2, y2, width2, height2) {
    if (x1 + width1 <= x2 || x2 + width2 <= x1)
        return false;
    if (y1 + height1 <= y2 || y2 + height2 <= y1)
        return false;

    return true;
}

function isPlayerPosOk(x, y, gameData) {
    if (x < 0 || x >= gameData.grid.width || y < 0 || y >= gameData.grid.height)
        return false;

    for (let wallData of gameData.walls) {
        const playerData = gameData.player;
        if (isOverlap(x, y, playerData.width, playerData.height, wallData.x, wallData.y, wallData.width, wallData.height))
            return false;
    }

    return true;
}

function updatePlayer(gameData, delayBetweenMoves, nextCommand) {
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
    playerData.waitTilNextMove = delayBetweenMoves;
}

function figureNextCommand(keyData) {
    let nextCommand = keyData.current;
    if (nextCommand && !keyData.pressData[nextCommand])
        keyData.current = false;
    else if (!nextCommand) {
        let currentPriority = -1;
        Object.entries(keyData.pressData).forEach(([key, value]) => {
            if (typeof value === 'number' && value > currentPriority) {
                nextCommand = key;
                currentPriority = value;
            }
        })
    }

    return nextCommand;
}

function goNextFrame(gameWrapperSelector, pxPerUnit, gameData, delayBetweenMoves, keyData) {
    const nextCommand = figureNextCommand(keyData);
    updatePlayer(gameData, delayBetweenMoves, nextCommand);
    drawFrame(gameWrapperSelector, pxPerUnit, gameData);
}

function keyDownEvent(event, keyData) {
    const pressed_key = event.key
    if (Object.keys(keyData.pressData).includes(pressed_key)) {
        keyData.pressData[pressed_key] = keyData.maxPriority++;
        keyData.current = pressed_key;
    }
}

function keyUpEvent(event, keyData) {
    const released_key = event.key;
    if (Object.keys(keyData.pressData).includes(released_key)) {
        keyData.pressData[released_key] = false;
    }
}

window.addEventListener("keydown", (event) => keyDownEvent(event, keyData));
window.addEventListener("keyup", (event) => keyUpEvent(event, keyData))
setInterval(
    () => goNextFrame(".game-display-wrapper", PX_PER_UNIT, gameData, DELAY_BETWEEN_MOVES, keyData),
    1 / FPS,
);
