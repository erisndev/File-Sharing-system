import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import TenderCard from "../components/tenders/TenderCard";
import TenderFilters from "../components/tenders/TenderFilters";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { FileText, Search, SlidersHorizontal } from "lucide-react";
import { useTender } from "../contexts/TenderContext";

const TenderListPage = () => {
  const { tenders, loading, filters, fetchTenders, setFilters } = useTender();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch all tenders initially
  useEffect(() => {
    fetchTenders(); // no filters = fetch all
    console.log("Tenders fetched", tenders);
  }, [fetchTenders]);

  // Refetch when filters change
  useEffect(() => {
    fetchTenders(filters);
  }, [filters, fetchTenders]);

  const handleFiltersChange = (newFilters) => setFilters(newFilters);
  const handleClearFilters = () =>
    setFilters({ category: "", status: "", search: "" });

  // Sorting logic
  const sortedTenders = [...tenders].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline);
      case "applicants":
        return (b.applicants || 0) - (a.applicants || 0);
      case "budget":
        return (b.budgetMax || 0) - (a.budgetMax || 0);
      default:
        return 0;
    }
  });

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Browse Tenders</h1>
              <p className="text-green-100 text-lg">
                Discover opportunities that match your skills and expertise
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Search & Sort */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tenders..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFiltersChange({ ...filters, search: e.target.value })
                  }
                  className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="applicants">Most Popular</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <TenderFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          )}

          {/* Tender Grid */}
          <div className={`${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedTenders.length > 0 ? (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing {sortedTenders.length} tender
                    {sortedTenders.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedTenders.map((tender) => (
                    <TenderCard key={tender.id || tender._id} tender={tender} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tenders found
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TenderListPage;
