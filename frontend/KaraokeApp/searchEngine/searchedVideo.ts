export class SearchedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;

  constructor(
    id: string,
    title: string,
    description: string,
    thumbnailUrl: string,
    channelTitle: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.thumbnailUrl = thumbnailUrl;
    this.channelTitle = channelTitle;
  }
}
