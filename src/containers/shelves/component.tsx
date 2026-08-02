import React from "react";
import toast from "react-hot-toast";
import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import ShelfGrid from "./shelfGrid";
import { ShelfInfo, ShelvesPageProps, ShelvesPageState } from "./interface";
import ShelfCoverUtil from "../../utils/file/shelfCoverUtil";
import "./shelves.css";

class ShelvesPage extends React.Component<ShelvesPageProps, ShelvesPageState> {
  private newShelfInput = React.createRef<HTMLInputElement>();

  state: ShelvesPageState = {
    isCreatingShelf: false,
    newShelfName: "",
    isMoreMenuOpen: false,
    customCovers: {},
    contextMenu: null,
  };

  async componentDidMount() {
    this.props.handleMode("shelves");
    this.props.handleShelf("");
    await this.loadCustomCovers();
  }

  componentDidUpdate(_: ShelvesPageProps, prevState: ShelvesPageState) {
    if (!prevState.isCreatingShelf && this.state.isCreatingShelf) {
      this.newShelfInput.current?.focus();
    }
  }

  getShelves = (): ShelfInfo[] => {
    const sorted = ConfigService.getAllListConfig("sortedShelfList") || [];
    const shelfMap = ConfigService.getAllMapConfig("shelfList") || {};
    const booksByKey = new Map(this.props.books.map((book) => [String(book.key), book]));

    return Array.from(new Set([...sorted, ...Object.keys(shelfMap)])).map((name) => {
      const bookKeys = Array.isArray(shelfMap[name]) ? shelfMap[name].map(String) : [];
      const availableBooks = bookKeys
        .map((key) => booksByKey.get(key))
        .filter(Boolean);
      const generatedCover = availableBooks.length
        ? availableBooks[this.stableCoverIndex(name, availableBooks.length)]?.cover
        : undefined;
      return { name, bookKeys, cover: this.state.customCovers[name] || generatedCover };
    });
  };

  loadCustomCovers = async () => {
    const shelfMap = ConfigService.getAllMapConfig("shelfList") || {};
    const names = Object.keys(shelfMap);
    const covers = await Promise.all(names.map(async (name) => [name, await ShelfCoverUtil.load(name)] as const));
    this.setState({ customCovers: covers.reduce<Record<string, string>>((result, [name, cover]) => {
      if (cover) result[name] = cover;
      return result;
    }, {}) });
  };

  stableCoverIndex = (name: string, count: number) => {
    const hash = Array.from(name).reduce((total, character) => total + character.charCodeAt(0), 0);
    return hash % count;
  };

  createShelf = () => {
    const name = this.state.newShelfName.trim();
    if (!name) {
      toast(this.props.t("Shelf Title is Empty"));
      return;
    }
    const shelfMap = ConfigService.getAllMapConfig("shelfList") || {};
    if (shelfMap.hasOwnProperty(name)) {
      toast(this.props.t("Duplicate shelf"));
      return;
    }
    ConfigService.setListConfig(name, "sortedShelfList");
    ConfigService.setOneMapConfig(name, [], "shelfList");
    toast.success(this.props.t("Created successfully"));
    this.setState({ isCreatingShelf: false, newShelfName: "" });
  };

  openShelf = (name: string) => {
    this.props.handleShelf(name);
    this.props.handleMode("shelf");
    this.props.history.push("/manager/shelf");
  };

  openContextMenu = (shelfName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.setState({ contextMenu: { shelfName, x: event.clientX, y: event.clientY }, isMoreMenuOpen: false });
  };

  closeContextMenu = () => this.setState({ contextMenu: null });

  chooseCover = async (shelfName: string) => {
    this.closeContextMenu();
    const dataUrl = await ShelfCoverUtil.selectImage();
    if (!dataUrl) return;
    await ShelfCoverUtil.save(shelfName, dataUrl);
    this.setState((state) => ({ customCovers: { ...state.customCovers, [shelfName]: dataUrl } }));
  };

  removeCover = async (shelfName: string) => {
    this.closeContextMenu();
    await ShelfCoverUtil.remove(shelfName);
    this.setState((state) => {
      const customCovers = { ...state.customCovers };
      delete customCovers[shelfName];
      return { customCovers };
    });
  };

  renameShelf = async (oldName: string) => {
    this.closeContextMenu();
    const newName = window.prompt(this.props.t("New shelf"), oldName)?.trim();
    if (!newName || newName === oldName) return;
    const shelfMap = ConfigService.getAllMapConfig("shelfList") || {};
    if (shelfMap.hasOwnProperty(newName)) return toast(this.props.t("Duplicate shelf"));
    const sorted = ConfigService.getAllListConfig("sortedShelfList") || [];
    ConfigService.setAllListConfig(sorted.map((name) => name === oldName ? newName : name), "sortedShelfList");
    ConfigService.deleteMapConfig(oldName, "shelfList");
    ConfigService.setOneMapConfig(newName, shelfMap[oldName] || [], "shelfList");
    await ShelfCoverUtil.rename(oldName, newName);
    await this.loadCustomCovers();
    toast.success(this.props.t("Renamed successfully"));
  };

