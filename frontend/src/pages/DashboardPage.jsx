import React from 'react';
import { BarChart3, Boxes, ClipboardList, Radio } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, StatCard } from '../components/ui';
import { useWorkspace } from '../context/WorkspaceContext';
import { currency } from '../lib/format';

export default function DashboardPage() {
  const { dashboard, orders, inventory } = useWorkspace();

  return (
    <div className="grid gap-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BarChart3} label="Revenue" value={currency(dashboard?.revenue)} detail="Paid and partial bills only" />
        <StatCard icon={ClipboardList} label="Total Orders" value={dashboard?.totalOrders || dashboard?.orderCount || 0} detail={`${dashboard?.paidOrderCount || 0} paid • ${dashboard?.unpaidOrders || 0} unpaid`} />
        <StatCard icon={Radio} label="Live Orders" value={dashboard?.liveOrders || orders.length} detail="Open kitchen pipeline" />
        <StatCard icon={Boxes} label="Low Stock" value={dashboard?.lowStockCount || 0} detail="Items at reorder level" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_.7fr]">
        <Card>
          <CardHeader><CardTitle>Top Items</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {(dashboard?.topItems || []).length ? dashboard.topItems.map((item) => (
              <div key={item._id} className="flex min-h-11 items-center justify-between border-b border-slate-100 text-sm last:border-0">
                <span className="font-semibold text-slate-700">{item.name}</span>
                <strong>{item.quantity} sold</strong>
              </div>
            )) : <p className="rounded-md border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">No completed sales yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Stock Watch</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {inventory.length ? inventory.slice(0, 8).map((item) => (
              <div key={item._id} className="flex min-h-11 items-center justify-between border-b border-slate-100 text-sm last:border-0">
                <span className="font-semibold text-slate-700">{item.name}</span>
                <strong>{item.quantityOnHand} {item.unit}</strong>
              </div>
            )) : <p className="rounded-md border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">No inventory items yet.</p>}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
