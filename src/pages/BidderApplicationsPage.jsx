import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApplications } from "@/contexts/ApplicationContext";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  Download,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
} from "lucide-react";
import { applicationAPI } from "@/services/api";

export const BidderApplicationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { mine, loadingMine, fetchMine } = useApplications();

  useEffect(() => {
    fetchMine();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "in review":
      case "review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
      case "in review":
      case "review":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredApplications = useMemo(() => {
    const list = Array.isArray(mine) ? mine : [];
    return list.filter((application) => {
      const tenderTitle =
        application?.tender?.title || application?.tenderTitle || "";
      const company =
        application?.tender?.createdBy?.name ||
        application?.tender?.issuer ||
        application?.company ||
        "";
      const category =
        application?.tender?.category || application?.category || "";
      const status = (application?.status || "").toLowerCase();

      const matchesSearch =
        tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "all" || status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [mine, searchTerm, filterStatus]);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await applicationAPI.withdraw(applicationId);
      await fetchMine();
    } catch (e) {
      alert(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to withdraw application"
      );
    }
  };

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Applications</h1>
              <p className="text-green-100 text-lg">
                Track the status of all your tender applications
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {loadingMine ? "-" : mine?.length || 0}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {loadingMine
                      ? "-"
                      : (mine || []).filter((a) =>
                          ["pending", "in review", "review"].includes(
                            (a?.status || "").toLowerCase()
                          )
                        ).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Accepted</p>
                  <p className="text-3xl font-bold text-green-900">
                    {loadingMine
                      ? "-"
                      : (mine || []).filter((a) =>
                          ["accepted", "approved"].includes(
                            (a?.status || "").toLowerCase()
                          )
                        ).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Rejected</p>
                  <p className="text-3xl font-bold text-red-900">
                    {loadingMine
                      ? "-"
                      : (mine || []).filter(
                          (a) => (a?.status || "").toLowerCase() === "rejected"
                        ).length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("pending")}
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("accepted")}
                    >
                      Accepted
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("rejected")}
                    >
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Link to="/tenders">
                  <Button className="gap-2 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4" />
                    Browse Tenders
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loadingMine ? (
            [...Array(6)].map((_, idx) => (
              <Card key={`skeleton-${idx}`} className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="h-24 bg-gray-100 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : filteredApplications.length > 0 ? (
            filteredApplications.map((application) => {
              const tenderTitle =
                application?.tender?.title ||
                application?.tenderTitle ||
                "Untitled";

              const issuer =
                application?.tender?.createdBy?.name ||
                application?.tender?.issuer ||
                "Unknown";

              const deadline =
                application?.tender?.deadline || application?.deadline || "-";
              const category =
                application?.tender?.category || application?.category || "-";

              const bidAmount =
                application?.bidAmount ||
                application?.amount ||
                application?.offerAmount;
              const submittedAt =
                application?.createdAt || application?.submittedAt;
              const submittedBy = issuer;

              return (
                <Card
                  key={application._id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge
                        className={getStatusColor(
                          (application?.status || "").toLowerCase()
                        )}
                        variant="outline"
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(
                            (application?.status || "").toLowerCase()
                          )}
                          {(application?.status || "Pending").toString()}
                        </div>
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/bidder/applications/${application._id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Application
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleWithdraw(application._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Withdraw Application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                      {tenderTitle}
                    </CardTitle>
                    <CardDescription>Issued by: {issuer}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800 text-sm">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1 text-green-600">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">
                            {bidAmount || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {deadline
                              ? new Date(deadline).toISOString().split("T")[0]
                              : "-"}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            Submitted{" "}
                            {submittedAt
                              ? new Date(submittedAt)
                                  .toISOString()
                                  .split("T")[0]
                              : "-"}{" "}
                            by {submittedBy}
                          </span>
                        </div>
                        <Badge variant="secondary">{category}</Badge>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                      >
                        <Link to={`/bidder/applications/${application._id}`}>
                          View Application
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start applying to tenders to see your applications here."}
                </p>
                <Link to="/tenders">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Browse Available Tenders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};
