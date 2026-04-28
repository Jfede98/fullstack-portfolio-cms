import { VideoStyle } from "@shared-ui/components/video/style";
import type { IVideoProps } from "@shared-ui/interfaces/video";
import type { FC } from "react";
import clsx from "clsx";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@shared-ui/helpers/video";

export const Video: FC<IVideoProps> = ({
  url,
  className,
  autoplay = false,
  controls = true,
  muted = false
}) => {
  const { wrapper } = VideoStyle();

  const isYouTube = isYouTubeUrl(url);

  return (
    <>
      {isYouTube ? (
        <iframe
          className={clsx(wrapper(), className?.wrapper)}
          src={getYouTubeEmbedUrl(url, { autoplay, muted })}
          style={{ border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          className={clsx(wrapper(), className?.wrapper)}
          src={url}
          controls={controls}
          autoPlay={autoplay}
          muted={muted}
        >
          Tu navegador no soporta el elemento de video.
        </video>
      )}
    </>
  );
};
