import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  School, 
  BookOpen, 
  GitCompare, 
  Calculator,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { mockTRPC } from "@/lib/mockData";

// Replace trpc with mockTRPC
const trpc = mockTRPC;

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: Calculator,
      title: "Transfer Credit Estimator",
      description: "Calculate how your community college courses transfer to USV degree programs",
      link: "/transfer-estimator",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: GitCompare,
      title: "Course Articulation Database",
      description: "Browse approved course equivalencies between USV and partner colleges",
      link: "/articulations",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: BookOpen,
      title: "Degree Program Requirements",
      description: "View detailed requirements for all 7 USV bachelor's degree programs",
      link: "/programs",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: School,
      title: "Partner Colleges",
      description: "Explore articulation agreements with 5 Bay Area community colleges",
      link: "/colleges",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const partnerColleges = [
    "Foothill College",
    "De Anza College",
    "San José City College",
    "Evergreen Valley College",
    "Sierra College",
  ];

  const degreePrograms = [
    "Game Design",
    "Game Art",
    "Game Engineering",
    "Digital Art & Animation",
    "Software Development",
    "Business Administration",
    "Digital Audio Technology",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <School className="w-8 h-8 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">USV Transfer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/transfer-estimator">
                <a><Button variant="ghost">Transfer Estimator</Button></a>
              </Link>
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <a><Button variant="outline">Admin Dashboard</Button></a>
                    </Link>
                  )}
                  <Link href="/profile">
                    <a><Button variant="outline">{user?.name || "Profile"}</Button></a>
                  </Link>
                </>
              ) : (
                <a href={getLoginUrl()}>
                  <Button>Sign In</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <GraduationCap className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">
              University of Silicon Valley
              <br />
              Transfer Credit Articulation Portal
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Simplifying the transfer process for community college students pursuing their
              bachelor's degree at USV. Discover how your courses transfer and plan your
              educational pathway.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/transfer-estimator">
                <a>
                  <Button size="lg" variant="secondary" className="text-lg">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Transfer Credits
                  </Button>
                </a>
              </Link>
              <Link href="/articulations">
                <a>
                  <Button size="lg" variant="outline" className="text-lg bg-white text-indigo-600 hover:bg-indigo-50">
                    Browse Course Mappings
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Transfer Planning
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive portal provides tools and information to help you navigate the
              transfer process with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.link}>
                  <Card className="h-full hover:shadow-lg transition cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="p-0">
                        Learn more <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Partner Colleges */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Partner Community Colleges</CardTitle>
              <CardDescription>
                We have established articulation agreements with the following Bay Area community
                colleges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partnerColleges.map((college) => (
                  <div
                    key={college}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900">{college}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Degree Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">USV Bachelor's Degree Programs</CardTitle>
              <CardDescription>
                Transfer credits apply to all seven of our undergraduate degree programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {degreePrograms.map((program) => (
                  <div
                    key={program}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
                  >
                    <GraduationCap className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900">{program}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Transfer Journey?</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Use our transfer credit estimator to see how your community college courses apply to
              your intended USV degree program.
            </p>
            <Link href="/transfer-estimator">
              <a>
                <Button size="lg" variant="secondary" className="text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Get Started Now
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-2">
              © 2025 University of Silicon Valley. All rights reserved.
            </p>
            <p className="text-sm">
              191 Baypointe Parkway, San Jose, CA 95134 • (408) 498-5100 • www.usv.edu
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
