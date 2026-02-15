"use client";

import { use } from "react";
import { MyApplicationDetailPage } from "@/features/candidate-portal";

export default function Page({ params }) {
  const { id } = use(params);
  return <MyApplicationDetailPage applicationId={id} />;
}
