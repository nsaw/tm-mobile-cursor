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
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  }

  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', data);
    return response.data;
  }

  async updateTask(id: string, data: Partial<CreateTaskRequest>): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }

  async completeTask(id: string): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}/complete`);
    return response.data;
  }
}

export const tasksService = new TasksService();
