export const analyticsQueries = {
    getResponsesByFormId: `*[_type == "response" && form._ref == $formId && form->organization._ref == $orgId] | order(submittedAt asc) {
        _id,
        answers,
        submittedAt
    }`,

    getFormById: `*[_type == "form" && _id == $id && organization._ref == $orgId][0]`,

    getTotalResponses: `count(*[_type == "response" && form._ref == $formId && form->organization._ref == $orgId])`,

    getResponsesOverTime: `*[_type == "response" && form._ref == $formId && form->organization._ref == $orgId && submittedAt >= $thirtyDaysAgo]{
        submittedAt
    } | order(submittedAt asc)`,

    getFieldStats: `*[_type == "form" && _id == $id && organization._ref == $orgId][0]{ fields }`,
};
