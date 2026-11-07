import React, { useState, useEffect } from "react";
import "./App.css";

function calcDeterminant(m) {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][0] * m[1][0];

  let det = 0;
  for (let j = 0; j < n; j++) {
    const subMatrix = m
      .slice(1)
      .map((row) => row.filter((_, colIndex) => colIndex !== j));
    det += Math.pow(-1, j) * m[0][j] * calcDeterminant(subMatrix);
  }
  return det;
}

function Object3App() {
  const [detResult, setDetResult] = useState(null);
  const [info, setInfo] = useState("Очікування даних від Object2...");

  useEffect(() => {
    const channel = new BroadcastChannel("matrix_channel");

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === "MATRIX_DATA") {
        const { matrix } = payload;
        const det = calcDeterminant(matrix);
        setDetResult(det);
        setInfo(
          `Матрицю отримано. Розмірність: ${matrix.length}x${matrix.length}`,
        );

        // СЮДИ ДОДАЄМО: Надсилаємо зворотний статус головному вікну Lab6!
        channel.postMessage({
          type: "DETERMINANT_CALCULATED",
          payload: { result: det },
        });
      }
    };

    return () => channel.close();
  }, []);

  return (
    <div className="app-container">
      <h3>Object3</h3>
      <p>
        <em>{info}</em>
      </p>

      {detResult !== null && (
        <div className="result-card">
          <h4>Детермінант det(A):</h4>
          <div className="result-value">{detResult}</div>
        </div>
      )}
    </div>
  );
}

export default Object3App;
