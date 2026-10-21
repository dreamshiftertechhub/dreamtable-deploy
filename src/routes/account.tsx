import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodCard } from "@/components/food/food-card";
import { ORDER_STATUS_LABELS } from "@/data/types";
import { formatDate, formatNaira, formatTime } from "@/lib/format";
import { useMimi } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const profile = useMimi((s) => s.profile);
  const update = useMimi((s) => s.updateProfile);
  const orders = useMimi((s) =>
    s.orders.filter((o) => o.customer.phone === profile.phone || o.customer.name === profile.name),
  );
  const mine = orders;
  const items = useMimi((s) => s.items);
  const favs = useMimi((s) => s.favouriteIds);
  const favItems = items.filter((i) => favs.includes(i.id));
  const addresses = useMimi((s) => s.addresses);
  const addAddress = useMimi((s) => s.addAddress);
  const removeAddress = useMimi((s) => s.removeAddress);
  const reservations = useMimi((s) => s.reservations.filter((r) => r.email === profile.email || r.name === profile.name));
  const points = useMimi((s) => s.points);
  const add = useMimi((s) => s.addToCart);
  const setCart = useUi((s) => s.setCartOpen);

  const [label, setLabel] = useState("New");
  const [line, setLine] = useState("");
  const [apt, setApt] = useState("");

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-24 md:pt-32">
        <p className="text-[11px] tracking-label text-brand">Account</p>
        <h1 className="mt-3 font-display text-5xl">{profile.name.split(" ")[0]}'s table</h1>
        <Tabs defaultValue="orders" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="favourites">Favourites</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="table">The Circle</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {mine.length === 0 ? (
              <Empty text="Your first DreamTable order is waiting." to="/menu" cta="Order now" />
            ) : (
              <ul className="space-y-6">
                {mine.map((o) => (
                  <li key={o.id} className="border border-line p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">#{o.id}</p>
                        <p className="text-sm text-muted">
                          {formatDate(o.createdAt)} · {formatTime(o.createdAt)} · {ORDER_STATUS_LABELS[o.status]}
                        </p>
                      </div>
                      <p className="tabular-nums">{formatNaira(o.total)}</p>
                    </div>
                    <p className="mt-3 text-sm text-muted">{o.items.map((i) => i.name).join(", ")}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          o.items.forEach((item) =>
                            add({
                              menuItemId: item.menuItemId,
                              name: item.name,
                              image: item.image,
                              unitPrice: item.unitPrice,
                              quantity: item.quantity,
                              protein: item.protein,
                              extras: item.extras,
                              spice: item.spice,
                              notes: item.notes,
                            }),
                          );
                          toast("Previous order added to your bag.");
                          setCart(true);
                        }}
                      >
                        Reorder
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/track/$orderId" params={{ orderId: o.id }}>
                          Track
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="favourites">
            {favItems.length === 0 ? (
              <Empty text="Save a dish. We'll keep it warm." to="/menu" cta="Browse menu" />
            ) : (
              <div className="grid gap-8 sm:grid-cols-2">
                {favItems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="addresses">
            <ul className="space-y-4">
              {addresses.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 border border-line p-4">
                  <div>
                    <p className="font-semibold">{a.label}</p>
                    <p className="text-sm text-muted">
                      {a.line}
                      {a.apartment ? ` · ${a.apartment}` : ""}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeAddress(a.id)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <form
              className="mt-8 grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!line) return;
                addAddress({ label, line, apartment: apt });
                setLine("");
                setApt("");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="al">Label</Label>
                <Input id="al" value={label} onChange={(e) => setLabel(e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="aline">Address</Label>
                <Input id="aline" value={line} onChange={(e) => setLine(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aapt">Apartment</Label>
                <Input id="aapt" value={apt} onChange={(e) => setApt(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button type="submit">Save address</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="reservations">
            {reservations.length === 0 ? (
              <Empty text="No table booked yet." to="/reservations" cta="Reserve" />
            ) : (
              <ul className="space-y-4">
                {reservations.map((r) => (
                  <li key={r.id} className="border border-line p-4">
                    <p className="font-semibold">#{r.id}</p>
                    <p className="text-sm text-muted">
                      {r.date} · {r.time} · {r.guests} guests · {r.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="table">
            <p className="font-display text-6xl tabular-nums">{points.toLocaleString()}</p>
            <p className="mt-2 text-muted">points in The Circle</p>
            <Button asChild className="mt-6">
              <Link to="/loyalty">See rewards</Link>
            </Button>
          </TabsContent>

          <TabsContent value="profile">
            <form
              className="max-w-md space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                update({
                  name: String(fd.get("name")),
                  phone: String(fd.get("phone")),
                  email: String(fd.get("email")),
                });
                toast("Profile saved.");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="pname">Name</Label>
                <Input id="pname" name="name" defaultValue={profile.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pphone">Phone</Label>
                <Input id="pphone" name="phone" defaultValue={profile.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pemail">Email</Label>
                <Input id="pemail" name="email" defaultValue={profile.email} />
              </div>
              <Button type="submit">Save</Button>
            </form>
          </TabsContent>

          <TabsContent value="settings">
            <p className="text-sm text-muted">
              Kitchen SMS and email receipts are on. This is a demo table — orders live in your
              browser until you clear site data.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/admin">Open kitchen desk</Link>
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </SiteShell>
  );
}

function Empty({ text, to, cta }: { text: string; to: "/menu" | "/reservations"; cta: string }) {
  return (
    <div className="py-10">
      <p className="font-display text-3xl">{text}</p>
      <Button asChild className="mt-6">
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}
