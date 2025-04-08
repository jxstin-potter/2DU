import { useMutation, useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  setLoading,
  setError,
} from '../store/slices/todoSlice';
import { Todo } from '../types';
import { api } from '../services/api';

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.items);
  const loading = useAppSelector((state) => state.todos.loading);
  const error = useAppSelector((state) => state.todos.error);

  const { refetch: fetchTodos } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const data = await api.todos.getAll();
        dispatch(setTodos(data));
        return data;
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch todos'));
        throw err;
      }
    },
  });

  const createTodoMutation = useMutation({
    mutationFn: api.todos.create,
    onSuccess: (newTodo) => {
      dispatch(addTodo(newTodo));
    },
    onError: (err) => {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to create todo'));
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: api.todos.update,
    onSuccess: (updatedTodo) => {
      dispatch(updateTodo(updatedTodo));
    },
    onError: (err) => {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update todo'));
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: api.todos.delete,
    onSuccess: (_, id) => {
      dispatch(deleteTodo(id));
    },
    onError: (err) => {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to delete todo'));
    },
  });

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo: createTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
  };
}; 