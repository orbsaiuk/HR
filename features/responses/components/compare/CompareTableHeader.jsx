'use client';

import { format } from 'date-fns';
import { FileText, Clock } from 'lucide-react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { columnColors } from './constants';

export function CompareTableHeader({ responses }) {
    return (
        <TableHeader className="sticky top-0 z-30">
            <TableRow className="bg-muted/30 hover:bg-muted/30">
                {/* Field column header */}
                <TableHead className="min-w-55 w-55 sticky left-0 bg-muted/50 z-40 border-r-2 font-semibold">
                    <div className="flex items-center gap-2 py-1">
                        <FileText size={16} className="text-primary" />
                        <span>Question / Field</span>
                    </div>
                </TableHead>
                {/* Response columns */}
                {responses.map((response, index) => {
                    const colors = columnColors[index % columnColors.length];
                    
                    return (
                        <TableHead
                            key={response._id}
                            className={cn(
                                "min-w-60 max-w-75 border-r last:border-r-0 transition-colors",
                                colors.bg
                            )}
                        >
                            <div className="space-y-2 py-2">
                                {/* Color indicator bar */}
                                <div className={cn("h-1 rounded-full -mx-2 -mt-3", colors.accent)} />
                                
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm",
                                        colors.accent
                                    )}>
                                        <span className="text-white font-bold text-sm">
                                            {response.user?.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={cn("font-semibold text-sm truncate", colors.text)}>
                                            {response.user?.name || 'Anonymous'}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {response.user?.email || 'No email provided'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="gap-1 text-[10px] font-normal bg-background/50">
                                        <Clock size={10} />
                                        {format(new Date(response.submittedAt), 'MMM dd, yyyy • h:mm a')}
                                    </Badge>
                                </div>
                            </div>
                        </TableHead>
                    );
                })}
            </TableRow>
        </TableHeader>
    );
}
