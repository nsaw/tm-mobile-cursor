import { Task } from '../../types/DataTypes';
import { ApiResponse } from '../../types/ApiTypes';

import { ApiClient } from './ApiClient';

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

export interface TaskFilters {
  isCompleted?: boolean;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: {
    start?: string;
    end?: string;
  };
  sortBy?: 'created' | 'updated' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class TaskService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getTasks(filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    return this.apiClient.get<Task[]>('/tasks', filters);
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.apiClient.get<Task>(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    return this.apiClient.post<Task>('/tasks', data);
  }

  async updateTask(data: UpdateTaskData): Promise<ApiResponse<Task>> {
    const { id, ...updateData } = data;
    return this.apiClient.put<Task>(`/tasks/${id}`, updateData);
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/tasks/${id}`);
  }

  async completeTask(id: string): Promise<ApiResponse<Task>> {
    return this.apiClient.patch<Task>(`/tasks/${id}/complete`);
  }

  async uncompleteTask(id: string): Promise<ApiResponse<Task>> {
    return this.apiClient.patch<Task>(`/tasks/${id}/uncomplete`);
  }

  async assignTask(id: string, userId: string): Promise<ApiResponse<Task>> {
    return this.apiClient.patch<Task>(`/tasks/${id}/assign`, { userId });
  }

  async unassignTask(id: string): Promise<ApiResponse<Task>> {
    return this.apiClient.patch<Task>(`/tasks/${id}/unassign`);
  }

  async getTasksByDueDate(startDate: string, endDate: string): Promise<ApiResponse<Task[]>> {
    return this.apiClient.get<Task[]>('/tasks/by-due-date', {
      startDate,
      endDate,
    });
  }

  async getOverdueTasks(): Promise<ApiResponse<Task[]>> {
    return this.apiClient.get<Task[]>('/tasks/overdue');
  }

  async getTasksByPriority(priority: 'low' | 'medium' | 'high'): Promise<ApiResponse<Task[]>> {
    return this.apiClient.get<Task[]>(`/tasks/by-priority/${priority}`);
  }
} 