import { query } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders — Admin" };

export default async function AdminPage({ searchParams }) {
  const allowed = await isAdmin();

  if (!allowed) {
    return (
      <div className="narrow">
        <div className="card">
          <h1>Admin</h1>
          <p className="sub">Enter the admin password to see orders.</p>
          {searchParams?.error && (
            <div className="alert alert-error">That password is not correct.</div>
          )}
          <form action="/api/admin/login" method="post">
            <div className="field">
              <label htmlFor="password">Admin password</label>
              <input id="password" name="password" type="password" required />
            </div>
            <div className="form-foot">
              <button type="submit" className="btn btn-primary btn-block">
                Open admin
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const { default: OrdersTable } = await import("@/components/OrdersTable");

  let rows = [];
  let error = null;
  try {
    const res = await query(
      `SELECT o.id, o.name, o.email, o.phone, o.amount, o.utr, o.status,
              to_char(o.created_at, 'DD Mon YYYY, HH24:MI') AS created,
              c.title AS course
         FROM orders o
         JOIN courses c ON c.id = o.course_id
        ORDER BY o.id DESC
        LIMIT 300`
    );
    rows = res.rows;
  } catch (err) {
    error = err.message;
  }

  const paid = rows.filter((r) => r.status === "paid");
  const total = paid.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <div className="dash-head">
        <div className="rule" />
        <h1>Orders</h1>
        <p>
          {paid.length} paid orders · ₹{total.toLocaleString("en-IN")} recorded.
          UTRs are as entered by buyers and are not verified automatically.
        </p>
      </div>

      <AdminNav active="orders" />

      {error && <div className="alert alert-error">Could not load orders. {error}</div>}

      <OrdersTable rows={rows} />
    </div>
  );
}
