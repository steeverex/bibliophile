import React from "react";
import "./sidebar.css";
import { sideMenu } from "../../constants/sideMenu";
import { SidebarProps, SidebarState } from "./interface";
import { withRouter } from "react-router-dom";
import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import { Ripple } from "../../components/microInteractions/component";
import {
  addBooksToFavorite,
  isBookDragEvent,
  moveBooksToTrash,
  parseBookDragData,
} from "../../utils/reader/bookDrag";
import toast from "react-hot-toast";

class Sidebar extends React.Component<SidebarProps, SidebarState> {
  state: SidebarState = {
    mode: "home",
    hoverMode: "",
    isCollapsed: ConfigService.getReaderConfig("isCollapsed") === "yes",
    dropTarget: "",
  };

  componentDidMount() {
    this.props.handleMode(document.URL.split("/").reverse()[0] === "empty" ? "home" : document.URL.split("/").reverse()[0]);
    document.addEventListener("dragend", this.clearDropTarget);
  }

  componentWillUnmount() {
    document.removeEventListener("dragend", this.clearDropTarget);
  }

  clearDropTarget = () => this.setState({ dropTarget: "" });

  handleSidebar = (mode: string) => {
    if (mode === "profile") {
      this.props.history.push("/profile");
      return;
    }
    this.setState({ mode });
    this.props.handleSelectBook(false);
    this.props.history.push(`/manager/${mode}`);
    this.props.handleMode(mode);
    this.props.handleShelf("");
    this.props.handleSearch(false);
    this.props.handleSortDisplay(false);
  };

  handleCollapse = (isCollapsed: boolean) => {
    this.setState({ isCollapsed });
    this.props.handleCollapse(isCollapsed);
    ConfigService.setReaderConfig("isCollapsed", isCollapsed ? "yes" : "no");
  };

  handleFavoriteDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.clearDropTarget();
    if (!isBookDragEvent(event)) return;
    const added = addBooksToFavorite(parseBookDragData(event));
    if (!added) return toast(this.props.t("Duplicate book"));
    toast.success(this.props.t("Addition successful"));
    this.props.handleFetchBooks();
  };

  handleTrashDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.clearDropTarget();
    if (!isBookDragEvent(event)) return;
    const moved = moveBooksToTrash(parseBookDragData(event));
    if (!moved) return toast(this.props.t("Duplicate book in trash bin"));
    toast.success(this.props.t("Deletion successful"));
    this.props.handleFetchBooks();
  };

  getBookDragHandlers = (mode: string, onDrop: (event: React.DragEvent) => void) => ({
    onDragEnter: (event: React.DragEvent) => {
      if (isBookDragEvent(event)) {
        event.preventDefault();
        this.setState({ dropTarget: mode });
      }
    },
    onDragLeave: (event: React.DragEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) this.clearDropTarget();
    },
    onDragOver: (event: React.DragEvent) => {
      if (isBookDragEvent(event)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }
    },
    onDrop,
  });

  render() {
    return (
      <div className="sidebar">
        <div className="sidebar-list-icon" onClick={() => this.handleCollapse(!this.state.isCollapsed)}>
          <span className="icon-menu sidebar-list" />
        </div>
        <div className="side-menu-container-parent" style={this.state.isCollapsed ? { width: "70px" } : {}}>
          <ul className="side-menu-container">
            {sideMenu.map((item) => {
              const isDropTarget = item.mode === "favorite" || item.mode === "trash";
              return (
                <Ripple key={item.name}>
                  <li
                    className={`${this.props.mode === item.mode ? "active " : ""}side-menu-item${this.state.dropTarget === item.mode ? " shelf-drop-target" : ""}`}
                    id={`sidebar-${item.icon}`}
                    onClick={() => this.handleSidebar(item.mode)}
                    onMouseEnter={() => this.setState({ hoverMode: item.mode })}
                    onMouseLeave={() => this.setState({ hoverMode: "" })}
                    style={this.state.isCollapsed ? { width: 40, marginLeft: 15 } : {}}
                    {...(isDropTarget ? this.getBookDragHandlers(item.mode, item.mode === "favorite" ? this.handleFavoriteDrop : this.handleTrashDrop) : {})}
                  >
                    {this.props.mode === item.mode && <div className="side-menu-selector-container" />}
                    {this.state.hoverMode === item.mode && <div className="side-menu-hover-container" />}
                    <div className={this.props.mode === item.mode ? "side-menu-selector active-selector" : "side-menu-selector"}>
                      <div className="side-menu-icon" style={this.state.isCollapsed ? {} : { marginLeft: "38px" }}>
                        <span className={this.props.mode === item.mode ? `icon-${item.icon} active-icon` : `icon-${item.icon}`} style={this.state.isCollapsed ? { position: "relative", marginLeft: "-9px" } : {}} />
                      </div>
                      <span style={this.state.isCollapsed ? { display: "none", width: "70%" } : { width: "60%" }}>{this.props.t(item.name)}</span>
                    </div>
                  </li>
                </Ripple>
              );
            })}
          </ul>
        </div>
        <div className="side-menu-about" style={{ paddingBottom: 8 }}>
          <div className="side-menu-selector" style={{ cursor: "pointer" }} onClick={() => this.props.history.push("/stats")}>
            <div className="side-menu-icon" style={this.state.isCollapsed ? {} : { marginLeft: "20px", marginRight: "15px" }}>
              <span className="icon-chart sidebar-shelf-icon" style={this.state.isCollapsed ? { position: "relative", fontSize: 14 } : { fontSize: 14 }} />
            </div>
            <span style={this.state.isCollapsed ? { display: "none", width: "70%" } : { width: "61%" }}>{this.props.t("Reading Stats")}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar as any);
