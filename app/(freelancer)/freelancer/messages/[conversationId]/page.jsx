import { FreelancerConversationPage } from "@/features/freelancer/messages";

export default function Page({ params }) {
    return <FreelancerConversationPage conversationId={params.conversationId} />;
}
