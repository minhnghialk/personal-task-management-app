export const StatsPanel = ({ stats }) => (
  <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
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
  </div>
);
