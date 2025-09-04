import React from "react";
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

const BidderDashboard = () => {
  const stats = [
    {
      title: "Applications Sent",
      value: "24",
      change: "+3 this week",
      icon: Send,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Active Bids",
      value: "8",
      change: "2 pending review",
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      title: "Won Projects",
      value: "12",
      change: "+2 this month",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Success Rate",
      value: "67%",
      change: "+12% improvement",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      textColor: "text-purple-600",
    },
  ];

  const myApplications = [
    {
      id: 1,
      tenderTitle: "Website Development Project",
      issuer: "TechCorp Inc.",
      appliedAt: "2025-01-10",
      status: "pending",
      budget: "$5,000 - $10,000",
      deadline: "2025-02-15",
      bidAmount: "$7,500",
    },
    {
      id: 2,
      tenderTitle: "Mobile App UI Design",
      issuer: "StartupXYZ",
      appliedAt: "2025-01-08",
      status: "shortlisted",
      budget: "$3,000 - $5,000",
      deadline: "2025-02-10",
      bidAmount: "$4,200",
    },
    {
      id: 3,
      tenderTitle: "Data Analysis Project",
      issuer: "Analytics Pro",
      appliedAt: "2025-01-05",
      status: "rejected",
      budget: "$2,000 - $4,000",
      deadline: "2025-01-30",
      bidAmount: "$3,000",
    },
  ];

  const recommendedTenders = [
    {
      id: 5,
      title: "React Dashboard Development",
      description:
        "Build a comprehensive admin dashboard with React and modern UI components.",
      category: "Web Development",
      budget: "$4,000 - $8,000",
      deadline: "2025-03-01",
      status: "active",
      issuer: "DashCorp",
      applicants: 6,
      matchScore: 95,
    },
    {
      id: 6,
      title: "E-commerce Platform Enhancement",
      description:
        "Enhance existing e-commerce platform with new features and performance improvements.",
      category: "Web Development",
      budget: "$6,000 - $12,000",
      deadline: "2025-03-15",
      status: "active",
      issuer: "ShopTech",
      applicants: 9,
      matchScore: 88,
    },
    {
      id: 7,
      title: "Mobile App Development",
      description:
        "iOS and Android app development for food delivery service.",
      category: "Mobile Development",
      budget: "$8,000 - $15,000",
      deadline: "2025-03-20",
      status: "active",
      issuer: "FoodTech",
      applicants: 12,
      matchScore: 82,
    },
  ];

  const quickActions = [
    {
      title: "Browse Tenders",
      description: "Find new opportunities",
      icon: FileText,
      link: "/tenders",
      color: "from-green-600 to-teal-600",
    },
    {
      title: "My Applications",
      description: "Track your bids",
      icon: Send,
      link: "/bidder/applications",
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Update Profile",
      description: "Improve your profile",
      icon: User,
      link: "/profile",
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "Analytics",
      description: "View your performance",
      icon: BarChart3,
      link: "/bidder/analytics",
      color: "from-orange-600 to-red-600",
    },
  ];

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`border-0 shadow-lg bg-gradient-to-br ${stat.bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${stat.textColor}`}>
                        {stat.title}
                      </p>
                      <p className={`text-3xl font-bold ${stat.textColor.replace('600', '900')}`}>
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
                <div className="space-y-4">
                  {myApplications.map((application) => {
                    const StatusIcon = getStatusIcon(application.status);
                    return (
                      <Card
                        key={application.id}
                        className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {application.tenderTitle}
                                </h3>
                                <Badge className={getStatusColor(application.status)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                by {application.issuer}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Applied {application.appliedAt}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  Bid: {application.bidAmount}
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
                <div className="space-y-4">
                  {recommendedTenders.map((tender) => (
                    <Card key={tender.id} className="border-0 bg-gradient-to-r from-gray-50 to-gray-100">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {tender.title}
                              </h4>
                              <div className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                <Star className="h-3 w-3 mr-1" />
                                {tender.matchScore}%
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                              {tender.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {tender.budget}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due {tender.deadline}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {tender.category}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                          <Link to={`/tenders/${tender.id}`}>View Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Completion & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Completion */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Profile Completion
              </CardTitle>
              <CardDescription>
                Complete your profile to get better recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Profile Strength</span>
                <span className="text-sm font-bold text-purple-600">75%</span>
              </div>
              <Progress value={75} className="mb-4 h-2" />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Add Portfolio
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Update Skills
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Add Certifications
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Upload Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Frequently used bidder functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} to={action.link}>
                      <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-green-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-xs text-gray-600">
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
      </div>
    </Layout>
  );
};

export default BidderDashboard;
