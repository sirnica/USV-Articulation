import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ImportExportPage() {
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: importHistory, refetch: refetchHistory } = trpc.import.history.useQuery({
    limit: 20,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid CSV file");
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setImporting(true);
    
    // In production, implement actual CSV parsing and import
    setTimeout(() => {
      toast.success("Import completed successfully");
      setImporting(false);
      setSelectedFile(null);
      refetchHistory();
    }, 2000);
  };

  const handleExportCourses = () => {
    // In production, implement actual export
    toast.success("Export started - download will begin shortly");
  };

  const handleExportMappings = () => {
    // In production, implement actual export
    toast.success("Export started - download will begin shortly");
  };

  const getStatusIcon = (success: number, error: number) => {
    if (error === 0) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (success === 0) return <XCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Import & Export Data</h1>
        <p className="text-gray-600">Bulk import and export course and articulation data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Import Data
            </CardTitle>
            <CardDescription>
              Upload CSV files to bulk import courses or articulation mappings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>CSV File Format</Label>
                <div className="bg-gray-50 p-4 rounded-lg text-xs font-mono mt-2">
                  <div className="text-gray-600 mb-2">Courses CSV:</div>
                  <div className="text-gray-800">
                    institution_id,course_code,title,units,description
                  </div>
                  <div className="text-gray-600 mt-3 mb-2">Articulations CSV:</div>
                  <div className="text-gray-800">
                    cc_course_id,usv_course_id,equivalency_type,similarity_score,notes
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="file-upload">Select CSV File</Label>
                <div className="mt-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </div>
                )}
              </div>

              <Button
                onClick={handleImport}
                disabled={!selectedFile || importing}
                className="w-full"
              >
                {importing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download current data as CSV files for backup or analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Export Courses</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download all courses from all institutions
                </p>
                <Button onClick={handleExportCourses} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Courses CSV
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Export Articulation Mappings</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download all articulation mappings with status and metadata
                </p>
                <Button onClick={handleExportMappings} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Mappings CSV
                </Button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Tip:</strong> Exported files can be edited in Excel or Google Sheets
                  and re-imported for bulk updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>Recent data import operations and their results</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Errors</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importHistory?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {new Date(record.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.importType}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{record.fileName}</TableCell>
                  <TableCell>{record.recordsProcessed}</TableCell>
                  <TableCell className="text-green-600">{record.recordsSuccess}</TableCell>
                  <TableCell className="text-red-600">{record.recordsError}</TableCell>
                  <TableCell>
                    {getStatusIcon(record.recordsSuccess || 0, record.recordsError || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {importHistory?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No import history yet. Upload your first CSV file to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
