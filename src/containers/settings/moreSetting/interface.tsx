import { RouteComponentProps } from "react-router-dom";

export interface MoreSettingProps extends RouteComponentProps<any> {
  t: (title: string) => string;
  handleSettingMode: (mode: string) => void;
}

export interface MoreSettingState {
  protectionMethod: string;
  biometricAvailable: boolean;
  pinInputMode: "none" | "setup-enter" | "setup-confirm" | "verify";
  pinValue: string;
  pinFirstValue: string;
  pinCallback: ((pin: string | false) => void) | null;
  confirmPreset: { id: string; label: string; css: string } | null;
}
