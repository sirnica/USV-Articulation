import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CoursesPage() {
  const [selectedInstitution, setSelectedInstitution] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const { data: institutions } = trpc.institutions.list.useQuery({ activeOnly: true });
  const { data: courses, refetch: refetchCourses } = trpc.courses.list.useQuery(
    { institutionId: selectedInstitution! },
    { enabled: !!selectedInstitution }
  );

  const createMutation = trpc.courses.create.useMutation({
    onSuccess: () => {
      toast.success("Course created successfully");
      setShowAddDialog(false);
      refetchCourses();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.courses.update.useMutation({
    onSuccess: () => {
      toast.success("Course updated successfully");
      setEditingCourse(null);
      refetchCourses();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.courses.delete.useMutation({
    onSuccess: () => {
      toast.success("Course deleted successfully");
      refetchCourses();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      institutionId: selectedInstitution!,
      courseCode: formData.get("courseCode") as string,
      title: formData.get("title") as string,
      units: parseInt(formData.get("units") as string),
      description: formData.get("description") as string,
      prerequisites: formData.get("prerequisites") as string,
      learningOutcomes: formData.get("learningOutcomes") as string,
    };

    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredCourses = courses?.filter((course) =>
    searchTerm === "" ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
        <p className="text-gray-600">Manage courses from all institutions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Institution</Label>
            <Select
              value={selectedInstitution?.toString() || ""}
              onValueChange={(value) => setSelectedInstitution(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select institution" />
              </SelectTrigger>
              <SelectContent>
                {institutions?.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id.toString()}>
                    {inst.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Search Courses</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by code or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => setShowAddDialog(true)}
              disabled={!selectedInstitution}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      {selectedInstitution ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses?.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.courseCode}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.units}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {course.description || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCourse(course)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredCourses?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No courses found. Add your first course to get started.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          Please select an institution to view courses
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || !!editingCourse} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingCourse(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
            <DialogDescription>
              Enter the course details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    name="courseCode"
                    defaultValue={editingCourse?.courseCode}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="units">Units</Label>
                  <Input
                    id="units"
                    name="units"
                    type="number"
                    defaultValue={editingCourse?.units}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingCourse?.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingCourse?.description || ""}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Textarea
                  id="prerequisites"
                  name="prerequisites"
                  defaultValue={editingCourse?.prerequisites || ""}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="learningOutcomes">Learning Outcomes</Label>
                <Textarea
                  id="learningOutcomes"
                  name="learningOutcomes"
                  defaultValue={editingCourse?.learningOutcomes || ""}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingCourse(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingCourse ? "Update" : "Create"} Course
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
