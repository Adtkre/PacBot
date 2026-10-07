export interface GameState {
    pacman: { x: number, y: number, fracX: number, fracY: number, rawLeft: number, rawTop: number } | null;
    ghosts: { id: string, x: number, y: number, rawLeft: number, rawTop: number }[];
    tileSizeX: number;
    tileSizeY: number;
}

export function readState(): GameState {
    const mazeEl = document.querySelector('.maze') as HTMLElement;
    const pacmanEl = document.querySelector('.pacman') as HTMLElement;
    const ghostEls = document.querySelectorAll('.ghost');

    const mw = mazeEl?.offsetWidth || 280;
    const mh = mazeEl?.offsetHeight || 310;

    const tileSizeX = mw / 28;
    const tileSizeY = mh / 31;

    function toTile(rawLeft: number, rawTop: number, width: number) {
        // Find fractional position using the center of the sprite
        const fracX = (rawLeft + width / 2 - tileSizeX / 2) / tileSizeX;
        const fracY = (rawTop + width / 2 - tileSizeY / 2) / tileSizeY;

        let x = Math.round(fracX);
        let y = Math.round(fracY);

        if (x < 0) x = 0; if (x > 27) x = 27;
        if (y < 0) y = 0; if (y > 30) y = 30;

        return { x, y, fracX, fracY };
    }

    const ghosts = Array.from(ghostEls).map(el => {
        const rawLeft = parseFloat((el as HTMLElement).style.left) || 0;
        const rawTop = parseFloat((el as HTMLElement).style.top) || 0;
        const width = (el as HTMLElement).offsetWidth || tileSizeX;
        const pos = toTile(rawLeft, rawTop, width);
        return { id: el.id, x: pos.x, y: pos.y, rawLeft, rawTop };
    });

    let pacman = null;
    if (pacmanEl) {
        const rawLeft = parseFloat(pacmanEl.style.left) || 0;
        const rawTop = parseFloat(pacmanEl.style.top) || 0;
        const width = pacmanEl.offsetWidth || tileSizeX;
        const pos = toTile(rawLeft, rawTop, width);
        pacman = { x: pos.x, y: pos.y, fracX: pos.fracX, fracY: pos.fracY, rawLeft, rawTop };
    }

    return { pacman, ghosts, tileSizeX, tileSizeY };
}
