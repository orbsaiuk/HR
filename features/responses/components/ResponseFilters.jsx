'use client';

import { Search, Calendar, Filter } from 'lucide-react';

export function ResponseFilters({ filters, onFiltersChange }) {
    const handleSearchChange = (e) => {
        onFiltersChange({ ...filters, search: e.target.value });
    };

    const handleDateFromChange = (e) => {
        onFiltersChange({ ...filters, dateFrom: e.target.value });
    };

    const handleDateToChange = (e) => {
        onFiltersChange({ ...filters, dateTo: e.target.value });
    };

    const handleStatusChange = (e) => {
        onFiltersChange({ ...filters, status: e.target.value });
    };

    const clearFilters = () => {
        onFiltersChange({ search: '', dateFrom: '', dateTo: '', status: 'all' });
    };

    const hasActiveFilters = filters.search || filters.dateFrom || filters.dateTo || (filters.status && filters.status !== 'all');

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            id="search"
                            type="text"
                            placeholder="Search by name or email..."
                            value={filters.search}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="md:w-48">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            id="status"
                            value={filters.status || 'all'}
                            onChange={handleStatusChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Date From Input */}
                <div className="md:w-48">
                    <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            id="dateFrom"
                            type="date"
                            value={filters.dateFrom}
                            onChange={handleDateFromChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Date To Input */}
                <div className="md:w-48">
                    <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            id="dateTo"
                            type="date"
                            value={filters.dateTo}
                            onChange={handleDateToChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
