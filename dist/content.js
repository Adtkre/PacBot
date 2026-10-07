"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/content/overlay/overlay.ts
  function initOverlay() {
    if (!mazeEl) {
      mazeEl = document.querySelector(".maze");
    }
    if (!mazeEl) return;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "pacbot-overlay";
      canvas.style.position = "absolute";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "9999";
      mazeEl.parentElement?.appendChild(canvas);
      ctx = canvas.getContext("2d");
    }
    const rect = mazeEl.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    canvas.style.left = mazeEl.offsetLeft + "px";
    canvas.style.top = mazeEl.offsetTop + "px";
  }
  function clearCanvas() {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  function drawRect(left, top, width, height, color) {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(left, top, width, height);
  }
  function drawLine(x1, y1, x2, y2, color) {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  function drawText(text, x, y, color) {
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.font = "12px sans-serif";
    ctx.fillText(text, x, y);
  }
  var canvas, ctx, mazeEl;
  var init_overlay = __esm({
    "src/content/overlay/overlay.ts"() {
      "use strict";
      canvas = null;
      ctx = null;
      mazeEl = null;
    }
  });

  // src/content/perception/stateMatrix.ts
  function readState() {
    const mazeEl2 = document.querySelector(".maze");
    const pacmanEl = document.querySelector(".pacman");
    const ghostEls = document.querySelectorAll(".ghost");
    const mw = mazeEl2?.offsetWidth || 280;
    const mh = mazeEl2?.offsetHeight || 310;
    const tileSizeX = mw / 28;
    const tileSizeY = mh / 31;
    function toTile(rawLeft, rawTop, width) {
      const fracX = (rawLeft + width / 2 - tileSizeX / 2) / tileSizeX;
      const fracY = (rawTop + width / 2 - tileSizeY / 2) / tileSizeY;
      let x = Math.round(fracX);
      let y = Math.round(fracY);
      if (x < 0) x = 0;
      if (x > 27) x = 27;
      if (y < 0) y = 0;
      if (y > 30) y = 30;
      return { x, y, fracX, fracY };
    }
    const ghosts = Array.from(ghostEls).map((el) => {
      const rawLeft = parseFloat(el.style.left) || 0;
      const rawTop = parseFloat(el.style.top) || 0;
      const width = el.offsetWidth || tileSizeX;
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
  var init_stateMatrix = __esm({
    "src/content/perception/stateMatrix.ts"() {
      "use strict";
    }
  });

  // src/content/control/control.ts
  function sendCommand(dir) {
    const targetKeys = [
      { key: keyMap[dir], code: keyMap[dir], keyCode: keyCodeMap[dir], which: keyCodeMap[dir], bubbles: true }
    ];
    for (const data of targetKeys) {
      document.dispatchEvent(new KeyboardEvent("keydown", data));
      window.dispatchEvent(new KeyboardEvent("keydown", data));
    }
  }
  var keyMap, keyCodeMap;
  var init_control = __esm({
    "src/content/control/control.ts"() {
      "use strict";
      keyMap = {
        "UP": "ArrowUp",
        "DOWN": "ArrowDown",
        "LEFT": "ArrowLeft",
        "RIGHT": "ArrowRight"
      };
      keyCodeMap = {
        "UP": 38,
        "DOWN": 40,
        "LEFT": 37,
        "RIGHT": 39
      };
    }
  });

  // src/content/model/mazeGraph.ts
  var MAZE_ASCII, graph, walkableNodes;
  var init_mazeGraph = __esm({
    "src/content/model/mazeGraph.ts"() {
      "use strict";
      MAZE_ASCII = `
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
`.trim().split("\n");
      graph = [];
      walkableNodes = [];
      for (let y = 0; y < 31; y++) {
        graph[y] = [];
        for (let x = 0; x < 28; x++) {
          const char = MAZE_ASCII[y][x];
          const isWall = char === "W" || char === "-";
          const node = {
            x,
            y,
            isWall,
            hasPellet: char === ".",
            hasPower: char === "O",
            neighbors: []
          };
          graph[y].push(node);
          if (!isWall) walkableNodes.push(node);
        }
      }
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
    }
  });

  // src/content/agent/astar.ts
  function astar(start, goal) {
    const openSet = /* @__PURE__ */ new Set([start]);
    const cameFrom = /* @__PURE__ */ new Map();
    const gScore = /* @__PURE__ */ new Map();
    gScore.set(start, 0);
    const fScore = /* @__PURE__ */ new Map();
    fScore.set(start, heuristic(start, goal));
    while (openSet.size > 0) {
      let current = null;
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
    return null;
  }
  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.push(current);
    }
    return path.reverse();
  }
  var init_astar = __esm({
    "src/content/agent/astar.ts"() {
      "use strict";
    }
  });

  // src/content/main.ts
  var require_main = __commonJS({
    "src/content/main.ts"() {
      init_overlay();
      init_stateMatrix();
      init_control();
      init_mazeGraph();
      init_astar();
      var currentPath = null;
      var currentDir = null;
      var lastCommandTime = 0;
      var stuckFrames = 0;
      var lastFracX = 0;
      var lastFracY = 0;
      function loop() {
        const state = readState();
        initOverlay();
        clearCanvas();
        if (state.pacman) {
          drawRect(state.pacman.rawLeft, state.pacman.rawTop, 20, 20, "yellow");
          const { fracX, fracY } = state.pacman;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const rx = Math.round(fracX) + dx;
              const ry = Math.round(fracY) + dy;
              if (graph[ry] && graph[ry][rx]) {
                if (Math.abs(fracX - rx) < 0.75 && Math.abs(fracY - ry) < 0.75) {
                  graph[ry][rx].hasPellet = false;
                  graph[ry][rx].hasPower = false;
                }
              }
            }
          }
          const now = Date.now();
          if (Math.abs(fracX - lastFracX) < 0.01 && Math.abs(fracY - lastFracY) < 0.01) {
            stuckFrames++;
          } else {
            stuckFrames = 0;
            lastFracX = fracX;
            lastFracY = fracY;
          }
          if (!currentPath || currentPath.length === 0 || stuckFrames > 30) {
            const startX = Math.round(fracX);
            const startY = Math.round(fracY);
            let startNode = graph[startY]?.[startX];
            if (startNode?.isWall) {
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
          if (currentPath && currentPath.length > 0) {
            let targetNode = currentPath[0];
            if (Math.abs(fracX - targetNode.x) < 0.25 && Math.abs(fracY - targetNode.y) < 0.25) {
              currentPath.shift();
              if (currentPath.length > 0) {
                targetNode = currentPath[0];
              } else {
                targetNode = null;
              }
            }
            if (targetNode) {
              let dir = null;
              let cx = Math.round(fracX);
              let cy = Math.round(fracY);
              let tx = targetNode.x;
              let ty = targetNode.y;
              let dx = tx - cx;
              let dy = ty - cy;
              if (dx > 14) dx -= 28;
              if (dx < -14) dx += 28;
              if (Math.abs(dx) > 0) {
                dir = dx > 0 ? "RIGHT" : "LEFT";
              } else if (Math.abs(dy) > 0) {
                dir = dy > 0 ? "DOWN" : "UP";
              } else {
                if (currentPath.length > 1) {
                  let nx = currentPath[1].x;
                  let ny = currentPath[1].y;
                  let ndx = nx - tx;
                  let ndy = ny - ty;
                  if (ndx > 14) ndx -= 28;
                  if (ndx < -14) ndx += 28;
                  if (Math.abs(ndx) > 0) dir = ndx > 0 ? "RIGHT" : "LEFT";
                  else if (Math.abs(ndy) > 0) dir = ndy > 0 ? "DOWN" : "UP";
                } else {
                  let fdx = tx - fracX;
                  let fdy = ty - fracY;
                  if (Math.abs(fdx) > Math.abs(fdy)) {
                    dir = fdx > 0 ? "RIGHT" : "LEFT";
                  } else {
                    dir = fdy > 0 ? "DOWN" : "UP";
                  }
                }
              }
              drawRect(targetNode.x * state.tileSizeX, targetNode.y * state.tileSizeY, state.tileSizeX, state.tileSizeY, "rgba(255,100,0,0.5)");
              if (dir && (now - lastCommandTime > 150 || dir !== currentDir)) {
                currentDir = dir;
                lastCommandTime = now;
                sendCommand(dir);
              }
            }
          }
          if (currentPath && currentPath.length > 0) {
            drawLine(
              fracX * state.tileSizeX + state.tileSizeX / 2,
              fracY * state.tileSizeY + state.tileSizeY / 2,
              currentPath[0].x * state.tileSizeX + state.tileSizeX / 2,
              currentPath[0].y * state.tileSizeY + state.tileSizeY / 2,
              "green"
            );
            for (let i = 0; i < currentPath.length - 1; i++) {
              const n1 = currentPath[i];
              const n2 = currentPath[i + 1];
              drawLine(
                n1.x * state.tileSizeX + state.tileSizeX / 2,
                n1.y * state.tileSizeY + state.tileSizeY / 2,
                n2.x * state.tileSizeX + state.tileSizeX / 2,
                n2.y * state.tileSizeY + state.tileSizeY / 2,
                "green"
              );
            }
          }
          for (const n of walkableNodes) {
            if (n.hasPellet) {
              drawRect(n.x * state.tileSizeX + state.tileSizeX / 2 - 2, n.y * state.tileSizeY + state.tileSizeY / 2 - 2, 4, 4, "rgba(255,255,255,0.4)");
            }
          }
        }
        for (const ghost of state.ghosts) {
          drawRect(ghost.rawLeft, ghost.rawTop, 20, 20, ghost.id === "clyde" ? "orange" : "red");
          drawText(ghost.id, ghost.rawLeft, ghost.rawTop - 5, "white");
        }
        requestAnimationFrame(loop);
      }
      window.focus();
      console.log("PacBot Phase 2.2 Started: Fractional Steering");
      requestAnimationFrame(loop);
    }
  });
  require_main();
})();
