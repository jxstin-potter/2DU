import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task } from '../../types';
import { computeNewOrder } from '../../utils/taskHelpers';
import TaskList from './TaskList';

export interface TaskDragAndDropProps {
  tasks: Task[];
  onReorder?: (reorderedTasks: Task[]) => void;
  isLoading?: boolean;
}

/**
 * Wrapper that provides DragDropContext + TaskList in Manual (draggable) mode.
 * Used for component tests and any consumer that needs a self-contained draggable list.
 * On drag end, calls onReorder with the new task list (order field updated on the moved task).
 */
const TaskDragAndDrop: React.FC<TaskDragAndDropProps> = ({
  tasks,
  onReorder,
  isLoading = false,
}) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination } = result;
      if (source.index === destination.index) return;

      const displayTasks = [...localTasks];
      const [movedTask] = displayTasks.splice(source.index, 1);
      displayTasks.splice(destination.index, 0, movedTask);

      const before = displayTasks[destination.index - 1];
      const after = displayTasks[destination.index + 1];
      const newOrder = computeNewOrder(before, after);

      const reordered = localTasks.map((t) =>
        t.id === movedTask.id ? { ...t, order: newOrder } : t
      );
      const sorted = [...reordered].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
      setLocalTasks(sorted);
      onReorder?.(sorted);
    },
    [localTasks, onReorder]
  );

  const noop = useCallback(async () => {}, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <TaskList
        tasks={localTasks}
        loading={isLoading}
        error={null}
        sortBy="manual"
        onSortChange={() => {}}
        draggable
        onTaskAction={{
          toggle: noop,
          delete: noop,
          update: noop,
          edit: noop,
        }}
      />
    </DragDropContext>
  );
};

export default TaskDragAndDrop;
