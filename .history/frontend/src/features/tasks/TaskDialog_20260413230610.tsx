import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateTask, useUpdateTask, useClients } from '@/hooks/useQueries';
import { Task, Client } from '@/types';
import { toast } from 'sonner';

// ─── Validation Schema ────────────────────────────────────────────────────────

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed'], {
    required_error: 'Please select a status',
    invalid_type_error: 'Please select a status',
  }),
  client: z.string().min(1, 'Please select a client'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((val) => !isNaN(new Date(val).getTime()), 'Enter a valid date'),
  priority: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Please select a priority',
    invalid_type_error: 'Please select a priority',
  }),
});

type TaskFormData = z.infer<typeof taskSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSuccess?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * The clients endpoint may return either:
 *   { data: { clients: [...] } }   <- paginated shape used in ClientsPage
 *   { data: [...] }                <- flat array shape used in selects
 * This helper normalises both so the dropdown always works.
 */
function extractClients(clientsData: any): Client[] {
  if (!clientsData) return [];
  const inner = clientsData.data;
  if (Array.isArray(inner)) return inner;
  if (inner && Array.isArray(inner.clients)) return inner.clients;
  return [];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskDialog({ open, onOpenChange, task, onSuccess }: TaskDialogProps) {
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask(task?._id || '');
  const { data: clientsData, isLoading: clientsLoading } = useClients();

  const isLoading = task ? updateMutation.isPending : createMutation.isPending;
  const clients = extractClients(clientsData);

  const defaultValues = useMemo(
    () => ({
      title: task?.title ?? '',
      description: task?.description ?? '',
      // Leave status/priority as empty string for new tasks so the user
      // must actively pick them — prevents silent bad defaults.
      status: (task?.status ?? '') as TaskFormData['status'],
      priority: (task?.priority ?? '') as TaskFormData['priority'],
      client:
        typeof task?.client === 'string'
          ? task.client
          : (task?.client as Client | undefined)?._id ?? '',
      dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    }),
    [task]
  );

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  // Reset form whenever the dialog opens/closes or the edited task changes.
  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
  }, [open, form, defaultValues]);

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = (data: TaskFormData) => {
    const handlers = {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
        toast.success(task ? 'Task updated successfully' : 'Task created successfully');
        onSuccess?.();
      },
    };

    if (task) {
      updateMutation.mutate(data, handlers);
    } else {
      createMutation.mutate(data, handlers);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[95vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* ── Title ────────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Client ───────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Client <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading || clientsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            clientsLoading ? 'Loading clients…' : 'Select a client'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.length === 0 && !clientsLoading ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          No clients found. Add a client first.
                        </div>
                      ) : (
                        clients.map((client: Client) => (
                          <SelectItem key={client._id} value={client._id}>
                            <span>{client.name}</span>
                            {client.companyName ? (
                              <span className="text-muted-foreground ml-1.5">
                                · {client.companyName}
                              </span>
                            ) : null}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Description ──────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Task description (optional)"
                      className="resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Status + Priority ────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Priority <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── Due Date ───────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Due Date <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Actions ──────────────────────────────────────────────────── */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving…' : task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}