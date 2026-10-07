import {
  PointShape,
  LineShape,
  RectangleShape,
  EllipseShape,
  LineWithCirclesShape,
  CubeShape,
} from "./shapes";

class MyEditor {
  constructor(N = 106) {
    this.N = N;
    this.pcshape = [];
    this.tempShape = null;
  }

  clear() {
    this.pcshape = [];
    this.tempShape = null;
  }

  addShape(shape) {
    if (this.pcshape.length < this.N) {
      this.pcshape.push(shape);
      return true;
    }
    return false;
  }

  createShape(tool, x1, y1, x2, y2) {
    switch (tool) {
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
}

export const globalEditor = new MyEditor(106);
