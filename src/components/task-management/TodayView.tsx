import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Button,
  ButtonBase,
  Popover,
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
  const [completedTodayExpanded, setCompletedTodayExpanded] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [showInlineEditor, setShowInlineEditor] = useState(false);
  const [todayDate, setTodayDate] = useState(() => startOfDay(new Date()));
  const [moreAnchorEl, setMoreAnchorEl] = useState<HTMLElement | null>(null);

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

  const { overdueTasks, todayTasks, todayIncomplete, todayCompleted, taskCount, tasksForSummary } = useMemo(() => {
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

    // Overdue section: only show incomplete tasks (completed = done, not overdue)
    const overdueIncomplete = overdue.filter(t => !t.completed);
    overdueIncomplete.sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    // Sort today: incomplete first (oldest first), then completed (oldest first)
    today.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const todayIncomplete = today.filter(t => !t.completed);
    // Only count tasks completed *today* (by updatedAt) so the count resets each day
    const todayCompleted = today.filter(
      (t) =>
        t.completed &&
        startOfDay(new Date(t.updatedAt)).getTime() === todayDate.getTime()
    );
    // Overview: incomplete tasks always; completed only if completed today (resets daily)
    const tasksForSummary = [
      ...overdueIncomplete,
      ...todayIncomplete,
      ...todayCompleted,
    ];
    return {
      overdueTasks: overdueIncomplete,
      todayTasks: today,
      todayIncomplete,
      todayCompleted,
      taskCount: incompleteCount,
      tasksForSummary,
    };
  }, [tasks, todayDate]);

  const formattedDate = format(todayDate, "MMM d 'Today' - EEEE");

  const priorityColors: Record<string, string> = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336',
  };
  const getTaskSummaryColor = (task: Task): string => {
    const cat = categories.find(c => c.id === task.categoryId);
    if (cat?.color) return cat.color;
    if (task.priority && priorityColors[task.priority]) return priorityColors[task.priority];
    return theme.palette.error.main;
  };

  const SUMMARY_VISIBLE_LIMIT = 9;
  const summaryVisibleTasks = tasksForSummary.slice(0, SUMMARY_VISIBLE_LIMIT);
  const summaryOverflowCount = Math.max(0, tasksForSummary.length - SUMMARY_VISIBLE_LIMIT);
  const isMoreOpen = Boolean(moreAnchorEl);
  const morePopoverId = isMoreOpen ? 'today-summary-more-popover' : undefined;

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

        {/* Task count + discreet collapser for concise summary */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: tasksForSummary.length > 0 ? 1 : 1.5,
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
          {tasksForSummary.length > 0 && (
            <IconButton
              size="small"
              onClick={() => setSummaryExpanded((e) => !e)}
              aria-label={summaryExpanded ? 'Hide task list' : 'Show task list'}
              sx={{
                p: 0.25,
                minWidth: 0,
                color: 'text.disabled',
                '&:hover': { color: 'text.secondary', backgroundColor: 'transparent' },
              }}
            >
              {summaryExpanded ? (
                <ExpandMoreIcon sx={{ fontSize: '1rem' }} />
              ) : (
                <ChevronRightIcon sx={{ fontSize: '1rem' }} />
              )}
            </IconButton>
          )}
        </Box>

        {/* Concise summary: task titles with checkmark only when completed (collapsible) */}
        {tasksForSummary.length > 0 && (
          <Collapse in={summaryExpanded}>
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
                mb: 1,
              }}
            >
              {summaryVisibleTasks.map((task) => (
                <Box
                  key={task.id}
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    mr: 1.25,
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 3,
                      height: 10,
                      borderRadius: 0.5,
                      flexShrink: 0,
                      backgroundColor: getTaskSummaryColor(task),
                    }}
                  />
                  <Typography component="span" variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.completed ? '✓ ' : ''}{task.title}
                  </Typography>
                </Box>
              ))}
              {summaryOverflowCount > 0 && (
                <ButtonBase
                  onClick={(e) => setMoreAnchorEl(e.currentTarget)}
                  aria-describedby={morePopoverId}
                  sx={{
                    borderRadius: 0.75,
                    px: 0.75,
                    py: 0.25,
                    lineHeight: 1.2,
                    color: 'text.disabled',
                    '&:hover': { color: 'text.secondary', backgroundColor: 'action.hover' },
                  }}
                >
                  <Typography component="span" variant="body2" sx={{ fontSize: '0.8125rem', color: 'inherit' }}>
                    {summaryOverflowCount} more
                  </Typography>
                </ButtonBase>
              )}
            </Box>
          </Collapse>
        )}
      </Box>

      <Popover
        id={morePopoverId}
        open={isMoreOpen}
        anchorEl={moreAnchorEl}
        onClose={() => setMoreAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: 2,
            minWidth: 280,
            maxWidth: 420,
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <Box sx={{ py: 0.5, maxHeight: 360, overflowY: 'auto' }}>
          {tasksForSummary.map((task) => (
            <ButtonBase
              key={task.id}
              onClick={() => {
                setMoreAnchorEl(null);
                onTaskAction.edit(task);
              }}
              sx={{
                width: '100%',
                textAlign: 'left',
                px: 1.5,
                py: 0.75,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <Box
                sx={{
                  width: 3,
                  height: 14,
                  borderRadius: 0.75,
                  flexShrink: 0,
                  backgroundColor: getTaskSummaryColor(task),
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.completed ? '✓ ' : ''}{task.title}
              </Typography>
            </ButtonBase>
          ))}
        </Box>
      </Popover>

      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <Box sx={{ mb: theme.spacing(3) }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: theme.spacing(1),
            }}
          >
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

        {todayTasks.length > 0 ? (
          <>
            {todayIncomplete.map((task) => {
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
            {/* Inline editor / Add task directly under last task (top-to-bottom) */}
            {showInlineEditor && onCreateTask ? (
              <Box sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}>
                <InlineTaskEditor
                  onSubmit={handleCreateTask}
                  onCancel={handleCancelEditor}
                  categories={categories}
                  defaultCategoryId={defaultCategoryId}
                />
              </Box>
            ) : (
              <Box sx={{ mt: theme.spacing(0.5), width: '100%' }}>
                <Button
                  fullWidth
                  disableRipple
                  startIcon={
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                        transition: 'background-color 0.2s ease, color 0.2s ease',
                      }}
                    >
                      <AddIcon sx={{ fontSize: '1rem', color: 'inherit' }} />
                    </Box>
                  }
                  onClick={() => setShowInlineEditor(true)}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    minHeight: 36,
                    py: 0,
                    px: 2,
                    color: 'text.secondary',
                    borderRadius: 1,
                    transition: 'color 0.2s ease, background-color 0.2s ease',
                    '& .MuiButton-startIcon > *': {
                      transition: 'background-color 0.2s ease, color 0.2s ease',
                    },
                    '&:hover': {
                      color: '#5c4e00',
                      backgroundColor: 'transparent',
                    },
                    '&:hover .MuiButton-startIcon > *': {
                      backgroundColor: '#5c4e00',
                      color: 'common.white',
                    },
                  }}
                >
                  Add task
                </Button>
              </Box>
            )}
            {todayCompleted.length > 0 && (
              <Box sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: theme.spacing(1),
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setCompletedTodayExpanded(!completedTodayExpanded)}
                    sx={{ p: theme.spacing(0.5) }}
                  >
                    {completedTodayExpanded ? (
                      <ExpandMoreIcon fontSize="small" />
                    ) : (
                      <ChevronRightIcon fontSize="small" />
                    )}
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: theme.typography.fontWeightBold,
                      fontSize: theme.typography.body1.fontSize,
                    }}
                  >
                    Completed ({todayCompleted.length})
                  </Typography>
                </Box>
                <Collapse in={completedTodayExpanded}>
                  <Box>
                    {todayCompleted.map((task) => {
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
          </>
        ) : (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: theme.spacing(1.5),
          }}>
            {showInlineEditor && onCreateTask ? (
              <InlineTaskEditor
                onSubmit={handleCreateTask}
                onCancel={handleCancelEditor}
                categories={categories}
                defaultCategoryId={defaultCategoryId}
              />
            ) : (
              <>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: theme.typography.body2.fontSize, mb: 1 }}
                >
                  No tasks for today
                </Typography>
                <Box sx={{ width: '100%' }}>
                  <Button
                    fullWidth
                    disableRipple
                    startIcon={
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'text.secondary',
                          transition: 'background-color 0.2s ease, color 0.2s ease',
                        }}
                      >
                        <AddIcon sx={{ fontSize: '1rem', color: 'inherit' }} />
                      </Box>
                    }
                    onClick={() => setShowInlineEditor(true)}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      minHeight: 36,
                      py: 0,
                      px: 2,
                      color: 'text.secondary',
                      borderRadius: 1,
                      transition: 'color 0.2s ease, background-color 0.2s ease',
                      '& .MuiButton-startIcon > *': {
                        transition: 'background-color 0.2s ease, color 0.2s ease',
                      },
                      '&:hover': {
                        color: '#5c4e00',
                        backgroundColor: 'transparent',
                      },
                      '&:hover .MuiButton-startIcon > *': {
                        backgroundColor: '#5c4e00',
                        color: 'common.white',
                      },
                    }}
                  >
                    Add task
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TodayView;
