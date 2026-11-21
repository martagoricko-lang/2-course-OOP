import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [n, setN] = useState(3);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  const [status, setStatus] = useState("Готовий до запуску");

  useEffect(() => {
    if (!window.electronIPC) return;

    window.electronIPC.onDeterminantResult((result) => {
      setStatus(`Обчислення завершено! Детермінант = ${result}`);
    });

    window.electronIPC.onWindowsClosed(() => {
      setStatus("Усі вікна закрито");
    });
  }, []);

  const handleStartProcess = () => {
    setStatus("Відкриття вікон та надсилання параметрів через IPC...");
    window.electronIPC?.startAndGenerate({
      n: Number(n),
      min: Number(min),
      max: Number(max),
    });
  };

  const handleCloseAllWindows = () => {
    window.electronIPC?.closeChildWindows();
  };

  return (
    <div className="app-container">
      <h2>Lab6</h2>

      <div className="input-group">
        <label>
          Розмірність n × n:
          <input
            type="number"
            value={n}
            min="1"
            max="10"
            onChange={(e) => setN(e.target.value)}
          />
        </label>
        <label>
          Мінімальне значення (Min):
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
        </label>
        <label>
          Максимальне значення (Max):
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </label>
      </div>

      <div className="btn-group">
        <button className="btn-primary" onClick={handleStartProcess}>
          Згенерувати та обчислити
        </button>
        <button className="btn-danger" onClick={handleCloseAllWindows}>
          Закрити всі вікна
        </button>
      </div>

      <div className="status-box">
        <strong>Статус:</strong> {status}
      </div>
    </div>
  );
}

export default App;
