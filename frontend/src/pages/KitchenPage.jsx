import React from 'react';
import { OrderTicket } from '../components/orders/OrderTicket';
import { Card, CardContent } from '../components/ui';
import { useWorkspace } from '../context/WorkspaceContext';

export default function KitchenPage() {
  const { orders, refresh } = useWorkspace();

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {orders.length ? orders.map((order) => (
        <OrderTicket key={order._id} order={order} refresh={refresh} showItems />
      )) : (
        <Card className="md:col-span-2 xl:col-span-3">
          <CardContent className="grid min-h-56 place-items-center text-center text-sm font-semibold text-slate-500">
            Kitchen is clear. New orders will appear here in realtime.
          </CardContent>
        </Card>
      )}
    </section>
  );
}
