import React, { useState } from 'react';

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../components/ui';
import { useWorkspace } from '../context/WorkspaceContext';
import { api } from '../lib/api';

export default function InventoryPage() {
  const { branchId, inventory, refresh } = useWorkspace();
  const [form, setForm] = useState({ name: '', unit: 'kg', quantityOnHand: '', reorderLevel: '' });

  async function submit(event) {
    event.preventDefault();
    await api.createInventoryItem({
      ...form,
      branchId,
      quantityOnHand: Number(form.quantityOnHand),
      reorderLevel: Number(form.reorderLevel),
    });
    setForm({ name: '', unit: 'kg', quantityOnHand: '', reorderLevel: '' });
    await refresh();
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader><CardTitle>Stock Ledger</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          {inventory.map((item) => (
            <div key={item._id} className="flex min-h-12 items-center justify-between border-b border-slate-100 text-sm last:border-0">
              <div>
                <strong className="block text-slate-800">{item.name}</strong>
                <span className="text-slate-500">Reorder at {item.reorderLevel} {item.unit}</span>
              </div>
              <strong>{item.quantityOnHand} {item.unit}</strong>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Add Stock Item</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={submit}>
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Chicken breast" required />
            <Input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} placeholder="kg" required />
            <Input type="number" value={form.quantityOnHand} onChange={(event) => setForm({ ...form, quantityOnHand: event.target.value })} placeholder="Quantity" required />
            <Input type="number" value={form.reorderLevel} onChange={(event) => setForm({ ...form, reorderLevel: event.target.value })} placeholder="Reorder level" required />
            <Button disabled={!branchId}>Save item</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
