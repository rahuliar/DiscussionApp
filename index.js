// New question logic 

// elements 

//index
let index = 0;
let responseIndex = 0;
//localstrorage elements
var tempIndex = -1;
var str = JSON.parse(localStorage.getItem("objects")) || [];
var responseStr = JSON.parse(localStorage.getItem("responses")) || [];

//body elements
let submit = document.getElementById("submit");
let questionSubjectElement = document.getElementById("questionSubject");
let questionElement = document.getElementById("question");

let mainSection1 = document.getElementById("questionDiv");
let newQueSection = document.getElementById("mainSection2NewQuestionSection");
let newQuesBtn = document.getElementById("newQuesBtn");
let resolveBtn = document.getElementById("resolve");

let responseSection = document.getElementById("mainSection2ResponseSection");
let responseSubject = document.getElementById("responseSubject");
let responseQuestion = document.getElementById("responseQuestion");
let idChecker = document.getElementById("idChecker");
let responserName = document.getElementById("responserName");
let responsePara = document.getElementById("responsePara");
let responseSubmit = document.getElementById("responseSubmit");
let responseShowingDiv = document.getElementById("responseShowingDiv")

//liking
let thumbsUp = document.getElementById("thumbsUp");
let thumbsDown = document.getElementById("thumbsDown");

//question search
let searchQuestion = document.getElementById("searchQuestion");




//functions
//reload function

//like count sort logic

function sortOnBasisOfLikeCount() {
    let startingTemp = str.sort((a, b) => {
        return (b.likes - b.dislike) - (a.likes - a.dislike);
    })
    str = startingTemp;
}

// create quesion logic
function strElementCreation() {
    mainSection1.innerHTML = "";
    str.forEach((data) => {
        createQuestion(data);
    })
    changeTime(str);
}

sortOnBasisOfLikeCount();

if (str != []) {
    str.forEach((question) => {
        createQuestion(question);
        if (question.id > tempIndex) {
            tempIndex = question.id;
        }
    })
    index = tempIndex + 1;
}

// like count sorted logic function


if (responseStr != []) {
    responseStr.forEach((data) => {
        responseIndex = data.response_id + 1;
    })
}

// new question window btn logic

newQuesBtn.addEventListener("click", () => {
    newQuestionOpenFunction()
})

function newQuestionOpenFunction() {
    newQueSection.style.display = "flex";
    responseSection.style.display = "none";
    document.documentElement.scrollTop = 0;
}

//new question submit logic

submit.addEventListener("click", () => {
    if (questionSubjectElement.value != "" && questionElement.value != "" && questionElement.value.replace(/\s/g, '').length && questionSubjectElement.value.replace(/\s/g, '').length) {

        let timeNow = new Date();
        let questions = {
            id: null,
            subject: null,
            que: null,
            likes: 0,
            dislike: 0,
            time: timeNow.getTime(),
        }
        questions.id = index++;
        questions.subject = questionSubjectElement.value;
        questions.que = questionElement.value;
        questionSubjectElement.value = "";
        questionElement.value = "";
        createQuestion(questions);
        storingStringInLocalStorage(questions);
    } else {
        alert("fill both the input section");
    }
})

//create question div logic

function createQuestion(questions) {
    let temp = document.createElement("div");
    let tempQueSubject = document.createElement("h3");
    let tempQue = document.createElement("P");
    let timeElement = document.createElement("p")
    let timeElementSpan1 = document.createElement('span')
    let timeElementSpan2 = document.createElement('span')
    timeElementSpan1.innerHTML = 'Created ';
    timeElementSpan2.id = questions.id;
    let timeElementSpan3 = document.createElement('span')
    timeElementSpan3.innerHTML = ' before'

    timeElement.append(timeElementSpan1, timeElementSpan2, timeElementSpan3);
    tempQueSubject.innerText = questions.subject;
    tempQue.innerText = questions.que;
    temp.append(tempQueSubject, tempQue, timeElement);
    temp.classList.add("m-2", "border-bottom", "border-dark");
    mainSection1.appendChild(temp);

    //question click logic

    temp.addEventListener('click', () => {
        newQueSection.style.display = "none";
        responseSection.style.display = "block";
        setResponseWindowAttribute(questions);
        findResponse(questions.id);
        document.documentElement.scrollTop = 0;
        responserName.value = "";
        responsePara.value = "";
    })
}

// time ago ligic
function changeTime(str){
    setInterval(function () {
    str.forEach((questions)=>{
        let timeElementSpan2=document.getElementById(questions.id);
    let timeNow = new Date();
    let timenow = timeNow.getTime();
    let secondshappend = Math.round((timenow - parseInt(questions.time)) / 1000);
    if (secondshappend < 60) {
        timeElementSpan2.innerHTML = secondshappend + ' seconds';
    } else if (secondshappend > 60 && secondshappend < 3600) {
        timeElementSpan2.innerHTML = Math.round(secondshappend / 60) + ' minutes';
    } else if (secondshappend > 3600 && secondshappend < 86400) {
        timeElementSpan2.innerHTML = Math.round((secondshappend / 60) / 60) + ' hours';
    } else if (secondshappend > 86400) {
        timeElementSpan2.innerHTML = Math.round(((secondshappend / 60) / 60) / 24) + ' days';
    }
    secondshappend++;
    })
}, 1000);
}

