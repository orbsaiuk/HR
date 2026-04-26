"use client";

import { use } from "react";
import { MyApplicationDetailPage } from "@/features/user/applications";

export default function Page({ params }) {
  const { id } = use(params);
  return <MyApplicationDetailPage applicationId={id} />;
}
