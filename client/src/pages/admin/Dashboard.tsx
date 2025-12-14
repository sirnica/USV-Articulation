import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, School, GitCompare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: stats, isLoading } = trpc.stats.dashboard.useQuery();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Courses",
      value: stats?.totalCourses || 0,
      description: "Active courses in database",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Articulation Mappings",
      value: stats?.totalMappings || 0,
      description: "Total course mappings",
      icon: GitCompare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Approved Mappings",
      value: stats?.approvedMappings || 0,
      description: "Ready for transfer",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Direct Equivalencies",
      value: stats?.directEquivalencies || 0,
      description: "One-to-one course matches",
      icon: School,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Articulation Portal Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of transfer credit articulation data and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for managing articulation data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition text-left">
              <BookOpen className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Add Course</h3>
              <p className="text-sm text-gray-600">
                Create a new course entry
              </p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition text-left">
              <GitCompare className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Create Mapping</h3>
              <p className="text-sm text-gray-600">
                Map CC course to USV course
              </p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition text-left">
              <CheckCircle className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Review Pending</h3>
              <p className="text-sm text-gray-600">
                Approve articulation mappings
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
