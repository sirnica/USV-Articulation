import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpen, GraduationCap, Home } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { mockTRPC } from "@/lib/mockData";

// Replace trpc with mockTRPC
const trpc = mockTRPC;

export default function Articulations() {
  const [selectedCollege, setSelectedCollege] = useState<number | undefined>();
  const [selectedProgram, setSelectedProgram] = useState<number | undefined>();

  const { data: institutions } = trpc.institutions.list.useQuery({});
  const { data: programs } = trpc.degreePrograms.list.useQuery({});
  const { data: mappings } = trpc.articulations.list.useQuery({});

  const communityColleges = institutions?.filter(i => i.type === "community_college") || [];
  const usv = institutions?.find(i => i.type === "university");

  // Filter mappings based on selections
  const filteredMappings = mappings?.filter(m => {
    if (selectedCollege && m.ccCourse?.institutionId !== selectedCollege) return false;
    if (selectedProgram && m.usvCourse?.institutionId !== usv?.id) return false;
    return m.mapping.status === "approved";
  }) || [];

  const getEquivalencyBadge = (type: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      direct: { variant: "default", label: "Direct Equivalency" },
      partial: { variant: "secondary", label: "Partial Credit" },
      elective: { variant: "outline", label: "Elective Credit" },
    };
    const config = variants[type] || { variant: "outline" as const, label: type };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
            <GraduationCap className="w-6 h-6" />
            USV Transfer Portal
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <a>
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </a>
            </Link>
            <Link href="/transfer-estimator">
              <a>
                <Button variant="ghost" size="sm">Transfer Estimator</Button>
              </a>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Course Articulation Database
            </h1>
            <p className="text-xl text-indigo-100">
              Browse approved course equivalencies between USV and partner community colleges
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Filter Articulations</CardTitle>
            <CardDescription>
              Select a community college and/or degree program to view relevant course equivalencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Community College</label>
                <Select
                  value={selectedCollege?.toString()}
                  onValueChange={(val) => setSelectedCollege(val ? parseInt(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All community colleges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All community colleges</SelectItem>
                    {communityColleges.map(cc => (
                      <SelectItem key={cc.id} value={cc.id.toString()}>
                        {cc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">USV Degree Program</label>
                <Select
                  value={selectedProgram?.toString()}
                  onValueChange={(val) => setSelectedProgram(val ? parseInt(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All degree programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All degree programs</SelectItem>
                    {programs?.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Articulations List */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Approved Course Equivalencies
          </h2>
          <p className="text-muted-foreground">
            {filteredMappings.length} {filteredMappings.length === 1 ? 'mapping' : 'mappings'} found
          </p>
        </div>

        {filteredMappings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">
                No articulation mappings found for the selected filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCollege(undefined);
                  setSelectedProgram(undefined);
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredMappings.map(mapping => (
              <Card key={mapping.mapping.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* CC Course */}
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">
                        {mapping.institution?.name}
                      </div>
                      <div className="font-semibold text-lg">
                        {mapping.ccCourse?.courseCode}
                      </div>
                      <div className="text-sm">
                        {mapping.ccCourse?.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {mapping.ccCourse?.units} units
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>

                    {/* USV Course */}
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">
                        University of Silicon Valley
                      </div>
                      <div className="font-semibold text-lg">
                        {mapping.usvCourse?.courseCode}
                      </div>
                      <div className="text-sm">
                        {mapping.usvCourse?.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {mapping.usvCourse?.units} units
                      </div>
                    </div>

                    {/* Equivalency Type */}
                    <div className="flex-shrink-0">
                      {getEquivalencyBadge(mapping.mapping.equivalencyType)}
                    </div>
                  </div>

                  {mapping.mapping.notes && (
                    <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                      <strong>Notes:</strong> {mapping.mapping.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Calculate Your Transfer Credits?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Use our transfer credit estimator to see exactly how your completed courses apply to your intended USV degree program
          </p>
          <Link href="/transfer-estimator">
            <a>
              <Button size="lg" className="gap-2">
                Calculate Transfer Credits
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
