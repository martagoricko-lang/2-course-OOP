export class Shape {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  draw(ctx) {}
}

export class PointShape extends Shape {
  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x1, this.y1, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export class LineShape extends Shape {
  draw(ctx) {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}

export class RectangleShape extends Shape {
  draw(ctx) {
    const width = Math.abs(this.x2 - this.x1) * 2;
    const height = Math.abs(this.y2 - this.y1) * 2;
    const startX = this.x1 - width / 2;
    const startY = this.y1 - height / 2;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(startX, startY, width, height);
    ctx.strokeRect(startX, startY, width, height);
  }
}

export class EllipseShape extends Shape {
  draw(ctx) {
    const centerX = (this.x1 + this.x2) / 2;
    const centerY = (this.y1 + this.y2) / 2;
    const radiusX = Math.abs(this.x2 - this.x1) / 2;
    const radiusY = Math.abs(this.y2 - this.y1) / 2;

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
