export function FreelancerPagePlaceholder({ title, description }) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-slate-600">{description}</p>
    </section>
  );
}
