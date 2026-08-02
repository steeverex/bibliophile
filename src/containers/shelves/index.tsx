import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { stateType } from "../../store";
import { handleMode, handleShelf, handleSortShelfDialog } from "../../store/actions";
import ShelvesPage from "./component";

const mapStateToProps = (state: stateType) => ({
  books: state.manager.books,
  isCollapsed: state.sidebar.isCollapsed,
  isOpenSortShelfDialog: state.backupPage.isOpenSortShelfDialog,
});

export default connect(mapStateToProps, {
  handleMode,
  handleShelf,
  handleSortShelfDialog,
})(withTranslation()(withRouter(ShelvesPage as any) as any) as any);
