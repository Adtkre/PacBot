import { initOverlay, drawRect, drawLine, clearCanvas, drawText } from './overlay/overlay';
import { readState } from './perception/stateMatrix';
import { sendCommand, Direction } from './control/control';
import { graph, walkableNodes, Node } from './model/mazeGraph';
import { astar } from './agent/astar';

let currentPath: Node[] | null = null;
let currentDir: Direction | null = null;
let lastCommandTime = 0;
let stuckFrames = 0;
let lastFracX = 0;
let lastFracY = 0;

function loop() {
    const state = readState();

    initOverlay();
    clearCanvas();

    if (state.pacman) {
        drawRect(state.pacman.rawLeft, state.pacman.rawTop, 20, 20, 'yellow');

        const { fracX, fracY } = state.pacman;

        // Virtual Pellet consumption - scan neighborhood for anything our massive threshold touches
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const rx = Math.round(fracX) + dx;
                const ry = Math.round(fracY) + dy;
                if (graph[ry] && graph[ry][rx]) {
                    // Ultra-resilient 0.75 tile threshold to accommodate CSS grid desync!
                    if (Math.abs(fracX - rx) < 0.75 && Math.abs(fracY - ry) < 0.75) {
                        graph[ry][rx].hasPellet = false;
                        graph[ry][rx].hasPower = false;
                    }
                }
            }
        }

        const now = Date.now();

        // Stuck detection
        if (Math.abs(fracX - lastFracX) < 0.01 && Math.abs(fracY - lastFracY) < 0.01) {
            stuckFrames++;
        } else {
            stuckFrames = 0;
            lastFracX = fracX;
            lastFracY = fracY;
        }

        // If path is empty or we reached the end or we are stuck, recalculate
        if (!currentPath || currentPath.length === 0 || stuckFrames > 30) {

            // Find our current exact logical node to start A*
            const startX = Math.round(fracX);
            const startY = Math.round(fracY);
            let startNode = graph[startY]?.[startX];

            if (startNode?.isWall) {
                // Find nearest walkable
                let bestDist = Infinity;
                for (const n of walkableNodes) {
                    const dist = Math.abs(n.x - fracX) + Math.abs(n.y - fracY);
                    if (dist < bestDist) {
                        bestDist = dist;
                        startNode = n;
                    }
                }
            }

            if (startNode) {
                // Find nearest remaining pellet
                let targetNode = null;
                let minDistance = Infinity;
                for (const n of walkableNodes) {
                    if (n.hasPellet || n.hasPower) {
                        const dist = Math.abs(n.x - startNode.x) + Math.abs(n.y - startNode.y);
                        if (dist < minDistance && dist > 0) {
                            minDistance = dist;
                            targetNode = n;
                        }
                    }
                }

                if (targetNode) {
                    const path = astar(startNode, targetNode);
                    if (path) {
                        currentPath = path;
                        stuckFrames = 0;
                    }
                }
            }
        }

        // Action Execution (Continuous steering to waypoints)
        if (currentPath && currentPath.length > 0) {
            let targetNode: Node | null = currentPath[0];

            // If we have reached the target node (more strict threshold for precise turns)
            if (Math.abs(fracX - targetNode.x) < 0.25 && Math.abs(fracY - targetNode.y) < 0.25) {
                currentPath.shift(); // Remove the reached node
                if (currentPath.length > 0) {
                    targetNode = currentPath[0]; // Set next
                } else {
                    targetNode = null;
                }
            }

            if (targetNode) {
                let dirs: Direction[] = [];

                let cx = Math.round(fracX);
                let cy = Math.round(fracY);
                let tx = targetNode.x;
                let ty = targetNode.y;

                let dx = tx - cx;
                let dy = ty - cy;

                // Tunnel warp corrections for integer comparison
                if (dx > 14) dx -= 28;
                if (dx < -14) dx += 28;

                if (Math.abs(dx) > 0) {
                    dirs.push(dx > 0 ? 'RIGHT' : 'LEFT');
                } else if (Math.abs(dy) > 0) {
                    dirs.push(dy > 0 ? 'DOWN' : 'UP');
                } else {
                    // We share the same integer tile as target.
                    // Are we physically aligned enough on the axis we WERE traveling on?
                    let isAligned = true;
                    if (currentDir === 'LEFT' && (fracX - cx) > 0.1) isAligned = false;
                    if (currentDir === 'RIGHT' && (cx - fracX) > 0.1) isAligned = false;
                    if (currentDir === 'UP' && (fracY - cy) > 0.1) isAligned = false;
                    if (currentDir === 'DOWN' && (cy - fracY) > 0.1) isAligned = false;

                    if (!isAligned && currentDir) {
                        dirs.push(currentDir);
                    } else if (currentPath.length > 1) {
                        // We are aligned! Look ahead into the next path segment to corner properly.
                        let nx = currentPath[1].x;
                        let ny = currentPath[1].y;
                        let ndx = nx - tx;
                        let ndy = ny - ty;

                        if (ndx > 14) ndx -= 28;
                        if (ndx < -14) ndx += 28;

                        if (Math.abs(ndx) > 0) dirs.push(ndx > 0 ? 'RIGHT' : 'LEFT');
                        else if (Math.abs(ndy) > 0) dirs.push(ndy > 0 ? 'DOWN' : 'UP');
                    } else {
                        // Fallback to fractional fine-tuning if it's the absolute last node
                        let fdx = tx - fracX;
                        let fdy = ty - fracY;
                        if (Math.abs(fdx) > Math.abs(fdy)) {
                            dirs.push(fdx > 0 ? 'RIGHT' : 'LEFT');
                        } else {
                            dirs.push(fdy > 0 ? 'DOWN' : 'UP');
                        }
                    }
                }

                // Draw target node indicator
                drawRect(targetNode.x * state.tileSizeX, targetNode.y * state.tileSizeY, state.tileSizeX, state.tileSizeY, 'rgba(255,100,0,0.5)');

                // Dispatch commands
                let activeDir = dirs.length > 0 ? dirs[0] : null;
                if (activeDir && (now - lastCommandTime > 150 || activeDir !== currentDir)) {
                    currentDir = activeDir;
                    lastCommandTime = now;
                    for (const d of dirs) {
                        sendCommand(d);
                    }
                }
            }
        }

        // Draw path
        if (currentPath && currentPath.length > 0) {
            // Draw from pacman to first node
            drawLine(
                fracX * state.tileSizeX + state.tileSizeX / 2,
                fracY * state.tileSizeY + state.tileSizeY / 2,
                currentPath[0].x * state.tileSizeX + state.tileSizeX / 2,
                currentPath[0].y * state.tileSizeY + state.tileSizeY / 2,
                'green'
            );

            for (let i = 0; i < currentPath.length - 1; i++) {
                const n1 = currentPath[i];
                const n2 = currentPath[i + 1];
                drawLine(
                    n1.x * state.tileSizeX + state.tileSizeX / 2,
                    n1.y * state.tileSizeY + state.tileSizeY / 2,
                    n2.x * state.tileSizeX + state.tileSizeX / 2,
                    n2.y * state.tileSizeY + state.tileSizeY / 2,
                    'green'
                );
            }
        }

        // Draw Virtual Pellets
        for (const n of walkableNodes) {
            if (n.hasPellet) {
                drawRect(n.x * state.tileSizeX + state.tileSizeX / 2 - 2, n.y * state.tileSizeY + state.tileSizeY / 2 - 2, 4, 4, 'rgba(255,255,255,0.4)');
            }
        }
    }

    for (const ghost of state.ghosts) {
        drawRect(ghost.rawLeft, ghost.rawTop, 20, 20, ghost.id === 'clyde' ? 'orange' : 'red');
        drawText(ghost.id, ghost.rawLeft, ghost.rawTop - 5, 'white');
    }

    requestAnimationFrame(loop);
}

// Ensure the game receives focus
window.focus();

console.log("PacBot Phase 2.2 Started: Fractional Steering");
requestAnimationFrame(loop);
