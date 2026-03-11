"use client";

import { useEffect } from "react";
import { useCareerDetail } from "../model/useCareerDetail";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Error } from "@/shared/components/feedback/Error";
import { CareerDetailSkeleton } from "./CareerDetailSkeleton";
import {
  CareerDetailHeader,
  CareerDetailContent,
  CareerDetailSidebar,
} from "./career-detail";

export function CareerDetailPage({ positionId }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { position, loading, error } = useCareerDetail(positionId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [positionId]);

  if (loading) return <CareerDetailSkeleton />;
  if (error) return <Error message={error} />;
  if (!position) return <Error message="الوظيفة غير موجودة" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <CareerDetailHeader position={position} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CareerDetailContent position={position} />

          <CareerDetailSidebar
            position={position}
            positionId={positionId}
            isSignedIn={isSignedIn}
            isLoaded={isLoaded}
          />
        </div>
      </div>
    </div>
  );
}
