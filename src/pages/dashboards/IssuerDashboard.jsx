import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  FileText,
  Users,
  PlusCircle,
  TrendingUp,
  CheckCircle,
  BarChart3,
  Zap,
  Eye,
  DollarSign,
  Calendar,
  Building,
} from "lucide-react";
import { tenderAPI, applicationAPI } from "../../services/api";

const IssuerDashboard = () => {
  const [stats, setStats] = useState([]);
  const [myTenders, setMyTenders] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shortlisted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTenderStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get tenders created by this issuer
        const tendersRes = await tenderAPI.getAll({ mine: true });
        const tenders = Array.isArray(tendersRes.data.items)
          ? tendersRes.data.items
          : [];
        setMyTenders(tenders);

        // 2️⃣ Gather all applications for these tenders
        const applications = [];
        for (let tender of tenders) {
          const res = await applicationAPI.getByTender(tender._id);
          const apps = Array.isArray(res.data) ? res.data : [];
          apps.forEach((a) =>
            applications.push({
              ...a,
              tenderTitle: tender.title,
              tenderId: tender._id || tender.id,
            })
          );
        }

        // Sort recent applications (latest 5)
        applications.sort(
          (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
        );
        setRecentApplications(applications.slice(0, 5));

        // 3️⃣ Compute stats
        const activeTenders = tenders.filter(
          (t) => t.status === "active"
        ).length;
        const completedProjects = tenders.filter(
          (t) => t.status === "closed"
        ).length;
        const totalApplications = applications.length;

        setStats([
          {
            title: "Active Tenders",
            value: activeTenders,
            change: "+0 this week",
            icon: FileText,
            color: "from-blue-500 to-blue-600",
            bgColor: "from-blue-50 to-blue-100",
            textColor: "text-blue-600",
          },
          {
            title: "Total Applications",
            value: totalApplications,
            change: "+0 this week",
            icon: Users,
            color: "from-green-500 to-green-600",
            bgColor: "from-green-50 to-green-100",
            textColor: "text-green-600",
          },
          {
            title: "Completed Projects",
            value: completedProjects,
            change: "+0 this month",
            icon: CheckCircle,
            color: "from-purple-500 to-purple-600",
            bgColor: "from-purple-50 to-purple-100",
            textColor: "text-purple-600",
          },
          {
            title: "Success Rate",
            value:
              activeTenders + completedProjects > 0
                ? `${Math.round(
                    (completedProjects / (activeTenders + completedProjects)) *
                      100
                  )}%`
                : "0%",
            change: "+0% improvement",
            icon: TrendingUp,
            color: "from-orange-500 to-orange-600",
            bgColor: "from-orange-50 to-orange-100",
            textColor: "text-orange-600",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Layout showSidebar>Loading...</Layout>;

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Issuer Dashboard</h1>
              <p className="text-indigo-100 text-lg">
                Manage your tenders and track applications
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Building className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`border-0 shadow-lg bg-gradient-to-br ${stat.bgColor}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${stat.textColor}`}>
                        {stat.title}
                      </p>
                      <p
                        className={`text-3xl font-bold ${stat.textColor.replace(
                          "600",
                          "900"
                        )}`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tenders and Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tenders */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      My Active Tenders
                    </CardTitle>
                    <CardDescription>
                      Manage your published tenders
                    </CardDescription>
                  </div>
                  <Button
                    asChild
                    className="bg-indigo-600 hover:bg-indigo-700 !text-white"
                  >
                    <Link to="/issuer/create-tender">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTenders.map((tender) => (
                    <Card
                      key={tender._id}
                      className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {tender.title}
                              </h3>
                              <Badge
                                className={getTenderStatusColor(tender.status)}
                              >
                                {tender.status.charAt(0).toUpperCase() +
                                  tender.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {tender.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {tender.budgetMin} - {tender.budgetMax}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Due{" "}
                                {new Date(tender.deadline).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {tender.applicants?.length || 0} applicants
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="ml-4">
                            {tender.category}
                          </Badge>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/issuer/tenders/${tender._id || tender.id}/manage`}>
                              Manage
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Recent Applications
                </CardTitle>
                <CardDescription>Latest bidder applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <Card
                      key={app._id}
                      className="border-0 bg-gradient-to-r from-gray-50 to-gray-100"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {app.bidderName?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {app.bidderName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {app.tenderTitle}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                          {app.proposal}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              {app.bidAmount}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="text-xs bg-indigo-600 hover:bg-indigo-700"
                            asChild
                          >
                            <Link to={`/issuer/tenders/${app.tenderId}/manage`}>
                              Review
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Frequently used issuer functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Create Tender",
                  link: "/issuer/create-tender",
                  icon: PlusCircle,
                  color: "from-indigo-600 to-purple-600",
                },
                {
                  title: "My Tenders",
                  link: "/issuer/tenders",
                  icon: FileText,
                  color: "from-blue-600 to-indigo-600",
                },
                {
                  title: "Applications",
                  link: "/issuer/tenders",
                  icon: Users,
                  color: "from-green-600 to-teal-600",
                },
                {
                  title: "Analytics",
                  link: "/issuer/tenders",
                  icon: BarChart3,
                  color: "from-orange-600 to-red-600",
                },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.link}>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default IssuerDashboard;
