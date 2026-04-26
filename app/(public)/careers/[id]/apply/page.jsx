"use client";

import { use } from "react";
import { CareerApplyPage } from "@/features/public/careers";

export default function Page({ params }) {
  const { id } = use(params);
  return <CareerApplyPage positionId={id} />;
}
