import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Calendar,
  DollarSign,
  Users,
  Building,
  Clock,
  FileText,
} from "lucide-react";

const TenderCard = ({ tender, showActions = true }) => {
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

  const getCategoryColor = (category) => {
    const colors = {
      "Web Development": "bg-blue-100 text-blue-800",
      Design: "bg-purple-100 text-purple-800",
      "Data Science": "bg-orange-100 text-orange-800",
      Marketing: "bg-pink-100 text-pink-800",
      Consulting: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
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

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getStatusColor(tender.status)}>
            {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
          </Badge>
          <Badge
            variant="outline"
            className={getCategoryColor(tender.category)}
          >
            {tender.category}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2 hover:text-blue-600 transition-colors">
          <Link to={`/tenders/${tender._id || tender.id}`}>{tender.title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {tender.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Issuer */}
          <div className="flex items-center text-sm text-gray-600">
            <Building className="h-4 w-4 mr-2" />
            <span>{tender.issuer}</span>
          </div>

          {/* Budget */}
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="font-medium text-green-600">{tender.budget}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span
              className={
                isExpired(tender.deadline)
                  ? "text-red-600 font-medium"
                  : isDeadlineNear(tender.deadline)
                  ? "text-orange-600 font-medium"
                  : ""
              }
            >
              {isExpired(tender.deadline)
                ? "Expired"
                : `Due ${tender.deadline}`}
            </span>
            {isDeadlineNear(tender.deadline) && !isExpired(tender.deadline) && (
              <Clock className="h-3 w-3 ml-1 text-orange-600" />
            )}
          </div>

          {/* Applicants */}
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{tender.applicants} applicants</span>
          </div>

          {/* Files */}
          {tender.files && tender.files.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              <span>{tender.files.length} file(s) attached</span>
            </div>
          )}

          {/* Requirements */}
          {tender.requirements && tender.requirements.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tender.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {req}
                </Badge>
              ))}
              {tender.requirements.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{tender.requirements.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {showActions && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <Button asChild className="flex-1" size="sm">
                <Link to={`/tenders/${tender._id || tender.id}`}>View Details</Link>
              </Button>
              {tender.status === "active" && !isExpired(tender.deadline) && (
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`/tenders/${tender._id || tender.id}/apply`}>Apply Now</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenderCard;
