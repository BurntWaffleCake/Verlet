import { Node } from "./Collections.js";

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
  calculate(dt);
  render(dt);

  window.requestAnimationFrame(loop);
}

function init() {
  window.requestAnimationFrame(loop);
}

function render(dt) {
  let size = 50;
  node.render(ctx);
}

let node = new Node(10, ctx.canvas.width / 2, ctx.canvas.height / 2, 1, 0);
console.log(node);

function calculate(dt) {
  node.tick(dt);
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
