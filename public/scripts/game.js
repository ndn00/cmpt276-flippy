var row = 22;
var col = 45;

var sol_matrix = [];
var matrix = []

var rowFilledCount = [];
var colFilledCount = [];

var cells = [];

var begin = false;
var timing = false;

var timeElapsed = 0;

var reveal = false;

var dark = false;

newTable();


function initMatrices() {
  var cnt = 0;
  var cnt2 = 0;
  sol_matrix = [];
  matrix = [];
  for (cnt = 0; cnt < row; cnt++) {
    let r_sm = [];
    let r_m = [];
    for (cnt2 = 0; cnt2 < col; cnt2++) {
      r_sm.push(Math.floor(Math.random() * 2));
      r_m.push(0);
    }
    sol_matrix.push(r_sm);
    matrix.push(r_m);
  }
}
function initFilledCounts() {
  var cnt, cnt2;
  rowFilledCount = [];
  colFilledCount = [];
  for (cnt = 0; cnt < row; cnt++) {
    let filled = 0;
    let strips = [];
    for (cnt2 = 0; cnt2 < col; cnt2++) {
      if (sol_matrix[cnt][cnt2])
        filled++;
      else if (filled) {
        strips.push(filled);
        filled = 0;
      }
    }
    if (filled)
      strips.push(filled);
    rowFilledCount.push(strips);
  }
  for (cnt2 = 0; cnt2 < col; cnt2++) {
    let filled = 0;
    let strips = [];
    for (cnt = 0; cnt < row; cnt++) {
      if (sol_matrix[cnt][cnt2])
        filled++;
      else if (filled) {
        strips.push(filled);
        filled = 0;
      }
    }
    if (filled)
      strips.push(filled);
    colFilledCount.push(strips);
  }
}
function drawTable() {
  console.log("drawing table");
  var table = document.getElementById("tb");
  // row 1
  var head_row = table.insertRow();
  head_row.appendChild(document.createElement("th"));
  for (var list of colFilledCount) {
    let th = document.createElement("th");
    let text = document.createTextNode(list.join(" "));
    th.classList.add("rhead");
    th.appendChild(text);
    head_row.appendChild(th);
  }
  // other rows
  var cell_id = 0;
  var r = 0;
  for (var list of rowFilledCount) {
    let row = table.insertRow();
    let th = document.createElement("th");
    let text = document.createTextNode(list.join(" "));
    th.classList.add("chead");
    th.appendChild(text);
    row.appendChild(th);
    for (var cell of matrix[r]) {
      let td = document.createElement("td");
      td.id = cell_id;
      td.classList.add("cell");
      cell_id++;
      if (cell) td.classList.add("filled");
      row.appendChild(td);
    }
    r++;
  }
}
function toggleCell(id) {
  matrix[Math.floor(id / col)][id % col] = matrix[Math.floor(id / col)][id % col] ? 0 : 1;
  document.getElementById(id).classList.toggle("filled");
  if (checkSolution()) {
    begin = false;
    endGame();
  }
}
function zeroCell(id) {
  matrix[Math.floor(id / col)][id % col] = 0;
  document.getElementById(id).classList.remove("filled");
}
function resetBoard() {
  for (var cell of cells) {
    zeroCell(cell.id);
  }
}
function revealSolution() {
  reveal = true;
  var cnt, cnt2;
  for (cnt = 0; cnt < row; cnt++) {
    for (cnt2 = 0; cnt2 < col; cnt2++) {
      if (matrix[cnt][cnt2] != sol_matrix[cnt][cnt2])
        toggleCell(cnt2 + col * cnt);
    }
  }
}
function checkSolution() {
  var cnt, cnt2;
  for (cnt = 0; cnt < row; cnt++) {
    for (cnt2 = 0; cnt2 < col; cnt2++) {
      if (matrix[cnt][cnt2] != sol_matrix[cnt][cnt2])
        return false;
    }
  }
  return true;
}
function endGame() {
  if (reveal) {
    window.alert("(ლ `Д ́ )ლ Hark!!! You forfeited (ლ `Д ́ )ლ");
    reveal = false;
  }
  else
    window.alert("(ﾉ｡･ω･)ﾉ Hasta la vista…baby! Solved in " + formatTime(timeElapsed) + " ヽ(･ω･｡ヽ)");
}
function formatTime(time) {
  return Math.floor(((time) % (1000 * 60 * 60)) / (1000 * 60)) + "m "
    + Math.floor((time % (1000 * 60)) / 1000) + "s";
}
function updateClock() {
  var p = document.getElementById("timer");
  p.innerHTML = formatTime(timeElapsed);
}
function initTimer(start) {
  if (!timing) {
    timing = true;
    var i = setInterval(
      () => {
        timeElapsed = Date.now() - start;
        if (!begin) {
          clearInterval(i);
          timeElapsed = 0;
          timing = false;
        }
        updateClock();
      }, 1000
    )
  }
}

function newTable() {
  begin = false;
  timing = false;
  initMatrices();
  initFilledCounts();
  removeTable();
  drawTable();
  updateCells();
}

function removeTable() {
  document.getElementById("tb").textContent = "";
}

function updateCells() {
  cells = document.getElementsByClassName("cell");
}

// event handlers
function handle_cell(evt) {
  console.log(this.id);
  toggleCell(this.id);
}
function handle_mousedown(evt) {
  toggleCell(this.id);
  for (var cell of cells) {
    cell.addEventListener('mouseover', handle_cell);
  }
}
function handle_mouseup(evt) {
  for (var cell of cells) {
    cell.removeEventListener('mouseover', handle_cell);
  }
}
function handle_reset_button(evt) {
  resetBoard();
}
function handle_solution_button(evt) {
  revealSolution();
}
function handle_form() {
  var c = document.getElementById("col-input").value;
  var r = document.getElementById("row-input").value;
  if (isNaN(c) || isNaN(r)) {
    window.alert("Invalid Values");
  }
  else {
    console.log(c + " " + r);
    col = c;
    row = r;
    newTable();
  }
}
function handle_start() {
  addCellsEventListeners();
  begin = true;
  timeElapsed = 0;
  initTimer(Date.now());
}
function handle_toggle() {
  dark = dark ? false : true;
  document.getElementById("theme").setAttribute("href", dark ? "/stylesheets/dark.css" : "/stylesheets/game.css");
}

// event listeners
function addCellsEventListeners() {
  for (var cell of cells) {
    cell.addEventListener('mousedown', handle_mousedown);
    cell.addEventListener('mouseup', handle_mouseup);
  }
}
document.getElementById("reset").addEventListener('click', handle_reset_button)
document.getElementById("solution").addEventListener('click', handle_solution_button)
