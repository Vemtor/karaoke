export interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
}
  
export interface YouTubeSearchItem {
  items: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: { url: string };
      };
      channelTitle: string;
      publishedAt: string;
    };
  }[];
}
