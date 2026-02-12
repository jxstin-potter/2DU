import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import type { Task } from '../../types';
import TaskItem from './TaskItem';
import InlineTaskEditor from './InlineTaskEditor';
import TodayAddTaskButton from './TodayAddTaskButton';
import { useTaskModal } from '../../contexts/TaskModalContext';

interface InboxViewProps {
  tasks: Task[];
  loading?: boolean;
  justAddedTaskId?: string | null;
  onTaskAction: {
    toggle: (taskId: string) => Promise<void>;
    delete: (taskId: string) => Promise<void>;
    update: (taskId: string, updates: Partial<Task>) => Promise<void>;
    edit: (task: Task) => void;
  };
  onCreateTask?: (taskData: Partial<Task>) => Promise<void>;
  defaultCategoryId?: string;
}

function sortByDueDateOldestFirst(a: Task, b: Task): number {
  const dueA = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
  const dueB = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
  if (dueA !== dueB) return dueA - dueB;
  const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  if (createdA !== createdB) return createdA - createdB;
  return a.id.localeCompare(b.id);
}

const InboxView: React.FC<InboxViewProps> = ({
  tasks,
  loading = false,
  justAddedTaskId = null,
  onTaskAction,
  onCreateTask,
  defaultCategoryId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const appBarOffset = isMobile ? 56 : 64;
  const { isOpen: isTaskModalOpen, closeModal: closeTaskModal } = useTaskModal();

  const [showInlineEditor, setShowInlineEditor] = useState(false);

  // Close "Add task" inline form when task modal opens (e.g. Sidebar "Add task") to avoid freeze from having both open.
  useEffect(() => {
    if (isTaskModalOpen) setShowInlineEditor(false);
  }, [isTaskModalOpen]);

  const handleCreateTask = useCallback(async (taskData: Partial<Task>) => {
    if (!onCreateTask) return;
    await onCreateTask(taskData);
    setShowInlineEditor(false);
    closeTaskModal();
  }, [onCreateTask, closeTaskModal]);

  const handleCancelEditor = useCallback(() => {
    setShowInlineEditor(false);
    closeTaskModal();
  }, [closeTaskModal]);

  const { activeTasks } = useMemo(() => {
    const active: Task[] = [];
    tasks.forEach((t) => {
      if (!t.completed) active.push(t);
    });
    active.sort(sortByDueDateOldestFirst);
    return { activeTasks: active };
  }, [tasks]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Sticky header: Inbox title */}
      <Box
        sx={{
          position: 'sticky',
          top: appBarOffset,
          zIndex: 10,
          backgroundColor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
          mb: 3,
        }}
      >
        <Typography
          component="h1"
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            fontSize: '1.5rem',
            lineHeight: 1.3,
          }}
        >
          Inbox
        </Typography>
      </Box>

      {/* Active tasks (sorted by due date ascending, missing due dates last) */}
      {activeTasks.map((task) => {
        const isJustAdded = task.id === justAddedTaskId;
        const item = (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onTaskAction.toggle}
            onDelete={onTaskAction.delete}
            onEdit={onTaskAction.edit}
            onUpdate={onTaskAction.update}
            isActionInProgress={loading}
            showPriorityRing
          />
        );
        return isJustAdded ? (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {item}
          </motion.div>
        ) : (
          item
        );
      })}

      {/* Inline editor / Add task */}
      {showInlineEditor && onCreateTask ? (
        <Box sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}>
          <InlineTaskEditor
            onSubmit={handleCreateTask}
            onCancel={handleCancelEditor}
            defaultCategoryId={defaultCategoryId}
          />
        </Box>
      ) : (
        <Box sx={{ mt: theme.spacing(0.5), width: '100%' }}>
          <TodayAddTaskButton onClick={() => setShowInlineEditor(true)} />
        </Box>
      )}
    </Box>
  );
};

export default InboxView;

