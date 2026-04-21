import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ title, value, icon: Icon, cardClassName }) {
  return (
    <Card
      className={cn(
        "border-0 shadow-sm transition-all hover:shadow-md",
        cardClassName,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1.5 text-sm font-medium text-white/90">{title}</p>
          </div>
          <div className="rounded-xl bg-white/20 p-3 text-white backdrop-blur-sm">
            <Icon size={24} className="opacity-95" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
