export const MAZE_ASCII = `
WWWWWWWWWWWWWWWWWWWWWWWWWWWW
W............WW............W
W.WWWW.WWWWW.WW.WWWWW.WWWW.W
WOWWWW.WWWWW.WW.WWWWW.WWWWOW
W.WWWW.WWWWW.WW.WWWWW.WWWW.W
W..........................W
W.WWWW.WW.WWWWWWWW.WW.WWWW.W
W.WWWW.WW.WWWWWWWW.WW.WWWW.W
W......WW....WW....WW......W
WWWWWW.WWWWW WW WWWWW.WWWWWW
      .WWWWW WW WWWWW.      
      .WW          WW.      
      .WW WWW--WWW WW.      
WWWWWW.WW W      W WW.WWWWWW
      .   W      W   .      
WWWWWW.WW W      W WW.WWWWWW
      .WW WWWWWWWW WW.      
      .WW          WW.      
      .WW WWWWWWWW WW.      
WWWWWW.WW WWWWWWWW WW.WWWWWW
W............WW............W
W.WWWW.WWWWW.WW.WWWWW.WWWW.W
W.WWWW.WWWWW.WW.WWWWW.WWWW.W
WOW.WW.......  .......WW.WOW
WWW.WW.WW.WWWWWWWW.WW.WW.WWW
WWW.WW.WW.WWWWWWWW.WW.WW.WWW
W......WW....WW....WW......W
W.WWWWWWWWWW.WW.WWWWWWWWWW.W
W.WWWWWWWWWW.WW.WWWWWWWWWW.W
W..........................W
WWWWWWWWWWWWWWWWWWWWWWWWWWWW
`.trim().split('\n');

export interface Node {
    x: number;
    y: number;
    isWall: boolean;
    hasPellet: boolean;
    hasPower: boolean;
    neighbors: Node[];
}

export const graph: Node[][] = [];
export const walkableNodes: Node[] = [];

// Initialize Graph
for (let y = 0; y < 31; y++) {
    graph[y] = [];
    for (let x = 0; x < 28; x++) {
        const char = MAZE_ASCII[y][x];
        const isWall = char === 'W' || char === '-';
        const node = {
            x, y,
            isWall,
            hasPellet: char === '.',
            hasPower: char === 'O',
            neighbors: []
        };
        graph[y].push(node);
        if (!isWall) walkableNodes.push(node);
    }
}

// Link neighbors
for (let y = 0; y < 31; y++) {
    for (let x = 0; x < 28; x++) {
        if (graph[y][x].isWall) continue;

        const node = graph[y][x];
        if (y === 14 && x === 0) {
            node.neighbors.push(graph[14][27]);
        } else if (x > 0 && !graph[y][x - 1].isWall) node.neighbors.push(graph[y][x - 1]);

        if (y === 14 && x === 27) {
            node.neighbors.push(graph[14][0]);
        } else if (x < 27 && !graph[y][x + 1].isWall) node.neighbors.push(graph[y][x + 1]);

        if (y > 0 && !graph[y - 1][x].isWall) node.neighbors.push(graph[y - 1][x]);
        if (y < 30 && !graph[y + 1][x].isWall) node.neighbors.push(graph[y + 1][x]);
    }
}
