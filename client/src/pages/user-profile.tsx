import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Settings, 
  Shield, 
  Award, 
  BookOpen, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Camera,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Download,
  Trophy,
  Clock,
  Target
} from "lucide-react";

const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(1, "Location is required"),
  district: z.string().min(1, "District is required"),
  subcounty: z.string().min(1, "Subcounty is required"),
  village: z.string().min(1, "Village is required"),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  learningLanguage: z.enum(["english", "swahili", "luganda", "french"]),
  timezone: z.string(),
});

const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "private", "contacts"]),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showLocation: z.boolean(),
  allowMessages: z.boolean(),
});

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Mock data for enhanced profile features
  const [stats] = useState({
    coursesCompleted: 12,
    totalCourses: 18,
    certificatesEarned: 8,
    forumPosts: 45,
    studyHours: 156,
    lastActivity: "2 hours ago"
  });

  const [achievements] = useState([
    { id: 1, title: "First Course Completed", icon: "🎓", date: "2024-01-15" },
    { id: 2, title: "Forum Contributor", icon: "💬", date: "2024-02-10" },
    { id: 3, title: "Perfect Score", icon: "⭐", date: "2024-03-05" },
    { id: 4, title: "Study Streak - 30 Days", icon: "🔥", date: "2024-03-20" }
  ]);

  const [recentActivity] = useState([
    { id: 1, type: "course", title: "Completed: Soil Regeneration Techniques", date: "2 hours ago" },
    { id: 2, type: "forum", title: "Posted in Water Management Discussion", date: "1 day ago" },
    { id: 3, type: "assignment", title: "Submitted: Permaculture Design Project", date: "3 days ago" },
    { id: 4, type: "certificate", title: "Earned: Composting Specialist Certificate", date: "1 week ago" }
  ]);

  const profileForm = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      location: user?.location || "",
      district: user?.district || "",
      subcounty: user?.subcounty || "",
      village: user?.village || "",
      emergencyContact: user?.emergencyContact || "",
      emergencyPhone: user?.emergencyPhone || "",
      learningLanguage: user?.learningLanguage || "english",
      timezone: user?.timezone || "Africa/Kampala",
    }
  });

  const privacyForm = useForm({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      profileVisibility: user?.profileVisibility || "public",
      showEmail: user?.showEmail || false,
      showPhone: user?.showPhone || false,
      showLocation: user?.showLocation || true,
      allowMessages: user?.allowMessages || true,
    }
  });

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onProfileSubmit = (data: any) => {
    console.log("Profile update:", data);
    setIsEditing(false);
    // TODO: Implement API call to update profile
  };

  const onPrivacySubmit = (data: any) => {
    console.log("Privacy settings update:", data);
    // TODO: Implement API call to update privacy settings
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const completionPercentage = Math.round((stats.coursesCompleted / stats.totalCourses) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-rrf-green to-rrf-dark-green rounded-t-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white">
                  <AvatarImage src={profileImage || user?.profileImage} />
                  <AvatarFallback className="bg-white text-rrf-green text-xl font-bold">
                    {getInitials(user?.firstName || "", user?.lastName || "")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white"
                  onClick={() => document.getElementById('profile-image-input')?.click()}
                >
                  <Camera className="w-4 h-4 text-rrf-green" />
                </Button>
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-lg opacity-90">@{user?.username}</p>
                <div className="flex items-center space-x-4 text-sm opacity-90">
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user?.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Last active {stats.lastActivity}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                Student ID: {user?.studentId}
              </Badge>
              <div className="space-y-1 text-sm opacity-90">
                <p>Member since {new Date(user?.createdAt || "").toLocaleDateString()}</p>
                <p>Verified {user?.isVerified ? "✓" : "Pending"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 -mt-8 mb-6 relative z-10">
          <Card className="text-center">
            <CardContent className="p-4">
              <Trophy className="w-8 h-8 text-rrf-green mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
              <p className="text-sm text-gray-600">Courses Completed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Award className="w-8 h-8 text-rrf-green mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.certificatesEarned}</p>
              <p className="text-sm text-gray-600">Certificates</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Target className="w-8 h-8 text-rrf-green mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.forumPosts}</p>
              <p className="text-sm text-gray-600">Forum Posts</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Clock className="w-8 h-8 text-rrf-green mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.studyHours}h</p>
              <p className="text-sm text-gray-600">Study Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>First Name</Label>
                          <Input
                            {...profileForm.register("firstName")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                        <div>
                          <Label>Last Name</Label>
                          <Input
                            {...profileForm.register("lastName")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Bio</Label>
                        <Textarea
                          {...profileForm.register("bio")}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Phone</Label>
                          <Input
                            {...profileForm.register("phone")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                        <div>
                          <Label>Emergency Contact</Label>
                          <Input
                            {...profileForm.register("emergencyContact")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            placeholder="Contact name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Emergency Phone</Label>
                          <Input
                            {...profileForm.register("emergencyPhone")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            placeholder="Emergency phone number"
                          />
                        </div>
                        <div>
                          <Label>Learning Language</Label>
                          <Select
                            value={profileForm.watch("learningLanguage")}
                            onValueChange={(value) => profileForm.setValue("learningLanguage", value as any)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="swahili">Swahili</SelectItem>
                              <SelectItem value="luganda">Luganda</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>District</Label>
                          <Input
                            {...profileForm.register("district")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                        <div>
                          <Label>Subcounty</Label>
                          <Input
                            {...profileForm.register("subcounty")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex space-x-2 pt-4">
                          <Button type="submit" className="bg-rrf-green hover:bg-rrf-dark-green">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Progress Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Course Completion</span>
                        <span className="text-sm text-gray-600">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Courses Enrolled</span>
                        <span className="font-medium">{stats.totalCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed</span>
                        <span className="font-medium text-rrf-green">{stats.coursesCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress</span>
                        <span className="font-medium text-orange-600">
                          {stats.totalCourses - stats.coursesCompleted}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Transcript
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Study Time
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <p className="text-sm text-gray-600">
                  Control who can see your information and how others can interact with you.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Profile Visibility</Label>
                      <Select
                        value={privacyForm.watch("profileVisibility")}
                        onValueChange={(value) => privacyForm.setValue("profileVisibility", value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can view</SelectItem>
                          <SelectItem value="contacts">Contacts Only</SelectItem>
                          <SelectItem value="private">Private - Only me</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Information Visibility</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Email Address</Label>
                          <p className="text-sm text-gray-600">Allow others to see your email</p>
                        </div>
                        <Switch
                          checked={privacyForm.watch("showEmail")}
                          onCheckedChange={(checked) => privacyForm.setValue("showEmail", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Phone Number</Label>
                          <p className="text-sm text-gray-600">Allow others to see your phone</p>
                        </div>
                        <Switch
                          checked={privacyForm.watch("showPhone")}
                          onCheckedChange={(checked) => privacyForm.setValue("showPhone", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Location</Label>
                          <p className="text-sm text-gray-600">Display your location information</p>
                        </div>
                        <Switch
                          checked={privacyForm.watch("showLocation")}
                          onCheckedChange={(checked) => privacyForm.setValue("showLocation", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Allow Messages</Label>
                          <p className="text-sm text-gray-600">Let others send you private messages</p>
                        </div>
                        <Switch
                          checked={privacyForm.watch("allowMessages")}
                          onCheckedChange={(checked) => privacyForm.setValue("allowMessages", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="bg-rrf-green hover:bg-rrf-dark-green">
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-8 h-8 rounded-full bg-rrf-green flex items-center justify-center text-white text-sm">
                        {activity.type === 'course' && <BookOpen className="w-4 h-4" />}
                        {activity.type === 'forum' && <User className="w-4 h-4" />}
                        {activity.type === 'assignment' && <Edit3 className="w-4 h-4" />}
                        {activity.type === 'certificate' && <Award className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Update Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Separator />
                  <Button variant="destructive" className="w-full justify-start">
                    <X className="w-4 h-4 mr-2" />
                    Delete Account
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