import { SearchedVideo } from "./searchedVideo";
import { YouTubeSearchItem } from "./youtubeSearchResponse";

export const mapToSearchedVideo = (data: YouTubeSearchItem): SearchedVideo[] => {
    return data.items.map(item =>
        new SearchedVideo(
          item.id.videoId,
          item.snippet.title,
          item.snippet.description,
          item.snippet.thumbnails.medium.url,
          item.snippet.channelTitle,
          item.snippet.publishedAt,
        )
      );
    };
