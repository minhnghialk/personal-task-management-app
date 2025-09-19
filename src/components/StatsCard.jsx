import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const StatsCard = ({ stats, chartData, COLORS }) => (
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6">
    {/* Stats Table */}
    <div className="flex-1">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Dashboard thống kê nhanh
      </h2>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
        <div>Tổng số Task</div>
        <div>{stats.total}</div>
        <div>Đã hoàn thành</div>
        <div>{stats.done}</div>
        <div>Đang làm</div>
        <div>{stats.inProgress}</div>
        <div>Trễ hạn</div>
        <div>{stats.overdue}</div>
      </div>
    </div>

    {/* Pie Chart + Legend */}
    <div className="flex-1">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-gray-700">
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
