import React, { useState, useRef, useEffect } from "react";
import { globalMyEditor } from "./MyEditor";
import {
  PointShape,
  LineShape,
  RectangleShape,
  CircleShape,
  LineWithCirclesShape,
  CubeShape,
  createShapeFromJSON,
} from "./shapes";
import "./App.css";

function App() {
  const [currentTool, setCurrentTool] = useState("point");
  const [openMenu, setOpenMenu] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const redrawCanvas = (tempShape) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    globalMyEditor.getShapes().forEach((shape) => shape.draw(ctx));

    if (isDrawing && tempShape) {
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.fillStyle = "transparent";
      ctx.setLineDash([6, 6]);

      tempShape.draw(ctx, true);

      ctx.restore();
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, []);

  const createShapeInstance = (tool, x1, y1, x2, y2) => {
    switch (tool) {
      case "point":
        return new PointShape(x1, y1, x2, y2);
      case "line":
        return new LineShape(x1, y1, x2, y2);
      case "rect":
        return new RectangleShape(x1, y1, x2, y2);
      case "circle":
        return new CircleShape(x1, y1, x2, y2);
      case "line_circles":
        return new LineWithCirclesShape(x1, y1, x2, y2);
      case "cube":
        return new CubeShape(x1, y1, x2, y2);
      default:
        return null;
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setIsDrawing(true);

    if (currentTool === "point") {
      globalMyEditor.addShape(new PointShape(x, y, x, y));
      redrawCanvas();
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || currentTool === "point") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tempShape = createShapeInstance(
      currentTool,
      startPos.x,
      startPos.y,
      x,
      y,
    );
    redrawCanvas(tempShape);
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || currentTool === "point") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(false);

    const finalShape = createShapeInstance(
      currentTool,
      startPos.x,
      startPos.y,
      x,
      y,
    );
    if (finalShape) {
      globalMyEditor.addShape(finalShape);
    }

    redrawCanvas();
  };

  const handleClearCanvas = () => {
    globalMyEditor.clear();
    redrawCanvas();
    setOpenMenu(null);
  };

  const handleSaveToFile = () => {
    const dataToSave = globalMyEditor
      .getShapes()
      .map((shape) => shape.toJSON());
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "shapes_lab4.json";
    a.click();
    URL.revokeObjectURL(url);
    setOpenMenu(null);
  };

  const handleOpenFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        if (Array.isArray(parsedData)) {
          const loadedShapes = parsedData
            .map((data) => createShapeFromJSON(data))
            .filter((s) => s !== null);

          globalMyEditor.setShapes(loadedShapes);
          redrawCanvas();
        }
      } catch (err) {
        alert("Помилка зчитування файлу!");
      }
    };
    reader.readAsText(file);
    setOpenMenu(null);
  };

  return (
    <div className="app-container">
      <header className="window-header">OOP_lab4</header>

      <nav className="menu-bar">
        <div className="dropdown">
          <button
            className={`menu-btn ${openMenu === "file" ? "active" : ""}`}
            onClick={() => setOpenMenu(openMenu === "file" ? null : "file")}
          >
            Файл ▾
          </button>
          {openMenu === "file" && (
            <div className="dropdown-menu">
              <button onClick={() => fileInputRef.current.click()}>
                Відкрити...
              </button>
              <button onClick={handleSaveToFile}>Зберегти як...</button>
              <button onClick={handleClearCanvas}>Очистити</button>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button
            className={`menu-btn ${openMenu === "objects" ? "active" : ""}`}
            onClick={() =>
              setOpenMenu(openMenu === "objects" ? null : "objects")
            }
          >
            Об'єкти ▾
          </button>
          {openMenu === "objects" && (
            <div className="dropdown-menu">
              <button
                onClick={() => {
                  setCurrentTool("point");
                  setOpenMenu(null);
                }}
              >
                {currentTool === "point" ? "✓ " : ""}Крапка
              </button>
              <button
                onClick={() => {
                  setCurrentTool("line");
                  setOpenMenu(null);
                }}
              >
                {currentTool === "line" ? "✓ " : ""}Лінія
              </button>
              <button
                onClick={() => {
                  setCurrentTool("rect");
                  setOpenMenu(null);
                }}
              >
                {currentTool === "rect" ? "✓ " : ""}Прямокутник
              </button>
              <button
                onClick={() => {
                  setCurrentTool("circle");
                  setOpenMenu(null);
                }}
              >
                {currentTool === "circle" ? "✓ " : ""}Окружність
              </button>
              <button
                onClick={() => {
                  setCurrentTool("line_circles");
                  setOpenMenu(null);
                }}
              >
                {currentTool === "line_circles" ? "✓ " : ""}Лінія з кружечками
              </button>
              <button
                onClick={() => {
                  setCurrentTool("cube");
                  setOpenMenu(null);
                }}
              >
                {currentTool === "cube" ? "✓ " : ""}Каркас куба
              </button>
            </div>
          )}
        </div>

        <button
          className="menu-btn"
          onClick={() => {
            setShowAbout(true);
            setOpenMenu(null);
          }}
        >
          Довідка
        </button>
      </nav>

      <div className="toolbar">
        <button
          className={`toolbar-btn ${currentTool === "point" ? "active" : ""}`}
          onClick={() => setCurrentTool("point")}
          title="Крапка"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
          </svg>
        </button>

        <button
          className={`toolbar-btn ${currentTool === "line" ? "active" : ""}`}
          onClick={() => setCurrentTool("line")}
          title="Лінія"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <line
              x1="4"
              y1="20"
              x2="20"
              y2="4"
              stroke="currentColor"
              strokeWidth="2.5"
            />
          </svg>
        </button>

        <button
          className={`toolbar-btn ${currentTool === "rect" ? "active" : ""}`}
          onClick={() => setCurrentTool("rect")}
          title="Прямокутник"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        <button
          className={`toolbar-btn ${currentTool === "circle" ? "active" : ""}`}
          onClick={() => setCurrentTool("circle")}
          title="Окружність"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        <button
          className={`toolbar-btn ${
            currentTool === "line_circles" ? "active" : ""
          }`}
          onClick={() => setCurrentTool("line_circles")}
          title="Лінія з кружечками"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <line
              x1="5"
              y1="19"
              x2="19"
              y2="5"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="5" cy="19" r="3" fill="currentColor" />
            <circle cx="19" cy="5" r="3" fill="currentColor" />
          </svg>
        </button>

        <button
          className={`toolbar-btn ${currentTool === "cube" ? "active" : ""}`}
          onClick={() => setCurrentTool("cube")}
          title="Каркас куба"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <rect
              x="3"
              y="7"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="8"
              y="2"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="3"
              y1="7"
              x2="8"
              y2="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="16"
              y1="7"
              x2="21"
              y2="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="3"
              y1="20"
              x2="8"
              y2="15"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="16"
              y1="20"
              x2="21"
              y2="15"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".json,.txt"
        onChange={handleOpenFile}
      />

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={780}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {showAbout && (
        <div className="modal-overlay">
          <div className="about-modal">
            <h2>Про програму</h2>
            <div className="about-section">
              <strong>Архітектура:</strong>
              <p>• Глобальний статичний об'єкт класу MyEditor</p>
            </div>
            <div className="about-section">
              <strong>Параметри:</strong>
              <p>• Прямокутник (по 2 кутах, жовта заливка)</p>
              <p>• Окружність (від центру, біла заливка)</p>
              <p>• Позначка типу об'єкта — галочка ✓ у меню "Об'єкти"</p>
              <p>• Гумовий слід — пунктирна чорна лінія</p>
            </div>
            <button className="close-btn" onClick={() => setShowAbout(false)}>
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
