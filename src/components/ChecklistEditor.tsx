import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface ChecklistItem {
  id: string | number;
  text: string;
  done: boolean;
}

interface ChecklistEditorProps {
  checklist: ChecklistItem[];
  newItem: string;
  setNewItem: (value: string) => void;
  onAdd: () => void;
  onRemove: (id: string | number) => void;
  onToggle: (id: string | number) => void;
}

export function ChecklistEditor({
  checklist,
  newItem,
  setNewItem,
  onAdd,
  onRemove,
  onToggle,
}: ChecklistEditorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Checklist</label>
      <div className="flex flex-col gap-2 mb-2 max-h-32 overflow-y-auto">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => onToggle(item.id)}
                className="w-4 h-4 accent-blue-500"
              />
              <span className={item.done ? 'line-through text-gray-400' : ''}>{item.text}</span>
            </label>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md p-2"
          placeholder="Thêm checklist mới"
        />
        <button
          type="button"
          onClick={onAdd}
          className="bg-gray-900 hover:bg-black text-white rounded-md px-3 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
