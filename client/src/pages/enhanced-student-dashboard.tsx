import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  Play, 
  Users, 
  Award,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Calendar,
  MessageSquare,
  Download,
  Search,
  Filter,
  Globe,
  Target,
  Zap,
  BookmarK,
  Heart,
  Share2,
  Lightbulb,
  Brain,
  Trophy,
  Flame,
  BarChart3,
  Settings,
  Bell,
  Mail,
  Video,
  FileText,
  Headphones,
  MonitorPlay,
  GraduationCap,
  MapPin,
  Coffee,
  Plus
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
  instructor?: {
    firstName: string;
    lastName: string;
  };
}

interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  enrolledAt: string;
  progress: number;
  completed: boolean;
}

export default function EnhancedStudentDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
  });

  // Mutations
  const enrollInCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to enroll in course");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      toast({ title: "Successfully enrolled in course!" });
    },
    onError: () => {
      toast({ title: "Failed to enroll in course", variant: "destructive" });
    },
  });

  // Filter courses
  const availableCourses = courses.filter(course => course.isApproved && course.isPublic);
  
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const enrolledCourseIds = enrollments.map(e => e.courseId);
  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const completedCourses = enrollments.filter(e => e.completed).length;
  const averageProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const categories = Array.from(new Set(availableCourses.map(c => c.category)));
  const levels = Array.from(new Set(availableCourses.map(c => c.level)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-purple-900/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learning Hub
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.firstName}! Continue your permaculture journey.
            </p>
          </div>
          <div className="flex gap-4">
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                {availableCourses.length} available total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                Courses finished
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageProgress}%</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                Days in a row
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Courses
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Continue Learning Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length > 0 ? (
                  <div className="grid gap-4">
                    {enrolledCourses.slice(0, 2).map((course) => {
                      const enrollment = enrollments.find(e => e.courseId === course.id);
                      const progress = enrollment?.progress || 0;
                      return (
                        <div key={course.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{course.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                            <div className="flex items-center gap-4">
                              <Progress value={progress} className="flex-1 max-w-xs" />
                              <span className="text-sm font-medium">{progress}% complete</span>
                            </div>
                          </div>
                          <Button className="ml-4">
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Start Your Learning Journey</h3>
                    <p className="text-muted-foreground mb-4">
                      Browse our courses to find something that interests you.
                    </p>
                    <Button onClick={() => setSelectedTab("browse")}>
                      Browse Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

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
                    className="h-20 flex flex-col gap-2" 
                    variant="outline"
                    onClick={() => setSelectedTab("browse")}
                  >
                    <Search className="h-6 w-6" />
                    Find Courses
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <Calendar className="h-6 w-6" />
                    Study Schedule
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <MessageSquare className="h-6 w-6" />
                    Ask Questions
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <Download className="h-6 w-6" />
                    Download Materials
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Study Time</span>
                    <span className="font-bold">24h 30m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Modules Completed</span>
                    <span className="font-bold">{completedCourses * 5}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Assignments Submitted</span>
                    <span className="font-bold">{completedCourses * 3}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Score</span>
                    <span className="font-bold text-green-600">87%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">First Course Completed!</p>
                      <p className="text-sm text-muted-foreground">Earned 2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Flame className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">7-Day Learning Streak</p>
                      <p className="text-sm text-muted-foreground">Keep it up!</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Community Helper</p>
                      <p className="text-sm text-muted-foreground">Helped 5 students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
              <Button onClick={() => setSelectedTab("browse")}>
                <Plus className="h-4 w-4 mr-2" />
                Enroll in More Courses
              </Button>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="grid gap-6">
                {enrolledCourses.map((course) => {
                  const enrollment = enrollments.find(e => e.courseId === course.id);
                  const progress = enrollment?.progress || 0;
                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-xl">{course.title}</h3>
                              <Badge variant="outline">{course.category}</Badge>
                              <Badge variant="secondary">{course.level}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{course.description}</p>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{course.estimatedDuration} minutes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Enrolled {new Date(enrollment?.enrolledAt || '').toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Progress value={progress} className="flex-1 max-w-md" />
                              <span className="text-sm font-medium">{progress}% complete</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button>
                              <Play className="h-4 w-4 mr-2" />
                              {progress > 0 ? "Continue" : "Start Course"}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Resources
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Enrolled Courses</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start your learning journey by browsing and enrolling in courses.
                  </p>
                  <Button onClick={() => setSelectedTab("browse")}>
                    Browse Available Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Browse Courses Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Browse Available Courses</h2>
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
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isEnrolled = enrolledCourseIds.includes(course.id);
                return (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            {isEnrolled && (
                              <Badge variant="default" className="bg-green-600">
                                Enrolled
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-3">{course.description}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{course.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>{course.level}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{course.estimatedDuration}m</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.8</span>
                            <span className="text-xs text-muted-foreground">(124 reviews)</span>
                          </div>
                          <Badge variant="outline" className="text-green-600">
                            <Globe className="h-3 w-3 mr-1" />
                            Free
                          </Badge>
                        </div>

                        {isEnrolled ? (
                          <Button className="w-full" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            onClick={() => enrollInCourse.mutate(course.id)}
                            disabled={enrollInCourse.isPending}
                          >
                            {enrollInCourse.isPending ? "Enrolling..." : "Enroll Now"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredCourses.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground text-center">
                    Try adjusting your search terms or filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">{averageProgress}%</div>
                      <p className="text-muted-foreground">Average Completion</p>
                    </div>
                    <Progress value={averageProgress} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600">7</div>
                    <p className="text-muted-foreground">Days in a row</p>
                    <div className="flex justify-center mt-4">
                      <Flame className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">24h</div>
                    <p className="text-muted-foreground">This month</p>
                    <div className="flex justify-center mt-4">
                      <Clock className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Progress Details */}
            <Card>
              <CardHeader>
                <CardTitle>Course Progress Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => {
                    const enrollment = enrollments.find(e => e.courseId === course.id);
                    const progress = enrollment?.progress || 0;
                    return (
                      <div key={course.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">{course.level} • {course.category}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={progress} className="w-32" />
                          <span className="text-sm font-medium w-12">{progress}%</span>
                          <Badge variant={progress === 100 ? "default" : "secondary"}>
                            {progress === 100 ? "Complete" : "In Progress"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Community</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Discussion Forums
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    General Discussion
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Study Tips & Tricks
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Find Study Partners
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Coffee className="h-4 w-4 mr-2" />
                    Casual Chat
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Connect with Peers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">Studying Permaculture Basics</p>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Avatar>
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">Sarah Miller</p>
                      <p className="text-sm text-muted-foreground">Advanced Sustainability</p>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Avatar>
                      <AvatarFallback>AL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">Alex Lee</p>
                      <p className="text-sm text-muted-foreground">Regenerative Agriculture</p>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Community Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50">
                  <h4 className="font-medium">New Course Available: Advanced Composting</h4>
                  <p className="text-sm text-muted-foreground">Learn advanced composting techniques for better soil health.</p>
                  <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                </div>

                <div className="p-4 rounded-lg border-l-4 border-l-green-500 bg-green-50">
                  <h4 className="font-medium">Study Group: Weekend Permaculture Workshop</h4>
                  <p className="text-sm text-muted-foreground">Join fellow learners for a hands-on workshop this weekend.</p>
                  <p className="text-xs text-muted-foreground mt-2">1 day ago</p>
                </div>

                <div className="p-4 rounded-lg border-l-4 border-l-purple-500 bg-purple-50">
                  <h4 className="font-medium">Achievement Unlocked: Early Bird Learner</h4>
                  <p className="text-sm text-muted-foreground">Congratulations on completing your morning study session!</p>
                  <p className="text-xs text-muted-foreground mt-2">3 days ago</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-2xl font-bold">Achievements & Badges</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Earned Achievements */}
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    First Course Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completed your first course successfully!
                    </p>
                    <Badge className="mt-2 bg-yellow-600">Earned</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-600" />
                    7-Day Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                      <Flame className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Maintained a 7-day learning streak!
                    </p>
                    <Badge className="mt-2 bg-orange-600">Earned</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Community Helper
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Helped 5 fellow students in forums!
                    </p>
                    <Badge className="mt-2 bg-green-600">Earned</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Locked Achievements */}
              <Card className="border-2 border-gray-200 bg-gray-50 opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-gray-500" />
                    Expert Learner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Star className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete 5 courses with 90%+ scores
                    </p>
                    <Badge variant="secondary" className="mt-2">Locked</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 bg-gray-50 opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    Month Champion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Study for 30 consecutive days
                    </p>
                    <Badge variant="secondary" className="mt-2">Locked</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 bg-gray-50 opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-gray-500" />
                    Knowledge Sharer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Share2 className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Share 10 helpful resources
                    </p>
                    <Badge variant="secondary" className="mt-2">Locked</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Expert Learner</span>
                      <span className="text-sm text-muted-foreground">{completedCourses}/5 courses</span>
                    </div>
                    <Progress value={(completedCourses / 5) * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Month Champion</span>
                      <span className="text-sm text-muted-foreground">7/30 days</span>
                    </div>
                    <Progress value={(7 / 30) * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Knowledge Sharer</span>
                      <span className="text-sm text-muted-foreground">2/10 resources</span>
                    </div>
                    <Progress value={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}