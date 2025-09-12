import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useNotifyAndNavigate = () => {
  const navigate = useNavigate();

  const notify = (message, path, delay = 4000) => {
    toast.success(message);
    setTimeout(() => navigate(path), delay);
  };

  return notify;
};
