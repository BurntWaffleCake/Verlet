export class Node {
  constructor(radius = 10, x, y, dx, dy) {
    this.radius = radius;
    this.pos = { x: x, y: y };
    this.posPrev = { x: x - dx, y: y - dy };
    this.a = { x: dx, y: dy };
  }

  render(ctx) {
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  tick(dt) {
    console.log(this.pos, this.posPrev);
    let Velx = this.pos.x - this.posPrev.x; // + this.a.x * dt ** 2;
    let Vely = this.pos.y - this.posPrev.y; // + this.a.y * dt ** 2;

    // this.pos.x += this.pos.x - this.posPrev.x;
    // this.pos.y += this.pos.y - this.posPrev.y;

    this.posPrev.x = this.pos.x;
    this.posPrev.y = this.pos.y;
    this.pos.x += Velx;
    this.pos.y += Vely;
  }
}

class Link {
  constructor(nodeA, nodeB) {}
}

export class Collection {
  constructor(nodes = [], links = []) {
    this.nodes = nodes;
    this.links = links;
  }
}
