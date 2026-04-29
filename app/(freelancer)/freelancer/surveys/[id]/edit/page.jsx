import { SurveyEditPage } from "@/features/freelancer/surveys";

export const metadata = {
  title: "تعديل استبيان | لوحة المستقل",
  description: "عدّل أسئلة الاستبيان وبياناته",
};

export default async function Page({ params }) {
  const { id } = await params;
  return <SurveyEditPage surveyId={id} />;
}
