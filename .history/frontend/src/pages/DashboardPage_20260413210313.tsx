
import { useDashboardStats } from '@/hooks/useQueries';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BarChart3, Users, CheckCircle2, Clock } from 'lucide-react';
import { formatDateTime, getStatusColor } from '@/utils/helpers';
import { Task } from '@/types';

export function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useDashboardStats();
  const stats = dashboardData?.data;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600 font-medium">Error loading dashboard</p>
        </div>
      </MainLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Tasks',
      value: stats?.pendingTasks || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back. Here's an overview of your work.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`${card.bgColor} p-2 rounded-lg`}>
                    <Icon className={`${card.color} h-4 w-4`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              The latest tasks assigned to clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentTasks && stats.recentTasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentTasks.slice(0, 5).map((task: Task) => {
                    const client = typeof task.client === 'string' ? task.client : task.client?.name || 'Unknown';
                    return (
                      <TableRow key={task._id}>
                        <TableCell className="font-medium max-w-xs truncate">{task.title}</TableCell>
                        <TableCell>{client}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTime(task.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No tasks yet. Create your first task to get started!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
