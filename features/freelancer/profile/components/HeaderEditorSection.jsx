import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

export function HeaderEditorSection() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">الاسم</Label>
        <Input id="name" {...register("name")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="headline">المسمى المهني</Label>
        <Input id="headline" {...register("headline")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">الموقع</Label>
        <Input id="location" {...register("location")} />
      </div>
    </div>
  );
}
