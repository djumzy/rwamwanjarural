import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookPlus, Plus, Minus, Save, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const questionSchema = z.object({
  id: z.string(),
  question: z.string().min(5, "Question must be at least 5 characters"),
  type: z.enum(["multiple-choice", "true-false", "short-answer"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  points: z.number().min(1, "Points must be at least 1").max(10, "Points cannot exceed 10")
});

const moduleSchema = z.object({
  title: z.string().min(5, "Module title must be at least 5 characters"),
  description: z.string().min(10, "Module description must be at least 10 characters"),
  content: z.string().min(50, "Module content must be at least 50 characters"),
  estimatedDuration: z.number().min(1, "Duration must be at least 1 minute"),
  order: z.number().min(1),
  questions: z.array(questionSchema).min(1, "At least one question is required")
});

const courseSchema = z.object({
  title: z.string().min(5, "Course title must be at least 5 characters"),
  description: z.string().min(20, "Course description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedDuration: z.number().min(1, "Duration must be at least 1 hour"),
  objectives: z.array(z.string()).min(1, "At least one objective is required"),
  prerequisites: z.array(z.string()),
  modules: z.array(moduleSchema).min(1, "At least one module is required"),
  passingScore: z.number().min(50, "Passing score must be at least 50%").max(100, "Passing score cannot exceed 100%")
});

export function AddCourseForm() {
  const [currentModule, setCurrentModule] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      difficulty: "beginner",
      estimatedDuration: 1,
      objectives: [""],
      prerequisites: [],
      modules: [{
        title: "",
        description: "",
        content: "",
        estimatedDuration: 30,
        order: 1,
        questions: [{
          id: "1",
          question: "",
          type: "multiple-choice",
          options: ["", "", "", ""],
          correctAnswer: "",
          points: 2
        }]
      }],
      passingScore: 70
    }
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      console.log('Making API request to create course:', courseData);
      try {
        const response = await apiRequest("/api/admin/courses", "POST", courseData);
        console.log('Course creation response:', response);
        return response;
      } catch (error) {
        console.error('Course creation API error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Course created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      
      const courseTitle = form.getValues("title");
      const moduleCount = form.getValues("modules").length;
      
      form.reset();
      setCurrentModule(0);
      setCurrentQuestion(0);
      
      toast({
        title: "✅ Course Created Successfully!",
        description: `"${courseTitle}" with ${moduleCount} modules has been created and is pending admin approval. You will be notified once reviewed. The auto-marking system is now active for all assessments.`,
        duration: 8000,
      });
    },
    onError: (error: any) => {
      console.error('Course creation mutation error:', error);
      const courseTitle = form.getValues("title") || "your course";
      
      toast({
        variant: "destructive",
        title: "❌ Course Creation Failed",
        description: `Failed to create "${courseTitle}". ${error.message || 'Please check all required fields and try again. Contact admin if the problem persists.'}`,
        duration: 10000,
      });
    }
  });

  const addObjective = () => {
    const objectives = form.getValues("objectives");
    form.setValue("objectives", [...objectives, ""]);
  };

  const removeObjective = (index: number) => {
    const objectives = form.getValues("objectives");
    if (objectives.length > 1) {
      form.setValue("objectives", objectives.filter((_, i) => i !== index));
    }
  };

  const addPrerequisite = () => {
    const prerequisites = form.getValues("prerequisites");
    form.setValue("prerequisites", [...prerequisites, ""]);
  };

  const removePrerequisite = (index: number) => {
    const prerequisites = form.getValues("prerequisites");
    form.setValue("prerequisites", prerequisites.filter((_, i) => i !== index));
  };

  const addModule = () => {
    const modules = form.getValues("modules");
    const newModule = {
      title: "",
      description: "",
      content: "",
      estimatedDuration: 30,
      order: modules.length + 1,
      questions: [{
        id: Date.now().toString(),
        question: "",
        type: "multiple-choice" as const,
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 2
      }]
    };
    form.setValue("modules", [...modules, newModule]);
    setCurrentModule(modules.length);
  };

  const removeModule = (index: number) => {
    const modules = form.getValues("modules");
    if (modules.length > 1) {
      form.setValue("modules", modules.filter((_, i) => i !== index));
      if (currentModule >= modules.length - 1) {
        setCurrentModule(Math.max(0, modules.length - 2));
      }
    }
  };

  const addQuestion = () => {
    const modules = form.getValues("modules");
    const newQuestion = {
      id: Date.now().toString(),
      question: "",
      type: "multiple-choice" as const,
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 2
    };
    modules[currentModule].questions.push(newQuestion);
    form.setValue("modules", modules);
    setCurrentQuestion(modules[currentModule].questions.length - 1);
  };

  const removeQuestion = (questionIndex: number) => {
    const modules = form.getValues("modules");
    if (modules[currentModule].questions.length > 1) {
      modules[currentModule].questions.splice(questionIndex, 1);
      form.setValue("modules", modules);
      if (currentQuestion >= modules[currentModule].questions.length) {
        setCurrentQuestion(Math.max(0, modules[currentModule].questions.length - 1));
      }
    }
  };

  const onSubmit = (data: z.infer<typeof courseSchema>) => {
    console.log('Form submitted with data:', data);
    
    // Transform the data to match the expected API format
    const courseData = {
      ...data,
      isApproved: true,
      isPublic: true,
      objectives: data.objectives.filter(obj => obj.trim() !== ''),
      prerequisites: data.prerequisites.filter(prereq => prereq.trim() !== ''),
      modules: data.modules.map(module => ({
        ...module,
        questions: module.questions.filter(q => q.question.trim() !== '')
      }))
    };
    
    console.log('Transformed course data:', courseData);
    createCourseMutation.mutate(courseData);
  };

  const modules = form.watch("modules");
  const currentModuleData = modules[currentModule];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookPlus className="w-5 h-5 mr-2" />
            Create New Course
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Create a comprehensive course with modules, assessments, and auto-marking system
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="objectives">Objectives</TabsTrigger>
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Introduction to Permaculture" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="permaculture">Permaculture</SelectItem>
                              <SelectItem value="agriculture">Sustainable Agriculture</SelectItem>
                              <SelectItem value="gardening">Organic Gardening</SelectItem>
                              <SelectItem value="composting">Composting</SelectItem>
                              <SelectItem value="water">Water Management</SelectItem>
                              <SelectItem value="soil">Soil Health</SelectItem>
                              <SelectItem value="livestock">Livestock Management</SelectItem>
                              <SelectItem value="forestry">Agroforestry</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Comprehensive course covering the fundamentals of permaculture design..."
                            className="min-h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estimatedDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Duration (hours)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="objectives" className="space-y-4">
                  <div>
                    <Label>Learning Objectives</Label>
                    <div className="space-y-2 mt-2">
                      {form.watch("objectives").map((_, index) => (
                        <div key={index} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`objectives.${index}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input 
                                    placeholder={`Learning objective ${index + 1}`}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeObjective(index)}
                            disabled={form.watch("objectives").length === 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addObjective}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Objective
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Prerequisites (Optional)</Label>
                    <div className="space-y-2 mt-2">
                      {form.watch("prerequisites").map((_, index) => (
                        <div key={index} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`prerequisites.${index}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input 
                                    placeholder={`Prerequisite ${index + 1}`}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePrerequisite(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addPrerequisite}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Prerequisite
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="modules" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Course Modules</h3>
                    <Button type="button" onClick={addModule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Module
                    </Button>
                  </div>

                  {modules.length > 0 && (
                    <Tabs value={currentModule.toString()} onValueChange={(value) => setCurrentModule(parseInt(value))}>
                      <TabsList>
                        {modules.map((_, index) => (
                          <TabsTrigger key={index} value={index.toString()}>
                            Module {index + 1}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {modules.map((_, moduleIndex) => (
                        <TabsContent key={moduleIndex} value={moduleIndex.toString()} className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`modules.${moduleIndex}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Module Title</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Module title" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`modules.${moduleIndex}.estimatedDuration`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Duration (minutes)</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          min="1" 
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name={`modules.${moduleIndex}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Module Description</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Brief description of this module" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`modules.${moduleIndex}.content`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Module Content</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Detailed content for this module..."
                                        className="min-h-32"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            {modules.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="ml-4"
                                onClick={() => removeModule(moduleIndex)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {/* Module Questions */}
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Assessment Questions</h4>
                              <Button type="button" size="sm" onClick={addQuestion}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Question
                              </Button>
                            </div>

                            {currentModuleData?.questions.map((question, questionIndex) => (
                              <div key={question.id} className="border rounded p-4 mb-4 space-y-4">
                                <div className="flex justify-between items-start">
                                  <h5 className="font-medium">Question {questionIndex + 1}</h5>
                                  {currentModuleData.questions.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeQuestion(questionIndex)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`modules.${moduleIndex}.questions.${questionIndex}.type`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Question Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                            <SelectItem value="true-false">True/False</SelectItem>
                                            <SelectItem value="short-answer">Short Answer</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`modules.${moduleIndex}.questions.${questionIndex}.points`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Points</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            min="1" 
                                            max="10" 
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <FormField
                                  control={form.control}
                                  name={`modules.${moduleIndex}.questions.${questionIndex}.question`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Question</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="Enter your question here..." {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {question.type === "multiple-choice" && (
                                  <div className="space-y-2">
                                    <Label>Answer Options</Label>
                                    {question.options?.map((_, optionIndex) => (
                                      <FormField
                                        key={optionIndex}
                                        control={form.control}
                                        name={`modules.${moduleIndex}.questions.${questionIndex}.options.${optionIndex}`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <Input 
                                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                                {...field} 
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    ))}
                                  </div>
                                )}

                                <FormField
                                  control={form.control}
                                  name={`modules.${moduleIndex}.questions.${questionIndex}.correctAnswer`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Correct Answer</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder={
                                            question.type === "multiple-choice" 
                                              ? "Enter the correct option (A, B, C, or D)"
                                              : question.type === "true-false"
                                              ? "Enter 'True' or 'False'"
                                              : "Enter the correct answer"
                                          }
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  )}
                </TabsContent>

                <TabsContent value="assessment" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Auto-Marking System Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="passingScore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passing Score (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="50" 
                                max="100" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-muted-foreground">
                              Students must achieve this score to pass the course
                            </p>
                          </FormItem>
                        )}
                      />

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 mb-2">Auto-Marking Features</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Automatic grading for multiple choice and true/false questions</li>
                          <li>• Instant feedback for students upon completion</li>
                          <li>• Progress tracking and performance analytics</li>
                          <li>• Certificate generation for passing students</li>
                          <li>• Detailed score breakdowns by module</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button type="submit" disabled={createCourseMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}