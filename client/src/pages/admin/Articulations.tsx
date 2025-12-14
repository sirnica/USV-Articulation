import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Sparkles, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ArticulationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCCCourse, setSelectedCCCourse] = useState<number | null>(null);
  const [selectedUSVCourse, setSelectedUSVCourse] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const { data: institutions } = trpc.institutions.list.useQuery({ activeOnly: true });
  const { data: mappings, refetch: refetchMappings } = trpc.articulations.list.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const createMutation = trpc.articulations.create.useMutation({
    onSuccess: () => {
      toast.success("Articulation mapping created successfully");
      setShowAddDialog(false);
      setAnalysisResult(null);
      refetchMappings();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.articulations.update.useMutation({
    onSuccess: () => {
      toast.success("Mapping updated successfully");
      refetchMappings();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const analyzeMutation = trpc.articulations.analyzeSimilarity.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data);
      setAnalyzing(false);
      toast.success("Analysis complete");
    },
    onError: (error) => {
      toast.error(error.message);
      setAnalyzing(false);
    },
  });

  const handleAnalyze = () => {
    if (!selectedCCCourse || !selectedUSVCourse) {
      toast.error("Please select both courses");
      return;
    }
    
    setAnalyzing(true);
    analyzeMutation.mutate({
      ccCourseId: selectedCCCourse,
      usvCourseId: selectedUSVCourse,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      ccCourseId: selectedCCCourse!,
      usvCourseId: selectedUSVCourse!,
      equivalencyType: formData.get("equivalencyType") as any,
      similarityScore: analysisResult?.similarityScore || parseInt(formData.get("similarityScore") as string),
      notes: formData.get("notes") as string,
      status: formData.get("status") as any,
    };

    createMutation.mutate(data);
  };

  const handleApprove = (id: number) => {
    updateMutation.mutate({ id, status: "approved" });
  };

  const handleReject = (id: number) => {
    updateMutation.mutate({ id, status: "rejected" });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      approved: { variant: "default", icon: CheckCircle },
      pending: { variant: "secondary", icon: Clock },
      rejected: { variant: "destructive", icon: XCircle },
      draft: { variant: "outline", icon: Clock },
    };
    
    const config = variants[status] || variants.draft;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="capitalize">
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getEquivalencyBadge = (type: string) => {
    const colors: Record<string, string> = {
      direct: "bg-green-100 text-green-800",
      elective: "bg-blue-100 text-blue-800",
      partial: "bg-yellow-100 text-yellow-800",
      none: "bg-red-100 text-red-800",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || colors.none}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Articulation Mappings</h1>
        <p className="text-gray-600">Manage course equivalencies between institutions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Status Filter</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <Button onClick={() => setShowAddDialog(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create New Mapping
            </Button>
          </div>
        </div>
      </div>

      {/* Mappings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CC Course</TableHead>
              <TableHead>USV Course</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Similarity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings?.map((item: any) => (
              <TableRow key={item.mapping.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.ccCourse?.courseCode}</div>
                    <div className="text-sm text-gray-500">{item.ccCourse?.title}</div>
                    <div className="text-xs text-gray-400">{item.institution?.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.usvCourse?.courseCode}</div>
                    <div className="text-sm text-gray-500">{item.usvCourse?.title}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {getEquivalencyBadge(item.mapping.equivalencyType)}
                </TableCell>
                <TableCell>
                  {item.mapping.similarityScore ? (
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${item.mapping.similarityScore}%` }}
                        />
                      </div>
                      <span className="text-sm">{item.mapping.similarityScore}%</span>
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(item.mapping.status)}</TableCell>
                <TableCell className="text-right">
                  {item.mapping.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(item.mapping.id)}
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(item.mapping.id)}
                      >
                        <XCircle className="w-4 h-4 text-red-600" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {mappings?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No articulation mappings found. Create your first mapping to get started.
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Articulation Mapping</DialogTitle>
            <DialogDescription>
              Map a community college course to a USV course with AI-powered analysis
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Community College Course</Label>
                  <Input
                    placeholder="Search and select CC course..."
                    onChange={(e) => {
                      // In production, implement autocomplete search
                      const id = parseInt(e.target.value);
                      if (!isNaN(id)) setSelectedCCCourse(id);
                    }}
                  />
                </div>
                <div>
                  <Label>USV Course</Label>
                  <Input
                    placeholder="Search and select USV course..."
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      if (!isNaN(id)) setSelectedUSVCourse(id);
                    }}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAnalyze}
                disabled={!selectedCCCourse || !selectedUSVCourse || analyzing}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {analyzing ? "Analyzing..." : "Analyze with AI"}
              </Button>

              {analysisResult && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-medium text-indigo-900 mb-2">AI Analysis Results</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Similarity Score:</span>{" "}
                      {analysisResult.similarityScore}%
                    </div>
                    <div>
                      <span className="font-medium">Recommended Type:</span>{" "}
                      {getEquivalencyBadge(analysisResult.equivalencyType)}
                    </div>
                    <div>
                      <span className="font-medium">Reasoning:</span>{" "}
                      {analysisResult.reasoning}
                    </div>
                    <div>
                      <span className="font-medium">Recommendations:</span>{" "}
                      {analysisResult.recommendations}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equivalencyType">Equivalency Type</Label>
                  <Select
                    name="equivalencyType"
                    defaultValue={analysisResult?.equivalencyType || "elective"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="elective">Elective</SelectItem>
                      <SelectItem value="partial">Partial Credit</SelectItem>
                      <SelectItem value="none">Not Equivalent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="draft">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={analysisResult?.recommendations || ""}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedCCCourse || !selectedUSVCourse}>
                Create Mapping
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
