import { SurveyResponsesPage } from "@/features/freelancer/surveys";

export const metadata = {
  title: "ردود الاستبيان | لوحة المستقل",
  description: "عرض ردود الاستبيان",
};

export default async function Page({ params }) {
  const { id } = await params;
  return <SurveyResponsesPage surveyId={id} />;
}
