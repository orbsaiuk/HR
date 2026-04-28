import { FREELANCER_CONTRACT_STATUS, FREELANCER_CONTRACT_STATUS_LABELS } from "../model/freelancerContractSchema";

const STATUS_STYLES = {
  [FREELANCER_CONTRACT_STATUS.RECEIVED]: {
    bg:   "bg-amber-50",
    text: "text-amber-700",
    dot:  "bg-amber-500",
  },
  [FREELANCER_CONTRACT_STATUS.ACCEPTED]: {
    bg:   "bg-emerald-50",
    text: "text-emerald-700",
    dot:  "bg-emerald-500",
  },
  [FREELANCER_CONTRACT_STATUS.DECLINED]: {
    bg:   "bg-red-50",
    text: "text-red-700",
    dot:  "bg-red-500",
  },
  [FREELANCER_CONTRACT_STATUS.EXPIRED]: {
    bg:   "bg-slate-100",
    text: "text-slate-500",
    dot:  "bg-slate-400",
  },
};

const DEFAULT_STYLE = {
  bg:   "bg-slate-100",
  text: "text-slate-500",
  dot:  "bg-slate-400",
};

/**
 * @param {{ status: string }} props
 */
export function ContractStatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? DEFAULT_STYLE;
  const label = FREELANCER_CONTRACT_STATUS_LABELS[status] ?? status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}
