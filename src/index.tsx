import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/reset.css";
import "./assets/styles/global.css";
import "./assets/styles/style.css";
import { Provider } from "react-redux";
import "./i18n";
import store from "./store";
import Router from "./router/index";
import VisualEffects from "./components/visualEffects/component";
import StyleUtil from "./utils/reader/styleUtil";
import {
  initSystemFont,
  initTheme,
  applyCustomSystemCSS,
  applyAppBackgroundImage,
} from "./utils/reader/launchUtil";
import { migrateConfig } from "./utils/common";
console.time("initTheme");
initTheme();
console.timeEnd("initTheme");
console.time("initSystemFont");
initSystemFont();
console.timeEnd("initSystemFont");
console.time("migrateConfig");
migrateConfig();
console.timeEnd("migrateConfig");
console.time("applyCustomSystemCSS");
applyCustomSystemCSS();
console.timeEnd("applyCustomSystemCSS");
console.time("applyAppBackgroundImage");
applyAppBackgroundImage();
console.timeEnd("applyAppBackgroundImage");
const container = document.getElementById("root")!;
ReactDOM.render(
  <Provider store={store}>
    <>
      <Router />
      <VisualEffects />
    </>
  </Provider>,
  container
);
StyleUtil.applyTheme();
