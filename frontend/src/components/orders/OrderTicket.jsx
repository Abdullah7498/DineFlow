import React, { useState } from 'react';

import { Badge, Button, Card } from '../ui';
import { api } from '../../lib/api';
import { currency, shortId } from '../../lib/format';

const orderStatuses = ['pending', 'accepted', 'preparing', 'prepared', 'served', 'completed'];

const statusTone = {
  pending: 'amber',
  accepted: 'sky',
  preparing: 'teal',
  prepared: 'teal',
  served: 'slate',
  completed: 'teal',
  cancelled: 'rose',
};

export function OrderTicket({ order, refresh, showItems = false }) {
  const [busy, setBusy] = useState(false);
  const nextStatus = orderStatuses[orderStatuses.indexOf(order.status) + 1];

  async function advance() {
    if (!nextStatus) return;
    setBusy(true);
    try {
      await api.updateOrderStatus(order._id, nextStatus);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="grid gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <strong className="font-black text-teal-700">#{shortId(order._id)}</strong>
        <Badge tone={statusTone[order.status]}>{order.status}</Badge>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{order.table?.tableNumber ? `Table ${order.table.tableNumber}` : 'Walk-in'}</span>
        <span>{order.source}</span>
      </div>

      {showItems ? (
        <ul className="grid gap-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
          {order.items?.map((item) => (
            <li key={`${order._id}-${item.menuItem}`} className="flex justify-between gap-3">
              <span>{item.quantity}x {item.name}</span>
              <span>{currency(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <strong>{currency(order.totalAmount)}</strong>
        {nextStatus ? <Button size="sm" variant="secondary" disabled={busy} onClick={advance}>Move to {nextStatus}</Button> : null}
      </div>
    </Card>
  );
}
