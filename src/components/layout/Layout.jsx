import React from "react";
import { useAuth } from "@/contexts/useAuth";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children, showSidebar = false }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        {" "}
        {/* pt-16 accounts for fixed navbar */}
        {/* Fixed Sidebar */}
        {showSidebar && isAuthenticated && (
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:bg-white lg:border-r lg:border-gray-200 lg:z-20">
            <Sidebar />
          </div>
        )}
        {/* Main Content */}
        <main
          className={`flex-1 flex flex-col ${
            showSidebar && isAuthenticated ? "lg:ml-64" : ""
          }`}
        >
          <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8">{children}</div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
