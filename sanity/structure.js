/**
 * Sanity Studio Structure
 *
 * Organized by domain for better navigation:
 * - Team & Users: Team members, users, and invites
 * - Forms: Form management
 * - Recruitment: Job positions, applications, and evaluations
 * - Messaging: Conversations and messages
 */

export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      // Team & Users Group
      S.listItem()
        .title("Team & Users")
        .icon(() => "👥")
        .child(
          S.list()
            .title("Team & Users")
            .items([
              S.listItem()
                .title("Team Members")
                .icon(() => "🧑‍💼")
                .child(S.documentTypeList("teamMember").title("Team Members")),

              S.listItem()
                .title("Users")
                .icon(() => "👤")
                .child(S.documentTypeList("user").title("Users")),

              S.listItem()
                .title("Team Invites")
                .icon(() => "✉️")
                .child(S.documentTypeList("teamMemberInvite").title("Team Invites")),
            ])
        ),

      // Forms Group
      S.listItem()
        .title("Forms")
        .icon(() => "📝")
        .child(S.documentTypeList("form").title("Forms")),

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
                .child(S.documentTypeList("jobPosition").title("Job Positions")),

              S.listItem()
                .title("Applications")
                .icon(() => "📄")
                .child(S.documentTypeList("application").title("Applications")),

              S.listItem()
                .title("Evaluation Scorecards")
                .icon(() => "⭐")
                .child(S.documentTypeList("evaluationScorecard").title("Evaluation Scorecards")),
            ])
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
                .child(S.documentTypeList("conversation").title("Conversations")),

              S.listItem()
                .title("Messages")
                .icon(() => "📩")
                .child(S.documentTypeList("message").title("Messages")),
            ])
        ),
    ]);
