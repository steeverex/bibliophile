import { connect } from "react-redux";
import MoreSetting from "./component";
import { withTranslation } from "react-i18next";
import { stateType } from "../../../store";
import { withRouter } from "react-router-dom";
import { handleSettingMode } from "../../../store/actions";

const mapStateToProps = (_state: stateType) => {
  return {};
};
const actionCreator = { handleSettingMode };
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(withRouter(MoreSetting as any) as any) as any);
