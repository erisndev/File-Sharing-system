import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Activity,
  Users,
  FileText,
  CheckCircle,
  DollarSign,
  Shield,
} from "lucide-react";
import { authAPI, tenderAPI } from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTenders: 0,
    totalTenders: 0,
    successRate: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [allTenders, setAllTenders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users
        const usersRes = await authAPI.getAllUsers();
        const usersData =
          usersRes.data?.users ?? usersRes.data?.items ?? usersRes.data ?? [];
        const users = Array.isArray(usersData) ? usersData : [];
        const totalUsers = users.length;

        // Fetch tenders
        const tendersRes = await tenderAPI.getAll();
        const tendersData =
          tendersRes.data?.items ?? tendersRes.data?.tenders ?? tendersRes.data ?? [];
        const tenders = Array.isArray(tendersData) ? tendersData : [];
        const activeTenders = tenders.filter((t) => t.status === "active").length;
        const totalTenders = tenders.length;

        // Example success rate calculation (adjust to your logic)
        const completedTenders = tenders.filter(
          (t) => t.status === "completed"
        ).length;
        const successRate = totalTenders
          ? ((completedTenders / totalTenders) * 100).toFixed(1)
          : 0;

        setStats({ totalUsers, activeTenders, totalTenders, successRate });
        setAllTenders(tenders);

        // Recent activity: last 5 users + last 5 tenders
        const recentUsers = users.slice(-5).map((u) => ({
          id: u._id,
          type: "user_registered",
          message: `New user "${u.name}" registered`,
          timestamp: new Date(u.createdAt).toISOString(),
          status: "success",
          user: u.name,
        }));

        const recentTenders = tenders.slice(-5).map((t) => ({
          id: t._id,
          type: "tender_created",
          message: `New tender "${t.title}" created`,
          timestamp: new Date(t.createdAt).toISOString(),
          status: "info",
          user: t.organization,
        }));

        setRecentActivity(
          [...recentUsers, ...recentTenders].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        );
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "tender_created":
        return FileText;
      case "user_registered":
        return Users;
      case "tender_closed":
        return CheckCircle;
      case "payment_received":
        return DollarSign;
      default:
        return Activity;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-600";
      case "warning":
        return "bg-yellow-100 text-yellow-600";
      case "error":
        return "bg-red-100 text-red-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Monitor and manage the TenderHub platform
            </p>
          </div>
          <Shield className="h-12 w-12 text-white" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent>
              <p className="text-sm font-medium text-blue-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-900">
                {stats.totalUsers}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent>
              <p className="text-sm font-medium text-green-600">
                Active Tenders
              </p>
              <p className="text-3xl font-bold text-green-900">
                {stats.activeTenders}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent>
              <p className="text-sm font-medium text-purple-600">
                Total Tenders
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {stats.totalTenders}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent>
              <p className="text-sm font-medium text-orange-600">
                Success Rate
              </p>
              <p className="text-3xl font-bold text-orange-900">
                {stats.successRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* All Tenders */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> All Tenders
            </CardTitle>
            <CardDescription>List of all tenders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTenders.map((tender) => (
                <Card
                  key={tender._id}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <CardContent>
                    <h3 className="text-lg font-semibold">{tender.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {tender.description}
                    </p>
                    <Badge
                      className={
                        tender.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {tender.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" /> Recent Activity
            </CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-full ${getActivityColor(
                        activity.status
                      )}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()} • by{" "}
                        {activity.user}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
