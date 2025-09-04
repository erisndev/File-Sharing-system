import React from "react";

import { AuthProvider } from "./contexts/AuthProvider";
import { TenderProvider } from "./contexts/TenderContext";
import { ApplicationProvider } from "./contexts/ApplicationContext";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import TenderListPage from "./pages/TenderListPage";
import TenderDetailPage from "./pages/TenderDetailPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import IssuerDashboard from "./pages/dashboards/IssuerDashboard";
import IssuerBiddersPage from "./pages/IssuerBiddersPage";
import BidderDashboard from "./pages/dashboards/BidderDashboard";
import MessagesPage from "./pages/MessagesPage";
import { Toaster } from "sonner";
import CreateTenderPage from "./pages/CreateTenderPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { IssuerTendersPage } from "./pages/IssuerTendersPage";
import { BidderApplicationsPage } from "./pages/BidderApplicationsPage";
import FilesPage from "./pages/FilesPage";
import ProfilePage from "./pages/ProfilePage";
import TenderResponsesPage from "./pages/TenderResponsesPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import ContactPage from "./pages/ContactPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import { IssuerTenderManagePage } from "./pages/IssuerTenderManagePage";
import TenderApplicationPage from "./pages/TenderApplicationPage";

function App() {
  return (
    <AuthProvider>
      <TenderProvider>
        <ApplicationProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/tenders" element={<TenderListPage />} />
              <Route path="/tenders/:id" element={<TenderDetailPage />} />
              <Route
                path="/tenders/:id/apply"
                element={
                  <ProtectedRoute allowedRoles={["bidder"]}>
                    <TenderApplicationPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/profile/:id" element={<PublicProfilePage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />

              {/* Issuer Routes */}
              <Route
                path="/issuer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["issuer"]}>
                    <IssuerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/issuer/tenders"
                element={
                  <ProtectedRoute allowedRoles={["issuer"]}>
                    <IssuerTendersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/issuer/create-tender"
                element={
                  <ProtectedRoute allowedRoles={["issuer"]}>
                    <CreateTenderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/issuer/tenders/:id/responses"
                element={
                  <ProtectedRoute allowedRoles={["issuer"]}>
                    <TenderResponsesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/issuer/bidders"
                element={
                  <ProtectedRoute allowedRoles={["issuer"]}>
                    <IssuerBiddersPage />
                  </ProtectedRoute>
                }
              />
              {/* Manage Tender Page */}
              <Route
                path="/issuer/tenders/:tenderId/manage"
                element={
                  <ProtectedRoute allowedRoles={["issuer"]}>
                    <IssuerTenderManagePage />
                  </ProtectedRoute>
                }
              />

              {/* Bidder Routes */}
              <Route
                path="/bidder/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["bidder"]}>
                    <BidderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bidder/applications"
                element={
                  <ProtectedRoute allowedRoles={["bidder"]}>
                    <BidderApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bidder/applications/:id"
                element={
                  <ProtectedRoute allowedRoles={["bidder"]}>
                    <ApplicationDetailPage />
                  </ProtectedRoute>
                }
              />

              {/* Shared Protected Routes */}
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/files"
                element={
                  <ProtectedRoute>
                    <FilesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster />
          </div>
        </ApplicationProvider>
      </TenderProvider>
    </AuthProvider>
  );
}

export default App;
