// src/components/TaskForm.jsx
import React, { useState } from "react";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { InputBase } from "./InputBase";
import { TextareaBase } from "./TextareaBase";
import { SelectField } from "./SelectField";
import { ChecklistEditor } from "./ChecklistEditor";
import { priorityOptions, statusOptions } from "../utils/taskOptions";
import { useTaskForm } from "../hooks/useTaskForm";
import { FormProvider } from "react-hook-form";

export const TaskForm = ({ isOpen, onClose, onTaskCreated, addTaskToList }) => {
  const [newItem, setNewItem] = useState("");
  const {
    methods,
    fields,
    addChecklistItem,
    removeChecklistItem,
    toggleChecklistItem,
    handleSubmitForm,
  } = useTaskForm({ onTaskCreated, onClose, addTaskToList });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo mới Task">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
          <FormField
            label="Tiêu đề"
            error={methods.formState.errors.title?.message}
          >
            <InputBase
              {...methods.register("title", {
                required: "Tiêu đề task bắt buộc.",
              })}
              placeholder="Nhập tiêu đề task"
            />
          </FormField>

          <FormField label="Mô tả">
            <TextareaBase
              {...methods.register("description")}
              rows={3}
              placeholder="Mô tả chi tiết công việc"
            />
          </FormField>

          <FormField
            label="Deadline"
            error={methods.formState.errors.deadline?.message}
          >
            <InputBase
              {...methods.register("deadline", {
                required: "Deadline bắt buộc.",
              })}
              type="date"
            />
          </FormField>

          <FormField label="Ưu tiên">
            <SelectField
              {...methods.register("priority")}
              options={priorityOptions}
            />
          </FormField>

          <FormField label="Trạng thái">
            <SelectField
              {...methods.register("status")}
              options={statusOptions}
            />
          </FormField>

          <ChecklistEditor
            checklist={fields}
            newItem={newItem}
            setNewItem={setNewItem}
            onAdd={() => {
              addChecklistItem(newItem);
              setNewItem("");
            }}
            onRemove={removeChecklistItem}
            onToggle={toggleChecklistItem}
          />

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
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2"
            >
              Tạo mới
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
