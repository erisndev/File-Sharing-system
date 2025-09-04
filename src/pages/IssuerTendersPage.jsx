import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Users,
  TrendingUp,
  MapPin,
  Star,
} from "lucide-react";
import { tenderAPI } from "../services/api";

export const IssuerTendersPage = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch tenders from API
  const fetchTenders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tenderAPI.getAll();
      const data = res?.data?.items || [];
      setTenders(Array.isArray(data) ? data : []);
      console.log("Fetched tenders:", data);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to fetch tenders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tender?")) return;
    try {
      await tenderAPI.delete(id);
      setTenders((prev) => prev.filter((t) => t._id !== id && t.id !== id));
    } catch (e) {
      alert(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to delete tender"
      );
    }
  };

  const handleManageTender = (tenderId) => {
    navigate(`/issuer/tenders/${tenderId}/manage`);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          color:
            "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          dot: "bg-emerald-400",
        };
      case "draft":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
          icon: <Clock className="h-3.5 w-3.5" />,
          dot: "bg-amber-400",
        };
      case "closed":
        return {
          color: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-100",
          icon: <XCircle className="h-3.5 w-3.5" />,
          dot: "bg-rose-400",
        };
      default:
        return {
          color: "bg-slate-50 text-slate-700 border-slate-200 ring-slate-100",
          icon: <AlertCircle className="h-3.5 w-3.5" />,
          dot: "bg-slate-400",
        };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
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
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Expired", color: "text-rose-600" };
    if (diffDays === 0) return { text: "Due today", color: "text-amber-600" };
    if (diffDays <= 3)
      return { text: `${diffDays} days left`, color: "text-amber-600" };
    if (diffDays <= 7)
      return { text: `${diffDays} days left`, color: "text-blue-600" };
    return { text: `${diffDays} days left`, color: "text-slate-600" };
  };

  const filteredTenders = Array.isArray(tenders)
    ? tenders.filter((tender) => {
        const matchesSearch =
          tender.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tender.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          tender.category?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          filterStatus === "all" || tender.status === filterStatus;

        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <Layout showSidebar>
      <div className="space-y-8">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600">Loading tenders...</span>
          </div>
        )}

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white rounded-3xl p-8">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>

          <div className="relative flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-indigo-100 font-medium tracking-wide">
                  TENDER MANAGEMENT
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight">
                My Tenders
              </h1>
              <p className="text-indigo-100 text-lg font-light max-w-md">
                Manage and track all your published tenders with comprehensive
                analytics
              </p>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {filteredTenders.length} Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Growing</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {filteredTenders.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="border-0 shadow-xl shadow-slate-200/20 ring-1 ring-slate-200/50">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex flex-1 gap-4 items-center w-full lg:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search tenders by title, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 h-12 px-6 border-slate-200 hover:bg-slate-50 rounded-xl"
                    >
                      <Filter className="h-4 w-4" />
                      Filter:{" "}
                      {filterStatus === "all"
                        ? "All"
                        : filterStatus.charAt(0).toUpperCase() +
                          filterStatus.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 rounded-xl shadow-xl border-0 ring-1 ring-slate-200">
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("all")}
                      className="rounded-lg"
                    >
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("active")}
                      className="rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                        Active
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("draft")}
                      className="rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                        Draft
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("closed")}
                      className="rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-400"></div>
                        Closed
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2 h-12 px-6 border-slate-200 hover:bg-slate-50 rounded-xl"
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Link to="/issuer/create-tender">
                  <Button className="gap-2 h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    Create New Tender
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTenders.map((tender) => {
            const statusConfig = getStatusConfig(tender.status);
            const daysRemaining = getDaysRemaining(tender.deadline);

            return (
              <Card
                key={tender._id || tender.id}
                className="group relative border-0 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/30 transition-all duration-500 rounded-2xl overflow-hidden ring-1 ring-slate-200/50 hover:ring-slate-300/50 hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50/30"
              >
                {/* Status indicator line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${statusConfig.dot.replace(
                    "bg-",
                    "bg-gradient-to-r from-"
                  )} to-transparent`}
                ></div>

                <CardHeader className="pb-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${statusConfig.color} ring-2 ${
                          statusConfig.color.split(" ")[3]
                        } px-3 py-1.5 font-medium tracking-wide`}
                        variant="outline"
                      >
                        <div className="flex items-center gap-2">
                          {statusConfig.icon}
                          {tender.status.charAt(0).toUpperCase() +
                            tender.status.slice(1)}
                        </div>
                      </Badge>
                      {tender.priority && (
                        <Badge
                          className={`${getPriorityBadge(
                            tender.priority
                          )} text-xs px-2 py-1`}
                          variant="outline"
                        >
                          {tender.priority?.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 rounded-lg hover:bg-slate-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl shadow-xl border-0 ring-1 ring-slate-200"
                      >
                        <DropdownMenuItem className="rounded-lg">
                          <Eye className="mr-3 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg">
                          <Edit className="mr-3 h-4 w-4" />
                          Edit Tender
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg">
                          <Link
                            to={`/issuer/tenders/${
                              tender._id || tender.id
                            }/responses`}
                            className="flex items-center"
                          >
                            <Users className="mr-3 h-4 w-4" />
                            View Applications
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-rose-600 rounded-lg focus:bg-rose-50 focus:text-rose-700"
                          onClick={() => handleDelete(tender._id || tender.id)}
                        >
                          <Trash2 className="mr-3 h-4 w-4" />
                          Delete Tender
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <CardTitle className="text-xl font-bold group-hover:text-indigo-600 transition-colors duration-200 leading-tight line-clamp-2">
                      {tender.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-slate-600 leading-relaxed">
                      {tender.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Budget
                          </p>
                          <p className="font-bold text-lg">
                            {formatCurrency(tender.budgetMin)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Applications
                          </p>
                          <p className="font-bold text-lg">
                            {tender.applications || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Category */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          Deadline: {formatDate(tender.deadline)}
                        </span>
                      </div>
                      {daysRemaining && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            daysRemaining.color.includes("rose")
                              ? "bg-rose-100 text-rose-700"
                              : daysRemaining.color.includes("amber")
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {daysRemaining.text}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-indigo-50 text-indigo-700 border-indigo-200 font-medium"
                      >
                        {tender.category}
                      </Badge>
                      {tender.location && (
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <MapPin className="h-3 w-3" />
                          <span>{tender.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105"
                      onClick={() => handleManageTender(tender._id)}
                    >
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Manage Tender
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTenders.length === 0 && !loading && (
          <Card className="border-0 shadow-xl shadow-slate-200/20 ring-1 ring-slate-200/50 rounded-2xl">
            <CardContent className="p-16 text-center">
              <div className="mx-auto mb-8 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <FileText className="h-16 w-16 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {searchTerm || filterStatus !== "all"
                  ? "No matching tenders found"
                  : "No tenders yet"}
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search criteria or filters to find what you're looking for."
                  : "Create your first tender to start receiving applications from qualified contractors."}
              </p>
              <Link to="/issuer/create-tender">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-12 px-8 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200">
                  <Plus className="mr-2 h-5 w-5" />
                  {searchTerm || filterStatus !== "all"
                    ? "Create New Tender"
                    : "Create Your First Tender"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
