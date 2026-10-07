import React, { useState, useRef, useEffect } from "react";
import { globalEditor } from "./editor";
import { PointShape, createShapeFromCSV } from "./shapes";
import { MyTable } from "./MyTable";
import "./App.css";

function App() {
  const [currentTool, setCurrentTool] = useState("point");
  const [openMenu, setOpenMenu] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    globalEditor.pcshape.forEach((shape, index) => {
      shape.isSelected = index === selectedIndex;
      shape.draw(ctx);
    });

    if (globalEditor.tempShape) {
      const { x1, y1, x2, y2 } = globalEditor.tempShape;
      ctx.save();
      ctx.strokeStyle = "blue";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [selectedIndex, showTable]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setIsDrawing(true);
    setSelectedIndex(null);

    if (currentTool === "point") {
      const added = globalEditor.addShape(new PointShape(x, y, x, y));
      if (!added) alert(`Досягнуто ліміт (${globalEditor.N})!`);
      redrawCanvas();
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || currentTool === "point") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    globalEditor.tempShape = { x1: startPos.x, y1: startPos.y, x2: x, y2: y };
    redrawCanvas();
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || currentTool === "point") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const shape = globalEditor.createShape(
      currentTool,
      startPos.x,
      startPos.y,
      x,
      y,
    );
    if (shape) {
      const added = globalEditor.addShape(shape);
      if (!added) alert(`Досягнуто ліміт (${globalEditor.N})!`);
    }

    globalEditor.tempShape = null;
    setIsDrawing(false);
    redrawCanvas();
  };

  const handleClearCanvas = () => {
    globalEditor.clear();
    setSelectedIndex(null);
    redrawCanvas();
    setOpenMenu(null);
  };

  const handleSaveToCSV = () => {
    const csvData = globalEditor.exportToCSV();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "shapes_lab5.csv";
    a.click();
    URL.revokeObjectURL(url);
    setOpenMenu(null);
  };

  const handleOpenCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split("\n");
        const loadedShapes = lines
          .map((line) => createShapeFromCSV(line))
          .filter((s) => s !== null);

        globalEditor.pcshape = loadedShapes;
        setSelectedIndex(null);
        redrawCanvas();
      } catch (err) {
        alert("Помилка зчитування CSV-файлу!");
      }
    };
    reader.readAsText(file);
    setOpenMenu(null);
  };

  const handleSelectObject = (index) => {
    setSelectedIndex(index);
  };

  const handleDeleteObject = (index) => {
    if (index !== null) {
      globalEditor.removeShapeAt(index);
      setSelectedIndex(null);
      redrawCanvas();
    }
  };

  return (
    <div className="app-container">
      <header className="window-header">OOP_lab5</header>

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
                Відкрити CSV...
              </button>
              <button onClick={handleSaveToCSV}>Зберегти в CSV...</button>
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
              <button
                onClick={() => {
                  setCurrentTool("lineWithCircles");
                  setOpenMenu(null);
                }}
              >
                {currentTool === "lineWithCircles" ? "✓ " : ""}Лінія з
                кружечками
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
          className={`menu-btn ${showTable ? "active" : ""}`}
          onClick={() => setShowTable(!showTable)}
        >
          {showTable ? "✓ Таблиця об'єктів" : "Таблиця об'єктів"}
        </button>

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

        <button
          className={`toolbar-btn ${currentTool === "lineWithCircles" ? "active" : ""}`}
          onClick={() => setCurrentTool("lineWithCircles")}
          title="Лінія з кружечками"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <line
              x1="6"
              y1="18"
              x2="18"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="6" cy="18" r="3" fill="currentColor" />
            <circle cx="18" cy="6" r="3" fill="currentColor" />
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
              y="9"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="9"
              y="3"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="3"
              y1="9"
              x2="9"
              y2="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="15"
              y1="9"
              x2="21"
              y2="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="3"
              y1="21"
              x2="9"
              y2="15"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="15"
              y1="21"
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
        accept=".csv,.txt"
        onChange={handleOpenCSV}
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

      {showTable && (
        <MyTable
          shapes={globalEditor.pcshape}
          selectedIndex={selectedIndex}
          onSelect={handleSelectObject}
          onDelete={handleDeleteObject}
          onClose={() => setShowTable(false)}
        />
      )}

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Лабораторна №5</h2>
            <div className="about-section">
              <strong>Паттерн:</strong>
              <p>Singleton Меєртса (Meyers Singleton)</p>
            </div>
            <div className="about-section">
              <strong>Вікна:</strong>
              <p>Головне + Немодальне вікно таблиці MyTable</p>
            </div>
            <div className="about-section">
              <strong>Формат файлів:</strong>
              <p>CSV (тип, x1, y1, x2, y2)</p>
            </div>
            <div className="about-section">
              <strong>Бонуси:</strong>
              <p>Синхронне виділення та вилучення об'єктів</p>
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
