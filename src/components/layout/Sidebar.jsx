import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  PlusCircle,
  MessageSquare,
  Settings,
  BarChart3,
  Briefcase,
  Send,
  Folder,
  User,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ className }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const common = [
      { icon: Folder, label: "My Files", to: "/files" },
      { icon: User, label: "Profile", to: "/profile" },
    ];

    switch (user?.role) {
      case "admin":
        return [
          { icon: LayoutDashboard, label: "Dashboard", to: "/admin/dashboard" },
          { icon: Users, label: "Manage Users", to: "/admin/users" },
          { icon: FileText, label: "All Tenders", to: "/tenders" },
          { icon: BarChart3, label: "Analytics", to: "/admin/analytics" },
          { icon: MessageSquare, label: "Messages", to: "/messages" },
          ...common,
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      case "issuer":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            to: "/issuer/dashboard",
          },
          { icon: FileText, label: "My Tenders", to: "/issuer/tenders" },
          {
            icon: PlusCircle,
            label: "Create Tender",
            to: "/issuer/create-tender",
          },
          { icon: Users, label: "Bidders", to: "/issuer/bidders" },
          { icon: MessageSquare, label: "Messages", to: "/messages" },
          ...common,
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      case "bidder":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            to: "/bidder/dashboard",
          },
          { icon: FileText, label: "Browse Tenders", to: "/tenders" },
          {
            icon: Briefcase,
            label: "My Applications",
            to: "/bidder/applications",
          },
          { icon: Send, label: "Submitted Bids", to: "/bidder/bids" },
          { icon: MessageSquare, label: "Messages", to: "/messages" },
          ...common,
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      default:
        return common;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={cn(
        "h-full w-64 bg-white border-r border-gray-100 shadow-sm",
        className
      )}
    >
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize truncate">
              {user?.role || "Member"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 !text-white shadow-md shadow-blue-500/25 transform scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm hover:transform hover:translate-x-1"
                )}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    isActive
                      ? "text-white/80 transform rotate-90"
                      : "text-gray-300 group-hover:text-gray-400 group-hover:transform group-hover:translate-x-0.5"
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="text-xs text-gray-400 text-center">
          © 2025 TenderPro
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
