import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTaskMetadata } from '../contexts/TaskMetadataContext';
import { subscribeToTasks } from '../services/tasksService';
import { Timestamp } from 'firebase/firestore';
import { taskDocumentToTask, taskPatchToTaskDocument } from '../types/firestore';
import { createTaskFromData, updateTask, deleteTask, invalidateTasksCache } from '../services/tasksService';
import type { Task } from '../types';
import { Tag } from '../types';
import TagList from '../components/TagList';
import { tagNameToSlug } from '../utils/slug';
import TaskItem from '../components/task-management/TaskItem';
import InlineTaskEditor from '../components/task-management/InlineTaskEditor';
import { useTaskModal } from '../contexts/TaskModalContext';
import TaskModal from '../components/modals/TaskModal';
import { motion } from 'framer-motion';

const TAG_COLORS = ['#4A9B6D', '#5B7A9E', '#B8954A', '#A67B8A', '#7B6B9E', '#5A8A8A'];

const Tags: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { tagSlug } = useParams<{ tagSlug?: string }>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const appBarOffset = isMobile ? 56 : 64;

  const { user } = useAuth();
  const { tags, loading, tagsError, addTag, deleteTag } = useTaskMetadata();
  const { openModal: openTaskModal, closeModal: closeTaskModal, isOpen: isTaskModalOpen } = useTaskModal();

  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [showInlineEditor, setShowInlineEditor] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [justAddedTaskId, setJustAddedTaskId] = useState<string | null>(null);

  const tagNames = useMemo(() => tags.map((t) => t.name), [tags]);

  const tag = useMemo(() => {
    if (!tagSlug) return null;
    return tags.find((t) => tagNameToSlug(t.name) === tagSlug) ?? null;
  }, [tagSlug, tags]);

  const isTagDetailView = Boolean(tagSlug);

  // Subscribe to tasks only when on tag detail view
  React.useEffect(() => {
    if (!isTagDetailView || !user?.id) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }
    setTasksLoading(true);
    const unsubscribe = subscribeToTasks(
      user.id,
      { completionStatus: 'all', sortBy: 'creationDate', sortOrder: 'desc' },
      (result) => {
        const converted = result.tasks.map((d: any) => taskDocumentToTask(d));
        setTasks(converted);
        setTasksLoading(false);
      }
    );
    return () => unsubscribe();
  }, [isTagDetailView, user?.id]);

  const tasksWithThisTag = useMemo(() => {
    if (!tag) return [];
    return tasks.filter((t) => t.tags?.includes(tag.id));
  }, [tasks, tag]);

  const handleTagSelect = useCallback((tagName: string) => {
    navigate(`/tags/${tagNameToSlug(tagName)}`);
  }, [navigate]);

  const handleTagCreate = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      setCreateError(null);
      const exists = tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase());
      if (exists) return;

      const color = TAG_COLORS[tags.length % TAG_COLORS.length];
      try {
        await addTag({ name: trimmed, color } as Omit<Tag, 'id'>);
      } catch {
        setCreateError('Failed to create tag. Check that you are signed in and have permission.');
      }
    },
    [tags, addTag]
  );

  const handleTagDelete = useCallback(
    async (name: string) => {
      const t = tags.find((x) => x.name === name);
      if (!t) return;
      try {
        await deleteTag(t.id);
        setSelectedTagNames((prev) => prev.filter((x) => x !== name));
      } catch {
        setCreateError('Failed to delete tag.');
      }
    },
    [tags, deleteTag]
  );

  const handleCreateTask = useCallback(
    async (taskData: Partial<Task>) => {
      if (!user?.id || !tag) return;
      const tagIds = [...(taskData.tags ?? []), tag.id].filter(
        (id, i, a) => a.indexOf(id) === i
      );
      const taskDoc = taskPatchToTaskDocument({
        ...taskData,
        tags: tagIds,
        userId: user.id,
        completed: false,
        order: tasks.length,
      });
      const newId = await createTaskFromData(user.id, taskDoc);
      invalidateTasksCache(user.id);
      const now = Timestamp.now();
      const optimisticDoc = {
        id: newId,
        ...taskDoc,
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [taskDocumentToTask(optimisticDoc as any), ...prev]);
      setJustAddedTaskId(newId);
      setTimeout(() => setJustAddedTaskId(null), 600);
      setShowInlineEditor(false);
      closeTaskModal();
    },
    [user?.id, tag, tasks.length, closeTaskModal]
  );

  const handleTaskToggle = useCallback(
    async (taskId: string) => {
      if (!user?.id) return;
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const taskDoc = taskPatchToTaskDocument({ completed: !task.completed });
      await updateTask(taskId, taskDoc, user.id);
    },
    [user?.id, tasks]
  );

  const handleTaskDelete = useCallback(
    async (taskId: string) => {
      if (!user?.id) return;
      await deleteTask(taskId, user.id);
    },
    [user?.id]
  );

  const handleTaskUpdate = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      if (!user?.id) return;
      const taskDoc = taskPatchToTaskDocument(updates);
      await updateTask(taskId, taskDoc, user.id);
    },
    [user?.id]
  );

  if (isTagDetailView && !tag) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">Tag not found.</Typography>
        <Typography
          component="button"
          onClick={() => navigate('/tags')}
          sx={{ textDecoration: 'underline', cursor: 'pointer', mt: 1 }}
        >
          Back to Tags
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        pl: 0,
        ml: -1,
        mt: -0.5,
      }}
    >
      <Container
        maxWidth="md"
        disableGutters
        sx={{
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: theme.breakpoints.values.sm }}>
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
            {isTagDetailView && tag ? (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.8125rem', mb: 0.25 }}
                >
                  Filters & Labels /
                </Typography>
                <Typography
                  component="h1"
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    lineHeight: 1.3,
                  }}
                >
                  {tag.name}
                </Typography>
                {!showInlineEditor && (
                  <Box
                    component="button"
                    onClick={() => setShowInlineEditor(true)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 1,
                      p: 0,
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'primary.main',
                      fontSize: '0.875rem',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: '1.125rem' }} />
                    Add task
                  </Box>
                )}
              </>
            ) : (
              <>
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
                  Tags
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  Create and manage tags to organize your tasks.
                </Typography>
              </>
            )}
          </Box>

          {isTagDetailView && tag ? (
            <>
              {showInlineEditor && (
                <Box sx={{ mb: 2 }}>
                  <InlineTaskEditor
                    onSubmit={handleCreateTask}
                    onCancel={() => setShowInlineEditor(false)}
                    defaultTagIds={[tag.id]}
                  />
                </Box>
              )}

              {!showInlineEditor && tasksWithThisTag.length === 0 && !tasksLoading && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 2,
                  }}
                >
                  <LabelIcon
                    sx={{
                      fontSize: 64,
                      color: 'text.disabled',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Try adding this label to some tasks…
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Click the + to add a task and it&apos;ll automatically get the {tag.name} label!
                  </Typography>
                </Box>
              )}

              {tasksWithThisTag.length > 0 &&
                tasksWithThisTag.map((task) => {
                  const isJustAdded = task.id === justAddedTaskId;
                  const item = (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={() => handleTaskToggle(task.id)}
                      onDelete={() => handleTaskDelete(task.id)}
                      onEdit={(t) => {
                        setSelectedTask(t);
                        openTaskModal();
                      }}
                      onUpdate={handleTaskUpdate}
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

              <TaskModal
                open={isTaskModalOpen}
                onClose={() => {
                  closeTaskModal();
                  setSelectedTask(null);
                }}
                onSubmit={
                  selectedTask
                    ? async (data) => {
                        if (selectedTask.id) {
                          await handleTaskUpdate(selectedTask.id, data);
                          closeTaskModal();
                          setSelectedTask(null);
                        }
                      }
                    : handleCreateTask
                }
                initialTask={selectedTask}
                loading={tasksLoading}
                defaultTagIds={selectedTask ? undefined : [tag.id]}
              />
            </>
          ) : (
            <>
              <TagList
                tags={tagNames}
                selectedTags={selectedTagNames}
                onTagSelect={handleTagSelect}
                onTagCreate={handleTagCreate}
                onTagDelete={handleTagDelete}
              />

              {loading && (
                <Typography sx={{ mt: 2 }} color="text.secondary" variant="body2">
                  Loading tags…
                </Typography>
              )}

              {(tagsError || createError) && (
                <Typography sx={{ mt: 2 }} color="error" variant="body2">
                  {createError ?? tagsError}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Tags;
