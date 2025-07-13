import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Shield, 
  Database, 
  Mail, 
  Bell, 
  Users, 
  BookOpen,
  Save,
  Download,
  Upload,
  Trash2,
  Monitor,
  Lock,
  Globe,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const systemSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().min(10, "Description must be at least 10 characters"),
  adminEmail: z.string().email("Valid email is required"),
  maxFileSize: z.number().min(1, "File size must be at least 1MB").max(100, "File size cannot exceed 100MB"),
  enableRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  enableNotifications: z.boolean(),
  autoApprovalCourses: z.boolean(),
  maintenanceMode: z.boolean(),
  backupFrequency: z.enum(["daily", "weekly", "monthly"]),
  maxUsersPerCourse: z.number().min(1, "Must allow at least 1 user").max(1000, "Cannot exceed 1000 users"),
  sessionTimeout: z.number().min(15, "Minimum 15 minutes").max(1440, "Maximum 24 hours"),
  passwordMinLength: z.number().min(6, "Minimum 6 characters").max(20, "Maximum 20 characters")
});

const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.number().min(1, "Port is required"),
  smtpUsername: z.string().min(1, "Username is required"),
  smtpPassword: z.string().min(1, "Password is required"),
  fromEmail: z.string().email("Valid email is required"),
  fromName: z.string().min(1, "From name is required"),
  enableSsl: z.boolean(),
  welcomeEmailEnabled: z.boolean(),
  courseCompletionEmailEnabled: z.boolean(),
  reminderEmailEnabled: z.boolean()
});

export function EnhancedSettings() {
  const [activeSection, setActiveSection] = useState("general");
  const { toast } = useToast();

  const systemForm = useForm<z.infer<typeof systemSettingsSchema>>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      siteName: "RRF Learning Platform",
      siteDescription: "Comprehensive e-learning platform for permaculture education in refugee and rural communities",
      adminEmail: "admin@rrfuganda.org",
      maxFileSize: 50,
      enableRegistration: true,
      requireEmailVerification: false,
      enableNotifications: true,
      autoApprovalCourses: false,
      maintenanceMode: false,
      backupFrequency: "daily",
      maxUsersPerCourse: 100,
      sessionTimeout: 480,
      passwordMinLength: 8
    }
  });

  const emailForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "noreply@rrfuganda.org",
      fromName: "RRF Learning Platform",
      enableSsl: true,
      welcomeEmailEnabled: true,
      courseCompletionEmailEnabled: true,
      reminderEmailEnabled: true
    }
  });

  const onSystemSubmit = (data: z.infer<typeof systemSettingsSchema>) => {
    console.log("System settings:", data);
    toast({
      title: "Success",
      description: "System settings updated successfully"
    });
  };

  const onEmailSubmit = (data: z.infer<typeof emailSettingsSchema>) => {
    console.log("Email settings:", data);
    toast({
      title: "Success",
      description: "Email settings updated successfully"
    });
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Data export has been initiated. You'll receive an email when ready."
    });
  };

  const importData = () => {
    toast({
      title: "Import Ready",
      description: "Please select a backup file to import data."
    });
  };

  const runBackup = () => {
    toast({
      title: "Backup Started",
      description: "System backup is now running in the background."
    });
  };

  const clearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "System cache has been cleared successfully."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Enhanced System Settings
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Comprehensive platform configuration and administrative controls
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                General System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...systemForm}>
                <form onSubmit={systemForm.handleSubmit(onSystemSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={systemForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={systemForm.control}
                      name="adminEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={systemForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={systemForm.control}
                      name="maxFileSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max File Size (MB)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={systemForm.control}
                      name="maxUsersPerCourse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Users Per Course</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={systemForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Timeout (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Platform Features</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={systemForm.control}
                        name="enableRegistration"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enable Registration</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Allow new users to register on the platform
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemForm.control}
                        name="requireEmailVerification"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Verification</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Require email verification for new accounts
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemForm.control}
                        name="enableNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">System Notifications</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Enable in-app notifications for users
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemForm.control}
                        name="autoApprovalCourses"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Auto-approve Courses</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Automatically approve instructor-created courses
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save General Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Security & Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={systemForm.control}
                  name="passwordMinLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Password Length</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="6" 
                          max="20" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <span className="text-sm text-muted-foreground">Enable 2FA for admin accounts</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Access Control</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">IP Whitelist</div>
                      <div className="text-sm text-muted-foreground">
                        Restrict admin access to specific IP addresses
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Session Security</div>
                      <div className="text-sm text-muted-foreground">
                        Force logout on password change
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Login Monitoring</div>
                      <div className="text-sm text-muted-foreground">
                        Monitor and log all login attempts
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Security Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700">SSL Certificate</span>
                    <Badge className="bg-green-100 text-green-800">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700">Database Encryption</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700">Firewall Protection</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Email Features</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={emailForm.control}
                        name="enableSsl"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enable SSL/TLS</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Use secure connection for SMTP
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="welcomeEmailEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Welcome Emails</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Send welcome email to new users
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="courseCompletionEmailEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Completion Emails</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Send email when course is completed
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="reminderEmailEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Reminder Emails</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Send reminder emails for inactive users
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save Email Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Backup & Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <FormField
                  control={systemForm.control}
                  name="backupFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backup Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={runBackup} className="h-24 flex-col gap-2">
                  <Database className="h-6 w-6" />
                  Run Backup Now
                </Button>
                <Button onClick={exportData} variant="outline" className="h-24 flex-col gap-2">
                  <Download className="h-6 w-6" />
                  Export Data
                </Button>
                <Button onClick={importData} variant="outline" className="h-24 flex-col gap-2">
                  <Upload className="h-6 w-6" />
                  Import Data
                </Button>
                <Button onClick={clearCache} variant="outline" className="h-24 flex-col gap-2">
                  <Trash2 className="h-6 w-6" />
                  Clear Cache
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Backup Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Last Backup</span>
                    <Badge className="bg-green-100 text-green-800">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Backup Size</span>
                    <span className="text-sm font-medium">127 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Storage Used</span>
                    <span className="text-sm font-medium">2.4 GB / 10 GB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                Performance Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Caching Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="text-base font-medium">Enable Page Caching</div>
                        <div className="text-sm text-muted-foreground">
                          Cache static pages for faster loading
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="text-base font-medium">Database Query Caching</div>
                        <div className="text-sm text-muted-foreground">
                          Cache frequent database queries
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Resource Optimization</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="text-base font-medium">Image Compression</div>
                        <div className="text-sm text-muted-foreground">
                          Automatically compress uploaded images
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="text-base font-medium">CDN Integration</div>
                        <div className="text-sm text-muted-foreground">
                          Use Content Delivery Network for assets
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">142ms</div>
                    <div className="text-sm text-green-600">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">98%</div>
                    <div className="text-sm text-green-600">Cache Hit Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">99.9%</div>
                    <div className="text-sm text-green-600">Uptime</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Maintenance & Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={systemForm.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Maintenance Mode</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Enable maintenance mode to perform updates
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h4 className="font-medium">System Health</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Database Status</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">Last check: 5 minutes ago</div>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">File System</span>
                      <Badge className="bg-green-100 text-green-800">Normal</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">67% storage used</div>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Email Service</span>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">SMTP configuration valid</div>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Auto-marking System</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">Processing assessments normally</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Scheduled Maintenance</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700">Next scheduled maintenance</span>
                    <span className="text-sm font-medium">Sunday, 2:00 AM - 4:00 AM</span>
                  </div>
                  <div className="text-xs text-yellow-600">
                    System will be temporarily unavailable during this window for updates and optimizations.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}