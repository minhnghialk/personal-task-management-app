export const tasks = [
  { id: 1, name: 'Quan trọng', priority: 'Cao', deadline: '20/04/2024' },
  { id: 2, name: 'Ít quan trọng', priority: 'Cao', deadline: '21/04/2024' },
  { id: 3, name: 'Quan trọng', priority: 'Thấp', deadline: '22/04/2024' },
  { id: 4, name: 'Ít quan trọng', priority: 'Thấp', deadline: '24/04/2024' },
  { id: 5, name: 'Trễ hạn', priority: 'Thấp', deadline: '24/04/2024' },
];

export const stats = { total: 10, done: 3, inProgress: 5, overdue: 2 };

export const chartData = [
  { name: 'Đã hoàn thành', value: stats.done },
  { name: 'Đang làm', value: stats.inProgress },
  { name: 'Trễ hạn', value: stats.overdue },
];

export const COLORS = ['#22c55e', '#3b82f6', '#ef4444'];

export const menuItems = [
  { name: 'Dashboard', iconName: 'Home', path: '/dashboard' },
  { name: 'Danh sách Task', iconName: 'List', path: '/dashboard/tasks' },
  { name: 'Thống kê', iconName: 'BarChart2', path: '/dashboard/stats' },
  { name: 'Hồ sơ cá nhân', iconName: 'User', path: '/dashboard/profile' },
];
