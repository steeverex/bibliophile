import { RouteComponentProps } from "react-router";

export interface StatsProps extends RouteComponentProps<any> {
  t: (title: string) => string;
}

export interface StatsState {
  last30Days: { date: string; seconds: number }[];
  heatmapData: { date: string; seconds: number }[];
  chartTab: "line" | "bar";
  isLoading: boolean;
}
