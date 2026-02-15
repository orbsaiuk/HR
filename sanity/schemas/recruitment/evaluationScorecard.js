/**
 * Evaluation Scorecard Schema
 *
 * Structured evaluation with multiple criteria that team members
 * can fill out independently per application/candidate.
 */

export const scorecardCriterion = {
    name: "scorecardCriterion",
    title: "Scorecard Criterion",
    type: "object",
    fields: [
        {
            name: "name",
            title: "Criterion Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "score",
            title: "Score",
            type: "number",
            validation: (Rule) => Rule.required().min(1).max(5),
            description: "Rating from 1 (poor) to 5 (excellent)",
        },
        {
            name: "comment",
            title: "Comment",
            type: "text",
            rows: 2,
        },
    ],
    preview: {
        select: {
            name: "name",
            score: "score",
        },
        prepare({ name, score }) {
            const stars = "★".repeat(score || 0) + "☆".repeat(5 - (score || 0));
            return { title: name || "Unnamed", subtitle: stars };
        },
    },
};

export default {
    name: "evaluationScorecard",
    title: "Evaluation Scorecard",
    type: "document",
    preview: {
        select: {
            evaluatorName: "evaluator.name",
            applicantName: "application.applicant.name",
            positionTitle: "application.jobPosition.title",
            overallScore: "overallScore",
        },
        prepare({ evaluatorName, applicantName, positionTitle, overallScore }) {
            return {
                title: `${evaluatorName || "Unknown"} → ${applicantName || "Unknown"}`,
                subtitle: `${positionTitle || "—"} · Overall: ${overallScore ?? "—"}/5`,
            };
        },
    },
    fields: [
        {
            name: "application",
            title: "Application",
            type: "reference",
            to: [{ type: "application" }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: "evaluator",
            title: "Evaluator",
            type: "reference",
            to: [{ type: "teamMember" }],
            validation: (Rule) => Rule.required(),
            description: "The team member who filled out this scorecard",
        },
        {
            name: "organization",
            title: "Organization",
            type: "reference",
            to: [{ type: "organization" }],
            description: "The organization this belongs to",
        },
        {
            name: "criteria",
            title: "Evaluation Criteria",
            type: "array",
            of: [{ type: "scorecardCriterion" }],
            validation: (Rule) => Rule.required().min(1),
        },
        {
            name: "overallScore",
            title: "Overall Score",
            type: "number",
            validation: (Rule) => Rule.min(1).max(5),
            description:
                "Overall rating (1–5). Auto-calculated from criteria averages, but can be overridden.",
        },
        {
            name: "recommendation",
            title: "Recommendation",
            type: "string",
            options: {
                list: [
                    { title: "Strong Hire", value: "strong-hire" },
                    { title: "Hire", value: "hire" },
                    { title: "No Hire", value: "no-hire" },
                    { title: "Strong No Hire", value: "strong-no-hire" },
                ],
                layout: "radio",
            },
        },
        {
            name: "summary",
            title: "Summary / Notes",
            type: "text",
            rows: 4,
            description: "Free-form evaluation summary",
        },
        {
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
            readOnly: true,
        },
        {
            name: "updatedAt",
            title: "Updated At",
            type: "datetime",
        },
    ],
};
