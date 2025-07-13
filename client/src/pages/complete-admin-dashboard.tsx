import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Shield,
  CheckCircle,
  Clock,
  Activity
} from "lucide-react";
import { AdminDashboardStats } from "@/components/AdminDashboardStats";
import { UserManagement } from "@/components/UserManagement";
import { CourseApproval } from "@/components/CourseApproval";
import { EnhancedUserManagement } from "@/components/EnhancedUserManagement";
import { AddCourseForm } from "@/components/AddCourseForm";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
import { EnhancedSettings } from "@/components/EnhancedSettings";
import { RRFLogo } from "@/components/RRFLogo";
import { useAuth } from "@/hooks/useAuth";

export default function CompleteAdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "courses", label: "Course Management", icon: BookOpen },
    { id: "add-course", label: "Add Course", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <RRFLogo size="sm" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <img src="https://res.cloudinary.com/dey9ic7qo/image/upload/v1751298558698/RRF%20LOGO.jpg" alt="RRF LOGO.jpg" className="w-12 h-12 object-contain rounded-full border-2 border-green-600/20 bg-green-50 p-1" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">RRF Learning</h2>
                  <p className="text-sm text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your learning platform
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <AdminDashboardStats />
                  
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>
                        Common administrative tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Button 
                          className="h-24 flex-col gap-2"
                          variant="outline"
                          onClick={() => setActiveTab("users")}
                        >
                          <Users className="h-6 w-6" />
                          Manage Users
                        </Button>
                        <Button 
                          className="h-24 flex-col gap-2"
                          variant="outline"
                          onClick={() => setActiveTab("courses")}
                        >
                          <CheckCircle className="h-6 w-6" />
                          Approve Courses
                        </Button>
                        <Button 
                          className="h-24 flex-col gap-2"
                          variant="outline"
                          onClick={() => setActiveTab("add-course")}
                        >
                          <BookOpen className="h-6 w-6" />
                          Create Course
                        </Button>
                        <Button 
                          className="h-24 flex-col gap-2"
                          variant="outline"
                          onClick={() => setActiveTab("analytics")}
                        >
                          <Activity className="h-6 w-6" />
                          View Analytics
                        </Button>
                        <Button 
                          className="h-24 flex-col gap-2"
                          variant="outline"
                          onClick={() => setActiveTab("settings")}
                        >
                          <Settings className="h-6 w-6" />
                          System Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Latest system events and user actions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                          <span className="text-sm">New user registered: Mary Johnson</span>
                          <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          <span className="text-sm">Course submitted for approval: "Advanced Composting"</span>
                          <span className="text-xs text-muted-foreground ml-auto">15 min ago</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                          <span className="text-sm">System backup completed successfully</span>
                          <span className="text-xs text-muted-foreground ml-auto">1 hour ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "users" && <EnhancedUserManagement />}
              {activeTab === "courses" && <CourseApproval />}
              {activeTab === "add-course" && <AddCourseForm />}
              {activeTab === "analytics" && <AdvancedAnalytics />}
              {activeTab === "settings" && <EnhancedSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}