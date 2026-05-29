import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from '../components/ui';
import { useWorkspace } from '../context/WorkspaceContext';
import { api } from '../lib/api';
import { currency } from '../lib/format';

export default function MenuPage() {
  const { branchId, menu, refresh } = useWorkspace();
  const [categoryName, setCategoryName] = useState('');
  const [item, setItem] = useState({ categoryId: '', name: '', price: '' });

  async function addCategory(event) {
    event.preventDefault();
    await api.createCategory({ branchId, name: categoryName });
    setCategoryName('');
    await refresh();
  }

  async function addItem(event) {
    event.preventDefault();
    await api.createMenuItem({ ...item, price: Number(item.price) });
    setItem({ categoryId: '', name: '', price: '' });
    await refresh();
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader><CardTitle>Menu Catalog</CardTitle></CardHeader>
        <CardContent className="grid gap-5">
          {menu.map((category) => (
            <div key={category._id} className="rounded-lg border border-slate-100 p-4">
              <h3 className="mb-2 font-black text-teal-700">{category.name}</h3>
              <div className="grid gap-2">
                {(category.items || []).map((menuItem) => (
                  <div key={menuItem._id} className="flex min-h-11 items-center justify-between border-b border-slate-100 text-sm last:border-0">
                    <span className="font-semibold">{menuItem.name}</span>
                    <strong>{currency(menuItem.price)}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader><CardTitle>Add Category</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={addCategory}>
              <Input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Burgers" required />
              <Button variant="secondary"><Plus size={16} /> Add category</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Add Item</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={addItem}>
              <Select value={item.categoryId} onChange={(event) => setItem({ ...item, categoryId: event.target.value })} required>
                <option value="">Choose category</option>
                {menu.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
              </Select>
              <Input value={item.name} onChange={(event) => setItem({ ...item, name: event.target.value })} placeholder="Classic burger" required />
              <Input type="number" value={item.price} onChange={(event) => setItem({ ...item, price: event.target.value })} placeholder="Price" required />
              <Button><Plus size={16} /> Add item</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
