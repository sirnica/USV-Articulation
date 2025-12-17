import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Redirect, Link } from "wouter";
import AdminDashboard from "@/components/AdminDashboard";
import DashboardPage from "./admin/Dashboard";
import CoursesPage from "./admin/Courses";
import ArticulationsPage from "./admin/Articulations";
import ImportExportPage from "./admin/ImportExport";
import { School } from "lucide-react";

export default function Admin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "courses":
        return <CoursesPage />;
      case "articulations":
        return <ArticulationsPage />;
      case "import":
      case "export":
        return <ImportExportPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-orange-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
              <School className="w-8 h-8 text-orange-500" />
              <span className="font-bold text-xl text-white">USV Admin Portal</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                Admin: {user.name}
              </span>
              <Link href="/">
                <a className="text-gray-300 hover:text-orange-400 transition px-3 py-2">
                  Back to Site
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-700 bg-gray-900/50">
            <div className="flex space-x-1 p-2">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "courses", label: "Courses" },
                { id: "articulations", label: "Articulations" },
                { id: "import", label: "Import/Export" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
