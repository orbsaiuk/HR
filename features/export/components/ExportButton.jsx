'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { exportToCSV } from '../services/csvExport.js';

export function ExportButton({ responses, form }) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const csv = exportToCSV(responses, form);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${form.title}-responses.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting || responses.length === 0}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
        >
            {isExporting ? (
                <>
                    <Download className="w-4 h-4 animate-pulse" />
                    <span>Exporting...</span>
                </>
            ) : (
                <>
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                </>
            )}
        </button>
    );
}
