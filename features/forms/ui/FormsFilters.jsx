/**
 * Forms filters component
 * Search, status filter, and sorting controls
 */

import { Search } from "lucide-react";

export function FormsFilters({ filters, onFiltersChange }) {
  const { search, sortBy, sortOrder } = filters;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search forms..."
            value={search}
            onChange={(e) => onFiltersChange.setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              onFiltersChange.setSortBy(field);
              onFiltersChange.setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="updatedAt-desc">Last Updated</option>
            <option value="updatedAt-asc">Last Updated (Oldest)</option>
            <option value="createdAt-desc">Created Date</option>
            <option value="createdAt-asc">Created Date (Oldest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="responseCount-desc">Most Responses</option>
            <option value="responseCount-asc">Least Responses</option>
          </select>
        </div>
      </div>
    </div>
  );
}
