import React from "react";
import { SettingInfoProps, SettingInfoState } from "./interface";
import { Trans } from "react-i18next";
import i18n from "../../../i18n";
import { removeCloudConfig } from "../../../utils/file/common";
import { isElectron } from "react-device-detect";
import _ from "underscore";
import { syncSettingList } from "../../../constants/settingList";

import toast from "react-hot-toast";
import {
  confirmBrowserExtensionAsync,
  detectKoodoExtension,
  generateSyncRecord,
  getICloudDrivePath,
  getServerRegion,
  getWebsiteUrl,
  handleContextMenu,
  openExternalUrl,
  openInBrowser,
  resetKoodoSync,
  showTaskProgress,
  testConnection,
  testCORS,
  vexComfirmAsync,
} from "../../../utils/common";

import { driveInputConfig, driveList } from "../../../constants/driveList";
import { backup } from "../../../utils/file/backup";
import { restore } from "../../../utils/file/restore";
import {
  ConfigService,
  KookitConfig,
  SyncHelper,
  SyncUtil,
  TokenService,
} from "../../../assets/lib/kookit-extra-browser.min";
import {
  encryptToken,
  onSyncCallback,
} from "../../../utils/request/thirdparty";
import SyncService from "../../../utils/storage/syncService";
import { updateUserConfig } from "../../../utils/request/user";
import BookUtil from "../../../utils/file/bookUtil";
import Book from "../../../models/Book";
import ConfigUtil from "../../../utils/file/configUtil";
declare var window: any;
class SyncSetting extends React.Component<SettingInfoProps, SettingInfoState> {
  constructor(props: SettingInfoProps) {
    super(props);
    this.state = {
      isKeepLocal: ConfigService.getReaderConfig("isKeepLocal") === "yes",
      autoOffline: ConfigService.getReaderConfig("autoOffline") === "yes",
      isDisableAutoSync:
        ConfigService.getReaderConfig("isDisableAutoSync") === "yes",
      isEnableKoodoSync:
        ConfigService.getReaderConfig("isEnableKoodoSync") === "yes",
      hideSyncProgress:
        ConfigService.getReaderConfig("hideSyncProgress") === "yes",
      driveConfig: {},
      scheduledSyncInterval:
        ConfigService.getReaderConfig("scheduledSyncInterval") || "",
      backupDrive: "",
      restoreDrive: "",
      showDefaultSyncAddGrid: false,
    };
  }

