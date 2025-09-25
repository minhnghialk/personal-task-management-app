// src/tests/pages/DashboardPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardPage } from '../../pages/DashboardIndex';
import { useSelector } from 'react-redux';
import { useTasks } from '../../hooks/useTasks';
import { TaskSection } from '../../components/TaskSection';
import { StatsSection } from '../../components/StatsSection';

// ------------------ Mock Supabase ------------------
jest.mock('../../api/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  },
}));

// ------------------ Mock Redux ------------------
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// ------------------ Mock hook useTasks ------------------
jest.mock('../../hooks/useTasks');

// ------------------ Mock Components ------------------
jest.mock('../../components/TaskSection', () => ({
  TaskSection: jest.fn(() => <div data-testid="task-section" />),
}));

jest.mock('../../components/StatsSection', () => ({
  StatsSection: jest.fn(() => <div data-testid="stats-section" />),
}));

describe('DashboardPage', () => {
  const mockSetTasks = jest.fn();
  const mockToggleTaskCompletion = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Redux user
    useSelector.mockReturnValue({ email: 'test@example.com' });

    // Mock useTasks hook
    useTasks.mockReturnValue({
      tasks: [
        { id: '1', title: 'Task 1', status: 'todo' },
        { id: '2', title: 'Task 2', status: 'done' },
      ],
      loading: false,
      setTasks: mockSetTasks,
      toggleTaskCompletion: mockToggleTaskCompletion,
    });
  });

  it('should render TaskSection and StatsSection', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('task-section')).toBeInTheDocument();
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();
  });

  it('should call setTasks when onTaskCreated is triggered', () => {
    render(<DashboardPage />);

    const taskSectionProps = TaskSection.mock.calls[0][0];
    const newTask = { id: '3', title: 'New Task', status: 'todo' };

    // Trigger onTaskCreated callback
    taskSectionProps.onTaskCreated(newTask);

    expect(mockSetTasks).toHaveBeenCalledTimes(1);
    expect(mockSetTasks).toHaveBeenCalledWith(expect.any(Function));

    // Test nội bộ function của setTasks(prev => [newTask, ...prev])
    const prevTasks = useTasks().tasks;
    const result = mockSetTasks.mock.calls[0][0](prevTasks);
    expect(result).toEqual([newTask, ...prevTasks]);
  });

  it('should call toggleTaskCompletion when onToggleCompletion is triggered', () => {
    render(<DashboardPage />);

    const taskSectionProps = TaskSection.mock.calls[0][0];
    const taskId = '1';

    taskSectionProps.onToggleCompletion(taskId);

    expect(mockToggleTaskCompletion).toHaveBeenCalledTimes(1);
    expect(mockToggleTaskCompletion).toHaveBeenCalledWith(taskId);
  });
});
