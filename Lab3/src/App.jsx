import React, { useState, useRef, useEffect } from "react";
import {
  PointShape,
  LineShape,
  RectangleShape,
  EllipseShape,
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
  const currentTempLineRef = useRef(null);
  const fileInputRef = useRef(null);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pcshapeRef.current.forEach((shape) => shape.draw(ctx));

    if (currentTempLineRef.current) {
      const { x1, y1, x2, y2 } = currentTempLineRef.current;
      ctx.save();
      ctx.strokeStyle = "blue";
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
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
      if (pcshapeRef.current.length >= N) {
        alert(`Досягнуто ліміт масиву об'єктів (${N})!`);
        setIsDrawing(false);
        return;
      }
      pcshapeRef.current.push(new PointShape(x, y, x, y));
      redrawCanvas();
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || currentTool === "point") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentTempLineRef.current = {
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

    if (pcshapeRef.current.length >= N) {
      alert(`Досягнуто ліміт масиву об'єктів (${N})!`);
      currentTempLineRef.current = null;
      setIsDrawing(false);
      redrawCanvas();
      return;
    }

    let finalShape = null;
    if (currentTool === "line")
      finalShape = new LineShape(startPos.x, startPos.y, x, y);
    else if (currentTool === "rect")
      finalShape = new RectangleShape(startPos.x, startPos.y, x, y);
    else if (currentTool === "ellipse")
      finalShape = new EllipseShape(startPos.x, startPos.y, x, y);

    if (finalShape) {
      pcshapeRef.current.push(finalShape);
    }

    currentTempLineRef.current = null;
    setIsDrawing(false);
    redrawCanvas();
  };

  const handleClearCanvas = () => {
    pcshapeRef.current = [];
    currentTempLineRef.current = null;
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
                  setCurrentTool("ellipse");
                  setOpenMenu(null);
                }}
              >
                {currentTool === "ellipse" ? "✓ " : ""}Еліпс
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

      {/* Toolbar */}
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
          className={`toolbar-btn ${currentTool === "ellipse" ? "active" : ""}`}
          onClick={() => setCurrentTool("ellipse")}
          title="Еліпс"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <ellipse
              cx="12"
              cy="12"
              rx="9"
              ry="6"
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
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Варіант 6</h2>
            <div className="about-section">
              <strong>Масив</strong>
              <p>динамічний pcshape, N = 106</p>
            </div>
            <div className="about-section">
              <strong>Гумовий слід</strong>
              <p>суцільна лінія синього кольору</p>
            </div>
            <div className="about-section">
              <strong>Прямокутник</strong>
              <p>Увід: по двом протилежним кутам</p>
              <p>Відображення: чорний контур з жовтим заповненням</p>
            </div>
            <div className="about-section">
              <strong>Еліпс</strong>
              <p>Увід: від центру до кута охоплюючого прямокутника</p>
              <p>Відображення: чорний контур з білим заповненням</p>
            </div>
            <div className="about-section">
              <strong>Позначка об'єкта</strong>
              <p>в меню (галочкою)</p>
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
