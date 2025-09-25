import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaskListSection } from '../../pages/DashboardTaskList';

describe('TaskListSection component', () => {
  test('renders title and description', () => {
    render(<TaskListSection />);
    expect(screen.getByText('Danh sách Task')).toBeInTheDocument();
    expect(
      screen.getByText('Đây là màn hình hiển thị tất cả danh sách task (khác với Dashboard).'),
    ).toBeInTheDocument();
  });
});
