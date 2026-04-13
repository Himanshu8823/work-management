import { useState } from 'react';
import { useTasks, useDeleteTask, useUpdateTaskStatus } from '@/hooks/useQueries';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskDialog } from '@/features/tasks/TaskDialog';
import { Task, TaskStatus } from '@/types';
import { formatDateTime, getStatusColor, getPriorityColor } from '@/utils/helpers';
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from 'lucide-react';

export function TasksPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const filters: any = {};
  if (search) filters.search = search;
  if (statusFilter !== 'all') filters.status = statusFilter;

  const { data: tasksData, isLoading, error } = useTasks(filters);
  const deleteMutation = useDeleteTask(taskToDelete?._id || '');

  const tasks = tasksData?.data || [];

  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const updateStatusMutation = useUpdateTaskStatus(updatingTaskId || '');

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    setUpdatingTaskId(task._id);
    updateStatusMutation.mutate(newStatus, {
      onSuccess: () => {
        setUpdatingTaskId(null);
      },
    });
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setTaskToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-2">Manage and track all tasks</p>
          </div>
          <Button onClick={handleAddTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} in total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8 text-destructive">
                Error loading tasks
              </div>
            ) : tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task: Task) => {
                      const clientName = typeof task.client === 'string' 
                        ? task.client 
                        : task.client?.name || 'Unknown';

                      return (
                        <TableRow key={task._id}>
                          <TableCell className="font-medium max-w-xs truncate">{task.title}</TableCell>
                          <TableCell>{clientName}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            {task.dueDate ? formatDateTime(task.dueDate) : '—'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(task.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange(task, 'Pending')}>
                                  Mark Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(task, 'In Progress')}>
                                  Mark In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(task, 'Completed')}>
                                  Mark Completed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(task)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks yet</p>
                <Button onClick={handleAddTask} variant="link" className="mt-2">
                  Create your first task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        onSuccess={() => {
          setDialogOpen(false);
          setSelectedTask(undefined);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{taskToDelete?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
