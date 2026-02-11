'use client';

import { useState } from 'react';
import { ResponseFilters } from './ResponseFilters.jsx';
import { ResponseTable } from './ResponseTable.jsx';
import { ResponseDetail } from './ResponseDetail.jsx';
import { deleteResponse } from '../services/responseService.js';


export function ResponseList({ formId, responses, onResponseDeleted }) {
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        dateFrom: '',
        dateTo: '',
    });

    const filteredResponses = responses.filter((response) => {
        const matchesSearch =
            !filters.search ||
            response.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            response.user.email.toLowerCase().includes(filters.search.toLowerCase());

        const matchesDateFrom =
            !filters.dateFrom ||
            new Date(response.submittedAt) >= new Date(filters.dateFrom);

        const matchesDateTo =
            !filters.dateTo ||
            new Date(response.submittedAt) <= new Date(filters.dateTo);

        return matchesSearch && matchesDateFrom && matchesDateTo;
    });

    const handleSelectResponse = (response) => {
        setSelectedResponse(response);
    };

    const handleDeleteResponse = async (responseId) => {
        try {
            await deleteResponse(responseId);
            if (onResponseDeleted) {
                onResponseDeleted(responseId);
            }
            if (selectedResponse && selectedResponse._id === responseId) {
                setSelectedResponse(null);
            }
        } catch (error) {
            console.error('Error deleting response:', error);
            alert('Failed to delete response. Please try again.');
        }
    };

    const handleBackToList = () => {
        setSelectedResponse(null);
    };

    if (selectedResponse) {
        return (
            <div>
                <button
                    onClick={handleBackToList}
                    className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to responses
                </button>
                <ResponseDetail
                    response={selectedResponse}
                    onDelete={handleDeleteResponse}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Responses</h2>
                    <p className="text-gray-600 mt-1">
                        {filteredResponses.length} of {responses.length} responses
                        {filteredResponses.length !== responses.length && ' (filtered)'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <ResponseFilters filters={filters} onFiltersChange={setFilters} />

            {/* Response Table */}
            <ResponseTable
                responses={filteredResponses}
                onSelectResponse={handleSelectResponse}
                onDeleteResponse={handleDeleteResponse}
            />

            {/* Empty State */}
            {filteredResponses.length === 0 && responses.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Matching Responses
                    </h3>
                    <p className="text-gray-500">
                        Try adjusting your filters to see more results.
                    </p>
                </div>
            )}
        </div>
    );
}
