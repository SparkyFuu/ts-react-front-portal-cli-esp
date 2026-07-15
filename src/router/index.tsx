import Layout from "@/layout";
import ConsumptionPage from "@/pages/consumption";
import DashboardPage from "@/pages/dashboard";
import InvoicesPage from "@/pages/invoices";
import LoginPage from "@/pages/login";
import ChangePasswordPage from "@/pages/changePassword";
import StaticPage from "@/pages/static";
import { selectAuthOptions } from "@/pages/auth/features/authSlice";
import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const ProtectedRoute = ({
  children,
  allowTemporaryPassword = false,
}: {
  children: React.ReactNode;
  allowTemporaryPassword?: boolean;
}) => {
  const auth = useAppSelector(selectAuthOptions);

  if (!auth.authenticated || !auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (auth.user.passwordChangeRequired && !allowTemporaryPassword) {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAppSelector(selectAuthOptions);

  if (auth.authenticated && auth.token) {
    return (
      <Navigate
        to={auth.user.passwordChangeRequired ? "/change-password" : "/area-clientes"}
        replace
      />
    );
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Layout flush>
                <LoginPage />
              </Layout>
            </PublicRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowTemporaryPassword>
              <Layout flush>
                <ChangePasswordPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout flush>
                <ConsumptionPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/area-clientes"
          element={
            <ProtectedRoute>
              <Layout flush>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumo"
          element={
            <ProtectedRoute>
              <Layout flush>
                <ConsumptionPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/facturas"
          element={
            <ProtectedRoute>
              <Layout flush>
                <InvoicesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <Layout flush>
              <StaticPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
