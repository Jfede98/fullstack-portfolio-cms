import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Video } from "@shared-ui/components/video";

describe("Video component", () => {
  describe("YouTube videos", () => {
    it("renders an iframe for YouTube watch URLs", () => {
      render(<Video url="https://www.youtube.com/watch?v=9bZkp7q19f0" />);

      const iframe = document.querySelector("iframe");
      expect(iframe).toBeDefined();
      expect(iframe?.getAttribute("src")).toContain(
        "https://www.youtube.com/embed/9bZkp7q19f0"
      );
    });

    it("renders an iframe for youtu.be URLs", () => {
      render(<Video url="https://youtu.be/9bZkp7q19f0" />);

      const iframe = document.querySelector("iframe");
      expect(iframe).toBeDefined();
      expect(iframe?.getAttribute("src")).toContain(
        "https://www.youtube.com/embed/9bZkp7q19f0"
      );
    });

    it("renders an iframe for YouTube embed URLs", () => {
      render(<Video url="https://www.youtube.com/embed/9bZkp7q19f0" />);

      const iframe = document.querySelector("iframe");
      expect(iframe).toBeDefined();
      expect(iframe?.getAttribute("src")).toBe(
        "https://www.youtube.com/embed/9bZkp7q19f0"
      );
    });

    it("adds autoplay parameter to YouTube iframe when autoplay is true", () => {
      render(
        <Video url="https://www.youtube.com/watch?v=9bZkp7q19f0" autoplay />
      );

      const iframe = document.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain("autoplay=1");
    });

    it("adds mute parameter to YouTube iframe when muted is true", () => {
      render(
        <Video url="https://www.youtube.com/watch?v=9bZkp7q19f0" muted />
      );

      const iframe = document.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain("mute=1");
    });

    it("adds both autoplay and mute parameters when both are true", () => {
      render(
        <Video
          url="https://www.youtube.com/watch?v=9bZkp7q19f0"
          autoplay
          muted
        />
      );

      const iframe = document.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain("autoplay=1");
      expect(iframe?.getAttribute("src")).toContain("mute=1");
    });

    it("sets allowFullScreen attribute on YouTube iframe", () => {
      render(<Video url="https://www.youtube.com/watch?v=9bZkp7q19f0" />);

      const iframe = document.querySelector("iframe");
      expect(iframe?.hasAttribute("allowfullscreen")).toBe(true);
    });

    it("sets allow attribute with required permissions", () => {
      render(<Video url="https://www.youtube.com/watch?v=9bZkp7q19f0" />);

      const iframe = document.querySelector("iframe");
      const allowAttr = iframe?.getAttribute("allow");
      expect(allowAttr).toContain("accelerometer");
      expect(allowAttr).toContain("autoplay");
      expect(allowAttr).toContain("encrypted-media");
    });
  });

  describe("Direct video URLs", () => {
    it("renders a video element for non-YouTube URLs", () => {
      render(<Video url="https://example.com/video.mp4" />);

      const video = document.querySelector("video");
      expect(video).toBeDefined();
      expect(video?.getAttribute("src")).toBe("https://example.com/video.mp4");
    });

    it("sets controls attribute by default", () => {
      render(<Video url="https://example.com/video.mp4" />);

      const video = document.querySelector("video");
      expect(video?.hasAttribute("controls")).toBe(true);
    });

    it("removes controls when controls prop is false", () => {
      render(<Video url="https://example.com/video.mp4" controls={false} />);

      const video = document.querySelector("video");
      expect(video?.hasAttribute("controls")).toBe(false);
    });

    it("sets autoplay attribute when autoplay is true", () => {
      render(<Video url="https://example.com/video.mp4" autoplay />);

      const video = document.querySelector("video");
      expect(video?.hasAttribute("autoplay")).toBe(true);
    });

    it("sets muted attribute when muted is true", () => {
      render(<Video url="https://example.com/video.mp4" muted />);

      const video = document.querySelector("video") as HTMLVideoElement;
      expect(video?.muted).toBe(true);
    });

    it("renders fallback text inside video element", () => {
      render(<Video url="https://example.com/video.mp4" />);

      const video = document.querySelector("video");
      expect(video?.textContent).toBe("Tu navegador no soporta el elemento de video.");
    });
  });

  describe("Custom styling", () => {
    it("applies custom className.wrapper to YouTube iframe", () => {
      render(
        <Video
          url="https://www.youtube.com/watch?v=9bZkp7q19f0"
          className={{ wrapper: "custom-wrapper" }}
        />
      );

      const iframe = document.querySelector("iframe");
      expect(iframe?.className).toContain("custom-wrapper");
    });

    it("applies custom className.wrapper to video element", () => {
      render(
        <Video
          url="https://example.com/video.mp4"
          className={{ wrapper: "custom-video-class" }}
        />
      );

      const video = document.querySelector("video");
      expect(video?.className).toContain("custom-video-class");
    });

    it("applies default wrapper styles", () => {
      render(<Video url="https://www.youtube.com/watch?v=9bZkp7q19f0" />);

      const iframe = document.querySelector("iframe");
      expect(iframe?.className.length).toBeGreaterThan(0);
    });
  });

  describe("Edge cases", () => {
    it("handles YouTube URLs with additional query parameters", () => {
      render(
        <Video url="https://www.youtube.com/watch?v=9bZkp7q19f0&t=30s" />
      );

      const iframe = document.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain(
        "https://www.youtube.com/embed/9bZkp7q19f0"
      );
      expect(iframe?.getAttribute("src")).not.toContain("t=30s");
    });

    it("handles S3 URLs correctly as direct videos", () => {
      const s3Url =
        "https://my-bucket.s3.amazonaws.com/videos/sample.mp4";
      render(<Video url={s3Url} />);

      const video = document.querySelector("video");
      expect(video).toBeDefined();
      expect(video?.getAttribute("src")).toBe(s3Url);
    });

    it("handles Vimeo URLs as direct videos", () => {
      render(<Video url="https://vimeo.com/123456789" />);

      const video = document.querySelector("video");
      expect(video).toBeDefined();
    });
  });
});



