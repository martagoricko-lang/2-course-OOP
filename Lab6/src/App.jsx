import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [n, setN] = useState(3);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  const [status, setStatus] = useState("Готовий до запуску");

  const win2Ref = useRef(null);
  const win3Ref = useRef(null);

  // СЮДИ ДОДАЄМО: Прослуховування повідомлення від Object3
  useEffect(() => {
    const channel = new BroadcastChannel("matrix_channel");

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === "DETERMINANT_CALCULATED") {
        setStatus(`Обчислення завершено! Детермінант = ${payload.result}`);
      }
    };

    return () => channel.close();
  }, []);

  const handleStartProcess = () => {
    win2Ref.current = window.open(
      "/object2.html",
      "Object2Window",
      "width=450,height=450,left=100,top=100",
    );
    win3Ref.current = window.open(
      "/object3.html",
      "Object3Window",
      "width=450,height=450,left=600,top=100",
    );

    setStatus("Вікна відкрито. Надсилання параметрів...");

    setTimeout(() => {
      const channel = new BroadcastChannel("matrix_channel");
      channel.postMessage({
        type: "GENERATE_MATRIX",
        payload: { n: Number(n), min: Number(min), max: Number(max) },
      });
      setStatus("Параметри надіслано в Object2. Очікуємо обчислення...");
    }, 1000);
  };

  const handleCloseAllWindows = () => {
    if (win2Ref.current) win2Ref.current.close();
    if (win3Ref.current) win3Ref.current.close();
    setStatus("Усі вікна закрито");
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
