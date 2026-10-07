let grid;
let cols;
let rows;
const RESOLUTION = 30; // Size of each cell
let speed = 3; // Amount of frames until next step
let paused = true;
//let lastToggledCell;

let selectedCells = [];
let generationsToSim = 10;

function setup() {
  createCanvas(windowWidth - (RESOLUTION * 2), windowHeight - (RESOLUTION * 2));
  cols = floor(width / RESOLUTION - 2);
  rows = floor(height / RESOLUTION - 4);

  grid = make2DArray(cols, rows);
  randomizeGrid();

  lastToggledCell = createVector(-1, -1);
}

function draw() {
  background(240); // Light gray background

  drawGrid(grid);

  if(frameCount % speed == 0 && !paused) {
    grid = updateGrid(grid);
  }

  drawUI();
}

function updateGrid(g) {
  let bufferGrid = make2DArray(cols, rows);
  for(let i = 0; i < g.length; i++) {
    for(let j = 0; j < g[i].length; j++) {
      let neighbors = countNeighbors(g, i, j);
      if(neighbors < 2 && g[i][j] == 1) {
        bufferGrid[i][j] = 0;
      }
      if((neighbors == 2 || neighbors == 3) && g[i][j] == 1) {
        bufferGrid[i][j] = 1;
      }
      if(neighbors > 3 && g[i][j] == 1) {
        bufferGrid[i][j] = 0;
      }
      if((neighbors == 3) && g[i][j] == 0) {
        bufferGrid[i][j] = 1;
      }
    }
  }
  return bufferGrid;
}

function drawGrid(g) {
  for(let i = 0; i < g.length; i++) {
    for(let j = 0; j < g[i].length; j++) {
      let cellSelected = false;
      for(let cell of selectedCells) {
        if(cell.x == i && cell.y == j) {
          cellSelected = true;
        }
      }
      if(cellSelected) {
        if(g[i][j] == 0) {
          fill("#ffff00");
        } else {
          fill("#808000");
        } 
      } else {
        if(g[i][j] == 0) {
          fill("white");
        } else {
          fill("black");
        }
      }

      rect((i + 1) * RESOLUTION, (j + 1) * RESOLUTION, RESOLUTION, RESOLUTION);
    }
  }
}

function drawUI() {
  textSize(32);
  fill("black");
  text("asdfkjlhadsfkljh", 0, height);
}

// --- INTERACTIVE CONTROLS ---

// 1. Click or Drag to Draw
function mousePressed() {
  selectCell(floor((mouseX - RESOLUTION) / RESOLUTION), floor((mouseY - RESOLUTION) / RESOLUTION));
}

function mouseDragged() {
  let x = floor((mouseX - RESOLUTION) / RESOLUTION);
  let y = floor((mouseY - RESOLUTION) / RESOLUTION);
  if(!(x == lastToggledCell.x && y == lastToggledCell.y)) {
    selectCell(x, y);
  }
}

function toggleCell(x, y) {
  grid[x][y] = 1 - grid[x][y];
  lastToggledCell = createVector(x, y);
}

function selectCell(x, y) {
  let hasTheForLoopFoundACellInTheArrayOfCellsThatHaveAlreadyBeenSelectedThatMatchesTheCellThatTheUserHasJustTriedToSelectTM = false;
  for(let i = 0; i < selectedCells.length; i++) {
    if(selectedCells[i].x == x && selectedCells[i].y == y) {
      selectedCells.splice(i, 1);
      hasTheForLoopFoundACellInTheArrayOfCellsThatHaveAlreadyBeenSelectedThatMatchesTheCellThatTheUserHasJustTriedToSelectTM = true;
      break;
    }
  }
  if(!hasTheForLoopFoundACellInTheArrayOfCellsThatHaveAlreadyBeenSelectedThatMatchesTheCellThatTheUserHasJustTriedToSelectTM) {
    selectedCells.push(createVector(x, y));
  }
  lastToggledCell = createVector(x, y);
}

// 2. Keyboard Controls
function keyPressed() {
  if((keyCode == 187 || key == "=") && speed > 1 && !paused) {
    speed--;
  } else if((keyCode == 189 || key == "-") && !paused) {
    speed++;
  } else if(keyCode == 32) {
    paused = !paused;
  } else if(key == "c") {
    grid = make2DArray(cols, rows);
  } else if(key == "r") {
    randomizeGrid();
  }
}

// --- HELPER FUNCTIONS ---

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

function randomizeGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}

function countNeighbors(g, x, y) {
  let neighbors = 0;
  for(let i = x - 1; i <= x + 1; i++) {
    for(let j = y - 1; j <= y + 1; j++) {
      if(i >= 0 && j >= 0 && i < g.length && j < g[0].length) {
        if(g[i][j] == 1 && !(i == x && j == y)) {
            neighbors++;
        }
      }
    }
  }
  return neighbors;
}
