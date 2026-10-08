import React, { useState, useRef } from "react";
import { PointShape, LineShape, RectangleShape, EllipseShape } from "./shapes";
import "./App.css";

function App() {
  const [currentTool, setCurrentTool] = useState("point");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const [openMenu, setOpenMenu] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  const N = 105;
  const pcshapeRef = useRef([]);
  const canvasRef = useRef(null);

  const redrawCanvas = (tempShape) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    pcshapeRef.current.forEach((shape) => shape.draw(ctx));

    if (isDrawing && tempShape) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.fillStyle = "transparent";
      ctx.setLineDash([]);

      tempShape.draw(ctx, true);

      ctx.restore();
    }
  };

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
    } else if (currentTool === "ellipse") {
      tempShape = new EllipseShape(startPos.x, startPos.y, x, y);
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

    let newShape = null;
    if (currentTool === "line") {
      newShape = new LineShape(startPos.x, startPos.y, x, y);
    } else if (currentTool === "rect") {
      newShape = new RectangleShape(startPos.x, startPos.y, x, y);
    } else if (currentTool === "ellipse") {
      newShape = new EllipseShape(startPos.x, startPos.y, x, y);
    }

    if (newShape) {
      pcshapeRef.current.push(newShape);
    }

    redrawCanvas();
  };

  const handleClearCanvas = () => {
    pcshapeRef.current = [];
    redrawCanvas();
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
      case "ellipse":
        return "Еліпс";
      default:
        return "";
    }
  };

  return (
    <div className="app-container">
      <header className="window-header">OOP_lab2 - {getToolTitle()}</header>

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

      <main className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </main>

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Варіант 5</h2>

            <div className="about-section">
              <strong>Масив</strong>
              <p>статичний, N = 105</p>
            </div>

            <div className="about-section">
              <strong>Гумовий слід</strong>
              <p>суцільна червона лінія за формою фігури</p>
            </div>

            <div className="about-section">
              <strong>Прямокутник</strong>
              <p>Увід: від центру до одного з кутів</p>
              <p>Відображення: чорний контур з білим заповненням</p>
            </div>

            <div className="about-section">
              <strong>Еліпс</strong>
              <p>Увід: по двох протилежних кутах охоплюючого прямокутника</p>
              <p>Відображення: чорний контур без заповнення</p>
            </div>

            <div className="about-section">
              <strong>Позначка поточного типу об'єкту</strong>
              <p>в заголовку вікна</p>
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
