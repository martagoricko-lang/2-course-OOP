export class Shape {
  constructor(type, x1, y1, x2, y2) {
    this.type = type;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  draw(ctx, isTemporary = false) {}

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

  draw(ctx, isTemporary = false) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x1, this.y1, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export class LineShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("line", x1, y1, x2, y2);
  }

  draw(ctx, isTemporary = false) {
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

  draw(ctx, isTemporary = false) {
    const startX = Math.min(this.x1, this.x2);
    const startY = Math.min(this.y1, this.y2);
    const width = Math.abs(this.x2 - this.x1);
    const height = Math.abs(this.y2 - this.y1);

    if (!isTemporary) {
      ctx.fillStyle = "yellow";
      ctx.strokeStyle = "black";
      ctx.fillRect(startX, startY, width, height);
    }

    ctx.strokeRect(startX, startY, width, height);
  }
}

export class CircleShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("circle", x1, y1, x2, y2);
  }

  draw(ctx, isTemporary = false) {
    const radius = Math.sqrt(
      Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2),
    );

    if (!isTemporary) {
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.arc(this.x1, this.y1, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(this.x1, this.y1, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}

export class LineWithCirclesShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("line_circles", x1, y1, x2, y2);
    this.line = new LineShape(x1, y1, x2, y2);
    this.circle1 = new CircleShape(x1, y1, x1 + 5, y1 + 5);
    this.circle2 = new CircleShape(x2, y2, x2 + 5, y2 + 5);
  }

  draw(ctx, isTemporary = false) {
    this.line.x1 = this.x1;
    this.line.y1 = this.y1;
    this.line.x2 = this.x2;
    this.line.y2 = this.y2;
    this.line.draw(ctx, isTemporary);

    this.circle1.x1 = this.x1;
    this.circle1.y1 = this.y1;
    this.circle1.x2 = this.x1 + 5;
    this.circle1.y2 = this.y1 + 5;

    this.circle2.x1 = this.x2;
    this.circle2.y1 = this.y2;
    this.circle2.x2 = this.x2 + 5;
    this.circle2.y2 = this.y2 + 5;

    this.circle1.draw(ctx, isTemporary);
    this.circle2.draw(ctx, isTemporary);
  }
}

export class CubeShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super("cube", x1, y1, x2, y2);
    this.rectFront = new RectangleShape(x1, y1, x2, y2);
    this.rectBack = new RectangleShape(x1, y1, x2, y2);
  }

  draw(ctx, isTemporary = false) {
    const startX = Math.min(this.x1, this.x2);
    const startY = Math.min(this.y1, this.y2);
    const w = Math.abs(this.x2 - this.x1);
    const h = Math.abs(this.y2 - this.y1);
    const shift = Math.min(w, h) * 0.35;

    this.rectFront.x1 = this.x1;
    this.rectFront.y1 = this.y1;
    this.rectFront.x2 = this.x2;
    this.rectFront.y2 = this.y2;
    this.rectFront.draw(ctx, true);

    this.rectBack.x1 = this.x1 + shift;
    this.rectBack.y1 = this.y1 - shift;
    this.rectBack.x2 = this.x2 + shift;
    this.rectBack.y2 = this.y2 - shift;
    this.rectBack.draw(ctx, true);

    const connLines = [
      new LineShape(startX, startY, startX + shift, startY - shift),
      new LineShape(startX + w, startY, startX + w + shift, startY - shift),
      new LineShape(startX, startY + h, startX + shift, startY + h - shift),
      new LineShape(
        startX + w,
        startY + h,
        startX + w + shift,
        startY + h - shift,
      ),
    ];

    connLines.forEach((l) => l.draw(ctx, isTemporary));
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
    case "circle":
      return new CircleShape(data.x1, data.y1, data.x2, data.y2);
    case "line_circles":
      return new LineWithCirclesShape(data.x1, data.y1, data.x2, data.y2);
    case "cube":
      return new CubeShape(data.x1, data.y1, data.x2, data.y2);
    default:
      return null;
  }
}
