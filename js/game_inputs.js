export const keyData = {
    pressData: {
        'ArrowLeft': false,
        'ArrowRight': false,
        'ArrowUp': false,
        'ArrowDown': false,
    },
    current: false,
    maxPriority: 0,
}

export function figureNextCommand(keyData) {
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

function keyDownEvent(event, keyData) {
    const pressed_key = event.key
    if (Object.keys(keyData.pressData).includes(pressed_key) && typeof keyData.pressData[pressed_key] !== 'number') {
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

export function addGameInputEvents(keyData) {
    window.addEventListener("keydown", (event) => keyDownEvent(event, keyData));
    window.addEventListener("keyup", (event) => keyUpEvent(event, keyData));
}
