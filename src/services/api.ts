import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Task, Tag, User, Todo } from '../types';
import { measureApiCall } from '../utils/performanceMonitoring';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await api.post('/auth/refresh', { refreshToken });
        const { token } = response.data;
        localStorage.setItem('auth_token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'An error occurred',
      response.status,
      errorData
    );
  }
  return response.json();
}

// API endpoints
export const apiService = {
  // Auth endpoints
  auth: {
    signup: async (email: string, password: string, name: string) => {
      return measureApiCall('/auth/signup', 'POST', () =>
        api.post('/auth/signup', { email, password, name })
      );
    },
    signin: async (email: string, password: string) => {
      return measureApiCall('/auth/signin', 'POST', () =>
        api.post('/auth/signin', { email, password })
      );
    },
    signout: async () => {
      return measureApiCall('/auth/signout', 'POST', () =>
        api.post('/auth/signout')
      );
    },
  },

  // Task endpoints
  tasks: {
    getAll: async (params?: {
      status?: string;
      tag?: string;
      search?: string;
      page?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
    }) => {
      return measureApiCall('/tasks', 'GET', () =>
        api.get('/tasks', { params })
      );
    },
    create: async (task: Partial<Task>) => {
      return measureApiCall('/tasks', 'POST', () =>
        api.post('/tasks', task)
      );
    },
    update: async (taskId: string, task: Partial<Task>) => {
      return measureApiCall(`/tasks/${taskId}`, 'PUT', () =>
        api.put(`/tasks/${taskId}`, task)
      );
    },
    delete: async (taskId: string) => {
      return measureApiCall(`/tasks/${taskId}`, 'DELETE', () =>
        api.delete(`/tasks/${taskId}`)
      );
    },
    bulkComplete: async (taskIds: string[]) => {
      return measureApiCall('/tasks/bulk/complete', 'POST', () =>
        api.post('/tasks/bulk/complete', { taskIds })
      );
    },
    bulkDelete: async (taskIds: string[]) => {
      return measureApiCall('/tasks/bulk/delete', 'POST', () =>
        api.post('/tasks/bulk/delete', { taskIds })
      );
    },
    bulkTag: async (taskIds: string[], tags: string[]) => {
      return measureApiCall('/tasks/bulk/tag', 'POST', () =>
        api.post('/tasks/bulk/tag', { taskIds, tags })
      );
    },
  },

  // Tag endpoints
  tags: {
    getAll: async () => {
      return measureApiCall('/tags', 'GET', () => api.get('/tags'));
    },
    create: async (tag: Partial<Tag>) => {
      return measureApiCall('/tags', 'POST', () => api.post('/tags', tag));
    },
    update: async (tagId: string, tag: Partial<Tag>) => {
      return measureApiCall(`/tags/${tagId}`, 'PUT', () =>
        api.put(`/tags/${tagId}`, tag)
      );
    },
    delete: async (tagId: string) => {
      return measureApiCall(`/tags/${tagId}`, 'DELETE', () =>
        api.delete(`/tags/${tagId}`)
      );
    },
  },

  // Todo endpoints
  todos: {
    getAll: () => measureApiCall('getAllTodos', async () => {
      const response = await fetch(`${API_BASE_URL}/todos`);
      return handleResponse<Todo[]>(response);
    }),

    create: (todo: Omit<Todo, 'id'>) => measureApiCall('createTodo', async () => {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      return handleResponse<Todo>(response);
    }),

    update: (todo: Todo) => measureApiCall('updateTodo', async () => {
      const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      return handleResponse<Todo>(response);
    }),

    delete: (id: string) => measureApiCall('deleteTodo', async () => {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<void>(response);
    }),
  },
};

export default apiService;
export type { ApiError }; 