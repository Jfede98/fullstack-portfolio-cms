import type { Meta, StoryObj } from "@storybook/react-vite";
import { Video } from "../../lib/components/video";

const description = `Componente de video que soporta URLs de YouTube y videos directos (S3, etc.)`;

const meta = {
  component: Video,
  title: "Layout/Video",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  parameters: {
    docs: {
      description: {
        component: description
      }
    },
    backgrounds: {
      default: "light"
    }
  },
  argTypes: {
    url: {
      control: "text",
      description: "URL del video (YouTube o enlace directo)"
    },
    autoplay: {
      control: "boolean",
      description: "Reproducir automáticamente el video"
    },
    controls: {
      control: "boolean",
      description: "Mostrar controles del video"
    },
    muted: {
      control: "boolean",
      description: "Silenciar el video"
    }
  }
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YouTubeVideo: Story = {
  args: {
    url: "https://www.youtube.com/watch?v=tTVhWWv54n8"
  }
};

export const YouTubeShortUrl: Story = {
  args: {
    url: "https://youtu.be/tTVhWWv54n8"
  }
};

export const YouTubeWithAutoplay: Story = {
  args: {
    url: "https://www.youtube.com/watch?v=tTVhWWv54n8",
    autoplay: true,
    muted: true
  }
};

export const DirectVideoUrl: Story = {
  args: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  }
};

export const DirectVideoWithAutoplay: Story = {
  args: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    autoplay: true,
    muted: true,
    controls: true
  }
};

export const Default: Story = {
  args: {
    url: "https://www.youtube.com/watch?v=tTVhWWv54n8"
  }
};
