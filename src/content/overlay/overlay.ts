let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let mazeEl: HTMLElement | null = null;

export function initOverlay() {
    if (!mazeEl) {
        mazeEl = document.querySelector('.maze') as HTMLElement;
    }

    if (!mazeEl) return;

    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'pacbot-overlay';
        canvas.style.position = 'absolute';
        canvas.style.pointerEvents = 'none'; // let clicks pass through
        canvas.style.zIndex = '9999';
        mazeEl.parentElement?.appendChild(canvas);
        ctx = canvas.getContext('2d');
    }

    const rect = mazeEl.getBoundingClientRect();

    if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    canvas.style.left = mazeEl.offsetLeft + 'px';
    canvas.style.top = mazeEl.offsetTop + 'px';
}

export function clearCanvas() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export function drawRect(left: number, top: number, width: number, height: number, color: string) {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(left, top, width, height);
}

export function drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export function drawText(text: string, x: number, y: number, color: string) {
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.font = '12px sans-serif';
    ctx.fillText(text, x, y);
}
