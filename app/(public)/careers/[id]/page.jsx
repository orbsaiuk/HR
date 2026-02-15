"use client";

import { use } from "react";
import { CareerDetailPage } from "@/features/careers";

export default function Page({ params }) {
  const { id } = use(params);
  return <CareerDetailPage positionId={id} />;
}
