import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  Filter,
  Download,
  Eye,
  Mail,
  Building,
  Calendar,
  Clock,
  Shield,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/services/api";
import Layout from "@/components/layout/Layout";

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [messageUser, setMessageUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    isActive: true,
  });
  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: "",
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await authAPI.getAllUsers();
        const fetchedUsers = res.data.users.map((user) => ({
          ...user,
          isActive: !!user.isActive,
        }));
        setUsers(fetchedUsers);
        toast.success("Users loaded successfully");
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-sm";
      case "issuer":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-sm";
      case "bidder":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-sm";
    }
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0"
      : "bg-gradient-to-r from-red-500 to-red-600 text-white border-0";
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await authAPI.updateUserById(id, { role: newRole });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
      toast.success("User role updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user role");
    }
  };

  // View user details
  const handleView = async (user) => {
    try {
      const res = await authAPI.getUserById(user._id);
      setSelectedUser(res.data.user);
      setShowUserDetails(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch user details");
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company || "",
      isActive: user.isActive,
    });
    setEditingUser(user);
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await authAPI.updateUserById(editingUser._id, editForm);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === editingUser._id ? { ...user, ...editForm } : user
        )
      );
      setShowEditDialog(false);
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };

  // Send message to user
  const handleMessage = (user) => {
    setMessageUser(user);
    setMessageForm({ subject: "", message: "" });
    setShowMessageDialog(true);
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!messageUser || !messageForm.subject || !messageForm.message) {
      toast.error("Please fill in all message fields");
      return;
    }

    try {
      // TODO: integrate messaging API
      setShowMessageDialog(false);
      setMessageUser(null);
      toast.success(`Message sent to ${messageUser.name} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  // Delete user
  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await authAPI.deleteUserById(userToDelete._id);
      setUsers((prev) => prev.filter((user) => user._id !== userToDelete._id));
      setShowDeleteDialog(false);
      setUserToDelete(null);
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <Layout showSidebar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">
                  User Management
                </h1>
                <p className="text-blue-100 text-lg opacity-90">
                  Manage all users, roles, and permissions across the platform
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Users className="h-16 w-16 text-white drop-shadow-sm" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-semibold mb-1">
                      Total Users
                    </p>
                    <p className="text-4xl font-bold text-blue-900">
                      {users.length}
                    </p>
                  </div>
                  <div className="bg-blue-500 rounded-2xl p-3 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-700 text-sm font-semibold mb-1">
                      Active Users
                    </p>
                    <p className="text-4xl font-bold text-emerald-900">
                      {users.filter((u) => u.isActive).length}
                    </p>
                  </div>
                  <div className="bg-emerald-500 rounded-2xl p-3 shadow-lg">
                    <UserCheck className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-semibold mb-1">
                      Issuers
                    </p>
                    <p className="text-4xl font-bold text-purple-900">
                      {users.filter((u) => u.role === "issuer").length}
                    </p>
                  </div>
                  <div className="bg-purple-500 rounded-2xl p-3 shadow-lg">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 text-sm font-semibold mb-1">
                      Bidders
                    </p>
                    <p className="text-4xl font-bold text-orange-900">
                      {users.filter((u) => u.role === "bidder").length}
                    </p>
                  </div>
                  <div className="bg-orange-500 rounded-2xl p-3 shadow-lg">
                    <UserCheck className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-4 items-center w-full md:w-auto">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search users by name, email, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-48 h-12 rounded-xl border-gray-200 shadow-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="issuer">Issuer</SelectItem>
                      <SelectItem value="bidder">Bidder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                All Users
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage user accounts, roles, and permissions with advanced
                controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="text-center py-12 text-gray-500">
                    Loading users...
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/80">
                        <TableHead className="font-semibold text-gray-700 py-4">
                          User
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Role
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Company
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Join Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Last Login
                        </TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user._id}
                          className="hover:bg-blue-50/50 transition-colors border-b border-gray-100"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {user.name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user._id, e.target.value)
                              }
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                                user.role
                              )} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                              <option value="admin" className="text-gray-900">
                                Admin
                              </option>
                              <option value="issuer" className="text-gray-900">
                                Issuer
                              </option>
                              <option value="bidder" className="text-gray-900">
                                Bidder
                              </option>
                            </select>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">
                                {user.company || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                user.isActive
                              )}`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {user.lastLogin
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : "Never"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 rounded-full hover:bg-gray-100"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => handleView(user)}
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEdit(user)}
                                  className="cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleMessage(user)}
                                  className="cursor-pointer"
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => handleDelete(user)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-12 text-gray-500"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-12 w-12 text-gray-300" />
                              <p className="text-lg font-medium">
                                No users found
                              </p>
                              <p className="text-sm">
                                Try adjusting your search criteria
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Details Dialog */}
          <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedUser?.name?.charAt(0)}
                  </div>
                  User Details
                </DialogTitle>
                <DialogDescription>
                  Detailed information about {selectedUser?.name}
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="grid grid-cols-2 gap-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Full Name
                      </Label>
                      <p className="text-lg font-semibold">
                        {selectedUser.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Email Address
                      </Label>
                      <p className="text-lg">{selectedUser.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Role
                      </Label>
                      <Badge
                        className={`mt-1 ${getRoleColor(selectedUser.role)}`}
                      >
                        {selectedUser.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Company
                      </Label>
                      <p className="text-lg">{selectedUser.company || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Registration Date
                      </Label>
                      <p className="text-lg">
                        {new Date(
                          selectedUser.registrationDate ||
                            selectedUser.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Last Login
                      </Label>
                      <p className="text-lg">
                        {selectedUser.lastLogin
                          ? new Date(selectedUser.lastLogin).toLocaleString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  onClick={() => setShowUserDetails(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user information and settings
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={editForm.role}
                      onValueChange={(value) =>
                        setEditForm((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="issuer">Issuer</SelectItem>
                        <SelectItem value="bidder">Bidder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={editForm.company}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editForm.isActive}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active User</Label>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Update User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Message Dialog */}
          <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
                <DialogDescription>
                  Send a message to {messageUser?.name}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={messageForm.subject}
                    onChange={(e) =>
                      setMessageForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Enter message subject"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={messageForm.message}
                    onChange={(e) =>
                      setMessageForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Enter your message..."
                    rows={5}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMessageDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  Delete User
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{userToDelete?.name}</strong>? This action cannot be
                  undone and will permanently remove all user data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  Delete User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Layout>
  );
};
