import { type FC } from "react";
import type { IAvatarGroupProps } from "@shared-ui/interfaces/avatar/group";
import { AvatarGroupStyles } from "./style";
import { Avatar } from "@shared-ui/components/avatar/base";
import { useAvatarGroup } from "@shared-ui/hooks/avatar/useAvatarGroup";
import clsx from "clsx";

export const AvatarGroup: FC<IAvatarGroupProps> = ({
  className,
  avatars,
  size,
  border,
  animation
}) => {
  const { base, wrapper } = AvatarGroupStyles({ size, animation });
  const { sortedAvatars } = useAvatarGroup({ avatars });

  return (
    <div className={clsx(base(), className?.base)} data-testid="avatar-group-container">
      {sortedAvatars.map((avatar, idx) => (
        <div
          key={idx}
          className={clsx(wrapper(), className?.wrapper)}
          style={{ zIndex: idx }}
          data-testid="avatar-group-wrapper"
        >
          <Avatar {...avatar} size={size} border={border} />
        </div>
      ))}
    </div>
  );
};
