"use client";

import { useCareersList } from "../model/useCareersList";
import { Loading } from "@/shared/components/feedback/Loading";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { Error } from "@/shared/components/feedback/Error";
import { PositionCard } from "./components/PositionCard";
import { CareersFilters } from "./components/CareersFilters";
import { Briefcase } from "lucide-react";

export function CareersPage() {
  const {
    positions,
    filters,
    loading,
    error,
    search,
    setSearch,
    department,
    setDepartment,
    location,
    setLocation,
    type,
    setType,
    clearFilters,
  } = useCareersList();

  const hasActiveFilters = search || department || location || type;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Explore open positions and find your next career opportunity.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <CareersFilters
          search={search}
          onSearchChange={setSearch}
          department={department}
          onDepartmentChange={setDepartment}
          location={location}
          onLocationChange={setLocation}
          type={type}
          onTypeChange={setType}
          departments={filters.departments}
          locations={filters.locations}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results */}
        {loading ? (
          <Loading />
        ) : error ? (
          <Error message={error} />
        ) : positions.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={
              hasActiveFilters
                ? "No positions match your filters"
                : "No open positions"
            }
            description={
              hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Check back later for new opportunities."
            }
            action={
              hasActiveFilters
                ? { label: "Clear Filters", onClick: clearFilters }
                : undefined
            }
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {positions.length} open position{positions.length !== 1 && "s"}
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {positions.map((position) => (
                <PositionCard key={position._id} position={position} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
