import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { api } from '../lib/api';
import { getSocket } from '../lib/socket';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [tables, setTables] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const selectedBranch = branches.find((branch) => branch._id === branchId);

  async function loadBranchData(nextBranchId = branchId) {
    if (!nextBranchId) {
      setDashboard(null);
      setOrders([]);
      setMenu([]);
      setTables([]);
      setInventory([]);
      return;
    }

    const [dashboardResult, orderResult, menuResult, tableResult, inventoryResult] = await Promise.all([
      api.dashboard(nextBranchId),
      api.liveOrders(nextBranchId),
      api.menu(nextBranchId),
      api.tables(nextBranchId),
      api.inventory(nextBranchId),
    ]);

    setDashboard(dashboardResult.data);
    setOrders(orderResult.data || []);
    setMenu(menuResult.data || []);
    setTables(tableResult.data || []);
    setInventory(inventoryResult.data || []);
  }

  async function refresh() {
    setLoading(true);
    try {
      const branchResult = await api.branches();
      const nextBranches = branchResult.data || [];
      const nextBranchId = branchId || nextBranches[0]?._id || '';

      setBranches(nextBranches);
      setBranchId(nextBranchId);
      await loadBranchData(nextBranchId);
      setNotice('');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function changeBranch(nextBranchId) {
    setBranchId(nextBranchId);
    setLoading(true);
    try {
      await loadBranchData(nextBranchId);
      setNotice('');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!branchId) return undefined;

    const socket = getSocket();
    socket.connect();
    socket.emit('join_branch', branchId);
    socket.on('order:new', refresh);
    socket.on('order:status', refresh);

    return () => {
      socket.off('order:new', refresh);
      socket.off('order:status', refresh);
    };
  }, [branchId]);

  const value = useMemo(() => ({
    branches,
    branchId,
    selectedBranch,
    dashboard,
    orders,
    menu,
    tables,
    inventory,
    loading,
    notice,
    setNotice,
    refresh,
    changeBranch,
  }), [branches, branchId, selectedBranch, dashboard, orders, menu, tables, inventory, loading, notice]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used inside WorkspaceProvider');
  }
  return context;
}