  deleteShelf = async (shelfName: string) => {
    this.closeContextMenu();
    if (!window.confirm(`${this.props.t("Delete this shelf")}?`)) return;
    ConfigService.deleteMapConfig(shelfName, "shelfList");
    ConfigService.deleteListConfig(shelfName, "sortedShelfList");
    await ShelfCoverUtil.remove(shelfName);
    await this.loadCustomCovers();
  };

  render() {
    const shelves = this.getShelves();
    return (
      <main
        className="shelves-page"
        onClick={() => this.closeContextMenu()}
        style={this.props.isCollapsed ? { left: 70, width: "calc(100vw - 70px)" } : {}}
      >
        <header className="shelves-page-header">
          <div>
            <p className="shelves-page-kicker">COLLECTION_INDEX</p>
            <h1>{this.props.t("Shelves")}</h1>
            <p className="shelves-page-subtitle">
              {shelves.length} {shelves.length === 1 ? "collection" : "collections"}
            </p>
          </div>
          <div className="shelves-page-actions">
            <button
              className="shelf-new-button"
              type="button"
              onClick={() => this.setState({ isCreatingShelf: true, isMoreMenuOpen: false })}
            >
              <span className="icon-add" /> {this.props.t("New shelf")}
            </button>
            <div className="shelf-more-wrap">
              <button
                className="shelf-more-button"
                type="button"
                aria-label="Shelf options"
                onClick={() => this.setState((state) => ({ isMoreMenuOpen: !state.isMoreMenuOpen }))}
              >
                ⋮
              </button>
              {this.state.isMoreMenuOpen && (
                <div className="shelf-more-menu">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState({ isMoreMenuOpen: false });
                      this.props.handleSortShelfDialog(true);
                    }}
                  >
                    {this.props.t("Manage shelf")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      this.setState({ isMoreMenuOpen: false });
                      this.props.handleSortShelfDialog(true);
                    }}
                  >
                    {this.props.t("Sort Shelves")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {this.state.isCreatingShelf && (
          <form
            className="shelf-create-form"
            onSubmit={(event) => {
              event.preventDefault();
              this.createShelf();
            }}
          >
            <input
              ref={this.newShelfInput}
              value={this.state.newShelfName}
              placeholder={this.props.t("New shelf")}
              onChange={(event) => this.setState({
                newShelfName: event.target.value.replace(/[\[\]{}",:\/\\|<>*?]/g, ""),
              })}
            />
            <button type="submit">{this.props.t("Create")}</button>
            <button type="button" onClick={() => this.setState({ isCreatingShelf: false, newShelfName: "" })}>
              {this.props.t("Cancel")}
            </button>
          </form>
        )}

        {shelves.length ? (
          <ShelfGrid shelves={shelves} onOpenShelf={this.openShelf} onShelfContextMenu={this.openContextMenu} />
        ) : (
          <div className="shelves-empty-state">
            <span className="icon-bookshelf-line" />
            <h2>{this.props.t("Empty shelf")}</h2>
            <p>Create a shelf to begin organizing your library.</p>
          </div>
        )}
        {this.state.contextMenu && (
          <div
            className="shelf-context-menu"
            style={{ left: this.state.contextMenu.x, top: this.state.contextMenu.y }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={() => this.openShelf(this.state.contextMenu!.shelfName)}>Open</button>
            <span className="shelf-context-divider" />
            <button type="button" onClick={() => this.renameShelf(this.state.contextMenu!.shelfName)}>Rename</button>
            <button type="button" onClick={() => { this.closeContextMenu(); this.props.handleSortShelfDialog(true); }}>Edit Shelf</button>
            <span className="shelf-context-divider" />
            <button type="button" onClick={() => this.chooseCover(this.state.contextMenu!.shelfName)}>Choose Cover…</button>
            <button type="button" disabled={!this.state.customCovers[this.state.contextMenu.shelfName]} onClick={() => this.removeCover(this.state.contextMenu!.shelfName)}>Remove Custom Cover</button>
            <span className="shelf-context-divider" />
            <button type="button" className="shelf-context-delete" onClick={() => this.deleteShelf(this.state.contextMenu!.shelfName)}>Delete Shelf</button>
          </div>
        )}
      </main>
    );
  }
}

export default ShelvesPage;
