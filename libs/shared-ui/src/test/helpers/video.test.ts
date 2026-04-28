import { describe, it, expect } from "vitest";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "../../lib/helpers/video";

describe("isYouTubeUrl", () => {
  it("detects youtube.com URLs", () => {
    expect(isYouTubeUrl("https://www.youtube.com/watch?v=9bZkp7q19f0")).toBe(
      true
    );
  });

  it("detects youtu.be URLs", () => {
    expect(isYouTubeUrl("https://youtu.be/9bZkp7q19f0")).toBe(true);
  });

  it("detects youtube.com/embed URLs", () => {
    expect(isYouTubeUrl("https://www.youtube.com/embed/9bZkp7q19f0")).toBe(
      true
    );
  });

  it("returns false for non-YouTube URLs", () => {
    expect(isYouTubeUrl("https://vimeo.com/123456")).toBe(false);
    expect(isYouTubeUrl("https://example.com/video.mp4")).toBe(false);
  });
});

describe("getYouTubeEmbedUrl", () => {
  it("converts watch URL to embed format", () => {
    const url = "https://www.youtube.com/watch?v=9bZkp7q19f0";
    const result = getYouTubeEmbedUrl(url);
    expect(result).toBe("https://www.youtube.com/embed/9bZkp7q19f0");
  });

  it("converts youtu.be URL to embed format", () => {
    const url = "https://youtu.be/9bZkp7q19f0";
    const result = getYouTubeEmbedUrl(url);
    expect(result).toBe("https://www.youtube.com/embed/9bZkp7q19f0");
  });

  it("keeps embed URL unchanged", () => {
    const url = "https://www.youtube.com/embed/9bZkp7q19f0";
    const result = getYouTubeEmbedUrl(url);
    expect(result).toBe(url);
  });

  it("adds autoplay parameter when specified", () => {
    const url = "https://www.youtube.com/watch?v=9bZkp7q19f0";
    const result = getYouTubeEmbedUrl(url, { autoplay: true });
    expect(result).toBe("https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1");
  });

  it("adds mute parameter when specified", () => {
    const url = "https://www.youtube.com/watch?v=9bZkp7q19f0";
    const result = getYouTubeEmbedUrl(url, { muted: true });
    expect(result).toBe("https://www.youtube.com/embed/9bZkp7q19f0?mute=1");
  });

  it("adds multiple parameters", () => {
    const url = "https://www.youtube.com/watch?v=9bZkp7q19f0";
    const result = getYouTubeEmbedUrl(url, { autoplay: true, muted: true });
    expect(result).toContain("autoplay=1");
    expect(result).toContain("mute=1");
  });

  it("handles URLs with additional query parameters", () => {
    const url = "https://www.youtube.com/watch?v=9bZkp7q19f0&t=30s";
    const result = getYouTubeEmbedUrl(url);
    expect(result).toBe("https://www.youtube.com/embed/9bZkp7q19f0");
  });
});

