
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
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const PROFILES = "/uploads/profiles"
const MYVIDEOS = "/:id/myvideos";

// Videos

const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/edit-video";
const DELETE_VIDEO = "/:id/delete";
const VIEW = "/:id/view";

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
            return USERS + "/" + id + EDIT_PROFILE;
        }
        else{
            return "/:id" + EDIT_PROFILE;
        }
    },
    changePassword: CHANGE_PASSWORD,
    profile: PROFILES,
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
            return VIDEOS + "/" + id + EDIT_VIDEO;
        }
        else{
            return "/:id" + EDIT_VIDEO;
        }
    },
    deleteVideo: DELETE_VIDEO,
    view: VIEW
};

export default routes;