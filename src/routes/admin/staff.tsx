import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addStaff, listStaff, removeStaff, type HouseRole, type Seat } from "@/lib/house.functions";

export const Route = createFileRoute("/admin/staff")({ component: StaffPage });

const ROLES: { id: Exclude<HouseRole, "owner">; label: string }[] = [
  { id: "kitchen", label: "Kitchen — orders and the pass" },
  { id: "host", label: "Host — reservations" },
  { id: "floor", label: "Floor — service tickets" },
];

function StaffPage() {
  const [staff, setStaff] = useState<Seat[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Exclude<HouseRole, "owner">>("kitchen");
  const [error, setError] = useState("");

  function refresh() {
    void listStaff().then((result) => {
      if (result.ok) setStaff(result.staff);
      else setError(result.error);
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="grid gap-12 md:grid-cols-12">
      <div className="md:col-span-5">
        <p className="text-[11px] tracking-label text-brand">The house</p>
        <h1 className="mt-2 font-display text-4xl">Staff</h1>
        <p className="mt-3 text-sm text-muted">
          Add a person with their own login. Share the password once — they sign in on the same door as guests, then open the kitchen.
        </p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {staff.map((person) => (
            <li key={person.userId} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-muted">
                  {person.email} · {person.role}
                </p>
              </div>
              {person.role !== "owner" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    void removeStaff({ data: { userId: person.userId } }).then(() => refresh());
                  }}
                >
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <form
        className="space-y-4 md:col-span-7"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          void addStaff({ data: { name, email, password, role } }).then((result) => {
            if (!result.ok) {
              setError(result.error);
              return;
            }
            toast(`${name} can sign in now.`);
            setName("");
            setEmail("");
            setPassword("");
            refresh();
          });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="staff-name">Name</Label>
          <Input id="staff-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="staff-email">Email</Label>
          <Input id="staff-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="staff-password">Starting password</Label>
          <Input
            id="staff-password"
            type="text"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Role</legend>
          {ROLES.map((item) => (
            <label key={item.id} className="flex items-center gap-3 text-sm">
              <input type="radio" name="role" checked={role === item.id} onChange={() => setRole(item.id)} />
              {item.label}
            </label>
          ))}
        </fieldset>
        {error && <p className="text-sm text-brand">{error}</p>}
        <Button type="submit">Add staff</Button>
      </form>
    </div>
  );
}
