import React, { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useApplications } from "@/contexts/ApplicationContext";
import { fileAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  ArrowLeft,
} from "lucide-react";

const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "accepted":
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "in review":
    case "review":
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const statusIcon = (status) => {
  switch ((status || "").toLowerCase()) {
    case "accepted":
    case "approved":
      return <CheckCircle className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const TenderResponsesPage = () => {
  const { id } = useParams();
  const tenderId = useMemo(() => (id ? Number(id) || id : id), [id]);
  const {
    byTender,
    loadingByTender,
    error,
    clearError,
    fetchByTender,
    updateStatus,
    updating,
  } = useApplications();

  const applications = byTender?.[tenderId] || [];
  const loading = loadingByTender?.[tenderId] || false;

  useEffect(() => {
    fetchByTender(tenderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenderId]);

  const handleDownload = async (fileId, filename = "download") => {
    try {
      const res = await fileAPI.download(fileId);
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("File download failed", e);
      alert("Failed to download file");
    }
  };

  const setStatus = async (applicationId, status) => {
    const res = await updateStatus(applicationId, status);
    if (!res.success) {
      alert(res.error || "Failed to update status");
    }
  };

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tender Responses</h1>
              <p className="text-indigo-100 text-lg">
                Review and manage applications submitted for this tender
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link to={`/tenders/${tenderId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tender
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-900">{loading ? "-" : applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Accepted</p>
                  <p className="text-3xl font-bold text-green-900">
                    {loading ? "-" : applications.filter((a) => (a?.status || "").toLowerCase() === "accepted" || (a?.status || "").toLowerCase() === "approved").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending/Review</p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {loading ? "-" : applications.filter((a) => ["pending", "in review", "review"].includes((a?.status || "").toLowerCase())).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>Submissions for tender #{tenderId}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded" onClick={clearError}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded">
                    <Skeleton className="h-4 col-span-3" />
                    <Skeleton className="h-4 col-span-2" />
                    <Skeleton className="h-4 col-span-2" />
                    <Skeleton className="h-6 w-24 col-span-2" />
                    <Skeleton className="h-8 w-28 col-span-3" />
                  </div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500">You'll see submissions here as bidders apply.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold text-gray-500">
                    <div className="col-span-3">Bidder</div>
                    <div className="col-span-2">Submitted</div>
                    <div className="col-span-2">Bid</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3 text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {applications.map((app) => {
                      const bidderName = app?.bidder?.name || app?.bidderName || app?.user?.name || "Unknown";
                      const bidderCompany = app?.bidder?.company || app?.company || app?.user?.company;
                      const submittedAt = app?.createdAt || app?.submittedAt || app?.appliedAt;
                      const bidAmount = app?.bidAmount || app?.amount || app?.offerAmount;
                      const files = app?.files || app?.attachments || [];

                      return (
                        <div key={app?.id} className="grid grid-cols-12 gap-2 items-center px-3 py-3 hover:bg-gray-50">
                          <div className="col-span-3 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{bidderName}</p>
                            {bidderCompany && (
                              <p className="text-xs text-gray-500 truncate">{bidderCompany}</p>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-700 flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {submittedAt ? new Date(submittedAt).toLocaleString() : "-"}
                          </div>
                          <div className="col-span-2 text-sm text-gray-700 flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            {bidAmount || "-"}
                          </div>
                          <div className="col-span-2">
                            <Badge className={statusColor(app?.status)}>
                              <span className="flex items-center gap-1">
                                {statusIcon(app?.status)}
                                {(app?.status || "Pending").toString()}
                              </span>
                            </Badge>
                          </div>
                          <div className="col-span-3 flex items-center justify-end gap-2">
                            {Array.isArray(files) && files.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleDownload(files[0]?.id || files[0]?.fileId, files[0]?.name || "attachment")}
                                title="Download first attachment"
                              >
                                <Download className="h-4 w-4" />
                                File
                              </Button>
                            )}
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={updating}
                                onClick={() => setStatus(app?.id, "accepted")}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={updating}
                                onClick={() => setStatus(app?.id, "in review")}
                              >
                                In Review
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600"
                                disabled={updating}
                                onClick={() => setStatus(app?.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TenderResponsesPage;
