import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { authAPI } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Building, User as UserIcon } from "lucide-react";

const PublicProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // Prefer a direct endpoint if available; fall back to filtering getAll
        if (authAPI.getUserById) {
          const res = await authAPI.getUserById(id);
          setUser(res.data?.user || res.data || null);
        } else {
          const res = await authAPI.getAllUsers();
          const list = res.data?.users || res.data || [];
          setUser(list.find((u) => (u._id || u.id) === id) || null);
        }
      } catch (e) {
        setError(
          e?.response?.data?.message || e.message || "Failed to load user"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const initials = (user?.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">User Profile</h1>
              <p className="text-blue-100 text-lg">
                View public details about this user
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <UserIcon className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Basic information</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-24 bg-gray-100 rounded" />
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : user ? (
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{initials || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.name || "Unnamed"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="secondary" className="capitalize">
                      {user.role || "user"}
                    </Badge>
                    {user.company && (
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" /> {user.company}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                    <Mail className="h-4 w-4" /> {user.email || "-"}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">User not found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PublicProfilePage;
