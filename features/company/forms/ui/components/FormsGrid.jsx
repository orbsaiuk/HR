import { FormCard } from "./FormCard";

export function FormsGrid({ forms, onAction, isUsingMockData }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {forms.map((form) => (
        <FormCard
          key={form._id}
          form={form}
          onAction={onAction}
          isMock={isUsingMockData}
        />
      ))}
    </div>
  );
}
