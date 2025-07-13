import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Target, 
  Play, 
  Pause, 
  Calendar,
  MessageSquare,
  Search,
  Filter,
  Star,
  TrendingUp,
  CheckCircle,
  Circle,
  User,
  Settings,
  Bell,
  Download,
  Share,
  MoreVertical,
  BookmarkPlus,
  Users,
  Video,
  FileText,
  Headphones,
  Image as ImageIcon,
  ChevronRight,
  ExternalLink,
  Timer,
  Brain,
  Zap,
  Trophy,
  Globe,
  Heart
} from "lucide-react";

export default function ModernStudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Enhanced student data
  const [studentStats] = useState({
    totalCourses: 12,
    completedCourses: 8,
    inProgressCourses: 4,
    totalHours: 156,
    certificatesEarned: 6,
    currentStreak: 15,
    averageScore: 87,
    rank: 23,
    totalStudents: 892
  });

  const [currentCourses] = useState([
    {
      id: 1,
      title: "Advanced Permaculture Design",
      instructor: "Dr. Jane Smith",
      progress: 75,
      totalModules: 12,
      completedModules: 9,
      nextModule: "Zoning and Sector Analysis",
      timeRemaining: "2h 30m",
      difficulty: "Advanced",
      rating: 4.8,
      thumbnail: "/course1.jpg",
      dueDate: "2024-07-15",
      lastAccessed: "2 hours ago"
    },
    {
      id: 2,
      title: "Sustainable Water Management",
      instructor: "Prof. Michael Wanjiku",
      progress: 45,
      totalModules: 8,
      completedModules: 4,
      nextModule: "Rainwater Harvesting Systems",
      timeRemaining: "4h 15m",
      difficulty: "Intermediate",
      rating: 4.6,
      thumbnail: "/course2.jpg",
      dueDate: "2024-07-20",
      lastAccessed: "1 day ago"
    },
    {
      id: 3,
      title: "Soil Regeneration Techniques",
      instructor: "Sarah Nakato",
      progress: 90,
      totalModules: 10,
      completedModules: 9,
      nextModule: "Final Assessment",
      timeRemaining: "1h 45m",
      difficulty: "Beginner",
      rating: 4.9,
      thumbnail: "/course3.jpg",
      dueDate: "2024-07-05",
      lastAccessed: "Today"
    }
  ]);

  const [recentAchievements] = useState([
    { id: 1, title: "Course Master", description: "Completed 8 courses", icon: "🎓", earnedDate: "2024-06-28" },
    { id: 2, title: "Perfect Score", description: "100% on Water Management Quiz", icon: "⭐", earnedDate: "2024-06-25" },
    { id: 3, title: "Study Streak", description: "15 days consecutive learning", icon: "🔥", earnedDate: "2024-06-20" },
    { id: 4, title: "Community Helper", description: "Helped 10+ students in forums", icon: "🤝", earnedDate: "2024-06-15" }
  ]);

  const [upcomingDeadlines] = useState([
    { id: 1, course: "Soil Regeneration Techniques", task: "Final Assessment", dueDate: "2024-07-05", priority: "high" },
    { id: 2, course: "Advanced Permaculture Design", task: "Module 10 Quiz", dueDate: "2024-07-15", priority: "medium" },
    { id: 3, course: "Sustainable Water Management", task: "Assignment 3", dueDate: "2024-07-20", priority: "low" }
  ]);

  const [forumActivity] = useState([
    { id: 1, type: "question", title: "Best composting methods for clay soil?", course: "Soil Regeneration", replies: 5, lastActivity: "30m ago" },
    { id: 2, type: "discussion", title: "Water conservation in drought areas", course: "Water Management", replies: 12, lastActivity: "2h ago" },
    { id: 3, type: "help", title: "Need help with zoning calculations", course: "Permaculture Design", replies: 3, lastActivity: "4h ago" }
  ]);

  const [studyPlan] = useState([
    { time: "09:00", activity: "Review Water Harvesting Module", duration: "45m", status: "completed" },
    { time: "10:00", activity: "Watch Permaculture Design Video", duration: "30m", status: "in-progress" },
    { time: "14:00", activity: "Complete Soil Analysis Quiz", duration: "20m", status: "pending" },
    { time: "16:00", activity: "Forum Discussion Participation", duration: "15m", status: "pending" }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50";
      case "medium": return "border-l-yellow-500 bg-yellow-50";
      case "low": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="bg-rrf-green text-white text-lg">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-gray-600">Ready to continue your permaculture journey?</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Study Streak</p>
                <p className="text-xl font-bold text-rrf-green">{studentStats.currentStreak} days</p>
              </div>
              
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <Badge className="ml-2 px-1.5 py-0.5 text-xs bg-red-500">3</Badge>
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Banner */}
      <div className="bg-gradient-to-r from-rrf-green to-rrf-dark-green text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{studentStats.completedCourses}</p>
              <p className="text-sm opacity-90">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{studentStats.inProgressCourses}</p>
              <p className="text-sm opacity-90">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{studentStats.totalHours}h</p>
              <p className="text-sm opacity-90">Study Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{studentStats.averageScore}%</p>
              <p className="text-sm opacity-90">Avg Score</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-90">Your Rank</p>
            <p className="text-2xl font-bold">#{studentStats.rank}</p>
            <p className="text-xs opacity-75">of {studentStats.totalStudents} students</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Courses Progress</p>
                  <p className="text-2xl font-bold">
                    {Math.round((studentStats.completedCourses / studentStats.totalCourses) * 100)}%
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-rrf-green" />
              </div>
              <Progress 
                value={(studentStats.completedCourses / studentStats.totalCourses) * 100} 
                className="mt-2 h-2" 
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certificates</p>
                  <p className="text-2xl font-bold">{studentStats.certificatesEarned}</p>
                  <p className="text-xs text-green-600">+2 this month</p>
                </div>
                <Award className="w-8 h-8 text-rrf-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Time</p>
                  <p className="text-2xl font-bold">{studentStats.totalHours}h</p>
                  <p className="text-xs text-blue-600">12h this week</p>
                </div>
                <Clock className="w-8 h-8 text-rrf-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold">{studentStats.currentStreak}</p>
                  <p className="text-xs text-orange-600">Personal best!</p>
                </div>
                <Zap className="w-8 h-8 text-rrf-green" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>My Courses</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Continue Learning */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Continue Learning
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-rrf-green rounded-lg flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{course.title}</h3>
                              <p className="text-sm text-gray-600">by {course.instructor}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={getDifficultyColor(course.difficulty)}>
                              {course.difficulty}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              {course.rating}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress: {course.completedModules}/{course.totalModules} modules</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              {course.timeRemaining} remaining
                            </div>
                            <Button size="sm" className="bg-rrf-green hover:bg-rrf-dark-green">
                              <Play className="w-4 h-4 mr-2" />
                              Continue
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-rrf-green" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {studyPlan.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="text-sm font-mono text-gray-600 w-12">
                          {item.time}
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.activity}</p>
                          <p className="text-xs text-gray-500">{item.duration}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Timer className="w-5 h-5 mr-2 text-rrf-green" />
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(deadline.priority)}`}>
                        <p className="font-medium text-sm">{deadline.task}</p>
                        <p className="text-xs text-gray-600">{deadline.course}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(deadline.dueDate).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-rrf-green" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentAchievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <p className="font-medium text-sm">{achievement.title}</p>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search courses..."
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
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-rrf-green to-rrf-dark-green rounded-t-lg flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <Badge className={`absolute top-2 right-2 ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>{course.completedModules}/{course.totalModules} modules</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.timeRemaining}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {course.rating}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-rrf-green hover:bg-rrf-dark-green">
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Forum Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {forumActivity.map((activity) => (
                      <div key={activity.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${
                              activity.type === 'question' ? 'bg-blue-100 text-blue-600' :
                              activity.type === 'discussion' ? 'bg-green-100 text-green-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-gray-600">in {activity.course}</p>
                              <p className="text-xs text-gray-500">{activity.replies} replies • {activity.lastActivity}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Forum Posts</span>
                      <span className="font-semibold">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Helpful Answers</span>
                      <span className="font-semibold">18</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reputation</span>
                      <span className="font-semibold">256</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Answer Rate</span>
                      <span className="font-semibold">67%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentAchievements.map((achievement) => (
                <Card key={achievement.id} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyPlan.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-mono">{item.time}</div>
                        <div>
                          <p className="font-medium">{item.activity}</p>
                          <p className="text-sm text-gray-600">{item.duration}</p>
                        </div>
                      </div>
                      <Badge variant={
                        item.status === 'completed' ? 'default' :
                        item.status === 'in-progress' ? 'secondary' :
                        'outline'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}