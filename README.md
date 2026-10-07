# PacBot - Autoplaying Pacman AI

PacBot is a Chrome Extension that autonomously plays the single-player Pac-Man game at [freepacman.org](https://freepacman.org/). It uses a combination of an underlying maze graph model, A* pathfinding, and direct DOM perception to maneuver through the maze and avoid getting stuck on corners.

## How to Install and Use

Since this is an unpacked extension, you can easily load it into Chrome without having to build anything yourself!

1. **Download the Extension:**
   - Click the green **Code** button at the top right of this repository.
   - Click **Download ZIP**.
   - Extract the downloaded ZIP file to a folder on your computer.

2. **Load into Chrome:**
   - Open Google Chrome and type `chrome://extensions/` in the URL bar.
   - In the top right corner, turn on **Developer mode**.
   - Click the **Load unpacked** button in the top left.
   - Select the `dist` folder located inside the folder you just extracted.

3. **Watch it Play!**
   - Go to [freepacman.org](https://freepacman.org/).
   - Click "Play Game" and let the AI take the wheel! You will see an overlay showing the pathfinding waypoints as it navigates the maze.

## Development

If you'd like to tweak the code or build it yourself:

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Clone this repository.
3. Run `npm install` to install dependencies.
4. Run `npm run build` to compile the TypeScript source files. The newly built files will be placed in the `dist` folder.
