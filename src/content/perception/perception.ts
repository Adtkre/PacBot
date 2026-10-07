export interface RawEntity {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface RawGameState {
    pacman: RawEntity | null;
    ghosts: RawEntity[];
    pellets: RawEntity[];
}

function getEntityBounds(el: HTMLElement): RawEntity {
    return {
        id: el.id,
        left: parseFloat(el.style.left) || 0,
        top: parseFloat(el.style.top) || 0,
        width: el.offsetWidth || 10,
        height: el.offsetHeight || 10
    };
}

export function readRawState(): RawGameState {
    const pacmanEl = document.querySelector('.pacman') as HTMLElement;
    const ghostEls = document.querySelectorAll('.ghost');
    const pelletEls = document.querySelectorAll('.power-pellet, .dot');

    return {
        pacman: pacmanEl ? getEntityBounds(pacmanEl) : null,
        ghosts: Array.from(ghostEls).map(el => getEntityBounds(el as HTMLElement)),
        pellets: Array.from(pelletEls).map(el => getEntityBounds(el as HTMLElement))
    };
}
