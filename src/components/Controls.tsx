import "./Controls.css";

export default function Controls() {
  return (
    <div className="controls-grid">
      <div className="control-row">
        <div className="control-key">Up</div>
        <div className="control-value">W or ⬆</div>
      </div>
      <div className="control-row">
        <div className="control-key">Left</div>
        <div className="control-value">A or ⬅</div>
      </div>
      <div className="control-row">
        <div className="control-key">Down</div>
        <div className="control-value">S or ⬇</div>
      </div>
      <div className="control-row">
        <div className="control-key">Right</div>
        <div className="control-value">D or ➡</div>
      </div>
      <div className="control-row">
        <div className="control-key">Shoot</div>
        <div className="control-value">Space</div>
      </div>
    </div>
  );
}
