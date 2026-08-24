type SummaryCardProps = {
  label: string;
  value: string;
};


function SummaryCard({
  label,
  value,
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <strong className="mt-2 block text-2xl font-semibold text-slate-900">
        {value}
      </strong>
    </article>
  );
}


export default SummaryCard;