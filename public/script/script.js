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

const saveValue = function(element) {
    var id = element.id;
    var val = element.value;

    localStorage.setItem(id, val);
}

const getSavedValue = function(id) {
    if(!localStorage.getItem(id)){
        return ""
    }

    return localStorage.getItem(id);
}