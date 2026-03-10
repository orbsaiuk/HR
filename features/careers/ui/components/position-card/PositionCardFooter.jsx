import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function PositionCardFooter({ positionId, postedTime, isClosed, compact = false }) {
    const textSize = compact ? "text-xs" : "text-sm";
    const btnSize = compact ? "px-4 text-xs" : "px-6 text-sm";

    return (
        <div className={`flex items-center justify-between ${compact ? "pt-3" : "mt-4 pt-3"} border-t border-gray-100`}>
            {postedTime && (
                <span className={`${textSize} text-gray-400`}>{postedTime}</span>
            )}
            {!isClosed ? (
                <Button
                    size="sm"
                    className={`bg-[#5286A5] hover:bg-[#5286A5]/90 text-white rounded-md ${btnSize} font-medium`}
                    asChild
                >
                    <Link href={`/careers/${positionId}`}>التقديم الآن</Link>
                </Button>
            ) : (
                <Badge variant="destructive" className={`whitespace-nowrap ${textSize}`}>
                    <AlertCircle size={compact ? 10 : 12} className="ml-1" />
                    مغلقة
                </Badge>
            )}
        </div>
    );
}
