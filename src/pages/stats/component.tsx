import React from "react";
import "./stats.css";
import { StatsProps, StatsState } from "./interface";
import { withRouter } from "react-router-dom";
import { Trans } from "react-i18next";
import { ConfigService, ReadingTimeUtil } from "../../assets/lib/kookit-extra-browser.min";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, TooltipValueType, XAxis, YAxis } from "recharts";

const formatMinutesTooltip = (value: TooltipValueType | undefined) =>
  value === undefined ? "" : `${value} min`;

class Stats extends React.Component<StatsProps, StatsState> {
  private readingTime = new ReadingTimeUtil(ConfigService, { registerUnloadHandler: () => () => {} });

  state: StatsState = { last30Days: [], heatmapData: [], chartTab: "bar", isLoading: true };

  componentDidMount() { this.loadActivity(); }

  dateToKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }

  async loadActivity() {
    const secondsByDate: Record<string, number> = {};
    this.readingTime.getAllDates().forEach((key) => {
      secondsByDate[key] = this.readingTime.getDayStats(key).reduce((sum, stat) => sum + stat.seconds, 0);
    });
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 29 + index);
      return { date: `${date.getMonth() + 1}/${date.getDate()}`, seconds: secondsByDate[this.dateToKey(date)] || 0 };
    });
    const start = new Date(today);
    start.setDate(today.getDate() - 51 * 7 - today.getDay());
    const heatmapData: { date: string; seconds: number }[] = [];
    for (const date = new Date(start); date <= today; date.setDate(date.getDate() + 1)) {
      const key = this.dateToKey(date);
      heatmapData.push({ date: key, seconds: secondsByDate[key] || 0 });
    }
    this.setState({ last30Days, heatmapData, isLoading: false });
  }

  isDark() { const skin = ConfigService.getReaderConfig("appSkin"); return skin === "night" || (skin === "system" && ConfigService.getReaderConfig("isOSNight") === "yes"); }
  formatTime(seconds: number) { return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m`; }
  heatColor(seconds: number, dark: boolean) {
    if (!seconds) return dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)";
    if (seconds < 300) return dark ? "#0e4429" : "#9be9a8";
    if (seconds < 900) return dark ? "#006d32" : "#40c463";
    if (seconds < 1800) return dark ? "#26a641" : "#30a14e";
    return dark ? "#39d353" : "#216e39";
  }

  renderHeatmap() {
    const dark = this.isDark();
    const padded = [...this.state.heatmapData, ...Array((7 - (this.state.heatmapData.length % 7 || 7)) % 7).fill(null)] as ({ date: string; seconds: number } | null)[];
    const weeks = Array.from({ length: Math.ceil(padded.length / 7) }, (_, index) => padded.slice(index * 7, index * 7 + 7));
    const levels = [0, 200, 600, 1200, 2400];
    return <div><div className="heatmap-layout"><div className="heatmap-side"><div className="heatmap-month-spacer" /><div className="heatmap-weekdays">{["", "Mon", "", "Wed", "", "Fri", ""].map((day, index) => <div key={index} className="heatmap-weekday-label">{day}</div>)}</div></div><div className="heatmap-main"><div className="heatmap-months">{weeks.map((week, index) => { const first = week.find(Boolean); const label = first && (index === 0 || new Date(first.date).getDate() <= 7) ? new Date(first.date).toLocaleString("default", { month: "short" }) : ""; return <div key={index} className="heatmap-month-label">{label}</div>; })}</div><div className="heatmap-grid">{weeks.map((week, index) => <div key={index} className="heatmap-col">{week.map((cell, day) => <div key={day} className="heatmap-cell" title={cell ? `${cell.date}: ${this.formatTime(cell.seconds)}` : ""} style={cell ? { backgroundColor: this.heatColor(cell.seconds, dark) } : { visibility: "hidden" }} />)}</div>)}</div></div></div><div className="heatmap-legend"><span>Less</span>{levels.map((level) => <div key={level} className="heatmap-legend-cell" style={{ backgroundColor: this.heatColor(level, dark) }} />)}<span>More</span></div></div>;
  }

  render() {
    const dark = this.isDark();
    const cardBg = dark ? "#2a2a2a" : "#fff";
    const text = dark ? "#e0e0e0" : "#333";
    const grid = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
    const chartData = this.state.last30Days.map((day) => ({ ...day, minutes: Math.round(day.seconds / 60) }));
    const tooltipStyle = { backgroundColor: dark ? "#2a2a2a" : "#25202a", border: "1px solid #ff2e97", borderRadius: 10, color: "#ffe3f3", fontFamily: "inherit", fontSize: 13, boxShadow: "0 8px 24px rgba(0,0,0,.22)" };
    const tooltipLabelStyle = { color: "#ff9bcd", fontWeight: 600 };
    const chart = this.state.chartTab === "bar" ? <BarChart data={chartData}><CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" interval={4} tickLine={false} axisLine={false} /><YAxis tickFormatter={(value) => `${value}m`} tickLine={false} axisLine={false} /><Tooltip formatter={formatMinutesTooltip} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={{ color: "#ffe3f3" }} cursor={{ fill: "rgba(255,46,151,.08)" }} /><Bar dataKey="minutes" fill={text} radius={[4, 4, 0, 0]} /></BarChart> : <AreaChart data={chartData}><CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" interval={4} tickLine={false} axisLine={false} /><YAxis tickFormatter={(value) => `${value}m`} tickLine={false} axisLine={false} /><Tooltip formatter={formatMinutesTooltip} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={{ color: "#ffe3f3" }} cursor={{ fill: "rgba(255,46,151,.08)" }} /><Area dataKey="minutes" stroke="none" fill="#ffb066" fillOpacity={.2} /><Line dataKey="minutes" stroke="#ffb066" strokeWidth={2.5} dot={false} /></AreaChart>;
    return <div className="stats-page" style={{ backgroundColor: dark ? "#1e1e1e" : "#f5f5f5", color: text }}><div className="stats-close-btn" onClick={() => this.props.history.push("/manager/home")}><span className="icon-close" /></div><div className="stats-title"><Trans>Reading Stats</Trans></div>{!this.state.isLoading && <><section className="stats-heatmap-wrapper" style={{ backgroundColor: cardBg }}><div className="stats-section-title"><Trans>Reading Heatmap</Trans></div>{this.renderHeatmap()}</section><section className="stats-chart-wrapper" style={{ backgroundColor: cardBg }}><div className="stats-section-title"><Trans>30-Day Activity</Trans></div><div className="stats-chart-tabs"><button className="stats-chart-tab" onClick={() => this.setState({ chartTab: "bar" })}>Bar Chart</button><button className="stats-chart-tab" onClick={() => this.setState({ chartTab: "line" })}>Line Chart</button></div><ResponsiveContainer width="100%" height={300}>{chart}</ResponsiveContainer></section></>}</div>;
  }
}

export default withRouter(Stats as any);
