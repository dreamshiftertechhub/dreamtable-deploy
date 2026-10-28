import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth/server";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import type { Order } from "@/data/types";

export type HouseRole = "owner" | "kitchen" | "host" | "floor";

export type Seat = {
  userId: string;
  email: string;
  name: string;
  role: HouseRole;
};

export type PassCall = {
  menuItemId: string;
  note: string;
  calledAt: string;
};

const ROLES: HouseRole[] = ["owner", "kitchen", "host", "floor"];

async function identity(sql: Sql, userId: string) {
  const rows = await sql<{ id: string; email: string; name: string }>`
    select id, email, name from "user" where id = ${userId} limit 1
  `;
  return rows[0] ?? null;
}

async function seatOf(sql: Sql, userId: string): Promise<Seat | null> {
  const rows = await sql<{ user_id: string; email: string; name: string; role: string }>`
    select user_id, email, name, role from house_members where user_id = ${userId} limit 1
  `;
  const row = rows[0];
  if (!row || !ROLES.includes(row.role as HouseRole)) return null;
  return { userId: row.user_id, email: row.email, name: row.name, role: row.role as HouseRole };
}

export const getMySeat = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Seat | null> => {
    const sql = await getSql();
    return seatOf(sql, context.userId);
  });

export const claimHouse = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (process.env.NODE_ENV === "production") return { ok: false as const, error: "Owner setup is locked on the public website. Use the verified, administrator-controlled provisioning process." };
    const sql = await getSql();
    const existing = await seatOf(sql, context.userId);
    if (existing) return { ok: true as const, seat: existing };
    const owners = await sql<{ n: number }>`select count(*)::int as n from house_members where role = 'owner'`;
    if ((owners[0]?.n ?? 0) > 0) {
      return { ok: false as const, error: "This house already has an owner. Ask them for a staff login." };
    }
    const who = await identity(sql, context.userId);
    if (!who) return { ok: false as const, error: "Sign in again, then take the keys." };
    await sql`
      insert into house_members (user_id, email, name, role)
      values (${who.id}, ${who.email}, ${who.name}, 'owner')
    `;
    return {
      ok: true as const,
      seat: { userId: who.id, email: who.email, name: who.name, role: "owner" as const },
    };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await seatOf(sql, context.userId);
    if (me?.role !== "owner") return { ok: false as const, error: "Only the owner sees the staff list.", staff: [] as Seat[] };
    const rows = await sql<{ user_id: string; email: string; name: string; role: string }>`
      select user_id, email, name, role from house_members order by created_at asc
    `;
    const staff: Seat[] = rows
      .filter((r) => ROLES.includes(r.role as HouseRole))
      .map((r) => ({ userId: r.user_id, email: r.email, name: r.name, role: r.role as HouseRole }));
    return { ok: true as const, staff };
  });

export const addStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { name: string; email: string; password: string; role: HouseRole }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await seatOf(sql, context.userId);
    if (me?.role !== "owner") return { ok: false as const, error: "Only the owner can add staff." };
    const role = data.role;
    if (role !== "kitchen" && role !== "host" && role !== "floor") {
      return { ok: false as const, error: "Pick kitchen, host, or floor." };
    }
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();
    if (!name || !email.includes("@") || data.password.length < 8) {
      return { ok: false as const, error: "Name, a real email, and a password of 8+ characters." };
    }
    try {
      const created = await auth.api.signUpEmail({
        body: { email, password: data.password, name },
      });
      const id = created?.user?.id;
      if (!id) return { ok: false as const, error: "That account was not created." };
      await sql`
        insert into house_members (user_id, email, name, role)
        values (${id}, ${email}, ${name}, ${role})
      `;
      return { ok: true as const };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not add them.";
      return { ok: false as const, error: message };
    }
  });

export const removeStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { userId: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await seatOf(sql, context.userId);
    if (me?.role !== "owner") return { ok: false as const, error: "Only the owner can remove staff." };
    if (data.userId === context.userId) return { ok: false as const, error: "You can't remove yourself." };
    await sql`delete from house_members where user_id = ${data.userId} and role <> 'owner'`;
    return { ok: true as const };
  });

export const saveHouseOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { order: Order }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const order = data.order;
    await sql`
      insert into house_orders (id, user_id, payload, status)
      values (${order.id}, ${context.userId}, ${JSON.stringify(order)}, ${order.status})
      on conflict (id) do update set payload = excluded.payload, status = excluded.status
    `;
    return { ok: true as const };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ payload: string }>`
      select payload from house_orders where user_id = ${context.userId} order by created_at desc
    `;
    return rows.map((r) => JSON.parse(r.payload) as Order);
  });

export const listHouseOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await seatOf(sql, context.userId);
    if (!me) return [] as Order[];
    const rows = await sql<{ payload: string }>`
      select payload from house_orders order by created_at desc limit 80
    `;
    return rows.map((r) => JSON.parse(r.payload) as Order);
  });

export const setHouseOrderStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await seatOf(sql, context.userId);
    if (!me) return { ok: false as const };
    const rows = await sql<{ payload: string }>`select payload from house_orders where id = ${data.id} limit 1`;
    const row = rows[0];
    if (!row) return { ok: false as const };
    const order = JSON.parse(row.payload) as Order;
    order.status = data.status as Order["status"];
    await sql`
      update house_orders set status = ${data.status}, payload = ${JSON.stringify(order)} where id = ${data.id}
    `;
    return { ok: true as const };
  });

export const listPassCalls = createServerFn({ method: "GET" }).handler(async (): Promise<PassCall[]> => {
  const sql = await getSql();
  const rows = await sql<{ menu_item_id: string; note: string; called_at: string }>`
    select menu_item_id, note, called_at from pass_calls order by called_at desc
  `;
  return rows.map((r) => ({ menuItemId: r.menu_item_id, note: r.note, calledAt: String(r.called_at) }));
});

export const setPassCall = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { menuItemId: string; note: string; on: boolean }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await seatOf(sql, context.userId);
    if (!me) return { ok: false as const, error: "The pass is for the house." };
    if (!data.on) {
      await sql`delete from pass_calls where menu_item_id = ${data.menuItemId}`;
      return { ok: true as const };
    }
    const note = data.note.trim().slice(0, 80);
    await sql`
      insert into pass_calls (menu_item_id, note)
      values (${data.menuItemId}, ${note})
      on conflict (menu_item_id) do update set note = excluded.note, called_at = now()
    `;
    return { ok: true as const };
  });
