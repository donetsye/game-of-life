const rows = 30;
const cols = 30;
const gridElement = document.getElementById('grid');
let generation = 0;

let interval = null;

//creating checkbox table
for (let r = 0; r < rows; r++) {
    const row = document.createElement('tr');
    for (let c = 0; c < cols; c++) {
        const cell = document.createElement('td');
        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';
        checkbox.id = `cell-${r}-${c}`;

        // manual click stops animation to add eventually more then one alive cell
        checkbox.addEventListener('change', () => {
            stop()
        });   
        //it's safer? to use addEventListeners() as it doesn't replace other listeners attached on the same event
        /*
        checkbox.onchange = () => {
            stop();
        } */

        cell.appendChild(checkbox);
        row.appendChild(cell);
    }
    gridElement.appendChild(row);
}

function getCurrentState() {
    const state = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const checkbox = document.getElementById(`cell-${r}-${c}`);
            if(checkbox.checked){
                row.push(1);
            } else {
                row.push(0);
            }
        }
        state.push(row);
    }
    return state;
}


function setState(state) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
        const checkbox = document.getElementById(`cell-${r}-${c}`);
        checkbox.checked = state[r][c] == 1;
        }
    }
}
/*
(-1, -1) (-1, 0) (-1, 1)
 (0, -1)  (0, 0) (1, 1)
 (1, -1)  (1, 0) (1, 1)
*/

function countNeighbors(state, x, y) {
   let count = 0;
   for (let horz = -1; horz <= 1; horz++) {
        for (let vert = -1; vert <= 1; vert++) {
            if (horz === 0 && vert === 0) continue;  //the main cell for which we are counting neighbors

            const newRow = x + horz;
            const newCol = y + vert;
            if(newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols){
                count += state[newRow][newCol]
            }
        }
    }
    return count;
}

function nextGeneration() {
    const current = getCurrentState();
    const next = [];
    for (let r = 0; r < rows; r++) {
        const row = [];

        for (let c = 0; c < cols; c++) {
            const neighbors = countNeighbors(current, r, c);
            const alive = current[r][c];

            if (alive && (neighbors === 2 || neighbors === 3)) { //any live cell with 2 or 3 live neighbours lives on 
                row.push(1);
            } else if (!alive && neighbors === 3) { //any dead cell with exactly three live neighbours becomes a live cell
                row.push(1);
            } else {
                row.push(0); // dies by overpopulation (more than 3 live cells-n) or underpopulation (fewer than two live cells-n)
            }
        }
        next.push(row);
    }
    setState(next);
    generation++;

    document.getElementById('alive').textContent = countAlive();
    document.getElementById('generation').textContent = generation;
}

function start() {
    if (!interval) {
        interval = setInterval(nextGeneration, 100);
    }
}

function stop() {
    clearInterval(interval);
    interval = null;
}

function clearGrid() {
    generation = 0;
    aliveCells = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const checkbox = document.getElementById(`cell-${r}-${c}`);
            checkbox.checked = false;
        }
    }
    document.getElementById('generation').textContent = generation;
    document.getElementById('alive').textContent = aliveCells;
}

function randomGrid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const checkbox = document.getElementById(`cell-${r}-${c}`);
          checkbox.checked = Math.random() < 0.2; //how many of checkboxes will be checked, density
        }
    }
}

function countAlive() {
    let aliveCells = 0;
    for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const checkbox = document.getElementById(`cell-${r}-${c}`);
                if(checkbox.checked){
                    aliveCells++;
                }
            }
        }
    return aliveCells;
}