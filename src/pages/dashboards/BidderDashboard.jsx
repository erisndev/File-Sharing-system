import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Progress } from "../../components/ui/progress";
import {
  FileText,
  Send,
  Clock,
  CheckCircle,
  TrendingUp,
  Eye,
  MessageSquare,
  Star,
  Target,
  Award,
  Zap,
  BarChart3,
  User,
  DollarSign,
  Calendar,
  XCircle,
} from "lucide-react";
import { applicationAPI, tenderAPI } from "../../services/api";

const BidderDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [recommendedTenders, setRecommendedTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch API Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get my applications
        const appsRes = await applicationAPI.getMine();
        setApplications(appsRes.data || []);

        // 2️⃣ Get recommended tenders (for now fetch all tenders)
        const tendersRes = await tenderAPI.getAll();
        setRecommendedTenders(tendersRes.data?.items || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shortlisted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "won":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return Clock;
      case "shortlisted":
        return Star;
      case "rejected":
        return XCircle;
      case "won":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bidder Dashboard</h1>
              <p className="text-green-100 text-lg">
                Track your applications and discover new opportunities
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Target className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Applications */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-green-600" />
                      My Applications
                    </CardTitle>
                    <CardDescription>
                      Track the status of your submitted bids
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline">
                    <Link to="/bidder/applications">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => {
                      const StatusIcon = getStatusIcon(application.status);
                      return (
                        <Card
                          key={application._id}
                          className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md transition-all duration-200"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {application.tender?.title}
                                  </h3>
                                  <Badge
                                    className={getStatusColor(
                                      application.status
                                    )}
                                  >
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {application.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  by{" "}
                                  {application.tender?.companyName || "Unknown"}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Applied{" "}
                                    {new Date(
                                      application.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    Bid: R{application.bidAmount}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p>No applications yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommended Tenders */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Recommended for You
                </CardTitle>
                <CardDescription>Tenders matching your skills</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : recommendedTenders.length > 0 ? (
                  <div className="space-y-4">
                    {recommendedTenders.map((tender) => (
                      <Card
                        key={tender._id}
                        className="border-0 bg-gradient-to-r from-gray-50 to-gray-100"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {tender.title}
                              </h4>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {tender.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />R
                                  {tender.budgetMin} - R{tender.budgetMax}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Due{" "}
                                  {new Date(
                                    tender.deadline
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {tender.category}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full !bg-green-600 hover:!bg-green-700 cursor-pointer"
                            onClick={() => navigate(`/tenders/${tender._id}`)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No recommended tenders available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BidderDashboard;
