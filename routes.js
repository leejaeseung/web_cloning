
// Global

const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";
const CHECK_ID = "/check-id";
const CHECK_EMAIL = "/check-email"
const CONFIRM_EMAIL = "/confirm-email"

// Users

const USERS = "/users";
const USERS_DETAIL = "/:id";
const EDIT_PROFILE = "/:id/edit-profile";
const MYVIDEOS = "/:id/myvideos";

// Videos

const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit-video";
const DELETE_VIDEO = "/:id";
const VIEW = "/:id/view";
//const EDIT_COMMENT = "/:vid/:cid/edit";
const DELETE_COMMENT = "/:vid/:cid";

// Object

const routes = {
    home: HOME,
    join: JOIN,
    login: LOGIN,
    logout: LOGOUT,
    search: SEARCH,
    checkId: CHECK_ID,
    checkEmail: CHECK_EMAIL,
    confirmEmail: CONFIRM_EMAIL,
    users: USERS,
    userDetail: (id) => {
        if (id) {
            return USERS + "/" + id;
        }
        else{
            return USERS_DETAIL;
        }
    },
    myVideos: (id) => {
        if (id) {
            return USERS + "/" + id + "/myvideos";
        }
        else{
            return MYVIDEOS;
        }
    },
    editProfile: (id) => {
        if (id) {
            return USERS + "/" + id + "/edit-profile";
        }
        else{
            return EDIT_PROFILE;
        }
    },
    videos: VIDEOS,
    upload: UPLOAD,
    videoDetail: (id) => {
        if (id) {
            return VIDEOS  + "/" + id;
        }
        else{
            return VIDEO_DETAIL;
        }
    },
    editVideo: (id) => {
        if(id) {
            return VIDEOS + "/" + id + "/edit-video";
        }
        else{
            return EDIT_VIDEO;
        }
    },
    deleteVideo: (id) => {
        if (id) {
            return VIDEOS  + "/" + id;
        }
        else{
            return DELETE_VIDEO;
        }
    },
    view: VIEW,
    deleteComment: (vid, cid) => {
        if(vid && cid)
            return VIDEOS + "/" + vid + "/" + cid;
        else    
            return DELETE_COMMENT; 
    }

};

export default routes;