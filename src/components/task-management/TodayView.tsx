import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Link,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, isBefore, startOfDay } from 'date-fns';
import { Task, Tag, Category } from '../../types';
import TaskItem from './TaskItem';
import InlineTaskEditor from './InlineTaskEditor';
import { useTaskModal } from '../../contexts/TaskModalContext';

interface TodayViewProps {
  tasks: Task[];
  justAddedTaskId?: string | null;
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
  justAddedTaskId = null,
  onTaskAction,
  onCreateTask,
  tags,
  categories,
  defaultCategoryId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const appBarOffset = isMobile ? 56 : 64;
  const { isOpen: isTaskModalOpen, openModal, closeModal: closeTaskModal } = useTaskModal();
  const [overdueExpanded, setOverdueExpanded] = useState(true);
  const [showInlineEditor, setShowInlineEditor] = useState(false);
  const [todayDate, setTodayDate] = useState(() => startOfDay(new Date()));

  // Refresh "today" at midnight and when tab becomes visible (e.g. user returns next day)
  useEffect(() => {
    const scheduleNextMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      const delay = nextMidnight.getTime() - now.getTime();
      return window.setTimeout(() => {
        setTodayDate(startOfDay(new Date()));
        timeoutRef.current = scheduleNextMidnight();
      }, delay);
    };
    const timeoutRef = { current: scheduleNextMidnight() };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = startOfDay(new Date());
        setTodayDate(prev => (prev.getTime() === now.getTime() ? prev : now));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearTimeout(timeoutRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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

  const { overdueTasks, todayTasks, taskCount, allDayTasksForSummary } = useMemo(() => {
    const overdue: Task[] = [];
    const today: Task[] = [];
    let incompleteCount = 0;

    tasks.forEach(task => {
      if (task.dueDate) {
        const taskDate = startOfDay(new Date(task.dueDate));

        if (isBefore(taskDate, todayDate)) {
          overdue.push(task);
          if (!task.completed) incompleteCount++;
        } else if (taskDate.getTime() === todayDate.getTime()) {
          today.push(task);
          if (!task.completed) incompleteCount++;
        }
      } else {
        today.push(task);
        if (!task.completed) incompleteCount++;
      }
    });

    // Sort overdue: incomplete first, then by dueDate (oldest first)
    overdue.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    // Sort today: incomplete first (newest first), then completed (newest first)
    today.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const allDayTasksForSummary = [...overdue, ...today];

    return {
      overdueTasks: overdue,
      todayTasks: today,
      taskCount: incompleteCount,
      allDayTasksForSummary,
    };
  }, [tasks, todayDate]);

  const formattedDate = format(todayDate, "MMM d 'Today' - EEEE");

  return (
    <Box sx={{ width: '100%' }}>
      {/* Sticky header: Today title + task count (concise summary added in step 3) */}
      <Box
        sx={{
          position: 'sticky',
          top: appBarOffset,
          zIndex: 10,
          backgroundColor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
          mb: 4,
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
          Today
        </Typography>

        {/* Task Count Display */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: allDayTasksForSummary.length > 0 ? 2 : 1.5,
        }}>
          <CheckCircleIcon sx={{
            fontSize: '0.75rem',
            color: 'text.secondary',
          }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </Typography>
        </Box>

        {/* Concise summary: ✓ N tasks ✓ t1 ✓ t2 … N+ more */}
        {allDayTasksForSummary.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '0.8125rem',
              color: 'text.secondary',
              maxHeight: 48,
              overflow: 'hidden',
            }}
          >
            <Typography component="span" variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', mr: 0.5 }}>
              ✓ {allDayTasksForSummary.length} {allDayTasksForSummary.length === 1 ? 'task' : 'tasks'}
            </Typography>
            {allDayTasksForSummary.slice(0, 7).map((task) => (
              <React.Fragment key={task.id}>
                <Typography component="span" variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', mx: 0.25 }}> · </Typography>
                <Typography component="span" variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', textDecoration: task.completed ? 'line-through' : 'none' }}>
                  ✓ {task.title}
                </Typography>
              </React.Fragment>
            ))}
            {allDayTasksForSummary.length > 7 && (
              <>
                <Typography component="span" variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', mx: 0.25 }}> · </Typography>
                <Typography component="span" variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                  ✓ {allDayTasksForSummary.length - 7}+ more
                </Typography>
              </>
            )}
          </Box>
        )}
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.disabled', fontSize: '0.75rem' }}>
          Tasks refresh at 12:00 AM
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
              {overdueTasks.map((task) => {
                const isJustAdded = task.id === justAddedTaskId;
                const item = (
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
            {todayTasks.map((task) => {
              const isJustAdded = task.id === justAddedTaskId;
              const item = (
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
                    transition: 'transform 0.2s ease, color 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      color: 'text.primary',
                      backgroundColor: 'action.hover',
                    },
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
                    transition: 'transform 0.2s ease, color 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      color: 'text.primary',
                      backgroundColor: 'action.hover',
                    },
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
