"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FreelancerContractFilterTabs } from "./FreelancerContractFilterTabs";
import { FreelancerContractCard } from "./FreelancerContractCard";
import { FreelancerContractDetailSheet } from "./FreelancerContractDetailSheet";
import { FreelancerContractsEmptyState } from "./FreelancerContractsEmptyState";
import { useFreelancerContracts } from "../model/useFreelancerContracts";

function ContractsSkeleton() {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <article
          key={i}
          className="rounded-lg border border-[#E4E8F2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
          dir="rtl"
        >
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/3" />
          <div className="mt-3 flex gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function FreelancerContractsPage() {
  const {
    filteredContracts,
    loading,
    updating,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    updateStatus,
  } = useFreelancerContracts();

  const [selectedContract, setSelectedContract] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleViewDetails(contract) {
    setSelectedContract(contract);
    setSheetOpen(true);
  }

  function handleSheetClose() {
    setSheetOpen(false);
    setTimeout(() => setSelectedContract(null), 300);
  }

  function handleUpdateStatus(contractId, newStatus) {
    updateStatus(contractId, newStatus);
    setSelectedContract((prev) =>
      prev && (prev.id === contractId || prev._id === contractId)
        ? { ...prev, status: newStatus }
        : prev,
    );
  }

  return (
    <section className="space-y-5 p-4 sm:p-6 lg:p-8" dir="rtl">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937] sm:text-3xl">
            العقود
          </h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            راجع العقود الواردة من الشركات وقم بقبولها أو رفضها
          </p>
        </div>
      </header>

      <div className="rounded-lg border border-[#E4E8F2] bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3B6]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم العقد أو الشركة..."
              className="h-10 border-[#DCE2EE] pr-9 text-right"
            />
          </div>

          <FreelancerContractFilterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {loading ? (
          <ContractsSkeleton />
        ) : error ? (
          <div className="mt-4 rounded-md border border-dashed border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
            {error}
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="mt-4">
            <FreelancerContractsEmptyState />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredContracts.map((contract) => (
              <FreelancerContractCard
                key={contract.id ?? contract._id}
                contract={contract}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
                updating={updating}
              />
            ))}
          </div>
        )}
      </div>

      <FreelancerContractDetailSheet
        contract={selectedContract}
        open={sheetOpen}
        onClose={handleSheetClose}
        onUpdateStatus={handleUpdateStatus}
        updating={updating}
      />
    </section>
  );
}
