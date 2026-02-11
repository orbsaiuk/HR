export const responsesQueries = {
  getByFormId: `*[_type == "response" && form._ref == $formId] | order(submittedAt desc) {
    _id,
    _type,
    form->{_id, title},
    user->{_id, name, email},
    answers,
    submittedAt,
    updatedAt,
    status,
    statusNote,
    rejectionReason
  }`,

  getById: `*[_type == "response" && _id == $id][0] {
    _id,
    _type,
    form->{_id, title, fields},
    user->{_id, name, email},
    answers,
    submittedAt,
    updatedAt,
    status,
    statusNote,
    rejectionReason
  }`,

  getByUserId: `*[_type == "response" && user._ref == $userId] | order(submittedAt desc) {
    _id,
    _type,
    form->{_id, title},
    user->{_id, name, email},
    answers,
    submittedAt,
    updatedAt,
    status,
    statusNote,
    rejectionReason,
    statusUpdated,
    statusViewed
  }`,

  getAllByFormId: `*[_type == "response" && form._ref == $formId]`,
};
