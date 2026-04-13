import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import {
  Admin,
  Client,
  ClientFilters,
  DashboardStats,
  Task,
  TaskFilters,
} from '@/types';

// Query keys factory
export const queryKeys = {
  all: ['query'],
  auth: () => [...queryKeys.all, 'auth'],
  admin: () => [...queryKeys.auth(), 'admin'],
  clients: () => [...queryKeys.all, 'clients'],
  clientsList: (filters?: ClientFilters) => [...queryKeys.clients(), 'list', filters],
  client: (id: string) => [...queryKeys.clients(), id],
  clientWithTasks: (id: string) => [...queryKeys.clients(), id, 'tasks'],
  clientStats: (id: string) => [...queryKeys.clients(), id, 'stats'],
  tasks: () => [...queryKeys.all, 'tasks'],
  tasksList: (filters?: TaskFilters) => [...queryKeys.tasks(), 'list', filters],
  task: (id: string) => [...queryKeys.tasks(), id],
  dashboard: () => [...queryKeys.all, 'dashboard'],
};

// ============ Auth Hooks ============
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.login(email, password),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useCurrentAdmin() {
  return useQuery({
    queryKey: queryKeys.admin(),
    queryFn: () => apiService.getCurrentAdmin(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

// ============ Client Hooks ============
export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: queryKeys.clientsList(filters),
    queryFn: () =>
      apiService.getClients({
        params: filters,
      }),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: queryKeys.client(id),
    queryFn: () => apiService.getClientById(id),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useClientWithTasks(id: string) {
  return useQuery({
    queryKey: queryKeys.clientWithTasks(id),
    queryFn: () => apiService.getClientWithTasks(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}

export function useClientStats(id: string) {
  return useQuery({
    queryKey: queryKeys.clientStats(id),
    queryFn: () => apiService.getClientStats(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients() });
    },
  });
}

export function useDeleteClient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

// ============ Task Hooks ============
export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: queryKeys.tasksList(filters),
    queryFn: () =>
      apiService.getTasks({
        params: filters,
      }),
    staleTime: 1000 * 60,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: queryKeys.task(id),
    queryFn: () => apiService.getTaskById(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.task(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

export function useUpdateTaskStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => apiService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.task(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

export function useDeleteTask(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

// ============ Dashboard Hooks ============
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
