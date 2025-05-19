export class SearchedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  videoUrl: string;
  rawDuration?: string;
<<<<<<< HEAD
  formattedDuration?: string;
=======
  formattedDuration?: number;
>>>>>>> develop

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
    this.videoUrl = `https://www.youtube.com/watch?v=${id}`;
  }
}
