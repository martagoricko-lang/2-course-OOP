export class Shape {
  constructor(type, x1, y1, x2, y2) {
    this.type = type;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.isSelected = false;
  }

  draw(ctx) {}

  getTypeName() {
    switch (this.type) {
      case "point":
        return "Точка";
      case "line":
        return "Лінія";
      case "rect":
        return "Прямокутник";
      case "ellipse":
        return "Еліпс";
      case "lineWithCircles":
        return "Лінія з кружечками";
      case "cube":
        return "Каркас куба";
      default:
        return this.type;
    }
  }

  toCSV() {
    return `${this.type},${Math.round(this.x1)},${Math.round(this.y1)},${Math.round(this.x2)},${Math.round(this.y2)}`;
  }

  drawSelection(ctx) {
    if (!this.isSelected) return;
    const startX = Math.min(this.x1, this.x2) - 5;
    const startY = Math.min(this.y1, this.y2) - 5;
    const w = Math.abs(this.x2 - this.x1) + 10;
    const h = Math.abs(this.y2 - this.y1) + 10;

    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(startX, startY, w || 10, h || 10);
    ctx.restore();
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
    this.drawSelection(ctx);
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
    this.drawSelection(ctx);
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
    this.drawSelection(ctx);
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
    this.drawSelection(ctx);
  }
}

export class LineWithCirclesShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("lineWithCircles", x1, y1, x2, y2);
    this.line = new LineShape(x1, y1, x2, y2);
    this.circle1 = new EllipseShape(x1, y1, x1 + 5, y1 + 5);
    this.circle2 = new EllipseShape(x2, y2, x2 + 5, y2 + 5);
  }

  draw(ctx) {
    this.line.x1 = this.x1;
    this.line.y1 = this.y1;
    this.line.x2 = this.x2;
    this.line.y2 = this.y2;
    this.line.draw(ctx);

    this.circle1.x1 = this.x1;
    this.circle1.y1 = this.y1;
    this.circle1.x2 = this.x1 + 6;
    this.circle1.y2 = this.y1 + 6;
    this.circle1.draw(ctx);

    this.circle2.x1 = this.x2;
    this.circle2.y1 = this.y2;
    this.circle2.x2 = this.x2 + 6;
    this.circle2.y2 = this.y2 + 6;
    this.circle2.draw(ctx);

    this.drawSelection(ctx);
  }
}

export class CubeShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("cube", x1, y1, x2, y2);
  }

  draw(ctx) {
    const startX = Math.min(this.x1, this.x2);
    const startY = Math.min(this.y1, this.y2);
    const w = Math.abs(this.x2 - this.x1);
    const h = Math.abs(this.y2 - this.y1);
    const offset = Math.min(w, h) * 0.35;

    const p1 = { x: startX, y: startY };
    const p2 = { x: startX + w, y: startY };
    const p3 = { x: startX + w, y: startY + h };
    const p4 = { x: startX, y: startY + h };

    const p5 = { x: startX + offset, y: startY - offset };
    const p6 = { x: startX + w + offset, y: startY - offset };
    const p7 = { x: startX + w + offset, y: startY + h - offset };
    const p8 = { x: startX + offset, y: startY + h - offset };

    ctx.strokeStyle = "black";
    ctx.setLineDash([]);
    ctx.strokeRect(startX, startY, w, h);
    ctx.strokeRect(p5.x, p5.y, w, h);

    const connectingLines = [
      new LineShape(p1.x, p1.y, p5.x, p5.y),
      new LineShape(p2.x, p2.y, p6.x, p6.y),
      new LineShape(p3.x, p3.y, p7.x, p7.y),
      new LineShape(p4.x, p4.y, p8.x, p8.y),
    ];

    connectingLines.forEach((line) => line.draw(ctx));
    this.drawSelection(ctx);
  }
}

export function createShapeFromCSV(line) {
  const parts = line.split(",");
  if (parts.length < 5) return null;
  const type = parts[0].trim();
  const x1 = parseFloat(parts[1]);
  const y1 = parseFloat(parts[2]);
  const x2 = parseFloat(parts[3]);
  const y2 = parseFloat(parts[4]);

  switch (type) {
    case "point":
      return new PointShape(x1, y1, x2, y2);
    case "line":
      return new LineShape(x1, y1, x2, y2);
    case "rect":
      return new RectangleShape(x1, y1, x2, y2);
    case "ellipse":
      return new EllipseShape(x1, y1, x2, y2);
    case "lineWithCircles":
      return new LineWithCirclesShape(x1, y1, x2, y2);
    case "cube":
      return new CubeShape(x1, y1, x2, y2);
    default:
      return null;
  }
}
