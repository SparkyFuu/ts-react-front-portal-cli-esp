import Layout from "@/layout";
import ConsumptionPage from "@/pages/consumption";
import DashboardPage from "@/pages/dashboard";
import InvoicesPage from "@/pages/invoices";
import LoginPage from "@/pages/login";
import ChangePasswordPage from "@/pages/changePassword";
import NotFoundPage from "@/pages/notFound";
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

const STATIC_ROUTES = [
  "/productos",
  "/tarifas",
  "/plan-amigo",
  "/contacto",
  "/ayuda",
  "/noticias",
  "/nosotros",
  "/servicios",
  "/profile",
  "/mas",
  "/contratos",
];

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
        to={
          auth.user.passwordChangeRequired ? "/change-password" : "/dashboard"
        }
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
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumos-historicos"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
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
        {STATIC_ROUTES.map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Layout flush>
                  <StaticPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
