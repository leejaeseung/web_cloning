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

const clearStorage = function(cert_ID, cert_Email) {
    //인증이 완료된 애들은 지우지 않음

    console.log(cert_ID);
    console.log(cert_Email);
    console.log(localStorage);

    if(!cert_ID)
        localStorage.removeItem("userName");
    if(!cert_Email)
        localStorage.removeItem("email");

}