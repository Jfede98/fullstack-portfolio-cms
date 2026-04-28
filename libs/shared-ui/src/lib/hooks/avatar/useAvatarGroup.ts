import { useMemo } from "react";
import type { IAvatarProps } from "@shared-ui/interfaces/avatar/base";
import type { HookAvatarGroup } from "@shared-ui/interfaces/avatar/group";

export const useAvatarGroup = ({ avatars }: HookAvatarGroup) => {
  const sortedAvatars = useMemo(() => {
    const { active, others } = avatars.reduce<{
      active: unknown[];
      others: unknown[];
    }>(
      (acc, avatar) => {
        if (avatar.active) acc.active.push(avatar);
        else acc.others.push(avatar);
        return acc;
      },
      { active: [], others: [] }
    );

    return [...others, ...active] as IAvatarProps[];
  }, [avatars]);

  return { sortedAvatars };
};
