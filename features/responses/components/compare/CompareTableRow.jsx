'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { columnColors } from './constants';
import { CompareAnswerCell } from './CompareAnswerCell';

export function CompareTableRow({ 
    field, 
    fieldIndex, 
    responses, 
    getAnswerData,
    isHighlighted = false
}) {
    return (
        <TableRow 
            id={`field-${fieldIndex}`}
            className={cn(
                "group transition-all duration-200",
                fieldIndex % 2 === 0 && "bg-muted/20",
                isHighlighted && "bg-yellow-50 dark:bg-yellow-900/20",
                "hover:bg-primary/5 dark:hover:bg-primary/10"
            )}
        >
            {/* Field info cell */}
            <TableCell 
                className={cn(
                    "sticky left-0 z-10 border-r-2 transition-colors",
                    fieldIndex % 2 === 0 ? "bg-muted/30" : "bg-card",
                    isHighlighted && "bg-yellow-50 dark:bg-yellow-900/20",
                    "group-hover:bg-primary/5 dark:group-hover:bg-primary/10"
                )}
            >
                <div className="space-y-2 py-1">
                    <div className="flex items-start gap-2.5">
                        <span 
                            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-primary/10 text-primary cursor-default"
                            title={`Question ${fieldIndex + 1}`}
                        >
                            {fieldIndex + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm leading-tight">
                                {field.label}
                            </p>
                            {field.required && (
                                <Badge 
                                    variant="destructive" 
                                    className="text-[10px] px-1.5 py-0 font-medium mt-1.5"
                                >
                                    Required
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </TableCell>
            
            {/* Answer cells for each response */}
            {responses.map((response, responseIndex) => {
                const answer = getAnswerData(response, field._key);
                const colors = columnColors[responseIndex % columnColors.length];
                const hasAnswer = answer?.value && answer.value.trim() !== '';
                
                return (
                    <TableCell
                        key={`${response._id}-${field._key}`}
                        className={cn(
                            "border-r last:border-r-0 align-top transition-colors py-3 px-4",
                            !hasAnswer && "bg-muted/10"
                        )}
                    >
                        <CompareAnswerCell answer={answer} field={field} />
                    </TableCell>
                );
            })}
        </TableRow>
    );
}
