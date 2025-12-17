import { useState } from "react";
import { mockTRPC } from "@/lib/mockData";
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
import { School, GraduationCap, CheckCircle, ArrowRight, Calculator, Home } from "lucide-react";
import { Link } from "wouter";

const trpc = mockTRPC;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-orange-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
              <School className="w-8 h-8 text-orange-500" />
              <span className="font-bold text-xl text-white">USV Transfer Portal</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <a className="text-gray-300 hover:text-orange-400 transition px-3 py-2 flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </a>
              </Link>
              <Link href="/articulations">
                <a className="text-gray-300 hover:text-orange-400 transition px-3 py-2">
                  Articulations
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600/20 to-purple-600/20 border-b border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-orange-500" />
            <h1 className="text-4xl font-bold text-white mb-4">
              USV Transfer Credit Estimator
            </h1>
            <p className="text-xl text-gray-300">
              Discover how your community college courses transfer to University of Silicon Valley
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Select Institution and Degree */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white flex items-center mb-2">
                <School className="w-5 h-5 mr-2 text-orange-500" />
                Step 1: Select Your Schools
              </h3>
              <p className="text-gray-400">
                Choose your community college and intended USV degree program
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300 mb-2 block">Community College</Label>
                <Select
                  value={selectedCC?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedCC(parseInt(value));
                    setShowResults(false);
                  }}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white hover:border-orange-500 transition">
                    <SelectValue placeholder="Select your community college" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {communityColleges?.map((inst) => (
                      <SelectItem 
                        key={inst.id} 
                        value={inst.id.toString()}
                        className="text-orange-400 hover:text-orange-300 hover:bg-gray-800 focus:text-orange-300 focus:bg-gray-800 cursor-pointer"
                      >
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">USV Degree Program</Label>
                <Select
                  value={selectedDegree?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedDegree(parseInt(value));
                    setShowResults(false);
                  }}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white hover:border-orange-500 transition">
                    <SelectValue placeholder="Select your intended degree" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {degreePrograms?.map((degree) => (
                      <SelectItem 
                        key={degree.id} 
                        value={degree.id.toString()}
                        className="text-orange-400 hover:text-orange-300 hover:bg-gray-800 focus:text-orange-300 focus:bg-gray-800 cursor-pointer"
                      >
                        {degree.degreeType} in {degree.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Step 2: Select Completed Courses */}
          {selectedCC && selectedDegree && pathway && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 mr-2 text-orange-500" />
                  Step 2: Select Completed Courses
                </h3>
                <p className="text-gray-400">
                  Check the courses you have completed or plan to complete
                </p>
              </div>
              <div className="space-y-4">
                {pathway.map((item: any, index: number) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                    <div className="mb-3">
                      <h4 className="font-medium text-white mb-1">
                        USV: {item.usvCourse.courseCode} - {item.usvCourse.title}
                      </h4>
                      <Badge className="bg-purple-600 text-white text-xs">
                        {item.requirementType}
                      </Badge>
                    </div>

                    {item.ccMappings.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400 mb-2">
                          Can be fulfilled by:
                        </p>
                        {item.ccMappings.map((mapping: any) => (
                          <div
                            key={mapping.ccCourse.id}
                            className="flex items-center space-x-3 bg-gray-800/50 border border-gray-700 p-3 rounded"
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
                              <div className="font-medium text-sm text-white">
                                {mapping.ccCourse.courseCode} - {mapping.ccCourse.title}
                              </div>
                              <div className="text-xs text-gray-400">
                                {mapping.ccCourse.units} units •{" "}
                                {mapping.mapping.equivalencyType} equivalency
                              </div>
                            </label>
                            <ArrowRight className="w-4 h-4 text-orange-500" />
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

              <button
                onClick={handleCalculate}
                className="w-full mt-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition shadow-lg shadow-orange-500/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedCourses.length === 0}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Transfer Credits
              </button>
            </div>
          )}

          {/* Results */}
          {showResults && calculation && (
            <div className="bg-gradient-to-br from-orange-900/20 to-purple-900/20 border-2 border-orange-500/50 rounded-xl p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Your Transfer Credit Summary</h2>
                <p className="text-gray-300">
                  Based on your selected courses for {selectedDegreeInfo?.name}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 text-center">
                  <div className="text-5xl font-bold text-orange-500 mb-2">
                    {calculation.totalTransferableUnits}
                  </div>
                  <div className="text-sm text-gray-300">Transferable Units</div>
                </div>
                <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 text-center">
                  <div className="text-5xl font-bold text-purple-500 mb-2">
                    {calculation.fulfilledRequirements}
                  </div>
                  <div className="text-sm text-gray-300">Requirements Fulfilled</div>
                </div>
                <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 text-center">
                  <div className="text-5xl font-bold text-green-500 mb-2">
                    {Math.round(
                      (calculation.fulfilledRequirements / calculation.totalRequirements) * 100
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-300">Progress Complete</div>
                </div>
              </div>

              <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-xl text-white mb-4">Matched Courses</h3>
                <div className="space-y-3">
                  {calculation.matchedCourses.map((match: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm text-white">
                          {match.ccCourse.courseCode} - {match.ccCourse.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {match.ccCourse.units} units
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-orange-500 mx-4" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-orange-400">
                          {match.usvCourse.courseCode} - {match.usvCourse.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {match.usvCourse.units} units
                        </div>
                      </div>
                      <Badge className="ml-4 bg-purple-600 text-white">
                        {match.mapping.equivalencyType}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-900/30 border border-orange-500/50 rounded-lg">
                <p className="text-sm text-orange-200">
                  <strong>Next Steps:</strong> Contact the USV Admissions Office to discuss your
                  transfer pathway and finalize your articulation agreement. These results are
                  estimates based on current articulation agreements.
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedCC && !selectedDegree && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-12 text-center">
              <School className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Get Started with Your Transfer Journey
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Select your community college and intended USV degree program above to see how
                your courses transfer and calculate your potential transfer credits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
