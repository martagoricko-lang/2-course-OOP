import React from "react";

export default function Step2({ onBack, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Робота 2</h3>
        <div className="button-group">
          <button onClick={onBack}>&lt; Назад</button>
          <button onClick={() => onConfirm("Робота 2 виконана успішно!")}>
            Так
          </button>
          <button onClick={onCancel}>Відміна</button>
        </div>
      </div>
    </div>
  );
}
