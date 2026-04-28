export const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

export const getYouTubeEmbedUrl = (
  videoUrl: string,
  options?: { autoplay?: boolean; muted?: boolean }
): string => {
  let videoId = "";

  if (videoUrl.includes("youtube.com/watch?v=")) {
    videoId = videoUrl.split("v=")[1]?.split("&")[0] || "";
  } else if (videoUrl.includes("youtu.be/")) {
    videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0] || "";
  } else if (videoUrl.includes("youtube.com/embed/")) {
    return videoUrl;
  }

  const params = new URLSearchParams();
  if (options?.autoplay) params.append("autoplay", "1");
  if (options?.muted) params.append("mute", "1");

  return `https://www.youtube.com/embed/${videoId}${params.toString() ? "?" + params.toString() : ""}`;
};

