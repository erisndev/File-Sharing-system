import React, { useEffect } from "react";
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
  FileText,
  ArrowLeft,
  Calendar,
  DollarSign,
  Building,
  Download,
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

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const { current, loadingCurrent, error, clearError, fetchById } = useApplications();

  useEffect(() => {
    fetchById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const app = current;

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

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Application Details</h1>
              <p className="text-green-100 text-lg">Review your submission and its status</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link to="/bidder/applications">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applications
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Submission</CardTitle>
                <CardDescription>Your submitted details and attachments</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded" onClick={clearError}>
                    {error}
                  </div>
                )}

                {loadingCurrent ? (
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : !app ? (
                  <div className="text-center py-8 text-gray-600">Application not found.</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={statusColor(app?.status)}>{app?.status || "Pending"}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">Submitted</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {app?.createdAt ? new Date(app.createdAt).toLocaleString() : "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">Bid Amount</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          {app?.bidAmount || app?.amount || app?.offerAmount || "-"}
                        </p>
                      </div>
                    </div>

                    {app?.notes || app?.feedback ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">Issuer Feedback</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{app?.feedback || app?.notes}</p>
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">Attachments</p>
                      {Array.isArray(app?.files) && app.files.length > 0 ? (
                        <div className="space-y-2">
                          {app.files.map((f) => (
                            <div key={f.id || f.fileId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700 truncate" title={f.name || "Attachment"}>
                                  {f.name || "Attachment"}
                                </span>
                              </div>
                              <Button size="sm" variant="outline" className="gap-2" onClick={() => handleDownload(f.id || f.fileId, f.name || "attachment")}>
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No attachments</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tender</CardTitle>
                <CardDescription>Application target details</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCurrent ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : app?.tender ? (
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{app.tender.title || "Tender"}</p>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{app.tender.issuer || app.tender.company || "Issuer"}</span>
                    </div>
                    <div className="pt-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/tenders/${app.tender.id}`}>View Tender</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Tender details unavailable</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationDetailPage;
