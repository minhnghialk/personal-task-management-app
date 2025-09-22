import React from "react";
import { StatsCard } from "./StatsCard";
import { stats, chartData, COLORS } from "../utils/data";

export const StatsSection = () => {
  return <StatsCard stats={stats} chartData={chartData} COLORS={COLORS} />;
};
