import React from "react";
import "./MyTable.css";

export function MyTable({
  shapes,
  selectedIndex,
  onSelect,
  onDelete,
  onClose,
}) {
  return (
    <div className="table-window">
      <div className="table-header">
        <span>Таблиця об'єктів</span>
        <button className="table-close-btn" onClick={onClose} title="Закрити">
          ✕
        </button>
      </div>

      <div className="table-body">
        {shapes.length === 0 ? (
          <div className="empty-msg">Немає побудованих об'єктів</div>
        ) : (
          <table className="objects-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Назва</th>
                <th>x1</th>
                <th>y1</th>
                <th>x2</th>
                <th>y2</th>
              </tr>
            </thead>
            <tbody>
              {shapes.map((shape, index) => (
                <tr
                  key={index}
                  className={selectedIndex === index ? "selected-row" : ""}
                  onClick={() => onSelect(index)}
                >
                  <td>{index + 1}</td>
                  <td>
                    <strong>{shape.getTypeName()}</strong>
                  </td>
                  <td>{Math.round(shape.x1)}</td>
                  <td>{Math.round(shape.y1)}</td>
                  <td>{Math.round(shape.x2)}</td>
                  <td>{Math.round(shape.y2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="table-footer">
        <button
          className="delete-btn"
          disabled={selectedIndex === null || selectedIndex < 0}
          onClick={() => onDelete(selectedIndex)}
        >
          Вилучити об'єкт
        </button>
      </div>
    </div>
  );
}
