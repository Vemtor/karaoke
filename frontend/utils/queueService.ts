import {SearchedVideo} from "@/components/utils/searchEngine/searchedVideo";

class QueueService {
  private queue: SearchedVideo[] = [];
  private currentTrack = 0;


  private isTrackInQueue(track_id: string): boolean {
    return this.queue.some(t => t.id === track_id);
  }

  addTrackToQueue(searchedVideo: SearchedVideo) {
    if (!this.isTrackInQueue(searchedVideo.id)) {
      this.queue.push(searchedVideo)
    }
  }

  removeFromQueue(trackId: string) {
    this.queue = this.queue.filter((track) => track.id !== trackId);
  }

  clearQueue() {
    this.queue = [];
  }

  getQueue(): SearchedVideo[] {
    return [...this.queue];
  }

  getShiftedQueue(): SearchedVideo[] {
    const firstPart = this.queue.slice(this.currentTrack);
    const secondPart = this.queue.slice(0, this.currentTrack);

    return [...firstPart, ...secondPart];
  }

  getNextTrack(): SearchedVideo {
    this.currentTrack = ++this.currentTrack;
    return this.queue[this.currentTrack];
  }
}

const queueService = new QueueService();
export default queueService;
