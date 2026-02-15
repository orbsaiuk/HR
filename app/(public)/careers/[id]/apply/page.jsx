"use client";

import { use } from "react";
import { CareerApplyPage } from "@/features/careers";

export default function Page({ params }) {
  const { id } = use(params);
  return <CareerApplyPage positionId={id} />;
}
