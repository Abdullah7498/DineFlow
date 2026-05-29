import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from '../components/ui';
import { useWorkspace } from '../context/WorkspaceContext';
import { api } from '../lib/api';
import { currency } from '../lib/format';

export default function PosPage() {
  const { branchId, menu, tables, refresh } = useWorkspace();
  const [cart, setCart] = useState([]);
  const [tableId, setTableId] = useState('');
  const [query, setQuery] = useState('');

  const items = useMemo(() => menu.flatMap((category) => category.items || []), [menu]);
  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderPayload = {
    branchId,
    tableId: tableId || undefined,
    source: 'pos',
    items: cart.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })),
  };

  function addItem(item) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.menuItemId === item._id);
      if (existing) {
        return current.map((cartItem) => cartItem.menuItemId === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
      }
      return [...current, { menuItemId: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
  }

  async function sendToKitchen() {
    await api.createOrder(orderPayload);
    setCart([]);
    await refresh();
  }

  async function payCash() {
    const result = await api.createOrder(orderPayload);
    await api.createBill({ orderId: result.data._id, method: 'cash', amount: result.data.totalAmount });
    setCart([]);
    await refresh();
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader><CardTitle>Menu</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
            <Search size={18} className="text-slate-400" />
            <Input className="border-0 px-0 shadow-none focus:ring-0" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search items" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <button key={item._id} className="grid min-h-28 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50" onClick={() => addItem(item)}>
                <span className="font-bold text-slate-800">{item.name}</span>
                <strong className="self-end text-teal-700">{currency(item.price)}</strong>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="xl:sticky xl:top-6">
        <CardHeader><CardTitle>Current Ticket</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <Select value={tableId} onChange={(event) => setTableId(event.target.value)}>
            <option value="">Walk-in</option>
            {tables.map((table) => <option key={table._id} value={table._id}>Table {table.tableNumber}</option>)}
          </Select>
          <div className="grid min-h-48 content-start gap-2">
            {cart.map((item) => (
              <div key={item.menuItemId} className="flex items-center justify-between border-b border-slate-100 py-2 text-sm">
                <span>{item.quantity}x {item.name}</span>
                <strong>{currency(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg">
            <span className="font-bold">Total</span>
            <strong>{currency(total)}</strong>
          </div>
          <Button disabled={!cart.length || !branchId} onClick={sendToKitchen}>Send to kitchen</Button>
          <Button variant="secondary" disabled={!cart.length || !branchId} onClick={payCash}>Quick cash sale</Button>
        </CardContent>
      </Card>
    </section>
  );
}
