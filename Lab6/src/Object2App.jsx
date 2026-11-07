import React, { useState, useEffect } from "react";
import "./App.css";

function Object2App() {
  const [matrix, setMatrix] = useState([]);
  const [info, setInfo] = useState("Очікування параметрів від Lab6...");

  useEffect(() => {
    const channel = new BroadcastChannel("matrix_channel");

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === "GENERATE_MATRIX") {
        const { n, min, max } = payload;

        const newMatrix = [];
        for (let i = 0; i < n; i++) {
          const row = [];
          for (let j = 0; j < n; j++) {
            row.push(Math.floor(Math.random() * (max - min + 1)) + min);
          }
          newMatrix.push(row);
        }

        setMatrix(newMatrix);
        setInfo(`Згенеровано матрицю ${n}x${n}`);

        channel.postMessage({
          type: "MATRIX_DATA",
          payload: { matrix: newMatrix },
        });
      }
    };

    return () => channel.close();
  }, []);

  return (
    <div className="app-container">
      <h3>Object2</h3>
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
