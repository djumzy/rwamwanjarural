import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, BookOpen, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  isApproved: boolean;
  isPublic: boolean;
  createdAt: string;
  difficulty: string;
  duration: string;
  price: number;
}

export function CourseApproval() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/admin/courses"],
  });

  const approveMutation = useMutation({
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
      toast({ title: "Course approved successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error approving course", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const rejectMutation = useMutation({
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
      toast({ title: "Course rejected successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error rejecting course", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleApprove = (courseId: number) => {
    approveMutation.mutate(courseId);
  };

  const handleReject = (courseId: number) => {
    rejectMutation.mutate(courseId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Approval</CardTitle>
          <CardDescription>Loading courses...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingCourses = courses.filter((course: Course) => !course.isApproved);
  const approvedCourses = courses.filter((course: Course) => course.isApproved);

  return (
    <div className="space-y-6">
      {/* Pending Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Course Approvals
            <Badge variant="destructive">{pendingCourses.length}</Badge>
          </CardTitle>
          <CardDescription>
            Review and approve courses submitted by instructors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingCourses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No courses pending approval</p>
          ) : (
            <div className="space-y-4">
              {pendingCourses.map((course: Course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Instructor ID: {course.instructorId}</span>
                          <span>Difficulty: {course.difficulty}</span>
                          <span>Duration: {course.duration}</span>
                          {course.price && <span>Price: ${course.price}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(course.id)}
                      disabled={approveMutation.isPending}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Course</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject "{course.title}"? The instructor will be notified.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleReject(course.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Approved Courses
            <Badge variant="default">{approvedCourses.length}</Badge>
          </CardTitle>
          <CardDescription>
            All approved and published courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedCourses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No approved courses yet</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedCourses.map((course: Course) => (
                <div
                  key={course.id}
                  className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-green-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{course.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {course.isPublic ? 'Public' : 'Private'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}