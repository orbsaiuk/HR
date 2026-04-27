import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export function AboutEditorSection() {
  const { register } = useFormContext();

  return (
    <div className="space-y-2">
      <Label htmlFor="bio">نبذة عني</Label>
      <Textarea id="bio" rows={6} {...register("bio")} />
    </div>
  );
}
