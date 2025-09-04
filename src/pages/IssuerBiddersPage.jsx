import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { applicationAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Search, Folder } from "lucide-react";
import { Link } from "react-router-dom";

const IssuerBiddersPage = () => {
  const [biddersData, setBiddersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadBidders = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch bidders with their applications
        const res = await applicationAPI.getBiddersForMyTenders();
        // Expected backend response: [{ bidder: {...}, applications: [...] }, ...]
        setBiddersData(res.data ?? []);
      } catch (e) {
        setError(
          e.response?.data?.message || e.message || "Failed to load bidders"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBidders();
  }, []);

  const filteredBidders = biddersData.filter(({ bidder }) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const name = (bidder?.name || "").toLowerCase();
    const email = (bidder?.email || "").toLowerCase();
    const company = (bidder?.company || "").toLowerCase();
    return name.includes(q) || email.includes(q) || company.includes(q);
  });

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bidders</h1>
              <p className="text-indigo-100 text-lg">
                Discover bidders and view their submitted bids
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Search & Count */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bidders by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold">{filteredBidders.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Bidders list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 rounded" />
            ))}
          </div>
        ) : filteredBidders.length === 0 ||
          (biddersData.length === 0 && error) ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bidders at this time
            </h3>
            <p className="text-gray-500">
              No bidders have submitted applications yet. Check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBidders.map(({ bidder, applications }) => (
              <Card key={bidder._id} className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {bidder?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {bidder?.name || "Unnamed Bidder"}
                        </h3>
                        <Badge variant="secondary" className="capitalize">
                          {bidder.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/profile/${bidder._id}`}>View Profile</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/messages?user=${bidder._id}`}>Message</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {applications?.length > 0 ? (
                    <div className="space-y-2">
                      {applications.map((app) => (
                        <div
                          key={app._id}
                          className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50"
                        >
                          <Folder className="h-5 w-5 text-blue-500" />
                          <div className="flex-1">
                            <Link
                              to={`/issuer/tenders/${app.tender._id}/responses`}
                              className="font-medium hover:underline"
                            >
                              {app.tender.title || "Untitled Tender"}
                            </Link>
                            <div className="text-sm text-gray-500">
                              Submitted:{" "}
                              {new Date(app.createdAt).toLocaleDateString()} |{" "}
                              Status: <Badge>{app.status}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No bids submitted yet.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IssuerBiddersPage;
