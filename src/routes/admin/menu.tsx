import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, CATEGORY_LABELS, type Category, type MenuItem, type SpiceLevel } from "@/data/types";
import { formatNaira } from "@/lib/format";
import { useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/admin/menu")({ component: AdminMenu });

function AdminMenu() {
  const items = useMimi((s) => s.items);
  const update = useMimi((s) => s.updateMenuItem);
  const remove = useMimi((s) => s.deleteMenuItem);
  const add = useMimi((s) => s.addMenuItem);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-label text-brand">Menu management</p>
          <h1 className="mt-2 font-display text-4xl">What we're cooking</h1>
        </div>
        <Button onClick={() => setCreating(true)}>Add item</Button>
      </div>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center gap-4 py-4">
            <img src={item.image} alt="" className="size-16 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted">
                {CATEGORY_LABELS[item.category]} · {formatNaira(item.price)}
                {!item.available ? " · Unavailable" : ""}
                {item.popular ? " · Popular" : ""}
                {item.spice ? " · Spicy" : ""}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setEditing(item)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => update(item.id, { available: !item.available })}
            >
              {item.available ? "Mark sold out" : "Make available"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => remove(item.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <ItemDialog
        key={editing?.id ?? "edit"}
        open={!!editing}
        item={editing}
        onOpenChange={(o) => !o && setEditing(null)}
        onSave={(patch) => {
          if (editing) update(editing.id, patch);
          setEditing(null);
        }}
      />
      <ItemDialog
        key="create"
        open={creating}
        item={null}
        onOpenChange={setCreating}
        onSave={(patch) => {
          add({
            id: `new-${Date.now()}`,
            name: patch.name ?? "New dish",
            description: patch.description ?? "",
            price: patch.price ?? 0,
            category: patch.category ?? "sides",
            image: patch.image ?? "/food/jollof.jpg",
            spice: patch.spice ?? 0,
            popular: patch.popular ?? false,
            vegetarian: patch.vegetarian ?? false,
            available: patch.available ?? true,
            ingredients: patch.ingredients ?? [],
            customizable: patch.customizable ?? true,
          });
          setCreating(false);
        }}
      />
    </div>
  );
}

function ItemDialog({
  open,
  item,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  item: MenuItem | null;
  onOpenChange: (o: boolean) => void;
  onSave: (patch: Partial<MenuItem>) => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item?.price ?? 0);
  const [category, setCategory] = useState<Exclude<Category, "all">>(item?.category ?? "rice");
  const [spice, setSpice] = useState<SpiceLevel>(item?.spice ?? 0);
  const [popular, setPopular] = useState(item?.popular ?? false);
  const [vegetarian, setVegetarian] = useState(item?.vegetarian ?? false);
  const [available, setAvailable] = useState(item?.available ?? true);
  const [image, setImage] = useState(item?.image ?? "/food/jollof.jpg");

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o && item) {
          setName(item.name);
          setDescription(item.description);
          setPrice(item.price);
          setCategory(item.category);
          setSpice(item.spice);
          setPopular(item.popular);
          setVegetarian(item.vegetarian);
          setAvailable(item.available);
          setImage(item.image);
        }
        onOpenChange(o);
      }}
    >
      <DialogContent className="p-6">
        <DialogHeader className="p-0">
          <DialogTitle>{item ? "Edit dish" : "New dish"}</DialogTitle>
          <DialogDescription>Changes go live on the menu immediately.</DialogDescription>
        </DialogHeader>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ name, description, price, category, spice, popular, vegetarian, available, image });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="iname">Name</Label>
            <Input id="iname" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idesc">Description</Label>
            <Textarea id="idesc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="iprice">Price (₦)</Label>
              <Input
                id="iprice"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Exclude<Category, "all">)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c !== "all").map((c) => (
                    <SelectItem key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="iimg">Image</Label>
            <Input
              id="iimg"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setImage(String(reader.result));
                reader.readAsDataURL(file);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} />
              Popular
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={vegetarian} onChange={(e) => setVegetarian(e.target.checked)} />
              Vegetarian
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
              Available
            </label>
            <label className="flex items-center gap-2">
              Spice
              <select
                className="border border-line bg-paper px-2 py-1"
                value={spice}
                onChange={(e) => setSpice(Number(e.target.value) as SpiceLevel)}
              >
                <option value={0}>None</option>
                <option value={1}>Mild</option>
                <option value={2}>Medium</option>
                <option value={3}>Hot</option>
              </select>
            </label>
          </div>
          <Button type="submit">Save dish</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
