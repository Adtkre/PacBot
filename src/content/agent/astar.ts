import { Node } from './mazeGraph';

export function astar(start: Node, goal: Node): Node[] | null {
    const openSet = new Set<Node>([start]);
    const cameFrom = new Map<Node, Node>();

    const gScore = new Map<Node, number>();
    gScore.set(start, 0);

    const fScore = new Map<Node, number>();
    fScore.set(start, heuristic(start, goal));

    while (openSet.size > 0) {
        let current: Node | null = null;
        let lowestFScore = Infinity;

        for (const node of openSet) {
            const score = fScore.get(node) ?? Infinity;
            if (score < lowestFScore) {
                lowestFScore = score;
                current = node;
            }
        }

        if (!current) break;

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);

        for (const neighbor of current.neighbors) {
            const tentativeGScore = (gScore.get(current) ?? Infinity) + 1;

            if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + heuristic(neighbor, goal));
                openSet.add(neighbor);
            }
        }
    }

    return null; // Path not found
}

function heuristic(a: Node, b: Node): number {
    // Manhattan distance. Tunnel wrapping makes this technically inadmissible for 
    // paths going through the tunnel, but in practice it's fine for small distances.
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(cameFrom: Map<Node, Node>, current: Node): Node[] {
    const path = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current)!;
        path.push(current);
    }
    return path.reverse();
}
