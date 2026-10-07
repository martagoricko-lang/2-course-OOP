export class Shape {
  constructor(type, x1, y1, x2, y2) {
    this.type = type;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  draw(ctx) {}

  toJSON() {
    return {
      type: this.type,
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
    };
  }
}

export class PointShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("point", x1, y1, x2, y2);
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x1, this.y1, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export class LineShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("line", x1, y1, x2, y2);
  }

  draw(ctx) {
    ctx.strokeStyle = "black";
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}

export class RectangleShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("rect", x1, y1, x2, y2);
  }

  draw(ctx) {
    const startX = Math.min(this.x1, this.x2);
    const startY = Math.min(this.y1, this.y2);
    const width = Math.abs(this.x2 - this.x1);
    const height = Math.abs(this.y2 - this.y1);

    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.fill();
    ctx.stroke();
  }
}

export class EllipseShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("ellipse", x1, y1, x2, y2);
  }

  draw(ctx) {
    const rx = Math.abs(this.x2 - this.x1);
    const ry = Math.abs(this.y2 - this.y1);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.ellipse(this.x1, this.y1, rx, ry, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}

export function createShapeFromJSON(data) {
  switch (data.type) {
    case "point":
      return new PointShape(data.x1, data.y1, data.x2, data.y2);
    case "line":
      return new LineShape(data.x1, data.y1, data.x2, data.y2);
    case "rect":
      return new RectangleShape(data.x1, data.y1, data.x2, data.y2);
    case "ellipse":
    case "circle":
      return new EllipseShape(data.x1, data.y1, data.x2, data.y2);
    default:
      return null;
  }
}
