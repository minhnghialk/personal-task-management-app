export const MENUS = {
  DASHBOARD: 'Dashboard',
  TASK_LIST: 'Danh sách Task',
  STATS: 'Thống kê',
  PROFILE: 'Hồ sơ cá nhân',
} as const;

export type MenuKey = keyof typeof MENUS;
export type MenuLabel = (typeof MENUS)[MenuKey];
