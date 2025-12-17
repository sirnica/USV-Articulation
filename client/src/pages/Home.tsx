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

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: Calculator,
      title: "Transfer Credit Estimator",
      description: "Calculate how your community college courses transfer to USV degree programs",
      link: "/transfer-estimator",
      color: "orange",
    },
    {
      icon: GitCompare,
      title: "Course Articulation Database",
      description: "Browse approved course equivalencies between USV and partner colleges",
      link: "/articulations",
      color: "purple",
    },
    {
      icon: BookOpen,
      title: "Degree Program Requirements",
      description: "View detailed requirements for all 7 USV bachelor's degree programs",
      link: "/programs",
      color: "orange",
    },
    {
      icon: School,
      title: "Partner Colleges",
      description: "Explore articulation agreements with 5 Bay Area community colleges",
      link: "/colleges",
      color: "purple",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-orange-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <School className="w-8 h-8 text-orange-500" />
              <span className="font-bold text-xl text-white">USV Transfer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/transfer-estimator">
                <a className="text-gray-300 hover:text-orange-400 transition px-3 py-2">
                  Transfer Estimator
                </a>
              </Link>
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <a className="text-gray-300 hover:text-orange-400 transition px-3 py-2">
                        Admin Dashboard
                      </a>
                    </Link>
                  )}
                  <Link href="/profile">
                    <a className="bg-gray-800 border border-gray-700 hover:border-orange-500 text-white px-4 py-2 rounded-lg transition">
                      {user?.name || "Profile"}
                    </a>
                  </Link>
                </>
              ) : (
                <a href={getLoginUrl()}>
                  <button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-orange-600 transition shadow-lg shadow-orange-500/50">
                    Sign In
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <GraduationCap className="w-20 h-20 mx-auto text-orange-500" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 bg-clip-text text-transparent">
              University of Silicon Valley
            </h1>
            <h2 className="text-3xl font-semibold text-white mb-6">
              Transfer Credit Articulation Portal
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Simplifying the transfer process for community college students pursuing their
              bachelor's degree at USV. Discover how your courses transfer and plan your
              educational pathway.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/transfer-estimator">
                <a>
                  <button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition shadow-lg shadow-orange-500/50 flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Transfer Credits
                  </button>
                </a>
              </Link>
              <Link href="/articulations">
                <a>
                  <button className="bg-gray-800 border-2 border-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition flex items-center">
                    Browse Course Mappings
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need for Transfer Planning
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our comprehensive portal provides tools and information to help you navigate the
              transfer process with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.link}>
                  <div className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-orange-500/50 rounded-xl p-8 transition duration-300 hover:shadow-xl hover:shadow-orange-500/20 cursor-pointer h-full">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color === 'orange' ? 'from-orange-600 to-orange-500' : 'from-purple-600 to-purple-500'} flex items-center justify-center mb-5 group-hover:scale-110 transition`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                    <div className="flex items-center text-orange-400 font-medium group-hover:text-orange-300 transition">
                      Learn more <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Partner Colleges */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-3">Partner Community Colleges</h3>
            <p className="text-gray-400 mb-6">
              We have established articulation agreements with the following Bay Area community colleges
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerColleges.map((college) => (
                <div
                  key={college}
                  className="flex items-center space-x-3 p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-orange-500/50 transition"
                >
                  <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="font-medium text-gray-200">{college}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Degree Programs */}
          <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 border border-purple-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-3">USV Bachelor's Degree Programs</h3>
            <p className="text-gray-400 mb-6">
              Transfer credits apply to all seven of our undergraduate degree programs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {degreePrograms.map((program) => (
                <div
                  key={program}
                  className="flex items-center space-x-3 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition"
                >
                  <GraduationCap className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="font-medium text-gray-200">{program}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Transfer Journey?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Use our transfer credit estimator to see how your community college courses apply to
              your intended USV degree program.
            </p>
            <Link href="/transfer-estimator">
              <a>
                <button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition shadow-lg shadow-orange-500/50 inline-flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Get Started Now
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 text-gray-400 py-8">
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
