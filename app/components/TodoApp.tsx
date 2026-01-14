'use client';

import { useState } from 'react';

type Status = 'Pending' | 'Running' | 'Completed';

interface SubTask {
  id: string;
  title: string;
  status: Status;
}

interface Task {
  id: string;
  title: string;
  status: Status;
  subtasks: SubTask[];
  isExpanded: boolean;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingType, setEditingType] = useState<'task' | 'subtask'>('task');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [addingSubtaskForId, setAddingSubtaskForId] = useState<string | null>(null);

  const addTask = () => {
    if (newTaskTitle.trim() === '') return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'Pending',
      subtasks: [],
      isExpanded: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, status: Status) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const toggleTaskExpand = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
    ));
  };

  const startEditingTask = (taskId: string, currentTitle: string) => {
    setEditingId(taskId);
    setEditingTitle(currentTitle);
    setEditingType('task');
  };

  const saveTaskEdit = (taskId: string) => {
    if (editingTitle.trim() === '') return;

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: editingTitle } : task
    ));
    setEditingId(null);
    setEditingTitle('');
  };

  const addSubtask = (taskId: string) => {
    if (newSubtaskTitle.trim() === '') return;

    const newSubtask: SubTask = {
      id: `${taskId}-${Date.now()}`,
      title: newSubtaskTitle,
      status: 'Pending',
    };

    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: [...task.subtasks, newSubtask], isExpanded: true }
        : task
    ));
    setNewSubtaskTitle('');
    setAddingSubtaskForId(null);
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: task.subtasks.filter(st => st.id !== subtaskId) }
        : task
    ));
  };

  const updateSubtaskStatus = (taskId: string, subtaskId: string, status: Status) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, status } : st
            ),
          }
        : task
    ));
  };

  const startEditingSubtask = (taskId: string, subtaskId: string, currentTitle: string) => {
    setEditingId(subtaskId);
    setEditingTitle(currentTitle);
    setEditingType('subtask');
  };

  const saveSubtaskEdit = (taskId: string, subtaskId: string) => {
    if (editingTitle.trim() === '') return;

    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, title: editingTitle } : st
            ),
          }
        : task
    ));
    setEditingId(null);
    setEditingTitle('');
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Running':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed':
        return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">TODO管理アプリ</h1>

      {/* タスク追加フォーム */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="新しいタスクを入力..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
        />
        <button
          onClick={addTask}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          追加
        </button>
      </div>

      {/* タスク一覧 */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="border border-gray-300 rounded-lg p-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {/* 展開/折りたたみボタン */}
              {task.subtasks.length > 0 && (
                <button
                  onClick={() => toggleTaskExpand(task.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {task.isExpanded ? '▼' : '▶'}
                </button>
              )}

              {/* タスクタイトル */}
              {editingId === task.id && editingType === 'task' ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveTaskEdit(task.id)}
                  onBlur={() => saveTaskEdit(task.id)}
                  className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none dark:bg-gray-800"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => startEditingTask(task.id, task.title)}
                  className="flex-1 cursor-pointer hover:text-blue-500"
                >
                  {task.title}
                </span>
              )}

              {/* ステータス選択 */}
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value as Status)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
              >
                <option value="Pending">Pending</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>

              {/* サブタスク追加ボタン */}
              <button
                onClick={() => setAddingSubtaskForId(task.id)}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                + サブタスク
              </button>

              {/* 削除ボタン */}
              <button
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                削除
              </button>
            </div>

            {/* サブタスク追加フォーム */}
            {addingSubtaskForId === task.id && (
              <div className="mt-3 ml-8 flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSubtask(task.id)}
                  placeholder="サブタスクを入力..."
                  className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  autoFocus
                />
                <button
                  onClick={() => addSubtask(task.id)}
                  className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  追加
                </button>
                <button
                  onClick={() => {
                    setAddingSubtaskForId(null);
                    setNewSubtaskTitle('');
                  }}
                  className="px-4 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  キャンセル
                </button>
              </div>
            )}

            {/* サブタスク一覧 */}
            {task.isExpanded && task.subtasks.length > 0 && (
              <div className="mt-3 ml-8 space-y-2">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded dark:bg-gray-800">
                    {/* サブタスクタイトル */}
                    {editingId === subtask.id && editingType === 'subtask' ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveSubtaskEdit(task.id, subtask.id)}
                        onBlur={() => saveSubtaskEdit(task.id, subtask.id)}
                        className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none dark:bg-gray-700"
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => startEditingSubtask(task.id, subtask.id, subtask.title)}
                        className="flex-1 cursor-pointer hover:text-blue-500 text-sm"
                      >
                        {subtask.title}
                      </span>
                    )}

                    {/* ステータス選択 */}
                    <select
                      value={subtask.status}
                      onChange={(e) => updateSubtaskStatus(task.id, subtask.id, e.target.value as Status)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subtask.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Running">Running</option>
                      <option value="Completed">Completed</option>
                    </select>

                    {/* 削除ボタン */}
                    <button
                      onClick={() => deleteSubtask(task.id, subtask.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          タスクがありません。上のフォームから追加してください。
        </div>
      )}
    </div>
  );
}
