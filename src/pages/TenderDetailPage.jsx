import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import { useTender } from "../contexts/TenderContext";
import { useAuth } from "../contexts/useAuth";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Calendar,
  DollarSign,
  Users,
  Building,
  FileText,
  Download,
  MessageSquare,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const TenderDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch tender details
    const fetchTender = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock tender data - replace with actual API call
      const mockTender = {
        id: parseInt(id),
        title: "Website Development Project",
        description: `We are looking for a skilled full-stack developer to build a modern e-commerce website. The project involves creating a responsive web application with user authentication, product catalog, shopping cart, and payment integration.

Key requirements include:
- Modern, responsive design that works across all devices
- User registration and authentication system
- Product management and catalog display
- Shopping cart and checkout functionality
- Payment gateway integration (Stripe/PayPal)
- Admin dashboard for order and product management
- SEO optimization and performance optimization

The ideal candidate should have experience with React.js, Node.js, and modern web development practices. Knowledge of e-commerce platforms and payment integrations is highly preferred.`,
        category: "Web Development",
        budget: "$5,000 - $10,000",
        deadline: "2025-02-15",
        status: "active",
        issuer: "TechCorp Inc.",
        issuerContact: "john.smith..techcorp.com",
        requirements: [
          "React.js",
          "Node.js",
          "MongoDB",
          "Payment Integration",
          "Responsive Design",
          "API Development",
          "Testing",
          "Deployment",
        ],
        files: [
          {
            id: 1,
            name: "requirements.pdf",
            size: "2.4 MB",
            type: "application/pdf",
          },
          {
            id: 2,
            name: "wireframes.zip",
            size: "15.8 MB",
            type: "application/zip",
          },
          {
            id: 3,
            name: "brand-guidelines.pdf",
            size: "1.2 MB",
            type: "application/pdf",
          },
        ],
        applicants: 12,
        createdAt: "2025-01-01",
        estimatedDuration: "8-10 weeks",
        experienceLevel: "Intermediate to Expert",
        location: "Remote",
        tags: ["React", "E-commerce", "Full-stack", "Remote"],
      };

      setTender(mockTender);
      setLoading(false);
    };

    fetchTender();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isDeadlineNear = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  const canApply = () => {
    return (
      isAuthenticated &&
      user?.role === "bidder" &&
      tender?.status === "active" &&
      !isExpired(tender?.deadline)
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tender) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Tender Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The tender you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/tenders">Browse Other Tenders</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              asChild
              className="!text-white hover:bg-white/10"
            >
              <Link to="/tenders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tenders
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <Badge
                className={`${getStatusColor(tender.status)} border-white/20`}
              >
                {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                {tender.category}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">{tender.title}</h1>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center text-sm text-blue-100">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{tender.issuer}</span>
                </div>
                <div className="flex items-center text-sm text-blue-100">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="font-medium text-yellow-300">
                    {tender.budget}
                  </span>
                </div>
                <div className="flex items-center text-sm text-blue-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span
                    className={isExpired(tender.deadline) ? "text-red-300" : ""}
                  >
                    {tender.deadline}
                  </span>
                </div>
                <div className="flex items-center text-sm text-blue-100">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{tender.applicants} applicants</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Alerts */}
        {isExpired(tender.deadline) && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              This tender has expired and is no longer accepting applications.
            </AlertDescription>
          </Alert>
        )}

        {isDeadlineNear(tender.deadline) && !isExpired(tender.deadline) && (
          <Alert className="border-orange-200 bg-orange-50">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Deadline approaching! Only a few days left to apply.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {tender.description.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4 text-gray-700 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tender.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary">
                      {req}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Files */}
            {tender.files && tender.files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attached Files</CardTitle>
                  <CardDescription>
                    Download project files and documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tender.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Apply Card */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Tender</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {canApply() ? (
                  <>
                    <Button className="w-full" size="lg">
                      Submit Application
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Issuer
                    </Button>
                  </>
                ) : !isAuthenticated ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      Sign in to apply for this tender
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </>
                ) : user?.role !== "bidder" ? (
                  <Alert>
                    <AlertDescription>
                      Only bidders can apply for tenders.
                    </AlertDescription>
                  </Alert>
                ) : isExpired(tender.deadline) ? (
                  <Alert>
                    <AlertDescription>
                      This tender has expired and is no longer accepting
                      applications.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertDescription>
                      This tender is not currently accepting applications.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">
                    {tender.estimatedDuration}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Experience Level
                  </p>
                  <p className="text-sm text-gray-600">
                    {tender.experienceLevel}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{tender.location}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-900">Posted</p>
                  <p className="text-sm text-gray-600">{tender.createdAt}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {tender.tags && tender.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tender.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TenderDetailPage;
