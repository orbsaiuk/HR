export const analyticsQueries = {
    getResponsesByFormId: `*[_type == "response" && form._ref == $formId] | order(submittedAt asc) {
        _id,
        answers,
        submittedAt
    }`,
    
    getFormById: `*[_type == "form" && _id == $id][0]`,
    
    getTotalResponses: `count(*[_type == "response" && form._ref == $formId])`,
    
    getResponsesOverTime: `*[_type == "response" && form._ref == $formId && submittedAt >= $thirtyDaysAgo]{
        submittedAt
    } | order(submittedAt asc)`,
    
    getFieldStats: `*[_type == "form" && _id == $id][0]{ fields }`,
};
