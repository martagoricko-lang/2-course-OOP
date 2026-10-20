export class MyEditor {
  constructor() {
    this.shapes = [];
    this.maxCount = 106;
  }

  addShape(shape) {
    if (this.shapes.length < this.maxCount) {
      this.shapes.push(shape);
    } else {
      alert(`Досягнуто ліміт масиву об'єктів (${this.maxCount})!`);
    }
  }

  clear() {
    this.shapes = [];
  }

  getShapes() {
    return this.shapes;
  }

  setShapes(shapes) {
    this.shapes = shapes;
  }
}

export const globalMyEditor = new MyEditor();
