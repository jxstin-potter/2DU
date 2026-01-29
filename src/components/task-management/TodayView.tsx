import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Link,
  Button,
  useTheme,
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { format, isBefore, isToday, startOfDay } from 'date-fns';
import { Task, Tag, Category } from '../../types';
import TaskItem from './TaskItem';
import InlineTaskEditor from './InlineTaskEditor';
import { useTaskModal } from '../../contexts/TaskModalContext';

interface TodayViewProps {
  tasks: Task[];
  onTaskAction: {
    toggle: (taskId: string) => Promise<void>;
    delete: (taskId: string) => Promise<void>;
    update: (taskId: string, updates: Partial<Task>) => Promise<void>;
    edit: (task: Task) => void;
  };
  onCreateTask?: (taskData: Partial<Task>) => Promise<void>;
  tags: Tag[];
  categories: Category[];
  defaultCategoryId?: string;
}

const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  onTaskAction,
  onCreateTask,
  tags,
  categories,
  defaultCategoryId,
}) => {
  const theme = useTheme();
  const { isOpen: isTaskModalOpen, openModal, closeModal: closeTaskModal } = useTaskModal();
  const [overdueExpanded, setOverdueExpanded] = useState(true);
  const [showInlineEditor, setShowInlineEditor] = useState(false);

  // Inline editor is controlled by showInlineEditor state, triggered by "Add task" buttons

  const handleCreateTask = useCallback(async (taskData: Partial<Task>) => {
    if (onCreateTask) {
      await onCreateTask(taskData);
      setShowInlineEditor(false);
      closeTaskModal();
    }
  }, [onCreateTask, closeTaskModal]);

  const handleCancelEditor = useCallback(() => {
    setShowInlineEditor(false);
    closeTaskModal();
  }, [closeTaskModal]);

  const todayDate = startOfDay(new Date());

  const { overdueTasks, todayTasks, taskCount } = useMemo(() => {
    const overdue: Task[] = [];
    const today: Task[] = [];
    let count = 0;

    tasks.forEach(task => {
      if (task.completed) {
        return;
      }
      
      if (task.dueDate) {
        const taskDate = startOfDay(new Date(task.dueDate));
        
        if (isBefore(taskDate, todayDate)) {
          overdue.push(task);
          count++;
        } else if (isToday(taskDate)) {
          today.push(task);
          count++;
        }
      } else {
        // Tasks without a due date should appear in the "today" section
        today.push(task);
        count++;
      }
    });

    // Sort overdue by dueDate (oldest first)
    overdue.sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    // Sort today tasks by creation date (newest first) so newly added tasks appear at the top
    today.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return { overdueTasks: overdue, todayTasks: today, taskCount: count };
  }, [tasks, todayDate]);

  const formattedDate = format(new Date(), "MMM d 'Today' - EEEE");

  return (
    <Box sx={{ width: '100%' }}>
      {/* Today Title */}
      <Typography 
        variant="h6" 
        component="div" 
        sx={{ 
          fontWeight: theme.typography.fontWeightBold,
          mb: theme.spacing(2),
          fontSize: theme.typography.h6.fontSize,
        }}
      >
        Today
      </Typography>

      {/* Task Count Display */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: theme.spacing(1), 
        mb: theme.spacing(3) 
      }}>
        <CheckCircleIcon sx={{ 
          fontSize: theme.typography.body2.fontSize, 
          color: 'text.secondary' 
        }} />
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: theme.typography.body2.fontSize }}
        >
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </Typography>
      </Box>

      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <Box sx={{ mb: theme.spacing(3) }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: theme.spacing(1),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
              <IconButton
                size="small"
                onClick={() => setOverdueExpanded(!overdueExpanded)}
                sx={{ p: theme.spacing(0.5) }}
              >
                {overdueExpanded ? (
                  <ExpandMoreIcon fontSize="small" />
                ) : (
                  <ChevronRightIcon fontSize="small" />
                )}
              </IconButton>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: theme.typography.fontWeightBold, 
                  fontSize: theme.typography.body1.fontSize 
                }}
              >
                Overdue
              </Typography>
            </Box>
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                // TODO: Implement reschedule functionality
              }}
              sx={{
                color: 'warning.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Reschedule
            </Link>
          </Box>

          <Collapse in={overdueExpanded}>
            <Box>
              {overdueTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onTaskAction.toggle}
                  onDelete={onTaskAction.delete}
                  onEdit={onTaskAction.edit}
                  onUpdate={onTaskAction.update}
                  tags={tags}
                  categories={categories}
                />
              ))}
            </Box>
          </Collapse>
        </Box>
      )}

      {/* Today Section */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            fontSize: theme.typography.body1.fontSize,
            mb: theme.spacing(2),
          }}
        >
          {formattedDate}
        </Typography>

        {/* Inline task editor */}
        {showInlineEditor && onCreateTask && (
          <Box sx={{ mb: theme.spacing(2) }}>
            <InlineTaskEditor
              onSubmit={handleCreateTask}
              onCancel={handleCancelEditor}
              categories={categories}
              defaultCategoryId={defaultCategoryId}
            />
          </Box>
        )}

        {todayTasks.length > 0 ? (
          <>
            {todayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onTaskAction.toggle}
                onDelete={onTaskAction.delete}
                onEdit={onTaskAction.edit}
                onUpdate={onTaskAction.update}
                tags={tags}
                categories={categories}
              />
            ))}
            {!showInlineEditor && (
              <Box sx={{ 
                mt: theme.spacing(3), 
                display: 'flex', 
                justifyContent: 'center' 
              }}>
                <Button
                  startIcon={<AddIcon sx={{ color: '#a7020290' }} />}
                  onClick={() => setShowInlineEditor(true)}
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                  }}
                >
                  Add task
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: theme.spacing(1.5),
          }}>
            {!showInlineEditor && (
              <>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: theme.typography.body2.fontSize }}
                >
                  No tasks for today
                </Typography>
                <Button
                  startIcon={<AddIcon sx={{ color: '#a7020290' }} />}
                  onClick={() => setShowInlineEditor(true)}
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                  }}
                >
                  Add task
                </Button>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TodayView;
