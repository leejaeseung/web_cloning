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

/*const saveValue = function(element) {
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

}*/

//input 경고 메세지를 Server에서 받아와 "태그 이름"-msg 형태로 만들어 출력함.
function verifySubmit(route, obj){
    const box = document.getElementById(obj);
    const value = box.value;

    var object = {};
    object[obj] = value;

    return new Promise(resolve => {fetch(route, { method: "POST" ,
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(object)
    }).then(response => response.json())
    .then(data => {
        var msg_tag = document.getElementById(data.tag);

        msg_tag.textContent = data.msg
        msg_tag.style.color = data.color
        if(data.color == "green" && obj == "email"){
            if(!document.getElementById("code")){
                console.log("리턴됨")
                resolve(createCodeForm())
            }
        }        
    })
})
}

async function createCodeForm(){
    const newBoxes = document.createElement("div");
    newBoxes.className = "edit-input";

    newBoxes.setAttribute("style", "margin-top: 5px;");

    const codeInput = document.createElement("input");
    //Code 입력 창

    codeInput.type = "text";
    codeInput.placeholder = "Code를 입력하세요.";
    codeInput.id = "code";
    codeInput.required = true;

    const verifyBt = await document.createElement("input");
    //인증 확인 버튼

    verifyBt.type = "button";
    verifyBt.id = "codeBt";
    
    verifyBt.value = "인증 확인";

    verifyBt.addEventListener("click", () => {
        verifySubmit( "/confirm-email" , 'code');
    })

    newBoxes.appendChild(codeInput);
    newBoxes.appendChild(verifyBt);

    document.getElementById("email-box").setAttribute("style", "height: 50%;")
    const target = document.getElementById("email-input");
    //이메일 폼

    target.appendChild(newBoxes);

    return verifyBt;
}

function joinChecker(route, obj){
    const form = document.getElementById(obj);

    const object = {
        userName: form.elements["userName"].value,
        email: form.elements["email"].value,
        password1: form.elements["password1"].value,
        password2: form.elements["password2"].value
    }

    fetch(route, { method: "POST" ,
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(object)
    }).then(response => response.json())
    .then(data => {
        if(data){
            var msg_tag = document.getElementById(data.tag);

            msg_tag.textContent = data.msg
            msg_tag.style.color = data.color
        }
        else{
            //홈으로 이동
            window.location.href = "/";
        }
    })

}