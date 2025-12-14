import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Redirect } from "wouter";
import AdminDashboard from "@/components/AdminDashboard";
import DashboardPage from "./admin/Dashboard";
import CoursesPage from "./admin/Courses";
import ArticulationsPage from "./admin/Articulations";
import ImportExportPage from "./admin/ImportExport";

export default function Admin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
    <AdminDashboard activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminDashboard>
  );
}
