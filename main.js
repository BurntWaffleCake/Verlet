import { Link, Node } from "./Collections.js";

const canvas = document.getElementById("source");
const ctx = canvas.getContext("2d");

function updateCanvasSize() {
  ctx.canvas.width = canvas.clientWidth;
  ctx.canvas.height = canvas.clientHeight;
}
updateCanvasSize();

let t = 0; //time in seconds
function loop(time) {
  // time in milliseconds
  let dt = time / 1000 - t;
  t = time / 1000;
  updateCanvasSize();

  if (minNode) {
    let dx = mousepos.x - minNode.pos.x;
    let dy = mousepos.y - minNode.pos.y;

    minNode.pos.x += 2 * dx * dt;
    minNode.pos.y += 2 * dy * dt;
  }

  calculate(dt);

  render(dt);

  window.requestAnimationFrame(loop);
}
function init() {
  window.requestAnimationFrame(loop);
}

function render(dt) {
  let size = 50;
  for (let node of nodes) {
    node.render(ctx);
  }

  for (let link of links) {
    link.render(ctx);
  }

  if (minNode) {
    ctx.strokeStyle = "rgb(255,0,0)";
    ctx.beginPath();
    ctx.moveTo(mousepos.x, mousepos.y);
    ctx.lineTo(minNode.pos.x, minNode.pos.y);
    ctx.stroke();
  }
}

let length = 500;
let hl = length / 2;

let node = new Node(5, ctx.canvas.width / 2 - hl, ctx.canvas.height / 2 - hl, 0, 0);
let node2 = new Node(5, ctx.canvas.width / 2 + hl, ctx.canvas.height / 2 - hl, 0, 0);
let node3 = new Node(5, ctx.canvas.width / 2 + hl, ctx.canvas.height / 2 + hl, 0, 0);
let node4 = new Node(5, ctx.canvas.width / 2 - hl, ctx.canvas.height / 2 + hl, 0, 0);
// node3.pinned = true;

let nodes = [node, node2, node3, node4];

let link = new Link(node, node2, length);
let link2 = new Link(node2, node3, length);
let link3 = new Link(node3, node4, length);
let link4 = new Link(node4, node, length);

let link5 = new Link(node, node3, Math.sqrt(2 * length ** 2));
let link6 = new Link(node2, node4, Math.sqrt(2 * length ** 2));

let links = [link, link2, link3, link4, link5, link6];

function generateRope(x, y, length, spacing) {
  let ropeNodes = [];
  for (let i = 0; i < length; i++) {
    let node = new Node(5, x + i * spacing, y);
    nodes.push(node);
    ropeNodes.push(node);
  }

  for (let i = 0; i < ropeNodes.length - 1; i++) {
    links.push(new Link(ropeNodes[i], ropeNodes[i + 1], spacing, 2));
  }
}

generateRope(ctx.canvas.width / 2, ctx.canvas.height / 2, 50, 10);

