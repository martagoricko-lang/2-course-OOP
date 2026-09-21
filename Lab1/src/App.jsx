import React, { useState } from "react";
import Module1Modal from "./module1";
import Module2Modal from "./module2";
import "./App.css";

function App() {
  const [activeModal, setActiveModal] = useState(null);

  const [resultWork1, setResultWork1] = useState("не виконано");
  const [resultWork2, setResultWork2] = useState("не виконано");

  const closeModal = () => setActiveModal(null);

  const handleConfirmWork1 = (value) => {
    setResultWork1(`обрано число: ${value}`);
    closeModal();
  };

  const handleConfirmWork2 = (msg) => {
    setResultWork2(msg);
    closeModal();
  };

  return (
    <div className="app-container">
      {}
      <nav className="menu-bar">
        <button
          onClick={() => setActiveModal("work1")}
          disabled={activeModal !== null}
        >
          Робота1
        </button>
        <button
          onClick={() => setActiveModal("work2")}
          disabled={activeModal !== null}
        >
          Робота2
        </button>
      </nav>

      {}
      <main className="main-content">
        <div className="result-box">
          <div className="result-item">
            <strong>Робота 1:</strong> {resultWork1}
          </div>
          <div className="result-item" style={{ marginTop: "10px" }}>
            <strong>Робота 2:</strong> {resultWork2}
          </div>
        </div>
      </main>

      {}
      {activeModal === "work1" && (
        <Module1Modal onConfirm={handleConfirmWork1} onCancel={closeModal} />
      )}

      {activeModal === "work2" && (
        <Module2Modal onConfirm={handleConfirmWork2} onCancel={closeModal} />
      )}
    </div>
  );
}

export default App;
