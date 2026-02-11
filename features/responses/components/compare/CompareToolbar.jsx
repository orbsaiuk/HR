'use client';

import { FileText, User, Printer, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function CompareToolbar({ 
    responsesCount, 
    fieldsCount,
    searchQuery = '',
    onSearchChange,
    showSearch = false
}) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1.5 font-medium px-3 py-1.5">
                    <User size={14} />
                    {responsesCount} Response{responsesCount !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="secondary" className="gap-1.5 font-medium px-3 py-1.5">
                    <FileText size={14} />
                    {fieldsCount} Field{fieldsCount !== 1 ? 's' : ''}
                </Badge>
            </div>

            <div className="flex items-center gap-2">
                {showSearch && (
                    <div className="relative">
                        {isSearchOpen ? (
                            <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                                <Input
                                    type="text"
                                    placeholder="Search fields..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange?.(e.target.value)}
                                    className="w-48 h-8 text-sm"
                                    autoFocus
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        onSearchChange?.('');
                                    }}
                                >
                                    <X size={14} />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 h-8"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search size={14} />
                                <span className="hidden sm:inline">Search</span>
                            </Button>
                        )}
                    </div>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-8"
                    onClick={handlePrint}
                >
                    <Printer size={14} />
                    <span className="hidden sm:inline">Print</span>
                </Button>
            </div>
        </div>
    );
}
