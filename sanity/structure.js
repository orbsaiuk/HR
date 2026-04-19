/**
 * Sanity Studio Structure
 *
 * Organized by domain for better navigation:
 * - Platform Admin: Organization requests (pending/approved/rejected)
 * - Organizations: All organizations
 * - Team & Users: Team members, users, and invites
 * - Forms: Form management
 * - Recruitment: Job positions, applications, and evaluations
 * - Messaging: Conversations and messages
 */

export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      // Platform Admin Group
      S.listItem()
        .title("Platform Admin")
        .icon(() => "🛡️")
        .child(
          S.list()
            .title("Platform Admin")
            .items([
              S.listItem()
                .title("Organization Requests")
                .icon(() => "📋")
                .child(
                  S.list()
                    .title("Organization Requests")
                    .items([
                      S.listItem()
                        .title("Pending Requests")
                        .icon(() => "⏳")
                        .child(
                          S.documentTypeList("organizationRequest")
                            .title("Pending Requests")
                            .filter(
                              '_type == "organizationRequest" && status == "pending"',
                            ),
                        ),

                      S.listItem()
                        .title("Approved Requests")
                        .icon(() => "✅")
                        .child(
                          S.documentTypeList("organizationRequest")
                            .title("Approved Requests")
                            .filter(
                              '_type == "organizationRequest" && status == "approved"',
                            ),
                        ),

                      S.listItem()
                        .title("Rejected Requests")
                        .icon(() => "❌")
                        .child(
                          S.documentTypeList("organizationRequest")
                            .title("Rejected Requests")
                            .filter(
                              '_type == "organizationRequest" && status == "rejected"',
                            ),
                        ),

                      S.divider(),

                      S.listItem()
                        .title("All Requests")
                        .icon(() => "📄")
                        .child(
                          S.documentTypeList("organizationRequest").title(
                            "All Organization Requests",
                          ),
                        ),
                    ]),
                ),

              S.listItem()
                .title("All Organizations")
                .icon(() => "🏢")
                .child(
                  S.documentTypeList("organization").title("Organizations"),
                ),
            ]),
        ),

      S.divider(),

      // Users Group
      S.listItem()
        .title("Users")
        .icon(() => "👤")
        .child(S.documentTypeList("user").title("Users")),

      // Forms Group
      S.listItem()
        .title("Forms")
        .icon(() => "📝")
        .child(S.documentTypeList("form").title("Forms")),

      // Contracts Group
      S.listItem()
        .title("Contracts")
        .icon(() => "📑")
        .child(S.documentTypeList("contract").title("Contracts")),

      // Recruitment Group
      S.listItem()
        .title("Recruitment")
        .icon(() => "💼")
        .child(
          S.list()
            .title("Recruitment")
            .items([
              S.listItem()
                .title("Job Positions")
                .icon(() => "📋")
                .child(
                  S.documentTypeList("jobPosition").title("Job Positions"),
                ),

              S.listItem()
                .title("Applications")
                .icon(() => "📄")
                .child(S.documentTypeList("application").title("Applications")),

              S.listItem()
                .title("Evaluation Scorecards")
                .icon(() => "⭐")
                .child(
                  S.documentTypeList("evaluationScorecard").title(
                    "Evaluation Scorecards",
                  ),
                ),
            ]),
        ),

      // Messaging Group
      S.listItem()
        .title("Messaging")
        .icon(() => "💬")
        .child(
          S.list()
            .title("Messaging")
            .items([
              S.listItem()
                .title("Conversations")
                .icon(() => "💭")
                .child(
                  S.documentTypeList("conversation").title("Conversations"),
                ),

              S.listItem()
                .title("Messages")
                .icon(() => "📩")
                .child(S.documentTypeList("message").title("Messages")),
            ]),
        ),
    ]);
