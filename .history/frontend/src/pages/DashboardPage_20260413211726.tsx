
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
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Pending Tasks',
      value: stats?.pendingTasks || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`${card.bgColor} border-2 ${card.borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-700">{card.title}</p>
                  <div className="p-3 bg-white rounded-xl">
                    <Icon className={`${card.color} h-6 w-6`} />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">{card.value}</p>
              </div>
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
