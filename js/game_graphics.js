import { unitToPxStr } from "./utils.js";

function drawGrid(parentEl, pxPerUnit, grid) {
    if (grid.dom)
        return grid.dom;

    const tableEl = document.createElement("table");
    tableEl.style.width = unitToPxStr(grid.width, pxPerUnit);
    tableEl.style.height = unitToPxStr(grid.height, pxPerUnit);
    for (let y = 0; y < grid.height; y++) {
        const rowEl = document.createElement("tr");
        tableEl.appendChild(rowEl);
        for (let x = 0; x < grid.width; x++) {
            const cellEl = document.createElement("td");
            cellEl.style.width = unitToPxStr(1, pxPerUnit);
            cellEl.style.height = unitToPxStr(1, pxPerUnit);
            rowEl.appendChild(cellEl);
        }
    }
    parentEl.appendChild(tableEl);
    grid.dom = tableEl;

    return tableEl;
}

function drawObjective(parentEl, pxPerUnit, objective) {
    if (objective.dom)
        return objective.dom;

    const objectiveEl = document.createElement("div");
    objectiveEl.setAttribute("class", "objective");
    objectiveEl.style.left = unitToPxStr(objective.x, pxPerUnit);
    objectiveEl.style.top = unitToPxStr(objective.y, pxPerUnit);
    objectiveEl.style.width = unitToPxStr(objective.width, pxPerUnit);
    objectiveEl.style.height = unitToPxStr(objective.height, pxPerUnit);
    parentEl.appendChild(objectiveEl);

    objective.dom = objectiveEl;

    return objectiveEl;
}

function drawWalls(parentEl, pxPerUnit, walls) {
    for (let wall of walls) {
        if (wall.dom)
            continue;

        const wallEl = document.createElement("div");

        wallEl.setAttribute("class", "wall");
        wallEl.style.left = unitToPxStr(wall.x, pxPerUnit);
        wallEl.style.top = unitToPxStr(wall.y, pxPerUnit);
        wallEl.style.width = unitToPxStr(wall.width, pxPerUnit);
        wallEl.style.height = unitToPxStr(wall.height, pxPerUnit);
        parentEl.appendChild(wallEl);

        wall.dom = wallEl;
    }
}

function drawPlayer(parentEl, pxPerUnit, player) {
    let playerEl = player.dom;
    if (!playerEl) {
        playerEl = document.createElement("div");
        playerEl.setAttribute("class", "player");
        playerEl.style.width = unitToPxStr(player.width, pxPerUnit);
        playerEl.style.height = unitToPxStr(player.height, pxPerUnit);
        parentEl.appendChild(playerEl);
        player.dom = playerEl;
    }
    playerEl.style.left = unitToPxStr(player.x, pxPerUnit);
    playerEl.style.top = unitToPxStr(player.y, pxPerUnit);

    return playerEl;
}

function drawEnnemies(parentEl, pxPerUnit, ennemies) {
    for (let ennemy of ennemies) {
        let ennemyEl = ennemy.dom;
        if (!ennemyEl) {
            ennemyEl = document.createElement("div");
            ennemyEl.setAttribute("class", "ennemy");
            ennemyEl.style.width = unitToPxStr(ennemy.width, pxPerUnit);
            ennemyEl.style.height = unitToPxStr(ennemy.height, pxPerUnit);
            ennemyEl.style.padding = "2px";
            parentEl.appendChild(ennemyEl);
            ennemy.dom = ennemyEl;

            const ennemyDrawingEl = document.createElement("div");
            ennemyDrawingEl.setAttribute("class", "ennemy_drawing");
            ennemyEl.appendChild(ennemyDrawingEl);
        }
        ennemyEl.style.left = unitToPxStr(ennemy.x, pxPerUnit);
        ennemyEl.style.top = unitToPxStr(ennemy.y, pxPerUnit);
    }
}

function showFailure(parentEl, status) {
    if (status === 'failure') {
        const failureEl = document.createElement("h2");
        failureEl.setAttribute("class", "failure_msg");
        failureEl.textContent = "Failure.";

        parentEl.appendChild(failureEl);
    }
}

function showSuccess(parentEl, status) {
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
    showFailure(gameWrapperEl, gameData.status);
    showSuccess(gameWrapperEl, gameData.status);
}
