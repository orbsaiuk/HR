/**
 * Sanity Studio Structure
 *
 * Organized by domain for better navigation.
 * Domains migrated to Supabase (forms, messaging, surveys, audit,
 * recruitment, contracts, api-keys) are no longer shown here.
 *
 * Remaining in Sanity:
 * - Platform Admin: Organization requests
 * - Organizations: All organizations
 * - Users: User profiles and freelancer profiles
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
        .child(
          S.list()
            .title("Users")
            .items([
              S.listItem()
                .title("Users")
                .icon(() => "🧑")
                .child(S.documentTypeList("user").title("Users")),
              S.listItem()
                .title("Freelancer Profiles")
                .icon(() => "🧰")
                .child(
                  S.documentTypeList("freelancerProfile").title(
                    "Freelancer Profiles",
                  ),
                ),
            ]),
        ),
    ]);
