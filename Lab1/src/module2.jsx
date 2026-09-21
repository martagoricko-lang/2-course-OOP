import React, { useState } from "react";

export default function Module2Modal({ onConfirm, onCancel }) {
  const [step, setStep] = useState(1);

  if (step === 1) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Робота 2</h3>
          <div className="button-group">
            <button onClick={() => setStep(2)}>Далі &gt;</button>
            <button onClick={onCancel}>Відміна</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Робота 2</h3>
        <div className="button-group">
          <button onClick={() => setStep(1)}>&lt; Назад</button>
          <button onClick={() => onConfirm("Робота 2 виконана успішно!")}>
            Так
          </button>
          <button onClick={onCancel}>Відміна</button>
        </div>
      </div>
    </div>
  );
}
