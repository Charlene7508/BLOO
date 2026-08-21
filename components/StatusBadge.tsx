import type { MarkerStatus } from "@/lib/analysis/status";

const STYLES: Record<MarkerStatus, { label: string; className: string }> = {
  bas: { label: "En dessous", className: "bg-watch-bg text-watch" },
  haut: { label: "Au-dessus", className: "bg-alert-bg text-alert" },
  normal: { label: "Dans la norme", className: "bg-ok-bg text-ok" },
  inconnu: { label: "Sans norme", className: "bg-sand text-ink-soft" },
};

export default function StatusBadge({
  status,
  marked = false,
}: {
  status: MarkerStatus;
  marked?: boolean;
}) {
  const style = STYLES[status];
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${style.className}`}>
      {style.label}
      {marked ? " nettement" : ""}
    </span>
  );
}
