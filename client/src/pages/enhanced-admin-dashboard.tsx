import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Settings,
  MessageSquare,
  FileText,
  BarChart3,
  UserPlus,
  Mail,
  Calendar,
  Award,
  Shield,
  Database,
  Activity,
  Trash2,
  Edit3,
  Eye,
  Download,
  Filter,
  Search,
  RefreshCw,
  Bell
} from "lucide-react";

interface User {
  id: number;
  studentId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  location: string;
  educationLevel: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  category: string;
  level: string;
  isApproved: boolean;
  isPublic: boolean;
  createdAt: string;
  estimatedDuration: number;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  activeCourses: number;
  pendingCourses: number;
  totalEnrollments: number;
  newUsersToday: number;
}

export default function EnhancedAdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/admin/courses"],
  });

  // Mutations
  const approveCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await fetch(`/api/admin/courses/${courseId}/approve`, {
        method: "PUT",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to approve course");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Course approved successfully!" });
    },
  });

  const rejectCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await fetch(`/api/admin/courses/${courseId}/reject`, {
        method: "PUT",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to reject course");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Course rejected successfully!" });
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ userId, updates }: { userId: number; updates: any }) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User updated successfully!" });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "User deleted successfully!" });
    },
  });

  // Filtered data
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = userFilter === "all" || user.role === userFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = courseFilter === "all" || 
                         (courseFilter === "pending" && !course.isApproved) ||
                         (courseFilter === "approved" && course.isApproved) ||
                         (courseFilter === "rejected" && course.isApproved === false);
    return matchesSearch && matchesFilter;
  });

  const pendingCourses = courses.filter(course => course.isApproved === null || course.isApproved === undefined);
  const approvedCourses = courses.filter(course => course.isApproved === true);
  const rejectedCourses = courses.filter(course => course.isApproved === false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Command Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete system control and analytics dashboard
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => queryClient.invalidateQueries()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.newUsersToday || 0} new today
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingCourses.length} pending approval
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(((stats?.activeUsers || 0) / (stats?.totalUsers || 1)) * 100)}% active rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Courses awaiting approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingCourses.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined as {user.role} • {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Course Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Approved Courses</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      {approvedCourses.length}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Pending Approval</span>
                    </div>
                    <Badge variant="default" className="bg-orange-600">
                      {pendingCourses.length}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Rejected Courses</span>
                    </div>
                    <Badge variant="default" className="bg-red-600">
                      {rejectedCourses.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Quick Administrative Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <UserPlus className="h-6 w-6" />
                    Create User
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <Mail className="h-6 w-6" />
                    Send Broadcast
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <Download className="h-6 w-6" />
                    Export Data
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <Database className="h-6 w-6" />
                    Backup System
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Courses Tab */}
          <TabsContent value="pending" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Pending Course Approvals</h2>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {pendingCourses.length} Pending
              </Badge>
            </div>

            {pendingCourses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground text-center">
                    No courses are pending approval at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {pendingCourses.map((course) => (
                  <Card key={course.id} className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {course.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Pending Review
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Level: {course.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Category: {course.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Duration: {course.estimatedDuration} min</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => approveCourse.mutate(course.id)}
                          disabled={approveCourse.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Course
                        </Button>
                        <Button
                          onClick={() => rejectCourse.mutate(course.id)}
                          disabled={rejectCourse.isPending}
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Course
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                    <SelectItem value="instructor">Instructors</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'instructor' ? 'secondary' : 'outline'}>
                              {user.role}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ID: {user.studentId}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {user.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => updateUser.mutate({
                            userId: user.id,
                            updates: { isActive: !user.isActive }
                          })}
                          variant="outline"
                          size="sm"
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteUser.mutate(user.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* All Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Course Management</h2>
              <div className="flex gap-4">
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{course.title}</h3>
                          <Badge
                            variant={
                              course.isApproved === true ? "default" :
                              course.isApproved === false ? "destructive" :
                              "secondary"
                            }
                          >
                            {course.isApproved === true ? "Approved" :
                             course.isApproved === false ? "Rejected" :
                             "Pending"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{course.description}</p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>Level: {course.level}</span>
                          <span>Category: {course.category}</span>
                          <span>Duration: {course.estimatedDuration} min</span>
                          <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {course.isApproved !== true && (
                          <Button
                            onClick={() => approveCourse.mutate(course.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        {course.isApproved !== false && (
                          <Button
                            onClick={() => rejectCourse.mutate(course.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">System Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["admin", "instructor", "student"].map(role => {
                      const count = users.filter(u => u.role === role).length;
                      const percentage = Math.round((count / users.length) * 100) || 0;
                      return (
                        <div key={role} className="flex items-center justify-between">
                          <span className="capitalize">{role}s</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(courses.map(c => c.category))).map(category => {
                      const count = courses.filter(c => c.category === category).length;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="capitalize">{category}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(users.map(u => u.educationLevel))).map(level => {
                      const count = users.filter(u => u.educationLevel === level).length;
                      return (
                        <div key={level} className="flex items-center justify-between">
                          <span className="capitalize">{level}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <h2 className="text-2xl font-bold">System Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Database
                  </Button>
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    System Health Check
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Configuration
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}