export type RouteItem = {
  path: string;
  importPath: string;
  name: string;
  protected?: boolean;
  children?: RouteItemChild | RouteItemChild[];
};

export type RouteItemChild = RouteItem & { index?: boolean };

export type RoutesConfig = RouteItem[];

export const routes: RoutesConfig = [
  {
    path: '/register',
    importPath: '../auth/RegisterPage',
    name: 'RegisterPage',
  },
  { path: '/login', importPath: '../auth/LoginPage', name: 'LoginPage' },
  {
    path: '/forgot-password',
    importPath: '../auth/ForgotPasswordPage',
    name: 'ForgotPasswordPage',
  },
  {
    path: '/reset-password',
    importPath: '../auth/ResetPasswordPage',
    name: 'ResetPasswordPage',
  },
  {
    path: '/dashboard',
    importPath: '../pages/DashboardLayout',
    name: 'DashboardLayout',
    protected: true,
    children: [
      {
        path: '',
        importPath: '../pages/Dashboard',
        name: 'DashboardPage',
        index: true,
      },
      {
        path: 'tasks',
        importPath: '../components/TaskListSection',
        name: 'TaskListSection',
      },
      {
        path: 'stats',
        importPath: '../components/StatsSection',
        name: 'StatsSection',
      },
      {
        path: 'profile',
        importPath: '../components/ProfileSection',
        name: 'ProfileSection',
      },
    ],
  },
];
