import React from "react";

export default function Step1({ onNext, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Робота 2</h3>
        <div className="button-group">
          <button onClick={onNext}>Далі &gt;</button>
          <button onClick={onCancel}>Відміна</button>
        </div>
      </div>
    </div>
  );
}
