import { SurveyResponseDetailPage } from "@/features/freelancer/surveys";

export const metadata = {
  title: "تفاصيل رد الاستبيان | لوحة المستقل",
  description: "عرض تفاصيل رد الاستبيان",
};

export default async function Page({ params }) {
  const { id, responseId } = await params;
  return (
    <SurveyResponseDetailPage
      surveyId={id}
      responseId={responseId}
    />
  );
}
