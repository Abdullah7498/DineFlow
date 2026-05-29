import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import PosPage from './pages/PosPage';
import KitchenPage from './pages/KitchenPage';
import MenuPage from './pages/MenuPage';
import InventoryPage from './pages/InventoryPage';
import TablesPage from './pages/TablesPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WorkspaceProvider>
                <AppLayout />
              </WorkspaceProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="pos" element={<PosPage />} />
          <Route path="kitchen" element={<KitchenPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="tables" element={<TablesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
