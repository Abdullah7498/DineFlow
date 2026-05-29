import React, { useState } from 'react';
import { Store, Table2 } from 'lucide-react';

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from '../components/ui';
import { useWorkspace } from '../context/WorkspaceContext';
import { api } from '../lib/api';

export default function TablesPage() {
  const { branchId, branches, tables, refresh } = useWorkspace();
  const [branchForm, setBranchForm] = useState({ name: '', address: '', phone: '' });
  const [tableForm, setTableForm] = useState({ tableNumber: '', capacity: 4 });

  async function addBranch(event) {
    event.preventDefault();
    await api.createBranch(branchForm);
    setBranchForm({ name: '', address: '', phone: '' });
    await refresh();
  }

  async function addTable(event) {
    event.preventDefault();
    await api.createTable({ ...tableForm, branchId, capacity: Number(tableForm.capacity) });
    setTableForm({ tableNumber: '', capacity: 4 });
    await refresh();
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader><CardTitle>Floor</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {tables.map((table) => (
              <div key={table._id} className="grid min-h-32 place-items-center rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                <Table2 className="text-teal-700" size={24} />
                <strong>Table {table.tableNumber}</strong>
                <span className="text-sm text-slate-500">{table.capacity} seats • {table.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader><CardTitle>Add Branch</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={addBranch}>
              <Input value={branchForm.name} onChange={(event) => setBranchForm({ ...branchForm, name: event.target.value })} placeholder="Main Branch" required />
              <Input value={branchForm.address} onChange={(event) => setBranchForm({ ...branchForm, address: event.target.value })} placeholder="Address" required />
              <Input value={branchForm.phone} onChange={(event) => setBranchForm({ ...branchForm, phone: event.target.value })} placeholder="Phone" />
              <Button variant="secondary"><Store size={16} /> Add branch</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Add Table</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={addTable}>
              <Select value={branchId} disabled>
                <option>{branches.find((branch) => branch._id === branchId)?.name || 'Select branch from top bar'}</option>
              </Select>
              <Input value={tableForm.tableNumber} onChange={(event) => setTableForm({ ...tableForm, tableNumber: event.target.value })} placeholder="A1" required />
              <Input type="number" value={tableForm.capacity} onChange={(event) => setTableForm({ ...tableForm, capacity: event.target.value })} min="1" required />
              <Button disabled={!branchId}>Create QR table</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
