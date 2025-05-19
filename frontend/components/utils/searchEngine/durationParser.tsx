<<<<<<< HEAD
export function parseISO8601Duration(isoDuration?: string): string {
    if (!isoDuration) return "0:00";
=======
export function parseISO8601Duration(isoDuration?: string): number {
    if (!isoDuration) return 0;
>>>>>>> develop

    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoDuration.match(regex);

<<<<<<< HEAD
    if (!matches) return "0:00";
=======
    if (!matches) return 0;
>>>>>>> develop

    const hours = parseInt(matches[1] || "0");
    const minutes = parseInt(matches[2] || "0");
    const seconds = parseInt(matches[3] || "0");

<<<<<<< HEAD
    let formatted = "";

    if (hours > 0) {
        formatted += `${hours}:`;
        formatted += `${minutes.toString().padStart(2, '0')}:`;
        formatted += seconds.toString().padStart(2, '0');
    } else {
        formatted += `${minutes}:`;
        formatted += seconds.toString().padStart(2, '0');
    }
    return formatted;
=======
    return 3600 * hours + 60 * minutes + seconds;
>>>>>>> develop
}