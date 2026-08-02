import React from "react";
import { ShelfCardProps } from "./interface";

const ShelfCard = ({ shelf, onOpen, onContextMenu }: ShelfCardProps) => (
  <button className="shelf-card" type="button" onClick={onOpen} onContextMenu={onContextMenu}>
    <div className="shelf-card-cover">
      {shelf.cover ? (
        <img src={shelf.cover} alt="" />
      ) : (
        <span className="icon-bookshelf-line shelf-card-placeholder" />
      )}
      <span className="shelf-card-scanline" />
    </div>
    <div className="shelf-card-details">
      <span className="shelf-card-name">{shelf.name}</span>
      <span className="shelf-card-count">
        {shelf.bookKeys.length} {shelf.bookKeys.length === 1 ? "Book" : "Books"}
      </span>
    </div>
  </button>
);

export default ShelfCard;
