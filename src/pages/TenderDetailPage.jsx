// src/pages/TenderDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applicationAPI, tenderAPI } from "@/services/api";
import Layout from "@/components/layout/Layout";
import {
  Calendar,
  DollarSign,
  Building,
  Mail,
  Phone,
  FileText,
  ArrowLeft,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/useAuth";

const formatCurrency = (amount) => {
  if (!amount) return "Not specified";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getDeadlineStatus = (deadline) => {
  if (!deadline)
    return { status: "unknown", color: "gray", text: "No deadline" };

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status: "expired",
      color: "red",
      text: "Expired",
      icon: AlertCircle,
    };
  } else if (daysLeft <= 7) {
    return {
      status: "urgent",
      color: "orange",
      text: `${daysLeft} days left`,
      icon: Clock,
    };
  } else {
    return {
      status: "open",
      color: "green",
      text: `${daysLeft} days left`,
      icon: CheckCircle,
    };
  }
};

const TenderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const res = await tenderAPI.getById(id);
        setTender(res.data);
      } catch (error) {
        console.error("Failed to fetch tender:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTender();
  }, [id]);

  useEffect(() => {
    const checkApplication = async () => {
      if (!user || user.role !== "bidder") {
        setCheckingApplication(false);
        return;
      }
      try {
        const res = await applicationAPI.getMine(); // fetch current bidder's applications
        const applied = res.data.some((app) => app.tender._id === tender._id);
        setHasApplied(applied);
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingApplication(false);
      }
    };

    if (tender?._id) checkApplication();
  }, [tender, user]);

  const handleApply = async () => {
    if (!user) {
      alert("Please login to apply.");
      navigate("/login");
      return;
    }
    if (user.role !== "bidder") {
      alert("Only bidder accounts can apply to tenders.");
      return;
    }
    navigate(`/tenders/${tender._id || tender.id}/apply`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-gray-600">Loading tender details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tender) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">
              Tender Not Found
            </h2>
            <p className="text-gray-600">
              The tender you're looking for doesn't exist or has been removed.
            </p>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const deadlineStatus = getDeadlineStatus(tender.deadline);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Tenders
            </Button>
          </div>

          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {tender.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {tender.companyName || "Company not specified"}
                      </span>
                      {tender.category && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {tender.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {tender.description}
                </p>

                {/* Deadline Status */}
                <div className="flex items-center gap-2 mb-4">
                  {deadlineStatus.icon && (
                    <deadlineStatus.icon
                      className={`w-5 h-5 text-${deadlineStatus.color}-600`}
                    />
                  )}
                  <span
                    className={`text-${deadlineStatus.color}-600 font-medium`}
                  >
                    {deadlineStatus.text}
                  </span>
                  {tender.deadline && (
                    <span className="text-gray-500">
                      (Deadline: {formatDate(tender.deadline)})
                    </span>
                  )}
                </div>
              </div>

              {/* Apply Button */}
              {user?.role === "bidder" && !checkingApplication && (
                <div className="lg:ml-8">
                  <Button
                    onClick={handleApply}
                    size="lg"
                    className={`w-full lg:w-auto px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200
        ${
          hasApplied || deadlineStatus.status === "expired"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
        }`}
                    disabled={hasApplied || deadlineStatus.status === "expired"}
                  >
                    {hasApplied
                      ? "Already Applied"
                      : deadlineStatus.status === "expired"
                      ? "Application Closed"
                      : "Apply Now"}
                  </Button>

                  {deadlineStatus.status === "urgent" && !hasApplied && (
                    <p className="text-sm text-orange-600 mt-2 text-center lg:text-left">
                      ⚠️ Deadline approaching soon!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Information Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      Deadline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600">
                      {formatDate(tender.deadline)}
                    </div>
                    <div
                      className={`text-xs font-medium text-${deadlineStatus.color}-600 mt-1`}
                    >
                      {deadlineStatus.text}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      Budget Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(tender.budgetMin)}
                    </div>
                    <div className="text-xs text-gray-500">
                      to {formatCurrency(tender.budgetMax)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-purple-600" />
                      </div>
                      Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-900">
                      {tender.category || "Not specified"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Documents Section */}
              {tender.documents?.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-amber-600" />
                      </div>
                      Tender Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {tender.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {doc.originalName || `Document ${i + 1}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              Click to download
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-indigo-600" />
                    </div>
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Company Name
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {tender.companyName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Registration Number
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {tender.registrationNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      B-BBEE Level
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {tender.bbeeLevel || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      CIDB Grading
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {tender.cidbGrading || "Not specified"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tender.contactPerson && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Contact Person
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {tender.contactPerson}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Email
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${tender.contactEmail}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {tender.contactEmail || "Not provided"}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Phone
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a
                        href={`tel:${tender.contactPhone}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {tender.contactPhone || "Not provided"}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TenderDetailPage;
