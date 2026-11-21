import React, { useState, useEffect } from "react";
import "./App.css";

function calcDeterminant(m) {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];

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
  const [info, setInfo] = useState("Очікування IPC-даних від Object2...");

  useEffect(() => {
    if (!window.electronIPC) return;

    window.electronIPC.onMatrixData((matrix) => {
      const det = calcDeterminant(matrix);
      setDetResult(det);
      setInfo(
        `Матрицю отримано через IPC. Розмірність: ${matrix.length}×${matrix.length}`,
      );

      window.electronIPC.sendDeterminantResult(det);
    });
  }, []);

  return (
    <div className="app-container">
      <h3>Програма Object3</h3>
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
