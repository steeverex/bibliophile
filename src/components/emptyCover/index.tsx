import React from "react";
import "./emptyCover.css";

const emptyCover = (props) => (
  <div className="empty-cover" style={{ transform: `scale(${props.scale})` }}>
    <div className="cover-banner">
      {props.format || "BOOK"}
    </div>
    <div className="cover-title">{props.title}</div>
    <div className="cover-footer">Koodo Reader</div>
  </div>
);

export default emptyCover;
