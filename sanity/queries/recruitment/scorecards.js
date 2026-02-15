export const scorecardQueries = {
  /**
   * Get all scorecards for a specific application
   * Org-scoped via the application's jobPosition organization reference
   */
  getByApplicationId: `*[_type == "evaluationScorecard" && application._ref == $applicationId && application->jobPosition->organization._ref == $orgId] | order(createdAt desc) {
    _id,
    overallScore,
    recommendation,
    summary,
    criteria,
    createdAt,
    updatedAt,
    "evaluator": evaluator->{
      _id,
      name,
      email
    }
  }`,

  /**
   * Get a single scorecard by ID
   */
  getById: `*[_type == "evaluationScorecard" && _id == $id][0] {
    _id,
    overallScore,
    recommendation,
    summary,
    criteria,
    createdAt,
    updatedAt,
    "evaluator": evaluator->{
      _id,
      name,
      email
    },
    "application": application->{
      _id,
      status,
      "applicant": applicant->{
        _id,
        name,
        email
      },
      "jobPosition": jobPosition->{
        _id,
        title,
        department
      }
    }
  }`,

  /**
   * Get scorecard by evaluator + application (to check duplicates / allow editing)
   */
  getByEvaluatorAndApplication: `*[_type == "evaluationScorecard" && evaluator._ref == $evaluatorId && application._ref == $applicationId][0] {
    _id,
    overallScore,
    recommendation,
    summary,
    criteria,
    createdAt,
    updatedAt
  }`,

  /**
   * Get average scores across all scorecards for an application
   * Org-scoped via the application's jobPosition organization reference
   */
  getAverageForApplication: `{
    "scorecards": *[_type == "evaluationScorecard" && application._ref == $applicationId && application->jobPosition->organization._ref == $orgId] {
      overallScore,
      recommendation,
      "evaluator": evaluator->{name}
    },
    "count": count(*[_type == "evaluationScorecard" && application._ref == $applicationId && application->jobPosition->organization._ref == $orgId])
  }`,
};
