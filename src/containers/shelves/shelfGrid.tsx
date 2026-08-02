import React from "react";
import ShelfCard from "./shelfCard";
import { ShelfInfo } from "./interface";

interface ShelfGridProps {
  shelves: ShelfInfo[];
  onOpenShelf: (name: string) => void;
  onShelfContextMenu: (name: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ShelfGrid = ({ shelves, onOpenShelf, onShelfContextMenu }: ShelfGridProps) => (
  <div className="shelf-grid">
    {shelves.map((shelf) => (
      <ShelfCard
        key={shelf.name}
        shelf={shelf}
        onOpen={() => onOpenShelf(shelf.name)}
        onContextMenu={(event) => onShelfContextMenu(shelf.name, event)}
      />
    ))}
  </div>
);

export default ShelfGrid;
