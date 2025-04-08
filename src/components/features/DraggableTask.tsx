import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Checkbox,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';

interface Tag {
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  tags: Tag[];
  priority: 'low' | 'medium' | 'high';
  order: number;
}

interface DraggableTaskProps {
  task: Task;
  index: number;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  index,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) => {
  const theme = useTheme();
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            mb: 1.5,
            bgcolor: snapshot.isDragging 
              ? theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.02)'
              : 'background.paper',
            cursor: 'grab',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              boxShadow: theme.shadows[2],
            },
            position: 'relative',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: snapshot.isDragging ? 'scale(1.02)' : 'scale(1)',
            boxShadow: snapshot.isDragging ? theme.shadows[4] : theme.shadows[1],
            zIndex: snapshot.isDragging ? 1 : 0,
          }}
        >
          <CardContent sx={{ 
            p: 2,
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 1.5,
            '&:last-child': { pb: 2 }
          }}>
            <Box
              {...provided.dragHandleProps}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                cursor: 'grab',
                '&:hover': {
                  color: 'text.primary',
                },
                opacity: snapshot.isDragging ? 1 : 0.6,
                transition: 'all 0.2s ease',
              }}
            >
              <DragIndicatorIcon />
            </Box>
            <Checkbox
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              onClick={(e) => e.stopPropagation()}
              size="small"
              sx={{ 
                mt: 0.5,
                color: 'primary.main',
                '&.Mui-checked': {
                  color: 'primary.main',
                }
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {task.title}
              </Typography>
              {task.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                  }}
                >
                  {task.description}
                </Typography>
              )}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.75, 
                mt: 1.5 
              }}>
                {task.tags.map((tag: Tag) => (
                  <Chip
                    key={tag.name}
                    label={tag.name}
                    size="small"
                    sx={{ 
                      bgcolor: `${tag.color}15`,
                      color: tag.color,
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        px: 1,
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5, 
              mt: 0.5,
              opacity: 0.7,
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 1,
              }
            }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default DraggableTask; 