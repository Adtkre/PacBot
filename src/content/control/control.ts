export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const keyMap = {
    'UP': 'ArrowUp',
    'DOWN': 'ArrowDown',
    'LEFT': 'ArrowLeft',
    'RIGHT': 'ArrowRight'
};

const keyCodeMap = {
    'UP': 38,
    'DOWN': 40,
    'LEFT': 37,
    'RIGHT': 39
};

export function sendCommand(dir: Direction) {
    // We fire events on both window and document to ensure it's captured
    const targetKeys = [
        { key: keyMap[dir], code: keyMap[dir], keyCode: keyCodeMap[dir], which: keyCodeMap[dir], bubbles: true }
    ];

    for (const data of targetKeys) {
        document.dispatchEvent(new KeyboardEvent('keydown', data));
        window.dispatchEvent(new KeyboardEvent('keydown', data));
    }
}
