import {
  PointShape,
  LineShape,
  RectangleShape,
  EllipseShape,
  LineWithCirclesShape,
  CubeShape,
} from "./shapes";

export class MyEditor {
  static instance = null;

  constructor(N = 106) {
    if (MyEditor.instance) {
      return MyEditor.instance;
    }
    this.N = N;
    this.pcshape = [];
    this.tempShape = null;
    MyEditor.instance = this;
  }

  static getInstance(N = 106) {
    if (!MyEditor.instance) {
      MyEditor.instance = new MyEditor(N);
    }
    return MyEditor.instance;
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

  removeShapeAt(index) {
    if (index >= 0 && index < this.pcshape.length) {
      this.pcshape.splice(index, 1);
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

  exportToCSV() {
    return this.pcshape.map((s) => s.toCSV()).join("\n");
  }
}

export const globalEditor = MyEditor.getInstance(106);
