"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PermissionsGrid } from "./PermissionsGrid";
import { PresetSelector } from "./PresetSelector";
import { PermissionPreview } from "./PermissionPreview";

export function CreateRoleDialog({ onCreate, disabled = false }) {
  const dialogContentRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const showError = (message) => {
    setError(message);
    requestAnimationFrame(() => {
      dialogContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      showError("اسم الدور مطلوب");
      return;
    }

    if (!permissions.length) {
      showError("يجب اختيار صلاحية واحدة على الأقل");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        permissions,
      });
      // Reset form
      setName("");
      setDescription("");
      setPermissions([]);
      setOpen(false);
    } catch (err) {
      showError(err.message || "تعذر إنشاء الدور");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          إنشاء دور
        </Button>
      </DialogTrigger>
      <DialogContent
        ref={dialogContentRef}
        className="max-w-3xl max-h-[85vh] overflow-y-auto [&>button]:hidden"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-right">إنشاء دور جديد</DialogTitle>
          <DialogDescription className="text-right">
            قم بتعريف دور جديد بصلاحيات مخصصة للمنظمة. يمكنك استخدام قالب جاهز
            للبدء بسرعة أو اختيار الصلاحيات يدوياً.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="create-role-name">اسم الدور *</Label>
            <Input
              id="create-role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: محرر المحتوى"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-role-desc">الوصف</Label>
            <Textarea
              id="create-role-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب وصفاً مختصراً لما يمكن لهذا الدور القيام به..."
              rows={2}
            />
          </div>

          {/* Preset selector */}
          <PresetSelector
            onApply={setPermissions}
            currentPermissions={permissions}
          />

          <div className="space-y-2">
            <Label>الصلاحيات *</Label>
            <PermissionsGrid selected={permissions} onChange={setPermissions} />
          </div>

          {/* Permission preview */}
          <PermissionPreview selected={permissions} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? "جارٍ الإنشاء..." : "إنشاء الدور"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