  handleRest = (_bool: boolean) => {
    toast.success(this.props.t("Change successful"));
  };
  handleJump = (url: string) => {
    openInBrowser(url);
  };
  handleSetting = (stateName: string) => {
    this.setState({ [stateName]: !this.state[stateName] } as any);
    ConfigService.setReaderConfig(
      stateName,
      this.state[stateName] ? "no" : "yes"
    );
    this.handleRest(this.state[stateName]);
  };
  handleAddDataSourceFromGrid = async (targetDrive: string) => {
    await this.handleAddDataSource({ target: { value: targetDrive } });
    if (this.props.settingDrive) {
      this.setState({ showDefaultSyncAddGrid: false });
    }
  };
  handleAddDataSource = async (event: any) => {
    let targetDrive = event.target.value;
    if (!targetDrive) {
      return;
    }
    if (
      !driveList
        .find((item) => item.value === targetDrive)
        ?.support.includes("browser") &&
      !isElectron
    ) {
      toast(
        this.props.t(
          "Koodo Reader's web version are limited by the browser, for more powerful features, please download the desktop version."
        )
      );
      return;
    }
    if (!this.props.isAuthed) {
      toast(this.props.t("This is a Pro feature"));
      return;
    }
    if (
      !isElectron &&
      driveList.find((item) => item.value === targetDrive)?.needExtension
    ) {
      if (!(await confirmBrowserExtensionAsync())) {
        return;
      }
    }
    if (
      driveList.find((item) => item.value === targetDrive)?.isPro &&
      !this.props.isAuthed
    ) {
      toast(this.props.t("This is a Pro feature"));
      return;
    }
    this.props.handleSettingDrive(targetDrive);
    let settingDrive = targetDrive;
    if (settingDrive === "icloud" || settingDrive === "folder") {
      let drivePath = "";
      if (settingDrive === "icloud") {
        drivePath = getICloudDrivePath();
        if (!drivePath) {
          toast.error(
            this.props.t(
              "Can't find Koodo Reader's folder in the default iCloud path, please make sure iCloud Drive is installed and set up correctly, and you have already synced your library to iCloud Drive on the iOS version first."
            ),
            {
              duration: 6000,
            }
          );
          this.props.handleSettingDrive("");
          return;
        }
      } else if (settingDrive === "folder") {
        const { ipcRenderer } = window.require("electron");
        drivePath = await ipcRenderer.invoke("select-path");
        if (!drivePath) {
          toast.error(i18n.t("Please select a folder"));
          this.props.handleSettingDrive("");
          return;
        }
      }
      toast.loading(i18n.t("Adding"), { id: "adding-sync-id" });
      let res = await encryptToken(settingDrive, {
        drivePath: drivePath,
      });
      if (res.code === 200) {
        toast.success(i18n.t("Binding successful"), { id: "adding-sync-id" });
      } else {
        toast.error(i18n.t("Binding failed"), { id: "adding-sync-id" });
        this.props.handleSettingDrive("");
        return;
      }
      SyncService.removeSyncUtil(settingDrive);
      removeCloudConfig(settingDrive);
      if (isElectron) {
        const { ipcRenderer } = window.require("electron");
        await ipcRenderer.invoke("cloud-close", {
          service: settingDrive,
        });
      }
      ConfigService.setListConfig(settingDrive, "dataSourceList");
      toast.success(i18n.t("Binding successful"), { id: "adding-sync-id" });
      if (this.props.isAuthed && !ConfigService.getItem("defaultSyncOption")) {
        ConfigService.setItem("defaultSyncOption", settingDrive);
        if (ConfigService.getReaderConfig("isEnableKoodoSync") === "yes") {
          resetKoodoSync();
        }
        this.props.handleFetchDefaultSyncOption();
      }
      this.props.handleFetchDataSourceList();
      this.props.handleSettingDrive("");
      return;
    }
    if (
      settingDrive === "dropbox" ||
      settingDrive === "yandex" ||
      settingDrive === "dubox" ||
      settingDrive === "yiyiwu" ||
      settingDrive === "google" ||
      settingDrive === "boxnet" ||
      settingDrive === "pcloud" ||
      settingDrive === "adrive" ||
      settingDrive === "microsoft_exp" ||
      settingDrive === "microsoft"
    ) {
      this.handleJump(
        new SyncUtil(settingDrive, {}).getAuthUrl(
          getServerRegion() === "china" &&
            (settingDrive === "microsoft" ||
              settingDrive === "microsoft_exp" ||
              settingDrive === "dubox" ||
              settingDrive === "yiyiwu" ||
              settingDrive === "adrive")
            ? KookitConfig.ThirdpartyConfig.cnCallbackUrl
            : KookitConfig.ThirdpartyConfig.callbackUrl
        )
      );
    }
  };
  handleDeleteDataSource = async (event: any) => {
    let targetDrive = event.target.value;
    if (!targetDrive) {
      return;
    }
    await TokenService.setToken(targetDrive + "_token", "");
    SyncService.removeSyncUtil(targetDrive);
    removeCloudConfig(targetDrive);
    if (isElectron) {
      const { ipcRenderer } = window.require("electron");
      await ipcRenderer.invoke("cloud-close", {
        service: targetDrive,
      });
    }
    ConfigService.deleteListConfig(targetDrive, "dataSourceList");
    this.props.handleFetchDataSourceList();
    if (targetDrive === ConfigService.getItem("defaultSyncOption")) {
      ConfigService.removeItem("defaultSyncOption");
      this.props.handleFetchDefaultSyncOption();
      if (ConfigService.getReaderConfig("isEnableKoodoSync") === "yes") {
        resetKoodoSync();
      }
    }
    toast.success(this.props.t("Deletion successful"));
  };
  handleSetDefaultSyncOption = async (newValue: string) => {
    if (!newValue) {
      return;
    }
    if (!this.props.isAuthed) {
      toast(this.props.t("This is a Pro feature"));
      return;
    }

    ConfigService.setItem("defaultSyncOption", newValue);
    if (ConfigService.getReaderConfig("isEnableKoodoSync") === "yes") {
      resetKoodoSync();
    }
    this.props.handleFetchDefaultSyncOption();
    toast.success(this.props.t("Change successful"));
    if (
      !(await ConfigUtil.isCloudEmpty()) &&
      ConfigService.getReaderConfig("isEnableKoodoSync") === "yes"
    ) {
      toast(
        this.props.t(
          "This data source already contains a library. If you need to merge local and cloud data, please turn off Koodo Sync and resync."
        ),
        {
          duration: 10000,
        }
      );
    }
  };
  handleSelectBackupOrRestoreSource = async (
    event: any,
    mode: "backup" | "restore"
  ) => {
    let targetDrive = event.target.value;
    if (!targetDrive) {
      this.setState({
        backupDrive: mode === "backup" ? "" : this.state.backupDrive,
        restoreDrive: mode === "restore" ? "" : this.state.restoreDrive,
      });
      return;
    }
    if (targetDrive === "add") {
      this.setState({ showDefaultSyncAddGrid: true });
      return;
    }
    if (
      targetDrive !== "local" &&
      !driveList
        .find((item) => item.value === targetDrive)
        ?.support.includes("browser") &&
      !isElectron
    ) {
      toast(
        this.props.t(
          "Koodo Reader's web version are limited by the browser, for more powerful features, please download the desktop version."
        )
      );
      return;
    }
    if (
      driveList.find((item) => item.value === targetDrive)?.isPro &&
      !this.props.isAuthed
    ) {
      toast(this.props.t("This is a Pro feature"));
      return;
    }
    this.setState({
      backupDrive: mode === "backup" ? targetDrive : this.state.backupDrive,
      restoreDrive: mode === "restore" ? targetDrive : this.state.restoreDrive,
    });
    if (mode === "backup") {
      this.handleBackupLibrary(targetDrive);
    } else {
      this.handleRestoreLibrary(targetDrive);
    }
  };
  handleBackupLibrary = async (name: string) => {
    if (!name) {
      return;
    }
    if (name === "local") {
      let result = await backup(name);
      if (result) {
        toast.dismiss("backup");
        toast.success(this.props.t("Execute successful"));
        this.props.handleFetchBooks();
        await generateSyncRecord();
      } else {
        toast.dismiss("backup");
        toast.error(this.props.t("Backup failed"));
      }
      return;
    }
    if (!(await TokenService.getToken(name + "_token"))) {
      this.props.handleTokenDialog(true);
      return;
    }
    toast.dismiss("backup");
    toast(this.props.t("Uploading, please wait"));
    this.props.handleLoadingDialog(true);
    let result = await backup(name);
    if (result) {
      this.props.handleLoadingDialog(false);
      toast.dismiss("backup");
      toast.success(this.props.t("Execute successful"));
      this.props.handleFetchBooks();
      await generateSyncRecord();
    } else {
      this.props.handleLoadingDialog(false);
      toast.dismiss("backup");
      toast.error(this.props.t("Upload failed, check your connection"));
    }
  };
  handleRestoreLibrary = async (name: string) => {
    if (!name) {
      return;
    }
    if (name === "local") {
      let result = await restore(name);
      if (result) {
        toast.dismiss("backup");
        toast.success(this.props.t("Execute successful"));
        this.props.handleFetchBooks();
        await generateSyncRecord();
        setTimeout(() => {
          this.props.history.push("/manager/home");
        }, 2000);
      } else {
        toast.dismiss("backup");
        toast.error(
          this.props.t("Download failed,network problem or no backup")
        );
      }
      return;
    }
    if (!(await TokenService.getToken(name + "_token"))) {
      this.props.handleTokenDialog(true);
      return;
    }
    this.props.handleLoadingDialog(true);
    toast.dismiss("backup");
    toast(this.props.t("Downloading, please wait"));
    let result = await restore(name);
    if (result) {
      this.props.handleLoadingDialog(false);
      toast.dismiss("backup");
      toast.success(this.props.t("Execute successful"));
      this.props.handleFetchBooks();
      await generateSyncRecord();
      setTimeout(() => {
        this.props.history.push("/manager/home");
      }, 2000);
    } else {
      this.props.handleLoadingDialog(false);
      toast.dismiss("backup");
      toast.error(this.props.t("Download failed,network problem or no backup"));
    }
  };
  handleCancelDrive = () => {
    this.props.handleSettingDrive("");
  };
  checkCorsForDrive = async (): Promise<boolean> => {
    toast.loading(i18n.t("Testing connection..."), {
      id: "testing-connection-id",
    });
    let corsResult = await testCORS(this.state.driveConfig.url);
    if (!corsResult && !isElectron) {
      const extensionInfo = await detectKoodoExtension();
      if (extensionInfo.installed) {
        vexComfirmAsync(
          this.props.t(
            "Please click the Koodo Reader extension icon in the upper right corner of the browser, authorize the request to this endpoint, and try again"
          )
        );
      }
    }
    if (!corsResult) {
      toast.dismiss("testing-connection-id");
      return false;
    }
    toast.dismiss("testing-connection-id");
    return true;
  };
  handleConfirmDrive = async () => {
    let flag = true;
    for (let item of driveInputConfig[this.props.settingDrive]) {
      if (!this.state.driveConfig[item.value] && item.required) {
        toast.error(
          this.props.t("Missing parameters") + ": " + this.props.t(item.label)
        );
        flag = false;
        break;
      }
    }
    if (!flag) {
      return;
    }
    if (
      this.props.settingDrive === "webdav" ||
      this.props.settingDrive === "docker" ||
      this.props.settingDrive === "ftp" ||
      this.props.settingDrive === "sftp" ||
      this.props.settingDrive === "mega" ||
      this.props.settingDrive === "s3compatible"
    ) {
      toast.loading(i18n.t("Adding"), { id: "adding-sync-id" });
      let res = await encryptToken(
        this.props.settingDrive,
        this.state.driveConfig
      );
      if (res.code === 200) {
        ConfigService.setListConfig(this.props.settingDrive, "dataSourceList");
        toast.success(i18n.t("Binding successful"), { id: "adding-sync-id" });
      } else {
        toast.error(i18n.t("Binding failed"), { id: "adding-sync-id" });
      }
    } else {
      await onSyncCallback(
        this.props.settingDrive,
        this.state.driveConfig.token
      );
    }
    SyncService.removeSyncUtil(this.props.settingDrive);
    removeCloudConfig(this.props.settingDrive);
    if (isElectron) {
      const { ipcRenderer } = window.require("electron");
      await ipcRenderer.invoke("cloud-close", {
        service: this.props.settingDrive,
      });
    }
    if (this.props.isAuthed && !ConfigService.getItem("defaultSyncOption")) {
      ConfigService.setItem("defaultSyncOption", this.props.settingDrive);
      if (ConfigService.getReaderConfig("isEnableKoodoSync") === "yes") {
        resetKoodoSync();
      }
      this.props.handleFetchDefaultSyncOption();
    }
    this.props.handleFetchDataSourceList();
    this.props.handleSettingDrive("");
  };

