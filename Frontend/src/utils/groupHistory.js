export function groupHistory(videos) {
    const groups = {
        Today: [],
        Yesterday: [],
        "Last 7 Days": [],
        Older: [],
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    videos.forEach((video) => {
        const watchedDate = new Date(video.createdAt);
        watchedDate.setHours(0, 0, 0, 0);

        if (watchedDate.getTime() === today.getTime()) {
            groups.Today.push(video);
        } else if (watchedDate.getTime() === yesterday.getTime()) {
            groups.Yesterday.push(video);
        } else if (watchedDate >= lastWeek) {
            groups["Last 7 Days"].push(video);
        } else {
            groups.Older.push(video);
        }
    });

    return Object.entries(groups).filter(
        ([, videos]) => videos.length > 0
    );
}