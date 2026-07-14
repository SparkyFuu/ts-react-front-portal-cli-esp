import Layout from "@/layout";
import ConsumptionPage from "@/pages/consumption";
import DashboardPage from "@/pages/dashboard";
import InvoicesPage from "@/pages/invoices";
import LoginPage from "@/pages/login";
import StaticPage from "@/pages/static";
import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <Layout flush>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout flush>
              <ConsumptionPage />
            </Layout>
          }
        />
        <Route
          path="/area-clientes"
          element={
            <Layout flush>
              <DashboardPage />
            </Layout>
          }
        />
        <Route
          path="/consumo"
          element={
            <Layout flush>
              <ConsumptionPage />
            </Layout>
          }
        />
        <Route
          path="/facturas"
          element={
            <Layout flush>
              <InvoicesPage />
            </Layout>
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