  renderSwitchOption = (optionList: any[]) => {
    return optionList.map((item) => {
      return (
        <div
          style={item.isElectron ? (isElectron ? {} : { display: "none" }) : {}}
          key={item.propName}
        >
          <div className="setting-dialog-new-title" key={item.title}>
            <span style={{ width: "calc(100% - 100px)" }}>
              <Trans>{item.title}</Trans>
            </span>

            <span
              className="single-control-switch"
              onClick={async () => {
                switch (item.propName) {
                  case "isEnableKoodoSync":
                    this.handleSetting(item.propName);
                    let encryptToken = await TokenService.getToken(
                      this.props.defaultSyncOption + "_token"
                    );
                    await updateUserConfig({
                      is_enable_koodo_sync:
                        ConfigService.getReaderConfig("isEnableKoodoSync"),
                      default_sync_option: this.props.defaultSyncOption,
                      default_sync_token: encryptToken || "",
                    });
                    let userInfo = await this.props.handleFetchUserInfo();
                    if (
                      ConfigService.getReaderConfig("isEnableKoodoSync") ===
                      "yes"
                    ) {
                      this.props.cloudSyncFunc(userInfo);
                    }

                    break;
                  case "autoOffline":
                    this.handleSetting(item.propName);
                    if (!this.state.autoOffline) {
                      if (this.props.defaultSyncOption === "adrive") {
                        toast.error(
                          this.props.t(
                            "Due to Aliyun Drive's stringent concurrency restrictions, we have bypassed the synchronization of books and covers. Please manually download the books by clicking on them"
                          ),
                          { id: "autoOffline" }
                        );
                        return;
                      }
                      let downloadTasks = await SyncHelper.syncBook(
                        ConfigService,
                        BookUtil
                      );
                      let timer = await showTaskProgress((_: boolean) => {});
                      if (!timer) {
                        return;
                      }
                      await SyncHelper.runTasksWithLimit(
                        downloadTasks,
                        99,
                        ConfigService.getItem("defaultSyncOption")
                      );
                      clearInterval(timer);

                      toast.success(this.props.t("Download completed"), {
                        id: "autoOffline",
                      });

                      setTimeout(() => {
                        toast.dismiss("syncing");
                      }, 3000);
                    }

                    break;
                  default:
                    this.handleSetting(item.propName);
                    break;
                }
              }}
              style={this.state[item.propName] ? {} : { opacity: 0.6 }}
            >
              <span
                className="single-control-button"
                style={
                  this.state[item.propName]
                    ? {
                        transform: "translateX(20px)",
                        transition: "transform 0.5s ease",
                      }
                    : {
                        transform: "translateX(0px)",
                        transition: "transform 0.5s ease",
                      }
                }
              ></span>
            </span>
          </div>
          <p className="setting-option-subtitle">
            <Trans>{item.desc}</Trans>
          </p>
        </div>
      );
    });
  };
  render() {
    return (
      <>
        {this.state.showDefaultSyncAddGrid && (
          <div
            className="account-login-grid"
            style={{
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              marginLeft: "25px",
              marginRight: "25px",
              fontWeight: 500,
              marginBottom: "20px",
            }}
          >
            {driveList
              .filter((item) => !this.props.dataSourceList.includes(item.value))
              .filter((item) => {
                if (!isElectron) {
                  return item.support.includes("browser");
                }
                return true;
              })
              .filter((item) => {
                if (
                  isElectron &&
                  process.platform !== "darwin" &&
                  item.value === "icloud"
                ) {
                  return false;
                }
                return true;
              })
              .map((item) => (
                <div
                  className="account-login-option"
                  key={item.value}
                  onClick={() => {
                    this.handleAddDataSourceFromGrid(item.value);
                  }}
                >
                  <span className="account-login-option-label">
                    {this.props.t(item.label) + (item.isPro ? " (Pro)" : "")}
                  </span>
                </div>
              ))}
          </div>
        )}
        {this.props.settingDrive && (
          <div
            className="voice-add-new-container"
            style={{
              marginLeft: "25px",
              width: "calc(100% - 50px)",
              fontWeight: 500,
            }}
          >
            {this.props.settingDrive === "webdav" ||
            this.props.settingDrive === "docker" ||
            this.props.settingDrive === "ftp" ||
            this.props.settingDrive === "sftp" ||
            this.props.settingDrive === "mega" ||
            this.props.settingDrive === "s3compatible" ? (
              <>
                {driveInputConfig[this.props.settingDrive].map((item) => {
                  return (
                    <div key={item.value}>
                      <input
                        type={item.type}
                        name={item.value}
                        key={item.value}
                        placeholder={
                          this.props.t(item.label) +
                          (item.required
                            ? ""
                            : " (" + this.props.t("Optional") + ")")
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            this.setState((prevState) => ({
                              driveConfig: {
                                ...prevState.driveConfig,
                                [item.value]: e.target.value.trim(),
                              },
                            }));
                          }
                        }}
                        onContextMenu={() => {
                          handleContextMenu(
                            "token-dialog-" + item.value + "-box",
                            true
                          );
                        }}
                        id={"token-dialog-" + item.value + "-box"}
                        className="token-dialog-username-box"
                      />
                      {item.value === "endpoint" ? (
                        <div
                          style={{
                            marginTop: "5px",
                            marginLeft: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {this.props.t(
                            "This endpoint usually don't contain bucket name"
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                      {item.example && (
                        <div
                          style={{
                            marginTop: "5px",
                            marginBottom: "2px",
                            marginLeft: "2px",
                            fontSize: "12px",
                            opacity: 0.8,
                          }}
                        >
                          {this.props.t("Example")}: {item.example}
                        </div>
                      )}
                      {item.note && (
                        <div
                          style={{
                            marginTop: "5px",
                            marginBottom: "2px",
                            marginLeft: "2px",
                            fontSize: "12px",
                            opacity: 0.8,
                          }}
                        >
                          {this.props.t(item.note)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <textarea
                  className="token-dialog-token-box"
                  id="token-dialog-token-box"
                  placeholder={this.props.t(
                    "Please click the authorize button below to authorize your account, enter the obtained credentials here, and then click the bind button below"
                  )}
                  onChange={(e) => {
                    if (e.target.value) {
                      this.setState((prevState) => ({
                        driveConfig: {
                          ...prevState.driveConfig,
                          token: e.target.value.trim(),
                        },
                      }));
                    }
                  }}
                  onContextMenu={() => {
                    handleContextMenu("token-dialog-token-box");
                  }}
                />
              </>
            )}
            {this.props.settingDrive === "webdav" && !isElectron && (
              <div
                className="token-dialog-tip"
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "rgba(231, 69, 69, 0.8)",
                }}
              >
                {this.props.t(
                  "Only WebDAV service provided by Alist is directly supported in Browser, Other WebDAV services need to enable CORS to work properly. Also due to browser's security restrictions, the WebDAV service must be accessed via HTTPS protocol when you're visiting Koodo Reader via HTTPS protocol."
                )}
              </div>
            )}
            {this.props.settingDrive === "docker" && !isElectron && (
              <div
                className="token-dialog-tip"
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "rgba(231, 69, 69, 0.8)",
                }}
              >
                {this.props.t(
                  "The Koodo Reader Docker version does not support the data source feature by default. You need to modify the configuration parameters during deployment to manually enable it. Also due to browser's security restrictions, the Docker service must be accessed via HTTPS protocol when you're visiting Koodo Reader via HTTPS protocol."
                )}
              </div>
            )}
            {this.props.settingDrive === "s3compatible" && !isElectron && (
              <div
                className="token-dialog-tip"
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "rgba(231, 69, 69, 0.8)",
                }}
              >
                {this.props.t(
                  "Some S3 services are not compatible with browser environments. If you encounter connection issues, please refer to the service provider's official documentation for instructions on enabling CORS. Also due to browser's security restrictions, the S3 service must be accessed via HTTPS protocol when you're visiting Koodo Reader via HTTPS protocol."
                )}
              </div>
            )}
            <div className="token-dialog-button-container">
              <div
                className="voice-add-confirm"
                onClick={async () => {
                  if (this.props.settingDrive === "webdav") {
                    if (!(await this.checkCorsForDrive())) {
                      return;
                    }
                  }
                  if (
                    this.props.settingDrive === "webdav" ||
                    this.props.settingDrive === "docker" ||
                    this.props.settingDrive === "ftp" ||
                    this.props.settingDrive === "sftp" ||
                    this.props.settingDrive === "mega" ||
                    this.props.settingDrive === "s3compatible"
                  ) {
                    let connectionResult = await testConnection(
                      this.props.settingDrive,
                      this.state.driveConfig
                    );
                    if (!connectionResult) {
                      return;
                    }
                  }
                  this.handleConfirmDrive();
                }}
              >
                <Trans>Bind</Trans>
              </div>

              <div className="voice-add-button-container">
                <div
                  className="voice-add-cancel"
                  onClick={() => {
                    this.handleCancelDrive();
                  }}
                >
                  <Trans>Cancel</Trans>
                </div>
                {(this.props.settingDrive === "dropbox" ||
                  this.props.settingDrive === "dubox" ||
                  this.props.settingDrive === "yandex" ||
                  this.props.settingDrive === "yiyiwu" ||
                  this.props.settingDrive === "google" ||
                  this.props.settingDrive === "boxnet" ||
                  this.props.settingDrive === "pcloud" ||
                  this.props.settingDrive === "adrive" ||
                  this.props.settingDrive === "microsoft_exp" ||
                  this.props.settingDrive === "microsoft") && (
                  <div
                    className="voice-add-confirm"
                    style={{ marginRight: "10px" }}
                    onClick={async () => {
                      this.handleJump(
                        new SyncUtil(this.props.settingDrive, {}).getAuthUrl(
                          getServerRegion() === "china" &&
                            (this.props.settingDrive === "microsoft" ||
                              this.props.settingDrive === "microsoft_exp" ||
                              this.props.settingDrive === "dubox" ||
                              this.props.settingDrive === "yiyiwu" ||
                              this.props.settingDrive === "adrive")
                            ? KookitConfig.ThirdpartyConfig.cnCallbackUrl
                            : KookitConfig.ThirdpartyConfig.callbackUrl
                        )
                      );
                    }}
                  >
                    <Trans>Authorize</Trans>
                  </div>
                )}
                {(this.props.settingDrive === "webdav" ||
                  this.props.settingDrive === "docker" ||
                  this.props.settingDrive === "ftp" ||
                  this.props.settingDrive === "sftp" ||
                  this.props.settingDrive === "mega" ||
                  this.props.settingDrive === "s3compatible") && (
                  <div
                    className="voice-add-confirm"
                    style={{ marginRight: "10px" }}
                    onClick={async () => {
                      if (this.props.settingDrive === "webdav") {
                        if (!(await this.checkCorsForDrive())) {
                          return;
                        }
                      }
                      testConnection(
                        this.props.settingDrive,
                        this.state.driveConfig
                      );
                    }}
                  >
                    <Trans>Test</Trans>
                  </div>
                )}
                {(this.props.settingDrive === "webdav" ||
                  this.props.settingDrive === "ftp" ||
                  this.props.settingDrive === "s3compatible" ||
                  this.props.settingDrive === "sftp") &&
                  ConfigService.getReaderConfig("lang") &&
                  ConfigService.getReaderConfig("lang").startsWith("zh") && (
                    <div
                      className="voice-add-cancel"
                      style={{ borderWidth: 0, lineHeight: "30px" }}
                      onClick={() => {
                        openExternalUrl(getWebsiteUrl() + "/zh/add-source");
                      }}
                    >
                      {this.props.t("How to fill out")}
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
        <div className="setting-dialog-new-title">
          <Trans>Backup library</Trans>
          <select
            name=""
            className="lang-setting-dropdown"
            value={this.state.backupDrive}
            onChange={(event) =>
              this.handleSelectBackupOrRestoreSource(event, "backup")
            }
          >
            <option value="" className="lang-setting-option">
              {this.props.t("Please select")}
            </option>
            {[
              { label: "Local", value: "local", isPro: false },
              ...driveList,
              { label: "Add data source", value: "add", isPro: false },
            ]
              .filter(
                (item) =>
                  this.props.dataSourceList.includes(item.value) ||
                  item.value === "local" ||
                  item.value === "add"
              )
              .map((item) => (
                <option
                  value={item.value}
                  key={item.value}
                  className="lang-setting-option"
                >
                  {this.props.t(item.label) + (item.isPro ? " (Pro)" : "")}
                </option>
              ))}
          </select>
        </div>
        <div className="setting-dialog-new-title">
          <Trans>Restore library</Trans>
          <select
            name=""
            className="lang-setting-dropdown"
            value={this.state.restoreDrive}
            onChange={(event) =>
              this.handleSelectBackupOrRestoreSource(event, "restore")
            }
          >
            <option value="" className="lang-setting-option">
              {this.props.t("Please select")}
            </option>
            {[
              { label: "Local", value: "local", isPro: false },
              ...driveList,
              { label: "Add data source", value: "add", isPro: false },
            ]
              .filter(
                (item) =>
                  this.props.dataSourceList.includes(item.value) ||
                  item.value === "local" ||
                  item.value === "add"
              )
              .map((item) => (
                <option
                  value={item.value}
                  key={item.value}
                  className="lang-setting-option"
                >
                  {this.props.t(item.label) + (item.isPro ? " (Pro)" : "")}
                </option>
              ))}
          </select>
        </div>
      </>
    );
  }
}

export default SyncSetting;
