let grid;
let cols;
let rows;
const RESOLUTION = 30; // Size of each cell
let speed = 30; // Amount of frames until next step
let paused = false;
//let lastToggledCell;

let money = 50;
let selectedCells = [];
let generationsToSim = 0;
let generationsSimmed = 0;
let betButton;
let betAmountSlider;

function setup() {
  createCanvas(windowWidth - (RESOLUTION * 2), windowHeight - (RESOLUTION * 2));
  cols = floor(width / RESOLUTION - 2);
  rows = floor(height / RESOLUTION - 4);

  betButton = createButton("Bet");
  betButton.position(RESOLUTION + 10, height - (RESOLUTION * 3));
  betButton.mousePressed(bet);
  betAmountSlider = createSlider(1, money, 1);
  betAmountSlider.position(RESOLUTION + 60, height - (RESOLUTION * 3));

  grid = make2DArray(cols, rows);
  randomizeGrid();

  lastToggledCell = createVector(-1, -1);
}

function draw() {
  background(240); // Light gray background

  drawGrid(grid);

  if(frameCount % speed == 0 && !paused && generationsSimmed < generationsToSim) {
    grid = updateGrid(grid);
    generationsSimmed++;
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
      stroke(0, 0, 0);
      strokeWeight(1);
      if(cellSelected) {
        stroke(255, 0, 150);
        strokeWeight(4);
        if(g[i][j] == 0) {
          fill("#fb369f");
        } else {
          fill("#910048ff");
        } 
      } else {
        if(g[i][j] == 0) {
          fill("white");
        } else {
          fill("black");
        }
      }

      square((i + 1) * RESOLUTION, (j + 1) * RESOLUTION, RESOLUTION);
    }
  }
}

function drawUI() {
  textSize(32);
  strokeWeight(1);
  stroke(0, 0, 0)
  fill("black");
  text("$" + money + "            " + betAmountSlider.value() + "\nSelected Cells: " + selectedCells.length, 0, height - 50);
}

function bet() {
  let bet = betAmountSlider.value();
  money -= bet;
  //generationsSimmed = 0;
  generationsToSim += 10;
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
  if(x >= 0 && y >= 0 && x < grid.length && y < grid[0].length) {
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
