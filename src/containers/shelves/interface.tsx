import BookModel from "../../models/Book";
import { RouteComponentProps } from "react-router-dom";
import React from "react";

export interface ShelfInfo {
  name: string;
  bookKeys: string[];
  cover?: string;
}

export interface ShelvesPageProps extends RouteComponentProps<any> {
  books: BookModel[];
  isCollapsed: boolean;
  isOpenSortShelfDialog: boolean;
  handleMode: (mode: string) => void;
  handleShelf: (shelfTitle: string) => void;
  handleSortShelfDialog: (isOpen: boolean) => void;
  t: (title: string) => string;
}

export interface ShelvesPageState {
  isCreatingShelf: boolean;
  newShelfName: string;
  isMoreMenuOpen: boolean;
  customCovers: Record<string, string>;
  contextMenu: { shelfName: string; x: number; y: number } | null;
}

export interface ShelfCardProps {
  shelf: ShelfInfo;
  onOpen: () => void;
  onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
