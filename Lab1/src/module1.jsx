import React, { useState } from "react";

export default function Module1Modal({ onConfirm, onCancel }) {
  const [value, setValue] = useState(50);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Робота 1</h3>
        <p>Виберіть число від 1 до 100:</p>

        <div style={{ margin: "20px 0" }}>
          <input
            type="range"
            min="1"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            style={{ width: "80%" }}
          />
          <div style={{ fontWeight: "bold", marginTop: "10px" }}>
            Обране значення: {value}
          </div>
        </div>

        <div className="button-group">
          <button onClick={() => onConfirm(value)}>Так</button>
          <button onClick={onCancel}>Відміна</button>
        </div>
      </div>
    </div>
  );
}
