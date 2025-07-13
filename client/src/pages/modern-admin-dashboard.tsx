import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  BookOpen, 
  Award, 
  BarChart3, 
  Settings, 
  Bell,
  UserCheck,
  GraduationCap,
  TrendingUp,
  Clock,
  MessageSquare,
  Shield,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Database,
  Server,
  Wifi,
  HardDrive,
  LogOut,
  Menu,
  Home,
  UserPlus,
  BookPlus,
  FileText,
  Mail
} from "lucide-react";

export default function ModernAdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  // Fetch real data from API
  const { data: systemStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    completionRate: 0,
    systemUptime: "99.9%",
    newUsersToday: 0
  }, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"]
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"]
  });

  const [recentUsers] = useState([
    { id: 1, name: "John Kamau", email: "john@example.com", role: "student", status: "active", joinDate: "2024-06-25", district: "Kampala", courses: 3 },
    { id: 2, name: "Sarah Nakato", email: "sarah@example.com", role: "instructor", status: "active", joinDate: "2024-06-20", district: "Mukono", courses: 7 },
    { id: 3, name: "David Ochieng", email: "david@example.com", role: "student", status: "pending", joinDate: "2024-06-28", district: "Jinja", courses: 1 },
    { id: 4, name: "Mary Achieng", email: "mary@example.com", role: "student", status: "active", joinDate: "2024-06-15", district: "Mbale", courses: 5 },
    { id: 5, name: "Peter Ssali", email: "peter@example.com", role: "instructor", status: "suspended", joinDate: "2024-05-10", district: "Masaka", courses: 2 }
  ]);

  const [pendingCourses] = useState([
    { id: 1, title: "Advanced Permaculture Design", instructor: "Dr. Jane Smith", submitted: "2024-06-25", modules: 12, status: "pending" },
    { id: 2, title: "Sustainable Agriculture in East Africa", instructor: "Prof. Michael Wanjiku", submitted: "2024-06-23", modules: 8, status: "review" },
    { id: 3, title: "Water Management for Rural Communities", instructor: "Sarah Nakato", submitted: "2024-06-28", modules: 10, status: "pending" }
  ]);

  const [systemActivity] = useState([
    { id: 1, type: "user", action: "New user registration", user: "John Kamau", time: "5 minutes ago", status: "success" },
    { id: 2, type: "course", action: "Course published", user: "Dr. Jane Smith", time: "1 hour ago", status: "success" },
    { id: 3, type: "system", action: "Database backup completed", user: "System", time: "2 hours ago", status: "success" },
    { id: 4, type: "error", action: "Failed login attempt", user: "Unknown", time: "3 hours ago", status: "warning" },
    { id: 5, type: "course", action: "Course submission", user: "Prof. Michael Wanjiku", time: "4 hours ago", status: "info" }
  ]);

  const handleUserAction = (action: string, userId: number) => {
    console.log(`Action: ${action} for user: ${userId}`);
    // TODO: Implement user actions
  };

  const handleCourseAction = (action: string, courseId: number) => {
    console.log(`Action: ${action} for course: ${courseId}`);
    // TODO: Implement course actions
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary", 
      suspended: "destructive",
      review: "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user": return <Users className="w-4 h-4" />;
      case "course": return <BookOpen className="w-4 h-4" />;
      case "system": return <Server className="w-4 h-4" />;
      case "error": return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <Badge variant="outline" className="bg-rrf-green text-white">
                Administrator
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <Badge className="ml-2 px-1.5 py-0.5 text-xs bg-red-500">12</Badge>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-rrf-green text-white">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* System Status Bar */}
      <div className="bg-rrf-green text-white px-6 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <Wifi className="w-4 h-4 mr-1" />
              System Status: Online
            </span>
            <span className="flex items-center">
              <Server className="w-4 h-4 mr-1" />
              Uptime: {systemStats.systemUptime}
            </span>
            <span className="flex items-center">
              <Database className="w-4 h-4 mr-1" />
              Storage: {systemStats.storageUsed}GB used
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{systemStats.newUsersToday} new users today</span>
            <span>{systemStats.supportTickets} open tickets</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{(systemStats.totalUsers || 0).toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{systemStats.newUsersToday} today</p>
                </div>
                <Users className="w-8 h-8 text-rrf-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-3xl font-bold text-gray-900">{systemStats.activeCourses || 0}</p>
                  <p className="text-sm text-gray-500">of {systemStats.totalCourses || 0} total</p>
                </div>
                <BookOpen className="w-8 h-8 text-rrf-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Enrollments</p>
                  <p className="text-3xl font-bold text-gray-900">{(systemStats.totalEnrollments || 0).toLocaleString()}</p>
                  <p className="text-sm text-green-600">{systemStats.completionRate || 0}% completion</p>
                </div>
                <GraduationCap className="w-8 h-8 text-rrf-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${(systemStats.revenueThisMonth || 0).toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-rrf-green" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Server className="w-4 h-4" />
              <span>System</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent System Activity</CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-100 text-green-600' :
                          activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-500">by {activity.user}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Course Reviews */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Pending Course Reviews</CardTitle>
                  <Badge variant="secondary">{pendingCourses.length} pending</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-gray-600">by {course.instructor}</p>
                          <p className="text-xs text-gray-400">Submitted {course.submitted}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(course.status)}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col space-y-2 bg-rrf-green hover:bg-rrf-dark-green">
                    <UserPlus className="w-6 h-6" />
                    <span>Add User</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <BookPlus className="w-6 h-6" />
                    <span>Create Course</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <FileText className="w-6 h-6" />
                    <span>Generate Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Mail className="w-6 h-6" />
                    <span>Send Announcement</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'instructor' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.district}</TableCell>
                        <TableCell>{user.courses}</TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Management Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Course Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{course.title}</h3>
                            <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                            <p className="text-sm text-gray-500">{course.modules} modules • Submitted {course.submitted}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(course.status)}
                            <Button size="sm" className="bg-rrf-green hover:bg-rrf-dark-green">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Courses</span>
                    <span className="font-semibold">{systemStats.totalCourses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Published</span>
                    <span className="font-semibold text-green-600">{systemStats.activeCourses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Review</span>
                    <span className="font-semibold text-orange-600">{pendingCourses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draft</span>
                    <span className="font-semibold text-gray-600">4</span>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Approval Rate</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>This Week</span>
                      <span className="font-semibold text-green-600">+156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-semibold text-green-600">+892</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate</span>
                      <span className="font-semibold">12.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Daily Active Users</span>
                      <span className="font-semibold">{systemStats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Session Time</span>
                      <span className="font-semibold">45m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Course Completion</span>
                      <span className="font-semibold">{systemStats.completionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span className="font-semibold text-green-600">{systemStats.systemUptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time</span>
                      <span className="font-semibold">120ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span className="font-semibold text-green-600">0.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Storage Usage</span>
                    <span>{systemStats.storageUsed}GB / 100GB</span>
                  </div>
                  <Progress value={(systemStats.storageUsed / 100) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Memory Usage</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>CPU Usage</span>
                    <span>34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export User Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Reports
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency Shutdown
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>User Registration</Label>
                      <p className="text-sm text-gray-600">Allow new user registration</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Course Auto-Approval</Label>
                      <p className="text-sm text-gray-600">Auto-approve courses from verified instructors</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Send system notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Put platform in maintenance mode</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-gray-600">Auto-logout inactive users</p>
                    </div>
                    <Select defaultValue="60">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30m</SelectItem>
                        <SelectItem value="60">1h</SelectItem>
                        <SelectItem value="120">2h</SelectItem>
                        <SelectItem value="240">4h</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Password Strength</Label>
                      <p className="text-sm text-gray-600">Enforce strong passwords</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      View Security Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}