changeTime(str);

//localstorage storing logic

function storingStringInLocalStorage(questions) {
    str.push(questions)
    localStorage.setItem("objects", JSON.stringify(str));
}

//localstorage response storing logic

function responseStoringInLocalStorage(responseObj) {
    responseStr.push(responseObj)
    localStorage.setItem("responses", JSON.stringify(responseStr));
}

//response tab element sets logic

function setResponseWindowAttribute(questions) {
    responseSubject.innerHTML = questions.subject;
    responseQuestion.innerHTML = questions.que;
    thumbsUp.innerHTML = questions.likes;
    thumbsDown.innerHTML = questions.dislike;
    responseSubject.parentElement.value = questions.id;
    resolveBtn.value = questions.id;
    idChecker.value = questions.id;
}

//responses logic

responseSubmit.addEventListener("click", () => {
    if (responserName.value != "" && responsePara.value != "" && responsePara.value.replace(/\s/g, '').length && responserName.value.replace(/\s/g, '').length) {
        let responseObj = {
            response_id: null,
            question_id: null,
            responser_name: null,
            response_para: null
        }
        responseObj.response_id = responseIndex;
        responseObj.question_id = idChecker.value;
        responseObj.responser_name = responserName.value;
        responseObj.response_para = responsePara.value;
        responserName.value = "";
        responsePara.value = "";
        responseStoringInLocalStorage(responseObj);
        findResponse(responseObj.question_id);
        responseIndex++;
    } else {
        alert("fill both the input section of response");
    }
})

//create response logic

function findResponse(val) {
    let countResponses = 0;
    responseShowingDiv.innerHTML = "";
    responseStr.forEach((data) => {
        if (data.question_id == val) {
            createResponse(data);
            countResponses++;
        }
    })
    if (countResponses == 0) {
        responseShowingDiv.innerHTML = "No response";
    }
}

function createResponse(data) {
    let restemp = document.createElement("div");
    let respName = document.createElement("h6")
    let respPara = document.createElement("p");
    respName.innerText = data.responser_name
    respPara.innerText = data.response_para
    restemp.append(respName, respPara);
    restemp.classList.add("p-3", "mt-1");
    restemp.style.backgroundColor = "whitesmoke";
    responseShowingDiv.appendChild(restemp);
}



// resolve button logic

resolveBtn.addEventListener("click", () => {
    deleteQue(resolveBtn.value);
    deleteRes(resolveBtn.value);
    newQuestionOpenFunction();
    strElementCreation();
})

//delete question and response logic

function deleteQue(val1) {
    let temparr = str.filter((data) => {
        if (data.id != val1) {
            return data;
        }
    })
    str = temparr;
    localStorage.setItem("objects", JSON.stringify(str));
}

function deleteRes(val1) {
    let temparr = responseStr.filter((data) => {
        if (data.question_id != val1) {
            return data;
        }
    })
    responseStr = temparr;
    localStorage.setItem("responses", JSON.stringify(responseStr));
}

//thumbsup logic

thumbsUp.addEventListener("click", () => {
    let temp = parseInt(thumbsUp.innerHTML);
    thumbsUp.innerHTML = temp + 1;
    increaseLikes(thumbsUp.parentElement.value);
})

//thumbsdown downlogic

thumbsDown.addEventListener("click", () => {
    let temp = parseInt(thumbsDown.innerHTML);
    thumbsDown.innerHTML = temp + 1;
    increaseDislike(thumbsDown.parentElement.value);
})

//increase likes in object and storing in localstorage logic

function increaseLikes(val) {
    str.forEach((data) => {
        if (data.id == val) {
            data.likes = data.likes + 1;
            localStorage.setItem("objects", JSON.stringify(str));
            sortOnBasisOfLikeCount();
            strElementCreation();
        }
    })
}

//increase dislikes in object and storing in localstorage logic

function increaseDislike(val) {
    str.forEach((data) => {
        if (data.id == val) {
            data.dislike = data.dislike + 1;
            localStorage.setItem("objects", JSON.stringify(str));
            sortOnBasisOfLikeCount();
            strElementCreation();
        }
    })
}

// search logic

searchQuestion.addEventListener('keyup', () => {
    let sqValue = searchQuestion.value.toLowerCase()
    let tempSearchArr = str.filter((data) => {
        if (data.subject.toLowerCase().includes(sqValue) || data.que.toLowerCase().includes(sqValue)) {
            return data;
        }
    })
    console.log(tempSearchArr);
    mainSection1.innerHTML = "";
    if (tempSearchArr.length == 0) {
        mainSection1.innerHTML = "<h4>no match found :)</h4>"

    } else {
        tempSearchArr.forEach((data) => {
            createQuestion(data);
            changeTime(tempSearchArr);
        })
    }
})
