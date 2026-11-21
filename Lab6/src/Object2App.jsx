import React, { useState, useEffect } from "react";
import "./App.css";

function Object2App() {
  const [matrix, setMatrix] = useState([]);
  const [info, setInfo] = useState("Очікування IPC-повідомлення від Lab6...");

  useEffect(() => {
    if (!window.electronIPC) return;

    window.electronIPC.onGenerateMatrix(({ n, min, max }) => {
      const newMatrix = [];
      for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
          row.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        newMatrix.push(row);
      }

      setMatrix(newMatrix);
      setInfo(`Згенеровано матрицю ${n}×${n}`);

      window.electronIPC.sendMatrixData(newMatrix);
    });
  }, []);

  return (
    <div className="app-container">
      <h3>Програма Object2</h3>
      <p>
        <em>{info}</em>
      </p>

      {matrix.length > 0 && (
        <table className="matrix-table">
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Object2App;
