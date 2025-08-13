import { apiClient } from '../api/apiClient';
import { Task } from '../types/task';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  binId?: string;
}

class TasksService {
  async getTasks(): Promise<Task[]> {
    return apiClient.get<Task[]>('/tasks');
  }

  async getTask(id: string): Promise<Task> {
    return apiClient.get<Task>(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return apiClient.post<Task>('/tasks', data);
  }

  async updateTask(id: string, data: Partial<CreateTaskRequest>): Promise<Task> {
    return apiClient.put<Task>(`/tasks/${id}`, data);
  }

  async deleteTask(id: string): Promise<void> {
    return apiClient.delete(`/tasks/${id}`);
  }

  async completeTask(id: string): Promise<Task> {
    return apiClient.put<Task>(`/tasks/${id}/complete`);
  }
}

export const tasksService = new TasksService();
