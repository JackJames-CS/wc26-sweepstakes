import { ownerOf } from "../config/participants";

export function OwnerBadge({ team }: { team: string }) {
  const owner = ownerOf(team);
  if (!owner) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: owner.colour }}
    >
      {owner.name}
    </span>
  );
}
