import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Bell, User, LogOut, Settings, FileText, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 shadow-red-100/50";
      case "issuer":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-blue-100/50";
      case "bidder":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 shadow-green-100/50";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 shadow-gray-100/50";
    }
  };

  const getNavLinks = () => {
    if (!isAuthenticated) return [];

    const baseLinks = [{ to: "/tenders", label: "Browse Tenders", icon: "📋" }];

    switch (user?.role) {
      case "admin":
        return [
          { to: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
          { to: "/admin/users", label: "Manage Users", icon: "👥" },
          ...baseLinks,
        ];
      case "issuer":
        return [
          { to: "/issuer/dashboard", label: "Dashboard", icon: "🏠" },
          { to: "/issuer/tenders", label: "My Tenders", icon: "📁" },
          { to: "/issuer/create-tender", label: "Create Tender", icon: "➕" },
          ...baseLinks,
        ];
      case "bidder":
        return [
          { to: "/bidder/dashboard", label: "Dashboard", icon: "🏠" },
          { to: "/bidder/applications", label: "My Applications", icon: "📝" },
          ...baseLinks,
        ];
      default:
        return baseLinks;
    }
  };

  return (
    <nav className="bg-white/95 w-full backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <FileText className="h-6 w-6 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                  TenderHub
                </span>
                <span className="text-[10px] text-gray-500 font-medium -mt-1">
                  PROCUREMENT PORTAL
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {getNavLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-gray-600 hover:text-blue-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="text-base opacity-70 group-hover:opacity-100 transition-opacity">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications - Fixed styling */}
                <div className="relative">
                  <button className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg shadow-red-500/30 animate-pulse">
                      3
                    </span>
                  </button>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-11 w-11 rounded-full hover:bg-blue-50 border-0 p-0 transition-all duration-300 group"
                    >
                      <Avatar className="h-10 w-10 border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-200/50">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                          {(
                            user?.name?.toString()?.charAt(0) || "U"
                          ).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-72 mt-3 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-2xl rounded-2xl overflow-hidden"
                    align="end"
                    forceMount
                  >
                    {/* Blue Gradient Header with border radius */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-t-2xl">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 border-2 border-white/30">
                          <AvatarFallback className="bg-white/20 backdrop-blur text-white font-bold">
                            {(
                              user?.name?.toString()?.charAt(0) || "U"
                            ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-white">
                            {user?.name}
                          </p>
                          <p className="text-xs text-white/80 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`mt-3 w-fit text-xs font-semibold border shadow-md ${getRoleColor(
                          user?.role
                        )}`}
                      >
                        {user?.role?.charAt(0)?.toUpperCase() +
                          user?.role?.slice(1)}{" "}
                        Account
                      </Badge>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-300 mx-1 rounded-xl my-1 py-2.5 group"
                      >
                        <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-white mr-3 transition-all duration-300">
                          <User className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          View Profile
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => navigate("/settings")}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-300 mx-1 rounded-xl my-1 py-2.5 group"
                      >
                        <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-white mr-3 transition-all duration-300">
                          <Settings className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          Settings
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-gray-100 my-2" />

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 cursor-pointer transition-all duration-300 mx-1 rounded-xl my-1 mb-1 py-2.5 group"
                      >
                        <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 mr-3 transition-all duration-300">
                          <LogOut className="h-4 w-4 text-red-500" />
                        </div>
                        <span className="text-sm text-red-600 font-medium">
                          Sign Out
                        </span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate("/login")}
                  className="text-blue-700 hover:text-white bg-transparent hover:bg-blue-600 border border-blue-500 hover:border-blue-200 font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5"
                >
                  Sign In
                </Button>

                <Button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 border-0 outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-transparent border-0 p-2.5 rounded-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 py-4 space-y-2 bg-gradient-to-b from-gray-50/50 to-white border-t border-gray-100">
            {getNavLinks().map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:translate-x-1"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-3 mt-3 border-t border-gray-200/50 space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-transparent border border-gray-200 hover:border-blue-200 font-semibold justify-center px-4 py-3 rounded-xl transition-all duration-300"
                >
                  Sign In
                </Button>

                <button
                  onClick={() => {
                    navigate("/register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-semibold px-4 py-3 rounded-xl shadow-lg shadow-blue-500/25 border-0 outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
