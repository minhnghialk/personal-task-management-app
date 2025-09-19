export const TaskStatusBadge = ({ status }) => {
  const styles =
    status === "todo"
      ? "bg-gray-100 text-gray-700"
      : status === "in_progress"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  const label =
    status === "todo"
      ? "Chưa làm"
      : status === "in_progress"
      ? "Đang làm"
      : "Hoàn thành";

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full font-semibold text-xs sm:text-sm ${styles}`}
    >
      {label}
    </span>
  );
};
