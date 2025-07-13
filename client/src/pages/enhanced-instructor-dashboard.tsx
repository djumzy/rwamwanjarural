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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  Plus, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Eye,
  Play,
  FileText,
  Video,
  Image,
  Download,
  Upload,
  MessageSquare,
  Calendar,
  Award,
  BarChart3,
  Settings,
  Star,
  Target,
  Zap,
  Globe,
  Lock,
  AlertCircle,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  estimatedDuration: number;
  isApproved: boolean;
  isPublic: boolean;
  createdAt: string;
  minPassPercentage: number;
  prerequisites: string[];
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function EnhancedInstructorDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Form state for new course
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    estimatedDuration: 60,
    minPassPercentage: 70,
    prerequisites: [] as string[],
  });

  // Queries
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses/instructor"],
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/enrollments/instructor"],
  });

  // Mutations
  const createCourse = useMutation({
    mutationFn: async (courseData: typeof newCourse) => {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(courseData),
      });
      if (!response.ok) throw new Error("Failed to create course");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses/instructor"] });
      setIsCreateDialogOpen(false);
      setNewCourse({
        title: "",
        description: "",
        category: "",
        level: "beginner",
        estimatedDuration: 60,
        minPassPercentage: 70,
        prerequisites: [],
      });
      toast({ title: "Course created successfully! It's pending admin approval." });
    },
    onError: () => {
      toast({ title: "Failed to create course", variant: "destructive" });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses/instructor"] });
      toast({ title: "Course deleted successfully!" });
    },
  });

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = courseFilter === "all" || 
                         (courseFilter === "approved" && course.isApproved) ||
                         (courseFilter === "pending" && !course.isApproved) ||
                         (courseFilter === "draft" && !course.isPublic);
    return matchesSearch && matchesFilter;
  });

  const pendingCourses = courses.filter(course => !course.isApproved);
  const approvedCourses = courses.filter(course => course.isApproved);
  const totalStudents = enrollments.length;

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.category) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createCourse.mutate(newCourse);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Instructor Studio
            </h1>
            <p className="text-muted-foreground mt-2">
              Create, manage, and track your courses • Welcome back, {user?.firstName}!
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                {approvedCourses.length} approved
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting admin review
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                Average completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Courses ({courses.length})
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Plus className="h-6 w-6" />
                    New Course
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <Upload className="h-6 w-6" />
                    Upload Content
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <MessageSquare className="h-6 w-6" />
                    Student Messages
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <Calendar className="h-6 w-6" />
                    Schedule Class
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Approved & Live</span>
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

                  <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50">
                    <div className="flex items-center gap-3">
                      <Edit3 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Draft Courses</span>
                    </div>
                    <Badge variant="default" className="bg-blue-600">
                      {courses.filter(c => !c.isPublic).length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Enrolled Students</span>
                    <span className="font-bold text-2xl">{totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active This Week</span>
                    <span className="font-bold text-lg text-green-600">{Math.floor(totalStudents * 0.7)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Course Completion Rate</span>
                    <span className="font-bold text-lg text-blue-600">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">4.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created {new Date(course.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={course.isApproved ? "default" : "secondary"}>
                          {course.isApproved ? "Live" : "Pending"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Management Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Course
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-xl">{course.title}</h3>
                          <Badge
                            variant={
                              course.isApproved ? "default" :
                              course.isApproved === false ? "destructive" :
                              "secondary"
                            }
                          >
                            {course.isApproved ? "Live" :
                             course.isApproved === false ? "Rejected" :
                             "Pending Approval"}
                          </Badge>
                          {course.isPublic && (
                            <Badge variant="outline" className="text-green-600">
                              <Globe className="h-3 w-3 mr-1" />
                              Public
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">{course.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span>{course.level}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{course.estimatedDuration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            <span>{course.minPassPercentage}% pass</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                        <Button
                          onClick={() => deleteCourse.mutate(course.id)}
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

              {filteredCourses.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {courseFilter === "all" 
                        ? "Start creating your first course to begin teaching!"
                        : `No courses match the current filter: ${courseFilter}`
                      }
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Course
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <h2 className="text-2xl font-bold">Student Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{totalStudents}</div>
                  <p className="text-muted-foreground">Total Students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{Math.floor(totalStudents * 0.7)}</div>
                  <p className="text-muted-foreground">Students Active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">87%</div>
                  <p className="text-muted-foreground">Average Rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Communications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Announcement to All Students
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Course Updates
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Virtual Office Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Course Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <span className="text-sm">{course.title}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {Math.floor(Math.random() * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Video Completion</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assignment Submission</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forum Participation</span>
                      <span className="font-medium">65%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Earnings</span>
                      <span className="font-bold text-green-600">$2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-medium">$380</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. per Student</span>
                      <span className="font-medium">$45</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <h2 className="text-2xl font-bold">Instructor Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Content Creation Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Video className="h-4 w-4 mr-2" />
                    Video Upload & Editor
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Document Generator
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Image className="h-4 w-4 mr-2" />
                    Image & Media Library
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Interactive Quiz Builder
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Course Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Scheduling Tools
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Award className="h-4 w-4 mr-2" />
                    Certificate Generator
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Course Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Student Communication Hub
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Course Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new course. It will be submitted for admin approval.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter course title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what students will learn"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newCourse.category} onValueChange={(value) => setNewCourse(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="sustainability">Sustainability</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="permaculture">Permaculture</SelectItem>
                      <SelectItem value="ecology">Ecology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select value={newCourse.level} onValueChange={(value) => setNewCourse(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newCourse.estimatedDuration}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 60 }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="passPercentage">Minimum Pass Percentage</Label>
                  <Input
                    id="passPercentage"
                    type="number"
                    value={newCourse.minPassPercentage}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, minPassPercentage: parseInt(e.target.value) || 70 }))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCourse}
                  disabled={createCourse.isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {createCourse.isPending ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}