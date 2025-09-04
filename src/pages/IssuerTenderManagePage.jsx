// src/pages/IssuerTenderManagePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
  Phone,
  Mail,
  Download,
  Eye,
  Edit,
  Clock,
  AlertCircle,
  TrendingUp,
  Shield,
  Award,
  MapPin,
  Globe,
  Star,
  MessageSquare,
  UserCheck,
  UserX,
  Filter,
  Search,
  ArrowLeft,
} from "lucide-react";
import { tenderAPI, applicationAPI } from "../services/api";
import TenderEditModal from "./TenderEditModal";

export const IssuerTenderManagePage = () => {
  const { tenderId } = useParams();
  const [tender, setTender] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch tender and applications
  const fetchTenderDetails = async () => {
    try {
      setLoading(true);
      const tenderRes = await tenderAPI.getById(tenderId);
      setTender(tenderRes?.data?.tender || tenderRes?.data);
      console.log(tenderRes);

      const appRes = await applicationAPI.getByTender(tenderId);
      setApplications(appRes?.data?.items || appRes?.data || []);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load tender"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await applicationAPI.updateStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status } : a))
      );
    } catch (e) {
      alert("Failed to update status");
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTenderDetails();
  }, [tenderId]);

  // Helper functions
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          dot: "bg-emerald-400",
        };
      case "rejected":
        return {
          color: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <XCircle className="h-3.5 w-3.5" />,
          dot: "bg-rose-400",
        };
      case "pending":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="h-3.5 w-3.5" />,
          dot: "bg-amber-400",
        };
      default:
        return {
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <AlertCircle className="h-3.5 w-3.5" />,
          dot: "bg-slate-400",
        };
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-ZA", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  const getApplicationStats = () => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    return { total, pending, approved, rejected };
  };

  const stats = getApplicationStats();

  if (loading) {
    return (
      <Layout showSidebar>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-slate-600 font-medium">
              Loading tender details...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showSidebar>
        <div className="max-w-2xl mx-auto mt-12">
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-rose-900 mb-2">
                Error Loading Tender
              </h3>
              <p className="text-rose-700 mb-6">{error}</p>
              <Button
                onClick={fetchTenderDetails}
                className="bg-rose-600 hover:bg-rose-700"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!tender) {
    return (
      <Layout showSidebar>
        <div className="max-w-2xl mx-auto mt-12">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Tender Not Found
              </h3>
              <p className="text-slate-600 mb-6">
                The tender you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/issuer/tenders">
                <Button>Back to Tenders</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar>
      <div className="space-y-8">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/issuer/tenders">
              <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                Back to Tenders
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-300"></div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
              className="gap-2 rounded-xl"
            >
              <Edit className="h-4 w-4" />
              Edit Tender
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Tender Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tender Info */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white p-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge className="bg-white/20 text-white border-white/30 mb-3">
                      {tender.category}
                    </Badge>
                    <p className="text-sm text-white font-medium">Title</p>
                    <h2 className="text-2xl font-bold leading-tight">
                      {tender.title}
                    </h2>
                    <p className="text-sm text-white font-medium">
                      Description
                    </p>
                    <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl">
                      {tender.description}
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <div className="bg-white/20 rounded-xl p-3 w-fit mx-auto mb-2">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(tender.budgetMin)} -{" "}
                      {formatCurrency(tender.budgetMax)}
                    </p>
                    <p className="text-indigo-100 text-sm font-medium">
                      Budget Range
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 rounded-xl p-3 w-fit mx-auto mb-2">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <p className="text-xl font-bold">
                      {formatDate(tender.deadline)}
                    </p>
                    <p className="text-indigo-100 text-sm font-medium">
                      Deadline
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 rounded-xl p-3 w-fit mx-auto mb-2">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-2xl font-bold">{applications.length}</p>
                    <p className="text-indigo-100 text-sm font-medium">
                      Applications
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 rounded-xl p-3 w-fit mx-auto mb-2">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                    <p className="text-indigo-100 text-sm font-medium">
                      Approved
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Application Stats */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Application Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.total}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">Total</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-xl">
                    <p className="text-2xl font-bold text-amber-700">
                      {stats.pending}
                    </p>
                    <p className="text-sm text-amber-600 font-medium">
                      Pending
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <p className="text-2xl font-bold text-emerald-700">
                      {stats.approved}
                    </p>
                    <p className="text-sm text-emerald-600 font-medium">
                      Approved
                    </p>
                  </div>
                  <div className="text-center p-4 bg-rose-50 rounded-xl">
                    <p className="text-2xl font-bold text-rose-700">
                      {stats.rejected}
                    </p>
                    <p className="text-sm text-rose-600 font-medium">
                      Rejected
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Company Name
                    </p>
                    <p className="font-semibold text-slate-900">
                      {tender.companyName || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Registration Number
                    </p>
                    <p className="font-semibold text-slate-900">
                      {tender.registrationNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        BBBEE Level
                      </p>
                      <p className="font-semibold text-slate-900">
                        {tender.bbeeLevel || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        CIDB Grade
                      </p>
                      <p className="font-semibold text-slate-900">
                        {tender.cidbGrading || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Documents */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-indigo-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Contact Person
                    </p>
                    <p className="font-semibold text-slate-900">
                      {tender.contactPerson || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Email</p>
                    <p className="font-semibold text-slate-900">
                      {tender.contactEmail || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Phone</p>
                    <p className="font-semibold text-slate-900">
                      {tender.contactPhone || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tender.documents && tender.documents.length > 0 ? (
                  <div className="space-y-3">
                    {tender.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {doc.name || `Document ${idx + 1}`}
                          </p>
                          <p className="text-sm text-slate-500">
                            Click to view or download
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => window.open(doc.url || "#", "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No documents uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Applications Section */}
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-6 w-6 text-indigo-600" />
                  Applications ({applications.length})
                </CardTitle>
                <CardDescription>
                  Review and manage tender applications from contractors
                </CardDescription>
              </div>

              {/* Filter Controls */}
              <div className="flex gap-3">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className="rounded-lg"
                >
                  All ({stats.total})
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                  className="rounded-lg"
                >
                  Pending ({stats.pending})
                </Button>
                <Button
                  variant={filterStatus === "approved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("approved")}
                  className="rounded-lg"
                >
                  Approved ({stats.approved})
                </Button>
                <Button
                  variant={filterStatus === "rejected" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("rejected")}
                  className="rounded-lg"
                >
                  Rejected ({stats.rejected})
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {applications.length === 0
                    ? "No applications yet"
                    : `No ${filterStatus} applications`}
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {applications.length === 0
                    ? "Applications will appear here once contractors start applying to your tender."
                    : `There are no ${filterStatus} applications to show.`}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredApplications.map((app) => {
                  const statusConfig = getStatusConfig(app.status);

                  return (
                    <Card
                      key={app._id}
                      className="border-slate-200 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-start gap-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {(app.applicantName || app.bidderName || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">
                                {app.applicantName ||
                                  app.bidderName ||
                                  "Unknown Applicant"}
                              </h3>
                              <div className="flex items-center gap-4 mt-2">
                                {app.email && (
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm">{app.email}</span>
                                  </div>
                                )}
                                {app.phone && (
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm">{app.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <Badge
                            className={`${statusConfig.color} px-3 py-1.5 font-medium`}
                            variant="outline"
                          >
                            <div className="flex items-center gap-2">
                              {statusConfig.icon}
                              {app.status?.charAt(0).toUpperCase() +
                                app.status?.slice(1) || "Unknown"}
                            </div>
                          </Badge>
                        </div>

                        {app.message && (
                          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-start gap-2 mb-2">
                              <MessageSquare className="h-4 w-4 text-slate-500 mt-0.5" />
                              <p className="text-sm font-medium text-slate-700">
                                Message from applicant:
                              </p>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                              {app.message}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="h-4 w-4" />
                            Applied on{" "}
                            {formatDate(app.createdAt || app.appliedAt)}
                          </div>

                          <div className="flex gap-3">
                            {app.status !== "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStatusUpdate(app._id, "approved")
                                }
                                className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-lg"
                              >
                                <UserCheck className="h-4 w-4" />
                                Approve
                              </Button>
                            )}
                            {app.status !== "rejected" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStatusUpdate(app._id, "rejected")
                                }
                                className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 rounded-lg"
                              >
                                <UserX className="h-4 w-4" />
                                Reject
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Edit Modal */}
      {isEditModalOpen && (
        <TenderEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          tender={tender}
          onUpdate={setTender}
        />
      )}
    </Layout>
  );
};
