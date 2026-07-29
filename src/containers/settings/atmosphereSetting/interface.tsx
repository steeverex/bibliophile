import { RouteComponentProps } from "react-router-dom";

export interface AtmosphereSettingProps extends RouteComponentProps<any> {
  t: (title: string) => string;
}

export interface AtmosphereSettingState {
  enabled: boolean;
  filePath: string;
  volume: number;
  loop: boolean;
  fadeIn: number;
  fadeOut: number;
  /** true when the saved file path no longer exists on disk */
  fileMissing: boolean;
  /** true when the saved file is not a supported audio format */
  fileInvalid: boolean;
}
