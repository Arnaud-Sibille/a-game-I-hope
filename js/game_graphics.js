import { unitToPxStr } from "./utils.js";

function drawGrid(parentEl, pxPerUnit, gridData) {
    if (gridData.dom)
        return gridData.dom;

    const tableEl = document.createElement("table");
    tableEl.style.width = unitToPxStr(gridData.width, pxPerUnit);
    tableEl.style.height = unitToPxStr(gridData.height, pxPerUnit);
    for (let y = 0; y < gridData.height; y++) {
        const rowEl = document.createElement("tr");
        tableEl.appendChild(rowEl);
        for (let x = 0; x < gridData.width; x++) {
            const cellEl = document.createElement("td");
            cellEl.style.width = unitToPxStr(1, pxPerUnit);
            cellEl.style.height = unitToPxStr(1, pxPerUnit);
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

function drawEnnemies(parentEl, pxPerUnit, ennemiesData) {
    for (let ennemyData of ennemiesData) {
        let ennemyEl = ennemyData.dom;
        if (!ennemyEl) {
            ennemyEl = document.createElement("div");
            ennemyEl.setAttribute("class", "ennemy");
            ennemyEl.style.width = unitToPxStr(ennemyData.width, pxPerUnit);
            ennemyEl.style.height = unitToPxStr(ennemyData.height, pxPerUnit);
            parentEl.appendChild(ennemyEl);
            ennemyData.dom = ennemyEl;
        }
        ennemyEl.style.left = unitToPxStr(ennemyData.x, pxPerUnit);
        ennemyEl.style.top = unitToPxStr(ennemyData.y, pxPerUnit);
    }
}

function drawSuccess(parentEl, status) {
    if (status === 'success') {
        const successEl = document.createElement("h2");
        successEl.setAttribute("class", "success_msg");
        successEl.textContent = "Success!";

        parentEl.appendChild(successEl);
    }
}

export function drawFrame(gameWrapperSelector, pxPerUnit, gameData) {
    const gameWrapperEl = document.querySelector(gameWrapperSelector);
    const tableEl = drawGrid(gameWrapperEl, pxPerUnit, gameData.grid);
    drawObjective(tableEl, pxPerUnit, gameData.objective);
    drawWalls(tableEl, pxPerUnit, gameData.walls);
    drawPlayer(tableEl, pxPerUnit, gameData.player);
    drawEnnemies(tableEl, pxPerUnit, gameData.ennemies);
    drawSuccess(gameWrapperEl, gameData.status);
}
