import React from 'react';
import { useEffect, useState } from 'react';
import { OrderTicket } from '../components/orders/OrderTicket';
import { Badge, Button, Card, CardContent } from '../components/ui';
import { useWorkspace } from '../context/WorkspaceContext';
import { api } from '../lib/api';
import { currency, shortId } from '../lib/format';

const columns = ['pending', 'accepted', 'preparing', 'prepared'];

export default function OrdersPage() {
  const { branchId, orders, refresh } = useWorkspace();
  const [tab, setTab] = useState('live');
  const [history, setHistory] = useState([]);

  async function loadHistory() {
    if (!branchId) return;
    const result = await api.orders({ branchId, limit: 200 });
    setHistory(result.data || []);
  }

  useEffect(() => {
    loadHistory();
  }, [branchId]);

  return (
    <div className="grid gap-4">
      <div className="inline-flex w-fit rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
        <button className={`h-9 rounded-md px-4 text-sm font-bold ${tab === 'live' ? 'bg-teal-700 text-white' : 'text-slate-600'}`} onClick={() => setTab('live')}>Live</button>
        <button className={`h-9 rounded-md px-4 text-sm font-bold ${tab === 'history' ? 'bg-teal-700 text-white' : 'text-slate-600'}`} onClick={() => { setTab('history'); loadHistory(); }}>History</button>
      </div>

      {tab === 'live' ? (
        <section className="grid gap-4 overflow-x-auto xl:grid-cols-4">
          {columns.map((status) => {
            const statusOrders = orders.filter((order) => order.status === status);
            return (
              <div key={status} className="min-h-[520px] min-w-64 rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-black capitalize">{status}</h3>
                  <span className="grid h-7 min-w-7 place-items-center rounded-full bg-slate-100 px-2 text-xs font-black">{statusOrders.length}</span>
                </div>
                <div className="grid gap-3">
                  {statusOrders.map((order) => <OrderTicket key={order._id} order={order} refresh={refresh} />)}
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <Card>
          <CardContent className="grid gap-2">
            <div className="flex items-center justify-between">
              <strong>Past Orders</strong>
              <Button variant="secondary" size="sm" onClick={loadHistory}>Refresh history</Button>
            </div>
            {history.map((order) => (
              <div key={order._id} className="grid gap-3 rounded-lg border border-slate-100 p-3 md:grid-cols-[110px_1fr_120px_120px] md:items-center">
                <strong className="text-teal-700">#{shortId(order._id)}</strong>
                <div>
                  <div className="font-semibold text-slate-800">{order.table?.tableNumber ? `Table ${order.table.tableNumber}` : 'Walk-in'}</div>
                  <div className="text-sm text-slate-500">{order.items?.map((item) => `${item.quantity}x ${item.name}`).join(', ')}</div>
                </div>
                <div className="flex gap-2">
                  <Badge>{order.status}</Badge>
                  <Badge tone={order.paymentStatus === 'paid' ? 'teal' : 'amber'}>{order.paymentStatus}</Badge>
                </div>
                <strong className="text-right">{currency(order.totalAmount)}</strong>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
