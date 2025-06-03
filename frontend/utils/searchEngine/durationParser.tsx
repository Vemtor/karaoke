export function parseISO8601Duration(isoDuration?: string): number {
    if (!isoDuration) return 0;

    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoDuration.match(regex);

    if (!matches) return 0;

    const hours = parseInt(matches[1] || "0");
    const minutes = parseInt(matches[2] || "0");
    const seconds = parseInt(matches[3] || "0");

    return 3600 * hours + 60 * minutes + seconds;
}