import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";
import { approveOrgRequestAction } from "./sanity/actions/approveOrgRequestAction";
import { rejectOrgRequestAction } from "./sanity/actions/rejectOrgRequestAction";

export default defineConfig({
    name: "default",
    title: "Form Builder App",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    basePath: "/studio",
    plugins: [
        structureTool({
            structure,
        }),
        visionTool(),
    ],
    schema: {
        types: schemaTypes,
    },
    document: {
        actions: (prev, context) => {
            if (context.schemaType === "organizationRequest") {
                return [
                    approveOrgRequestAction,
                    rejectOrgRequestAction,
                    ...prev,
                ];
            }
            return prev;
        },
    },
});
