import { StructureBuilder } from "sanity/structure";

export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      // Team Members
      S.listItem()
        .title("Team Members")
        .icon(() => "🧑‍💼")
        .child(S.documentTypeList("teamMember").title("Team Members")),

      // Users
      S.listItem()
        .title("Users")
        .icon(() => "👤")
        .child(S.documentTypeList("user").title("Users")),

      // Forms
      S.listItem()
        .title("Forms")
        .icon(() => "📝")
        .child(S.documentTypeList("form").title("Forms")),

      // Responses organized by Form
      S.listItem()
        .title("Responses by Form")
        .icon(() => "📊")
        .child(
          // First level: List all forms
          S.documentTypeList("form")
            .title("Select a Form")
            .child((formId) =>
              // Second level: Show responses for selected form
              S.documentList()
                .title("Responses")
                .filter('_type == "response" && form._ref == $formId')
                .params({ formId })
                .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
            ),
        ),

      // All Responses (flat list)
      S.listItem()
        .title("All Responses")
        .icon(() => "📋")
        .child(
          S.documentTypeList("response")
            .title("All Responses")
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
        ),

      // Conversations
      S.listItem()
        .title("Conversations")
        .icon(() => "💬")
        .child(S.documentTypeList("conversation").title("Conversations")),

      // Messages
      S.listItem()
        .title("Messages")
        .icon(() => "✉️")
        .child(S.documentTypeList("message").title("Messages")),

      // Divider
      S.divider(),

      // All other document types (if any)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "teamMember",
            "user",
            "form",
            "response",
            "conversation",
            "message",
          ].includes(listItem.getId()),
      ),
    ]);
