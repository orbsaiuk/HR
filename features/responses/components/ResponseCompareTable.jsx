'use client';

import { useState, useMemo } from 'react';
import { FileText, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table';
import {
    CompareToolbar,
    CompareEmptyState,
    CompareTableHeader,
    CompareTableRow,
} from './compare';

export function ResponseCompareTable({ form, responses }) {
    const [searchQuery, setSearchQuery] = useState('');

    if (!form || !responses || responses.length === 0) {
        return <CompareEmptyState />;
    }

    const getAnswerData = (response, fieldId) => {
        return response?.answers?.find(a => a.fieldId === fieldId);
    };

    // Filter fields based on search query
    const filteredFields = useMemo(() => {
        if (!searchQuery.trim()) return form.fields || [];
        const query = searchQuery.toLowerCase();
        return (form.fields || []).filter(field => 
            field.label?.toLowerCase().includes(query)
        );
    }, [form.fields, searchQuery]);

    const totalFields = form.fields?.length || 0;

    return (
        <div className="space-y-4 print:space-y-2">
            {/* Print Header - Only visible when printing */}
            <div className="hidden print:block print:mb-4">
                <h1 className="text-xl font-bold text-center">{form.title || 'Form Responses Comparison'}</h1>
                <p className="text-center text-sm text-gray-600 mt-1">
                    Comparing {responses.length} response{responses.length !== 1 ? 's' : ''} • {totalFields} field{totalFields !== 1 ? 's' : ''}
                </p>
                <p className="text-center text-xs text-gray-500 mt-1">
                    Generated on {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

            {/* Toolbar - Hidden when printing */}
            <div className="print:hidden">
                <CompareToolbar 
                    responsesCount={responses.length}
                    fieldsCount={totalFields}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    showSearch={totalFields > 5}
                />
            </div>

            {/* Main Table Card */}
            <Card className="overflow-hidden border-2 shadow-sm print:border print:shadow-none">
                <div className="overflow-x-auto overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent print:max-h-none print:overflow-visible">
                    <Table className="print:text-xs">
                        <CompareTableHeader 
                            responses={responses} 
                            totalFields={totalFields}
                        />
                        <TableBody>
                            {filteredFields.map((field, fieldIndex) => {
                                const originalIndex = form.fields?.findIndex(f => f._key === field._key) ?? fieldIndex;
                                return (
                                    <CompareTableRow
                                        key={field._key}
                                        field={field}
                                        fieldIndex={originalIndex}
                                        responses={responses}
                                        getAnswerData={getAnswerData}
                                        isHighlighted={searchQuery.trim() !== ''}
                                    />
                                );
                            })}
                            
                            {filteredFields.length === 0 && searchQuery.trim() !== '' && (
                                <TableRow>
                                    <TableCell colSpan={responses.length + 1} className="text-center py-12">
                                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                                            <Search className="text-muted-foreground" size={24} />
                                        </div>
                                        <p className="text-muted-foreground font-medium">No fields match "{searchQuery}"</p>
                                        <p className="text-muted-foreground text-sm mt-1">Try a different search term</p>
                                    </TableCell>
                                </TableRow>
                            )}
                            
                            {!form.fields?.length && (
                                <TableRow>
                                    <TableCell colSpan={responses.length + 1} className="text-center py-16">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                            <FileText className="text-muted-foreground" size={32} />
                                        </div>
                                        <p className="text-muted-foreground text-lg font-medium">No fields in this form</p>
                                        <p className="text-muted-foreground text-sm mt-1">This form doesn't have any fields to compare.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Print styles */}
            <style jsx global>{`
                @media print {
                    /* Page setup */
                    @page {
                        size: landscape;
                        margin: 0.5in;
                    }
                    
                    /* Hide non-essential elements */
                    nav, header, footer, aside,
                    [data-sidebar], [data-topbar],
                    .print\\:hidden { 
                        display: none !important; 
                    }
                    
                    /* Body styling */
                    body {
                        font-size: 10px !important;
                        line-height: 1.4 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    
                    /* Table styling */
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        font-size: 9px !important;
                    }
                    
                    th, td {
                        padding: 6px 8px !important;
                        border: 1px solid #e5e7eb !important;
                        vertical-align: top !important;
                    }
                    
                    th {
                        background-color: #f9fafb !important;
                        font-weight: 600 !important;
                    }
                    
                    /* Alternating row colors */
                    tbody tr:nth-child(even) {
                        background-color: #f9fafb !important;
                    }
                    
                    /* Sticky column print fix */
                    .sticky {
                        position: static !important;
                    }
                    
                    /* Badge styling for print */
                    [class*="badge"] {
                        border: 1px solid #d1d5db !important;
                        padding: 1px 4px !important;
                        font-size: 8px !important;
                        background: #f3f4f6 !important;
                    }
                    
                    /* Avatar styling for print */
                    .rounded-full {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Remove shadows and unnecessary styling */
                    * {
                        box-shadow: none !important;
                        text-shadow: none !important;
                    }
                    
                    /* Ensure text is readable */
                    p, span, td, th {
                        color: #1f2937 !important;
                    }
                    
                    .text-muted-foreground {
                        color: #6b7280 !important;
                    }
                    
                    /* Image handling */
                    img {
                        max-height: 60px !important;
                        page-break-inside: avoid !important;
                    }
                    
                    /* Avoid page breaks inside rows */
                    tr {
                        page-break-inside: avoid !important;
                    }
                    
                    /* Color indicator bars */
                    .bg-blue-500, .bg-emerald-500, .bg-purple-500, 
                    .bg-amber-500, .bg-rose-500 {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Line clamp removal for full content */
                    .line-clamp-4 {
                        -webkit-line-clamp: unset !important;
                        overflow: visible !important;
                    }
                }
            `}</style>
        </div>
    );
}
