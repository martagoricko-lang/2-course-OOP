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

  const N = 106;
  const canvasRef = useRef(null);
  const pcshapeRef = useRef([]);
  const fileInputRef = useRef(null);

  const redrawCanvas = (tempShape) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    pcshapeRef.current.forEach((shape) => shape.draw(ctx));

    if (isDrawing && tempShape) {
      ctx.save();
      ctx.strokeStyle = "blue";
      ctx.fillStyle = "transparent";
      ctx.setLineDash([]);

      tempShape.draw(ctx, true);

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
      if (pcshapeRef.current.length < N) {
        pcshapeRef.current.push(new PointShape(x, y, x, y));
        redrawCanvas();
      } else {
        alert(`Досягнуто ліміт масиву об'єктів (${N})!`);
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || currentTool === "point") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let tempShape = null;
    if (currentTool === "line") {
      tempShape = new LineShape(startPos.x, startPos.y, x, y);
    } else if (currentTool === "rect") {
      tempShape = new RectangleShape(startPos.x, startPos.y, x, y);
    } else if (currentTool === "circle") {
      tempShape = new CircleShape(startPos.x, startPos.y, x, y);
    }

    redrawCanvas(tempShape);
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || currentTool === "point") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(false);

    if (pcshapeRef.current.length >= N) {
      alert(`Досягнуто ліміт масиву об'єктів (${N})!`);
      redrawCanvas();
      return;
    }

    let finalShape = null;
    if (currentTool === "line") {
      finalShape = new LineShape(startPos.x, startPos.y, x, y);
    } else if (currentTool === "rect") {
      finalShape = new RectangleShape(startPos.x, startPos.y, x, y);
    } else if (currentTool === "circle") {
      finalShape = new CircleShape(startPos.x, startPos.y, x, y);
    }

    if (finalShape) {
      pcshapeRef.current.push(finalShape);
    }

    redrawCanvas();
  };

  const handleClearCanvas = () => {
    pcshapeRef.current = [];
    redrawCanvas();
    setOpenMenu(null);
  };

  const handleSaveToFile = () => {
    const dataToSave = pcshapeRef.current.map((shape) => shape.toJSON());
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
          pcshapeRef.current = parsedData
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

  return (
    <div className="app-container">
      <header className="window-header">OOP_lab3</header>

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
              strokeLinecap="round"
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
              rx="1"
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
          height={420}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {showAbout && (
        <div className="modal-overlay">
          <div className="about-modal">
            <h2>Варіант 6</h2>
            <div className="about-section">
              <strong>Масив</strong>
              <p>динамічний, N = 106</p>
            </div>
            <div className="about-section">
              <strong>Гумовий слід</strong>
              <p>суцільна синя лінія</p>
            </div>
            <div className="about-section">
              <strong>Прямокутник</strong>
              <p>Увід: по протилежних кутах</p>
              <p>Відображення: чорний контур із жовтою заливкою</p>
            </div>
            <div className="about-section">
              <strong>Окружність / Еліпс</strong>
              <p>Увід: від центру до кута </p>
              <p>Відображення: чорний контур із білою заливкою </p>
            </div>
            <div className="about-section">
              <strong>Позначка типу об'єкта</strong>
              <p>в меню</p>
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
