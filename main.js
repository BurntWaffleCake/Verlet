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

  if (mousedown) {
    let minNode = null;
    let minDis = Number.MAX_VALUE;
    let mindx = 0;
    let mindy = 0;
    for (let node of nodes) {
      let dx = mousepos.x - node.pos.x;
      let dy = mousepos.y - node.pos.y;
      let dis = Math.sqrt(dx * dx + dy * dy);
      console.log(dis);
      if (minDis > dis) {
        minNode = node;
        minDis = dis;
        mindx = dx;
        mindy = dy;
      }
    }

    minNode.pos.x += mindx * dt;
    minNode.pos.y += mindy * dt;
  }
  // for (let dti = dt / 6; dti < dt; dti += dt / 6) {
  calculate(dt);
  // }
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
}

let node = new Node(5, ctx.canvas.width / 2 - 50, ctx.canvas.height / 2 - 50, 0, 0);
let node2 = new Node(5, ctx.canvas.width / 2 + 50, ctx.canvas.height / 2 - 50, 0, 0);
let node3 = new Node(5, ctx.canvas.width / 2 + 50, ctx.canvas.height / 2 + 50, 0, 0);
let node4 = new Node(5, ctx.canvas.width / 2 - 50, ctx.canvas.height / 2 + 50, 0, 0);
// node3.pinned = true;

let nodes = [node, node2, node3, node4];

let link = new Link(node, node2, 100);
let link2 = new Link(node2, node3, 100);
let link3 = new Link(node3, node4, 100);
let link4 = new Link(node4, node, 100);

let link5 = new Link(node, node3, 141.42135623);
let link6 = new Link(node2, node4, 141.42135623);

let links = [link, link2, link3, link4, link5, link6];

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

document.addEventListener("mousedown", (event) => {
  mousedown = true;
});

document.addEventListener("mouseup", (event) => {
  mousedown = false;
});
