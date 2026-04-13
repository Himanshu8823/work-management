// Auth Types
export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    admin: Admin;
  };
}

export interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Client Types
export interface Client {
  _id: string;
  name: string;
  email: string;
  companyName?: string | null;
  phone?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  companyName?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}

export interface ClientsResponse {
  success: boolean;
  message: string;
  data: Client[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ClientResponse {
  success: boolean;
  message: string;
  data: Client;
}

// Task Types
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  _id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  client: string | Client;
  dueDate?: string | null;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  client: string;
  dueDate?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: Task[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

// Dashboard Types
export interface DashboardStats {
  totalClients: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  recentTasks: Task[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

// Query Filters
export interface ClientFilters {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface TaskFilters {
  status?: TaskStatus;
  client?: string;
  priority?: TaskPriority;
  search?: string;
  page?: number;
  limit?: number;
}
