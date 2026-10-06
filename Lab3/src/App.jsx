import React, { useState, useRef, useEffect } from "react";
import {
  PointShape,
  LineShape,
  RectangleShape,
  CircleShape,
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
  const shapesRef = useRef([]);
  const currentTempBoxRef = useRef(null); // Для K2 = 2 (гумовий прямокутник)
  const fileInputRef = useRef(null);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Малювання фігур
    shapesRef.current.forEach((shape) => shape.draw(ctx));

    // Візуалізація методом «гумового прямокутника» (K2 = 2)
    if (currentTempBoxRef.current) {
      const { x1, y1, x2, y2 } = currentTempBoxRef.current;
      const startX = Math.min(x1, x2);
      const startY = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);

      ctx.save();
      ctx.strokeStyle = "red";
      ctx.setLineDash([4, 4]); // Пунктирний прямокутник
      ctx.strokeRect(startX, startY, width, height);
      ctx.restore();
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, []);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setIsDrawing(true);

    if (currentTool === "point") {
      shapesRef.current.push(new PointShape(x, y, x, y));
      redrawCanvas();
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || currentTool === "point") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Гумовий прямокутник (K2 = 2)
    currentTempBoxRef.current = {
      x1: startPos.x,
      y1: startPos.y,
      x2: x,
      y2: y,
    };

    redrawCanvas();
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || currentTool === "point") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let finalShape = null;
    if (currentTool === "line") {
      finalShape = new LineShape(startPos.x, startPos.y, x, y);
    } else if (currentTool === "rect") {
      finalShape = new RectangleShape(startPos.x, startPos.y, x, y);
    } else if (currentTool === "circle") {
      finalShape = new CircleShape(startPos.x, startPos.y, x, y);
    }

    if (finalShape) {
      shapesRef.current.push(finalShape);
    }

    currentTempBoxRef.current = null;
    setIsDrawing(false);
    redrawCanvas();
  };

  const handleClearCanvas = () => {
    shapesRef.current = [];
    currentTempBoxRef.current = null;
    redrawCanvas();
    setOpenMenu(null);
  };

  const handleSaveToFile = () => {
    const dataToSave = shapesRef.current.map((shape) => shape.toJSON());
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "shapes_lab3.json";
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
          shapesRef.current = parsedData
            .map((data) => createShapeFromJSON(data))
            .filter((shape) => shape !== null);

          redrawCanvas();
        }
      } catch (err) {
        alert("Помилка зчитування файлу!");
      }
    };
    reader.readAsText(file);
    setOpenMenu(null);
  };

  const getToolTitle = () => {
    switch (currentTool) {
      case "point":
        return "Крапка";
      case "line":
        return "Лінія";
      case "rect":
        return "Прямокутник";
      case "circle":
        return "Окружність";
      default:
        return "";
    }
  };

  return (
    <div className="app-container">
      {/* Заголовок */}
      <header className="window-header">OOP_lab3 - {getToolTitle()}</header>

      {/* Меню: Файл, Об'єкти, Довідка */}
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

      {/* Панель інструментів (Toolbar) з іконками та підказками (Tooltips) */}
      <div className="toolbar">
        <button
          className={`toolbar-btn ${currentTool === "point" ? "active" : ""}`}
          onClick={() => setCurrentTool("point")}
          title="Малювання крапки"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
          </svg>
        </button>

        <button
          className={`toolbar-btn ${currentTool === "line" ? "active" : ""}`}
          onClick={() => setCurrentTool("line")}
          title="Малювання лінії"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <line
              x1="4"
              y1="20"
              x2="20"
              y2="4"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        </button>

        <button
          className={`toolbar-btn ${currentTool === "rect" ? "active" : ""}`}
          onClick={() => setCurrentTool("rect")}
          title="Малювання прямокутника"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
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
          title="Малювання окружності"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
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
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".json,.txt"
        onChange={handleOpenFile}
      />

      {/* Полотно Canvas */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={780}
          height={420}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {/* Модальне вікно Довідка */}
      {showAbout && (
        <div className="modal-overlay">
          <div className="about-modal">
            <h2>Про програму (Лабораторна 3)</h2>
            <div className="about-section">
              <strong>Варіант: Ж = 6 (Ж_лаб2 + 1)</strong>
              <p>• K1 = 1: Крапка, Лінія, Прямокутник, Окружність</p>
              <p>• K2 = 2: Гумовий прямокутник (червоний пунктир)</p>
              <p>• K3 = 3: Збереження та завантаження JSON-файлів</p>
              <p>• Реалізовано Toolbar з іконками та tooltips</p>
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
