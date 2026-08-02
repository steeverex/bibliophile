import { RouteComponentProps } from "react-router";

export interface SidebarProps extends RouteComponentProps<any> {
  mode: string;
  isCollapsed: boolean;
  handleMode: (mode: string) => void;
  handleSearch: (isSearch: boolean) => void;
  handleCollapse: (isCollapsed: boolean) => void;
  handleSortDisplay: (isSortDisplay: boolean) => void;
  handleSelectBook: (isSelectBook: boolean) => void;
  handleShelf: (shelfTitle: string) => void;
  handleFetchBooks: () => void;
  t: (title: string) => string;
}

export interface SidebarState {
  mode: string;
  hoverMode: string;
  isCollapsed: boolean;
  dropTarget: string;
}
