import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { distanceKm, formatKm } from "../../lib/distance";
import {
  selectCurrentStaff,
  staffLogout,
} from "../../redux-store/Slices/staffAuthSlice";
import {
  ADMIN_PLACE,
  makeNewOrder,
  seedOrders,
  type MockOrder,
} from "./mockOrders";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const timeAgo = (ts: number, now: number) => {
  const mins = Math.max(0, Math.floor((now - ts) / 60_000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
};

const clock = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

const BellIcon = () => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <path d='M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9' />
    <path d='M13.7 21a2 2 0 0 1-3.4 0' />
  </svg>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-(--lm-r-card) border border-(--lm-line) bg-(--lm-surface) p-4'>
    <p className='text-sm text-(--lm-muted)'>{label}</p>
    <p className='mt-1 text-2xl font-semibold text-(--lm-brand-ink)'>
      {value}
    </p>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector(selectCurrentStaff);

  const [orders, setOrders] = useState<MockOrder[]>(seedOrders);
  const [panelOpen, setPanelOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep "x min ago" fresh.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Close the notification panel on outside click / Escape.
  useEffect(() => {
    if (!panelOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setPanelOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanelOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [panelOpen]);

  const rows = useMemo(
    () =>
      orders.map((o) => ({
        ...o,
        km: distanceKm(ADMIN_PLACE.location, o.location),
      })),
    [orders],
  );

  const unread = rows.filter((o) => !o.read).length;
  const totalKm = rows.reduce((sum, o) => sum + o.km, 0);
  const revenue = rows.reduce((sum, o) => sum + o.total, 0);

  const simulateOrder = () => {
    const order = makeNewOrder();
    setOrders((prev) => [order, ...prev]);
    toast(`New order ${order.id} — ${rupees(order.total)}`);
  };

  const markAllRead = () =>
    setOrders((prev) => prev.map((o) => ({ ...o, read: true })));

  const logout = () => {
    dispatch(staffLogout());
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className='min-h-dvh bg-(--lm-page)'>
      <header className='sticky top-0 z-20 border-b border-(--lm-line) bg-(--lm-surface)'>
        <div className='mx-auto flex max-w-(--lm-max) items-center justify-between gap-3 px-(--lm-gutter) py-3'>
          <h1 className='text-lg font-black tracking-tight text-(--lm-brand-ink)'>
            Local Mart <span className='text-(--lm-brand)'>Admin</span>
          </h1>

          <div className='flex items-center gap-2'>
            <div className='relative' ref={panelRef}>
              <button
                type='button'
                onClick={() => setPanelOpen((v) => !v)}
                aria-label={`Notifications, ${unread} unread`}
                aria-expanded={panelOpen}
                className='relative flex h-(--lm-tap) w-(--lm-tap) items-center justify-center rounded-(--lm-r-control) text-(--lm-brand-ink) hover:bg-(--lm-tile)'
              >
                <BellIcon />
                {unread > 0 && (
                  <span className='absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white'>
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {panelOpen && (
                <div className='absolute right-0 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-(--lm-r-card) border border-(--lm-line) bg-(--lm-surface) shadow-lg'>
                  <div className='flex items-center justify-between border-b border-(--lm-line) px-4 py-3'>
                    <p className='font-semibold text-(--lm-brand-ink)'>
                      Order notifications
                    </p>
                    <button
                      type='button'
                      onClick={markAllRead}
                      disabled={unread === 0}
                      className='text-sm text-(--lm-brand) underline disabled:no-underline disabled:opacity-40'
                    >
                      Mark all read
                    </button>
                  </div>
                  <ul className='max-h-[60vh] divide-y divide-(--lm-line) overflow-y-auto'>
                    {rows.map((o) => (
                      <li
                        key={o.id}
                        className={`px-4 py-3 ${o.read ? "" : "bg-(--lm-plan-bg)"}`}
                      >
                        <div className='flex items-start justify-between gap-2'>
                          <p className='text-sm font-semibold text-(--lm-brand-ink)'>
                            {o.customerName} placed {o.id}
                          </p>
                          <span className='shrink-0 text-xs text-(--lm-muted)'>
                            {timeAgo(o.placedAt, now)}
                          </span>
                        </div>
                        <p className='mt-0.5 text-xs text-(--lm-muted)'>
                          {rupees(o.total)} · {formatKm(o.km)} from store
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <span className='hidden text-sm text-(--lm-muted) sm:inline'>
              {admin?.name ?? admin?.email}
            </span>
            <button
              type='button'
              onClick={logout}
              className='min-h-(--lm-tap) rounded-(--lm-r-control) border border-(--lm-line) px-3 text-sm text-(--lm-brand-ink) hover:bg-(--lm-tile)'
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-(--lm-max) px-(--lm-gutter) py-6'>
        <div className='mb-4 flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h2 className='text-xl font-semibold text-(--lm-brand-ink)'>
              Dashboard
            </h2>
            <p className='text-sm text-(--lm-muted)'>
              Delivering from {ADMIN_PLACE.name} · mock data
            </p>
          </div>
          <button
            type='button'
            onClick={simulateOrder}
            className='min-h-(--lm-tap) rounded-(--lm-r-control) bg-(--lm-brand) px-4 text-sm font-medium text-white hover:bg-(--lm-brand-deep)'
          >
            Simulate new order
          </button>
        </div>

        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          <StatCard label='Orders' value={String(rows.length)} />
          <StatCard label='Unread' value={String(unread)} />
          <StatCard label='Revenue' value={rupees(revenue)} />
          <StatCard label='Total distance' value={formatKm(totalKm)} />
        </div>

        <section className='mt-6 overflow-hidden rounded-(--lm-r-card) border border-(--lm-line) bg-(--lm-surface)'>
          <h3 className='border-b border-(--lm-line) px-4 py-3 font-semibold text-(--lm-brand-ink)'>
            Customer orders
          </h3>

          {/* Table from md up */}
          <div className='hidden overflow-x-auto md:block'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-(--lm-tile) text-(--lm-muted)'>
                <tr>
                  <th className='px-4 py-2 font-medium'>Order</th>
                  <th className='px-4 py-2 font-medium'>Customer</th>
                  <th className='px-4 py-2 font-medium'>Placed</th>
                  <th className='px-4 py-2 font-medium'>Distance</th>
                  <th className='px-4 py-2 text-right font-medium'>Total</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-(--lm-line)'>
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td className='px-4 py-3 font-medium text-(--lm-brand-ink)'>
                      {!o.read && (
                        <span
                          className='mr-2 inline-block h-2 w-2 rounded-full bg-red-600'
                          title='Unread'
                        />
                      )}
                      {o.id}
                    </td>
                    <td className='px-4 py-3'>
                      <p>{o.customerName}</p>
                      <p className='text-xs text-(--lm-muted)'>
                        {o.address}
                      </p>
                    </td>
                    <td className='px-4 py-3'>
                      <p>{clock(o.placedAt)}</p>
                      <p className='text-xs text-(--lm-muted)'>
                        {timeAgo(o.placedAt, now)}
                      </p>
                    </td>
                    <td className='px-4 py-3'>{formatKm(o.km)}</td>
                    <td className='px-4 py-3 text-right font-medium'>
                      {rupees(o.total)}
                      <p className='text-xs font-normal text-(--lm-muted)'>
                        {o.itemCount} items
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards below md */}
          <ul className='divide-y divide-(--lm-line) md:hidden'>
            {rows.map((o) => (
              <li key={o.id} className='px-4 py-3'>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-(--lm-brand-ink)'>
                    {!o.read && (
                      <span className='mr-2 inline-block h-2 w-2 rounded-full bg-red-600' />
                    )}
                    {o.id} · {o.customerName}
                  </p>
                  <p className='font-medium'>{rupees(o.total)}</p>
                </div>
                <p className='mt-0.5 text-xs text-(--lm-muted)'>
                  {o.address}
                </p>
                <p className='mt-1 text-xs text-(--lm-muted)'>
                  {clock(o.placedAt)} ({timeAgo(o.placedAt, now)}) ·{" "}
                  {formatKm(o.km)} away
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
