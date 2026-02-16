"use client";

import { use } from "react";
import { CompanyProfilePage } from "@/features/companies";

export default function Page({ params }) {
    const { slug } = use(params);
    return <CompanyProfilePage slug={slug} />;
}
