"use client";

import { ApplyPage } from "./apply/ApplyPage";

/**
 * CareerApplyPage — delegates to the new apply page orchestrator
 * that supports profile, form, and both application methods.
 */
export function CareerApplyPage({ positionId }) {
  return <ApplyPage positionId={positionId} />;
}
