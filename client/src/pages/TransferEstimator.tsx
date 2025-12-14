import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { School, GraduationCap, CheckCircle, ArrowRight, Calculator } from "lucide-react";

export default function TransferEstimator() {
  const [selectedCC, setSelectedCC] = useState<number | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { data: institutions } = trpc.institutions.list.useQuery({ activeOnly: true });
  const { data: degreePrograms } = trpc.degreePrograms.list.useQuery({ activeOnly: true });
  
  const { data: pathway } = trpc.transfer.getPathway.useQuery(
    { ccInstitutionId: selectedCC!, degreeProgramId: selectedDegree! },
    { enabled: !!selectedCC && !!selectedDegree }
  );

  const { data: calculation } = trpc.transfer.calculateCredits.useQuery(
    {
      ccInstitutionId: selectedCC!,
      degreeProgramId: selectedDegree!,
      completedCourseIds: selectedCourses,
    },
    { enabled: showResults && !!selectedCC && !!selectedDegree }
  );

  const communityColleges = institutions?.filter((inst) => inst.type === "community_college");
  const selectedDegreeInfo = degreePrograms?.find((d) => d.id === selectedDegree);

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              USV Transfer Credit Estimator
            </h1>
            <p className="text-xl text-indigo-100">
              Discover how your community college courses transfer to University of Silicon Valley
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Select Institution and Degree */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="w-5 h-5 mr-2" />
                Step 1: Select Your Schools
              </CardTitle>
              <CardDescription>
                Choose your community college and intended USV degree program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Community College</Label>
                  <Select
                    value={selectedCC?.toString() || ""}
                    onValueChange={(value) => {
                      setSelectedCC(parseInt(value));
                      setShowResults(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your community college" />
                    </SelectTrigger>
                    <SelectContent>
                      {communityColleges?.map((inst) => (
                        <SelectItem key={inst.id} value={inst.id.toString()}>
                          {inst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>USV Degree Program</Label>
                  <Select
                    value={selectedDegree?.toString() || ""}
                    onValueChange={(value) => {
                      setSelectedDegree(parseInt(value));
                      setShowResults(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your intended degree" />
                    </SelectTrigger>
                    <SelectContent>
                      {degreePrograms?.map((degree) => (
                        <SelectItem key={degree.id} value={degree.id.toString()}>
                          {degree.degreeType} in {degree.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Select Completed Courses */}
          {selectedCC && selectedDegree && pathway && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Step 2: Select Completed Courses
                </CardTitle>
                <CardDescription>
                  Check the courses you have completed or plan to complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pathway.map((item: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">
                          USV: {item.usvCourse.courseCode} - {item.usvCourse.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {item.requirementType}
                        </Badge>
                      </div>

                      {item.ccMappings.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 mb-2">
                            Can be fulfilled by:
                          </p>
                          {item.ccMappings.map((mapping: any) => (
                            <div
                              key={mapping.ccCourse.id}
                              className="flex items-center space-x-3 bg-gray-50 p-3 rounded"
                            >
                              <Checkbox
                                id={`course-${mapping.ccCourse.id}`}
                                checked={selectedCourses.includes(mapping.ccCourse.id)}
                                onCheckedChange={() => handleCourseToggle(mapping.ccCourse.id)}
                              />
                              <label
                                htmlFor={`course-${mapping.ccCourse.id}`}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="font-medium text-sm">
                                  {mapping.ccCourse.courseCode} - {mapping.ccCourse.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {mapping.ccCourse.units} units •{" "}
                                  {mapping.mapping.equivalencyType} equivalency
                                </div>
                              </label>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No direct transfer courses available yet
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleCalculate}
                  className="w-full mt-6"
                  size="lg"
                  disabled={selectedCourses.length === 0}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Transfer Credits
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {showResults && calculation && (
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-2xl">Your Transfer Credit Summary</CardTitle>
                <CardDescription>
                  Based on your selected courses for {selectedDegreeInfo?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {calculation.totalTransferableUnits}
                    </div>
                    <div className="text-sm text-gray-600">Transferable Units</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {calculation.fulfilledRequirements}
                    </div>
                    <div className="text-sm text-gray-600">Requirements Fulfilled</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {Math.round(
                        (calculation.fulfilledRequirements / calculation.totalRequirements) * 100
                      )}
                      %
                    </div>
                    <div className="text-sm text-gray-600">Progress Complete</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">Matched Courses</h3>
                  <div className="space-y-3">
                    {calculation.matchedCourses.map((match: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {match.ccCourse.courseCode} - {match.ccCourse.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {match.ccCourse.units} units
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-indigo-600">
                            {match.usvCourse.courseCode} - {match.usvCourse.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {match.usvCourse.units} units
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-4">
                          {match.mapping.equivalencyType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Next Steps:</strong> Contact the USV Admissions Office to discuss your
                    transfer pathway and finalize your articulation agreement. These results are
                    estimates based on current articulation agreements.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!selectedCC && !selectedDegree && (
            <Card className="text-center py-12">
              <CardContent>
                <School className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Get Started with Your Transfer Journey
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Select your community college and intended USV degree program above to see how
                  your courses transfer and calculate your potential transfer credits.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
