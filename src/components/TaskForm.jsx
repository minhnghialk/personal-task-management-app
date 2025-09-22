import React from "react";
import { useTaskForm } from "../hooks/useTaskForm";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { InputBase } from "./InputBase";
import { SelectField } from "./SelectField";
import { TextareaBase } from "./TextareaBase";
import { ChecklistEditor } from "./ChecklistEditor";
import { priorityOptions, statusOptions } from "../utils/taskOptions";

export const TaskForm = ({ isOpen, onClose, user, onTaskCreated }) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    deadline,
    setDeadline,
    priority,
    setPriority,
    status,
    setStatus,
    checklist,
    newItem,
    setNewItem,
    errors,
    loading,
    handleAddChecklistItem,
    handleRemoveChecklistItem,
    handleToggleChecklist,
    handleSubmit,
  } = useTaskForm({ user, onTaskCreated, onClose });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo mới Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Tiêu đề */}
        <FormField label="Tiêu đề" error={errors.title}>
          <InputBase
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề task"
            error={errors.title}
          />
        </FormField>

        {/* Mô tả */}
        <FormField label="Mô tả">
          <TextareaBase
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả chi tiết công việc"
            rows={3}
          />
        </FormField>

        {/* Deadline */}
        <FormField label="Deadline" error={errors.deadline}>
          <InputBase
            type="date"
            value={deadline ? deadline.toString().split("T")[0] : ""}
            onChange={(e) => setDeadline(e.target.value)}
            error={errors.deadline}
          />
        </FormField>

        {/* Priority */}
        <FormField label="Ưu tiên">
          <SelectField
            value={priority}
            onChange={setPriority}
            options={priorityOptions}
          />
        </FormField>

        {/* Status */}
        <FormField label="Trạng thái">
          <SelectField
            value={status}
            onChange={setStatus}
            options={statusOptions}
          />
        </FormField>

        {/* Checklist */}
        <ChecklistEditor
          checklist={checklist}
          newItem={newItem}
          setNewItem={setNewItem}
          onAdd={handleAddChecklistItem}
          onRemove={handleRemoveChecklistItem}
          onToggle={handleToggleChecklist}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
