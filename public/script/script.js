const view = (videoUrl) => {

    videoID = videoUrl.split("/videos/")[1];

    fetch("/videos/" + videoID + "/view", {
        method: "POST"
    });
}

const viewHome = (videoID) => {

    fetch("/videos/" + videoID + "/view", {
        method: "POST"
    });
}