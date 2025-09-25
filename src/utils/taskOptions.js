export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

export const TaskPriority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const statusOptions = [
  { value: TaskStatus.TODO, label: 'Chưa làm' },
  { value: TaskStatus.IN_PROGRESS, label: 'Đang làm' },
  { value: TaskStatus.DONE, label: 'Hoàn thành' },
];

export const priorityOptions = [
  { value: TaskPriority.HIGH, label: 'Cao' },
  { value: TaskPriority.MEDIUM, label: 'Trung bình' },
  { value: TaskPriority.LOW, label: 'Thấp' },
];
