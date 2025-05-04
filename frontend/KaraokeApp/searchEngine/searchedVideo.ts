export class SearchedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;

  constructor(
    id: string,
    title: string,
    description: string,
    thumbnailUrl: string,
    channelTitle: string,
    publishedAt: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.thumbnailUrl = thumbnailUrl;
    this.channelTitle = channelTitle;
    this.publishedAt = publishedAt;
  }
}