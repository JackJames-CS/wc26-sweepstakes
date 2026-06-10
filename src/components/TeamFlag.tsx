import { TEAM_BY_NAME } from "../data/teams";

export function TeamFlag({
  team,
  size = 20,
  className = "",
}: {
  team: string;
  size?: number;
  className?: string;
}) {
  const t = TEAM_BY_NAME.get(team);
  if (!t) {
    return (
      <span
        className={`inline-block rounded-sm bg-edge text-center ${className}`}
        style={{ width: size, height: size * 0.75, fontSize: size * 0.5 }}
      >
        ?
      </span>
    );
  }
  return (
    <img
      src={t.flag}
      alt={`${t.name} flag`}
      width={size}
      height={size * 0.75}
      loading="lazy"
      className={`inline-block rounded-sm object-cover ${className}`}
      style={{ width: size, height: size * 0.75 }}
    />
  );
}
