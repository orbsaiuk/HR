export const surveyQueries = {
  getByFreelancer: `*[_type == "survey" && createdBy._ref == $userId] {
    _id,
    title,
    description,
    "questionCount": count(questions),
    "responseCount": count(*[_type == "surveyResponse" && survey._ref == ^._id]),
    createdAt,
    updatedAt
  } | order(updatedAt desc)`,

  getByIdForFreelancer: `*[_type == "survey" && _id == $id && createdBy._ref == $userId][0] {
    _id,
    title,
    description,
    questions,
    settings,
    "responseCount": count(*[_type == "surveyResponse" && survey._ref == ^._id]),
    createdAt,
    updatedAt
  }`,

  getUserByClerkId: `*[_type == "user" && clerkId == $clerkId][0]`,
};

export const surveyResponseQueries = {
  getBySurveyForOwner: `*[
    _type == "surveyResponse" &&
    survey._ref == $surveyId &&
    survey->createdBy._ref == $userId
  ] {
    _id,
    respondentName,
    respondentEmail,
    "respondent": respondent->{ _id, name, email, avatar },
    submittedAt,
    createdAt
  } | order(submittedAt desc)`,

  getByIdForOwner: `*[
    _type == "surveyResponse" &&
    _id == $responseId &&
    survey->createdBy._ref == $userId
  ][0] {
    _id,
    "survey": survey->{ _id, title, questions },
    "respondent": respondent->{ _id, name, email, avatar },
    respondentName,
    respondentEmail,
    answers,
    metadata,
    submittedAt,
    createdAt
  }`,

  getBySurveyForDelete: `*[_type == "surveyResponse" && survey._ref == $surveyId]._id`,

  getCountBySurvey: `count(*[_type == "surveyResponse" && survey._ref == $surveyId])`,
};
