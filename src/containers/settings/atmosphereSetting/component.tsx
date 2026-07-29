import React from "react";
import "./atmosphereSetting.css";
import { Trans } from "react-i18next";
import toast from "react-hot-toast";
import { ConfigService } from "../../../assets/lib/kookit-extra-browser.min";
import { AtmosphereSettingProps, AtmosphereSettingState } from "./interface";
import audioManager from "../../../utils/audio/audioManager";

declare var window: any;

const SUPPORTED_FORMATS = ["mp3", "wav", "flac", "ogg", "m4a"];

class AtmosphereSetting extends React.Component<
  AtmosphereSettingProps,
  AtmosphereSettingState
> {
  private atmosphereEnabledHandler: (() => void) | null = null;

  constructor(props: AtmosphereSettingProps) {
    super(props);

    const filePath =
      ConfigService.getReaderConfig("atmosphereFilePath") || "";

    this.state = {
      enabled:
        ConfigService.getReaderConfig("atmosphereEnabled") === "yes",
      filePath,
      volume: parseInt(
        ConfigService.getReaderConfig("atmosphereVolume") || "70",
        10
      ),
      loop:
        ConfigService.getReaderConfig("atmosphereLoop") !== "no",
      fadeIn: parseFloat(
        ConfigService.getReaderConfig("atmosphereFadeIn") || "3"
      ),
      fadeOut: parseFloat(
        ConfigService.getReaderConfig("atmosphereFadeOut") || "3"
      ),
      fileMissing: filePath !== "" && !this.checkFileExists(filePath),
      fileInvalid: filePath !== "" && !this.isSupportedFile(filePath),
    };
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  componentDidMount() {
    this.atmosphereEnabledHandler = () => {
      this.setState({
        enabled: ConfigService.getReaderConfig("atmosphereEnabled") === "yes",
      });
    };
    window.addEventListener(
      "atmosphere-enabled-changed",
      this.atmosphereEnabledHandler
    );
  }

  componentWillUnmount() {
    if (this.atmosphereEnabledHandler) {
      window.removeEventListener(
        "atmosphere-enabled-changed",
        this.atmosphereEnabledHandler
      );
      this.atmosphereEnabledHandler = null;
    }
  }

  private checkFileExists(filePath: string): boolean {
    try {
      const fs = window.require("fs");
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  private save(key: string, value: string) {
    ConfigService.setReaderConfig(key, value);
  }

  private isSupportedFile(filePath: string): boolean {
    const extension = filePath.split(".").pop()?.toLowerCase();
    return !!extension && SUPPORTED_FORMATS.includes(extension);
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  handleToggleEnabled = async () => {
    const next = !this.state.enabled;
    this.save("atmosphereEnabled", next ? "yes" : "no");
    this.setState({ enabled: next });
    window.dispatchEvent(new Event("atmosphere-enabled-changed"));
    if (!next) {
      audioManager.dispose();
    } else if (!this.state.filePath) {
      toast.error(this.props.t("Choose an audio file first."));
    } else if (this.state.fileMissing || this.state.fileInvalid) {
      toast.error(this.props.t("The selected audio file is unavailable."));
    } else {
      await audioManager.play();
    }
    toast.success(this.props.t("Change successful"));
  };

  handleToggleLoop = () => {
    const next = !this.state.loop;
    this.save("atmosphereLoop", next ? "yes" : "no");
    this.setState({ loop: next });
    audioManager.applySettings();
    toast.success(this.props.t("Change successful"));
  };

  handlePickFile = async () => {
    try {
      const { ipcRenderer } = window.require("electron");
      const filePath: string | undefined = await ipcRenderer.invoke(
        "select-file",
        {
          filters: [
            {
              name: "Audio files",
              extensions: SUPPORTED_FORMATS,
            },
          ],
        }
      );
      if (!filePath) return;

      const fileMissing = !this.checkFileExists(filePath);
      const fileInvalid = !this.isSupportedFile(filePath);
      this.save("atmosphereFilePath", filePath);
      this.setState({ filePath, fileMissing, fileInvalid });

      if (fileMissing || fileInvalid) {
        toast.error(this.props.t("The selected audio file is unavailable."));
        return;
      }

      if (this.state.enabled) {
        await audioManager.play();
      }
      toast.success(this.props.t("Change successful"));
    } catch (err) {
      console.error("[AtmosphereSetting] File picker error:", err);
      toast.error(this.props.t("Unable to open the audio file picker."));
    }
  };

  handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    this.save("atmosphereVolume", String(value));
    this.setState({ volume: value });
    audioManager.applySettings();
  };

  handleFadeInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseFloat(e.target.value) || 0);
    this.save("atmosphereFadeIn", String(value));
    this.setState({ fadeIn: value });
  };

  handleFadeOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseFloat(e.target.value) || 0);
    this.save("atmosphereFadeOut", String(value));
    this.setState({ fadeOut: value });
  };

  // ── Render helpers ─────────────────────────────────────────────────────────

  renderToggle(active: boolean, onClick: () => void) {
    return (
      <span
        className="single-control-switch"
        onClick={onClick}
        style={active ? {} : { opacity: 0.6 }}
      >
        <span
          className="single-control-button"
          style={
            active
              ? { transform: "translateX(20px)", transition: "transform 0.5s ease" }
              : { transform: "translateX(0px)", transition: "transform 0.5s ease" }
          }
        />
      </span>
    );
  }

  render() {
    const {
      enabled,
      filePath,
      volume,
      loop,
      fadeIn,
      fadeOut,
      fileMissing,
      fileInvalid,
    } = this.state;

    // Short display name for the chosen file
    const fileName = filePath
      ? filePath.replace(/\\/g, "/").split("/").filter(Boolean).pop() || filePath
      : "";

    return (
      <>
        {/* ── Enable toggle ── */}
        <div className="setting-dialog-new-title">
          <Trans>Enable background music</Trans>
          {this.renderToggle(enabled, this.handleToggleEnabled)}
        </div>

        {/* ── File picker ── */}
        <div className="setting-dialog-new-title audio-file-setting">
          <span className="audio-file-label">
            <Trans>Audio File</Trans>
            <span className="audio-file-name">
              {fileName || <Trans>No file selected</Trans>}
            </span>
          </span>
          <span
            className="change-location-button"
            onClick={this.handlePickFile}
          >
            <Trans>{fileName ? "Change..." : "Browse..."}</Trans>
          </span>
        </div>

        {/* Missing-file warning */}
        {(fileMissing || fileInvalid) && (
          <p className="setting-option-subtitle" style={{ color: "#e05c5c" }}>
            <Trans>
              The selected audio file is unavailable or unsupported. Please
              choose a new file.
            </Trans>
          </p>
        )}

        {/* ── Volume ── */}
        <div className="setting-dialog-new-title audio-volume-setting">
          <Trans>Volume</Trans>
          <span className="audio-volume-control">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={this.handleVolumeChange}
              className="audio-volume-slider"
            />
            <span className="audio-volume-value">
              {volume}%
            </span>
          </span>
        </div>

        {/* ── Loop toggle ── */}
        <div className="setting-dialog-new-title">
          <Trans>Loop</Trans>
          {this.renderToggle(loop, this.handleToggleLoop)}
        </div>

        {/* ── Fade in ── */}
        <div className="setting-dialog-new-title">
          <Trans>Fade in duration (seconds)</Trans>
          <input
            type="number"
            min={0}
            max={60}
            step={0.5}
            value={fadeIn}
            onChange={this.handleFadeInChange}
            className="lang-setting-dropdown"
            style={{ width: "70px", textAlign: "center" }}
          />
        </div>

        {/* ── Fade out ── */}
        <div className="setting-dialog-new-title">
          <Trans>Fade out duration (seconds)</Trans>
          <input
            type="number"
            min={0}
            max={60}
            step={0.5}
            value={fadeOut}
            onChange={this.handleFadeOutChange}
            className="lang-setting-dropdown"
            style={{ width: "70px", textAlign: "center" }}
          />
        </div>
      </>
    );
  }
}

export default AtmosphereSetting;
