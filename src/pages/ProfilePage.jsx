import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../contexts/useAuth";
import { authAPI } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Save,
  User as UserIcon,
  Mail,
  Briefcase,
  Building,
} from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
    role: user?.role || "",
    description: user?.description || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authAPI.me();
        const data = res.data?.user || res.data || {};
        setProfile((prev) => ({ ...prev, ...data }));
      } catch (e) {
        // fallback to context user
        setProfile((prev) => ({ ...prev, ...user }));
        console.error("Failed to load profile:", e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("Auth user:", user);
      await authAPI.updateMe({
        name: profile.name,
        company: profile.company,
        description: profile.description,
      });
      setSaving(false);
      console.log("Profile updated:", profile);
      alert("Profile updated");
    } catch (e) {
      console.error(e);
      setSaving(false);
      alert("Failed to update profile");
    }
  };
  const handlePasswordUpdate = async () => {
    if (profile.newPassword !== profile.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setSaving(true);
      await authAPI.updateMe({ password: profile.newPassword });
      setSaving(false);
      alert("Password updated successfully");
      setProfile((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (e) {
      console.error(e);
      setSaving(false);
      alert("Failed to update password");
    }
  };

  const initials = (profile.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-purple-100 text-lg">
                Manage your account information
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <UserIcon className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{initials || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {profile.name || "Unnamed"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="secondary" className="capitalize">
                      {profile.role || "user"}
                    </Badge>
                    {profile.company && (
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" /> {profile.company}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {profile.email || "-"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Edit Profile Card */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={profile.company || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">About</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={profile.description || ""}
                  onChange={handleChange}
                  placeholder="Tell others about you..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Password Update Card */}
        <Card className="lg:col-span-2 border-0 shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={profile.newPassword || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={profile.confirmPassword || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={handlePasswordUpdate}
                disabled={saving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Update Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
