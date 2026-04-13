import { useState } from 'react';
import { useClients, useDeleteClient } from '@/hooks/useQueries';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClientDialog } from '@/features/clients/ClientDialog';
import { Client } from '@/types';
import { formatDateTime } from '@/utils/helpers';
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from 'lucide-react';

export function ClientsPage() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { data: clientsData, isLoading, error } = useClients(search ? { search } : undefined);
  const deleteMutation = useDeleteClient(clientToDelete?._id || '');

  const clients = clientsData?.data?.clients || [];
  const isInitialLoading = isLoading && !clientsData;

  const handleAddClient = () => {
    setSelectedClient(undefined);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setDialogOpen(nextOpen);
    if (!nextOpen) {
      setSelectedClient(undefined);
    }
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    // Defer opening the dialog until the DropdownMenu has fully closed
    // and released its focus trap — otherwise Dialog and Dropdown fight
    // over focus causing an infinite loop and call stack overflow
    setTimeout(() => setDialogOpen(true), 0);
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    // Same defer for the AlertDialog
    setTimeout(() => setDeleteDialogOpen(true), 0);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setClientToDelete(null);
        },
      });
    }
  };

  if (isInitialLoading) {
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
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground mt-2">Manage and track all your clients</p>
          </div>
          <Button onClick={handleAddClient} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, email, or company..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
            <CardDescription>
              {clients.length} client{clients.length !== 1 ? 's' : ''} in total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8 text-destructive">
                Error loading clients
              </div>
            ) : clients.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client: Client) => (
                      <TableRow key={client._id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{client.email}</TableCell>
                        <TableCell>{client.companyName || '—'}</TableCell>
                        <TableCell>{client.phone || '—'}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {formatDateTime(client.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditClient(client)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(client)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No clients yet</p>
                <Button onClick={handleAddClient} variant="link" className="mt-2">
                  Create your first client
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Client Dialog */}
      <ClientDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        client={selectedClient}
        onSuccess={() => {
          setDialogOpen(false);
          setSelectedClient(undefined);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{clientToDelete?.name}</strong>? This will also delete all associated tasks. This action cannot be undone.
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