type RoutingConfigLike = {
  id?: number;
  isActive?: boolean;
};

const sortById = <T extends RoutingConfigLike>(items: T[]): T[] =>
  [...items].sort((a, b) => {
    const aId = typeof a?.id === "number" ? a.id : Number.MAX_SAFE_INTEGER;
    const bId = typeof b?.id === "number" ? b.id : Number.MAX_SAFE_INTEGER;
    return aId - bId;
  });

export const selectCurrentRoutingConfig = <T extends RoutingConfigLike>(
  configs?: Array<T | null | undefined> | null
): T | undefined => {
  const list = (configs ?? []).filter(Boolean) as T[];
  if (!list.length) return undefined;

  const active = list.filter((item) => item?.isActive === true);
  if (active.length) return sortById(active)[0];

  return sortById(list)[0];
};