function generateGrid(type, x, y, width, height, spacing = 10, radius = 1, stiffness) {
  let grid = [];
  for (let sy = 0; sy < height; sy++) {
    let row = [];
    for (let sx = 0; sx < width; sx++) {
      let node = new Node(radius, x + sx * spacing, y + sy * spacing);
      node.selectable = false;
      nodes.push(node);
      row.push(node);
    }
    grid.push(row);
  }

  for (let sy = 0; sy < grid.length - 1; sy++) {
    let row = grid[sy];
    let nextRow = grid[sy + 1];
    for (let sx = 0; sx < row.length - 1; sx++) {
      links.push(new Link(row[sx], row[sx + 1], spacing, stiffness));
      links.push(new Link(row[sx], nextRow[sx], spacing, stiffness));
    }
    links.push(new Link(row[row.length - 1], nextRow[nextRow.length - 1], spacing));
  }

  let lastRow = grid[grid.length - 1];
  for (let sx = 0; sx < lastRow.length - 1; sx++) {
    links.push(new Link(lastRow[sx], lastRow[sx + 1], spacing, stiffness));
  }

  switch (type) {
    case "corner-spaced":
      grid[0].forEach((element, index) => {
        if (index % 10 == 0) {
          element.pinned = true;
          element.radius = 5;
          element.selectable = true;
        }
      });

      grid[grid.length - 1].forEach((element, index) => {
        if (index % 10 == 0) {
          element.pinned = true;
          element.radius = 5;
          element.selectable = true;
        }
      });

      grid.forEach((element, index) => {
        if (index % 10 == 0) {
          element[0].pinned = true;
          element[0].radius = 5;
          element[0].selectable = true;
        }
      });

      grid.forEach((element, index) => {
        if (index % 10 == 0) {
          element[element.length - 1].pinned = true;
          element[element.length - 1].radius = 5;
          element[element.length - 1].selectable = true;
        }
      });

      grid[grid.length - 1][grid[0].length - 1].pinned = true;
      grid[grid.length - 1][grid[0].length - 1].radius = 5;
      grid[grid.length - 1][grid[0].length - 1].selectable = true;

      break;
    case "corner":
      grid[0][0].pinned = true;
      grid[0][grid[0].length - 1].pinned = true;
      grid[grid.length - 1][0].pinned = true;
      grid[grid.length - 1][grid[0].length - 1].pinned = true;

      grid[0][0].selectable = true;
      grid[0][grid[0].length - 1].selectable = true;
      grid[grid.length - 1][0].selectable = true;
      grid[grid.length - 1][grid[0].length - 1].selectable = true;
      break;

    case "spaced":
      grid[0].forEach((element, index) => {
        if (index % 10 == 0) {
          element.pinned = true;
          element.selectable = true;
        }
      });

      grid[0][0].pinned = true;
      grid[0][grid[0].length - 1].pinned = true;

      grid[0][0].selectable = true;
      grid[0][grid[0].length - 1].selectable = true;
      break;

    default:
      grid[0].forEach((element, index) => {
        element.pinned = true;
        element.selectable = true;
      });
      break;
  }
}

generateGrid("corner-spaced", 100, 100, 30, 30, 10, 1, 1.5);

function calculate(dt) {
  for (let node of nodes) {
    node.tick(dt, ctx);
    node.constrain(ctx.canvas.width, ctx.canvas.height);
  }

  for (let link of links) {
    link.tick(dt, ctx);
  }
}

init();

const optionsBody = document.getElementById("options-body");
const optionsButton = document.getElementById("options-toggle");
let optionsOpen = false;
optionsButton.onclick = function (event) {
  optionsOpen = !optionsOpen;
  if (optionsOpen) {
    optionsBody.style.display = "block";
  } else {
    optionsBody.style.display = "none";
  }
};

let mousepos = { x: ctx.canvas.width / 2, y: ctx.canvas.height / 2 };
let mousedown = false;
document.addEventListener("mousemove", (event) => {
  mousepos.x = event.clientX;
  mousepos.y = event.clientY;
});

let minNode = undefined;
document.addEventListener("mousedown", (event) => {
  mousedown = true;

  let minDis = Number.MAX_SAFE_INTEGER;
  for (let node of nodes) {
    if (!node.selectable && event.buttons == 2) {
      continue;
    }
    let dx = mousepos.x - node.pos.x;
    let dy = mousepos.y - node.pos.y;
    let dis = Math.sqrt(dx * dx + dy * dy);
    if (dis < minDis) {
      minNode = node;
      minDis = dis;
    }
  }
});

document.addEventListener("mouseup", (event) => {
  minNode = undefined;
  mousedown = false;
});

document.oncontextmenu = function () {
  return false;
};

document.onkeydown = function (event) {
  console.log(event);
  if (event.key == " " && minNode) {
    minNode.pinned = !minNode.pinned;
  }
};
