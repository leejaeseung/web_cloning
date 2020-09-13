const addCommentDeleteEvent = (tag, form, type) => {
    const eventAdder = (idx) => {
        tag[idx].addEventListener(type, () => {
        
        form[idx].submit();
        })
    }

    for(var i = 0; i < tag.length; i++){
        eventAdder(i);
    }
}

//답글 입력 박스를 추가하는 함수
const addCommentReplyEvent = (tag, block, type, route, comments) => {
    //comments = 각 댓글들의 정보, parent를 얻기 위해

    const eventAdder = (idx) => {
        const createCommentReply = () => {
            const parent = block[idx];

            const commentForm = document.createElement("form");

            commentForm.className = "comment-input";
            commentForm.action = route;
            commentForm.method = "POST";

            const commentBox = document.createElement("input");

            commentBox.className = "comment-box";
            commentBox.type = "text";
            commentBox.placeholder = "댓글 입력";
            commentBox.name = "comment";

            const buttons = document.createElement("div");
            buttons.className = "buttons";

            const parentBt = document.createElement("input");
            parentBt.type = "hidden";
            parentBt.name = "parent";
            parentBt.value = comments[idx]._id;

            const applyBt = document.createElement("input");
            const cancelBt = document.createElement("input");

            applyBt.className = "button white applyBt";
            applyBt.type = "submit";
            applyBt.value = "확인";


            cancelBt.className = "button white cancelBt";
            cancelBt.type = "button";
            cancelBt.value = "취소";

            cancelBt.addEventListener("click", () => {
                tag[idx].addEventListener(type, createCommentReply, {once: true})
                parent.removeChild(commentForm);
            })

            buttons.appendChild(parentBt);
            buttons.appendChild(applyBt);
            buttons.appendChild(cancelBt);

            commentForm.appendChild(commentBox);
            commentForm.appendChild(buttons);

            parent.appendChild(commentForm);
        }

        tag[idx].addEventListener(type, createCommentReply, {once: true})
    }

    //reply 태그의 개수만큼 이벤트 리스너를 붙여줌.
    for(var i = 0; i < tag.length; i++){
        eventAdder(i);
    }
}

//답글 form을 만들어 return
const makeReplyForm = (commentOwner, comment) => {
    const replyCommentBlock = document.createElement("div");
    replyCommentBlock.className = "replyCommentBlock";

    const commentTitle = document.createElement("div")
    commentTitle.className = "commentTitle"

    const author = document.createElement("div")
    author.className = "author"
    author.textContent = comment.author.userName + "님의 답글"

    const dateBlock = document.createElement("div")
    if(comment.updatedAt){
        dateBlock.className = "updated"
        dateBlock.textContent = comment.updatedAt + " 수정됨"
    }
    else{
        dateBlock.className = "created"
        dateBlock.textContent = comment.createdAt + " 생성됨"
    }

    commentTitle.appendChild(author)
    commentTitle.appendChild(dateBlock)
    
    const textBlock = document.createElement("p")
    textBlock.className = "text"
    if(comment.isDeleted){
        textBlock.textContent = "삭제된 댓글입니다"
    }
    else{
        textBlock.textContent = comment.text
    }

    replyCommentBlock.appendChild(commentTitle)
    replyCommentBlock.appendChild(textBlock)

    //console.log(comment)

    if(commentOwner == comment.author.userName && !comment.isDeleted){
        //댓쓴이이고, 아직 지워지지 않았을 때
        const activeForm = document.createElement("div")
        activeForm.className = "activeForm"

        const route = "/videos/" + comment.videoID + "/comments/" + comment._id

        const editForm = document.createElement("form")
        editForm.className = "editForm"
        editForm.action = route + "?_method=PUT"
        editForm.method = "POST"

        const editBt = document.createElement("a")
        editBt.className = "edit"
        editBt.href = "javascript:;"
        editBt.textContent = "edit"

        editForm.appendChild(editBt)

        const deleteForm = document.createElement("form")
        deleteForm.className = "deleteForm"
        deleteForm.action = route + "?_method=DELETE"
        deleteForm.method = "POST"

        const deleteBt = document.createElement("a")
        deleteBt.className = "delete"
        deleteBt.href = "javascript:;"
        deleteBt.textContent = "delete"

        deleteForm.appendChild(deleteBt)

        deleteBt.addEventListener("click", () => {
            deleteForm.submit()
        })

        activeForm.appendChild(editForm)
        activeForm.appendChild(deleteForm)
        
        replyCommentBlock.appendChild(activeForm)
    }

    return replyCommentBlock
}

//답글을 불러오는 event를 commentBlock마다 붙여줌
const addShowReplyEvent = (tag, parentBlock, type, route, comments, commentOwner) => {

    const eventAdder = (idx) => {

        const showReply = () => {
            const parentId = comments[idx]._id;
            const openReply = tag[idx]
            const replyBlock = parentBlock[idx].parentNode.children[3]
            const childCount = comments[idx].childCount

            openReply.textContent = "답글 " + childCount + "개 숨기기"

            const query = route + "?comment=" + parentId + "&reply=True";

            fetch(query, {method: "GET"}).
            then(res => res.json()).
            then(data => {

                for(var i = 0; i < data.length; i ++ ){
                    parentBlock[idx].appendChild(makeReplyForm(commentOwner, data[i]))
                }
            })
            
            openReply.addEventListener(type, () => {

                if(replyBlock.style.display == ""){
                    replyBlock.style.display = "none"
                    openReply.textContent = "답글 " + childCount + "개 보기"
                }
                else{
                    replyBlock.style.display = ""
                    openReply.textContent = "답글 " + childCount + "개 숨기기"
                }
            })
        }

        tag[idx].addEventListener(type, showReply, {once: true})
    }

    //openReply 태그의 개수만큼 이벤트 리스너를 붙여줌.
    for(var i = 0; i < tag.length; i++){
        eventAdder(i);
    }
}