function Forms(method, action, pos, columnCount) {
    initDiv(method, action, pos, columnCount);
    this.id = "form_" + String(formNum - 1);
    this.method = method;
    this.action = action;
    this.columnCount = columnCount;
    this.pos = JSON.parse(JSON.stringify(pos));

    btns = document.querySelectorAll("span[id*='_moveBtn']");

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("mousedown", moveEvent)
        btns[i].addEventListener("mouseout", moveEvent)
    }
}
var mouseFlag = false
var mouseEvent = null

function moveEvent(e) {
    if (e.which == 1) {
        try {
            div = e.path[1]
        } catch (e) {
            div = composedPath(e.target)
        }
        prevPos = JSON.parse(JSON.stringify(box));
        mouseFlag = true
        mouseEvent = e.path[1]
    }
}

function addColumn(e) {
    idx = e.path[1].children.length - 4
    str = e.path[1].children[idx].id
    str = str.split("_")
    parentNode = e.path[1].id
    div = document.getElementById(parentNode).children
    var columnCount = Number(formArr[div[4].id].columnCount) + 1
    var originPos = formArr[div[4].id].pos;
    removeDiv(div[4].id);
    var tmp = new Forms("POST", "#", originPos, columnCount);
    formArr[tmp.id] = tmp;
}

function saveLocal() {
    var divs = document.querySelectorAll("div[id^='div_']")
    //console.log(formArr);
    test = divs;
    for (var i = 0; i < divs.length; i++) {

    }
}


function deleteColumn(e) {
    var columnCount = Number(formArr[div.lastChild.id].columnCount) - 1
    if (columnCount > 0) {
        idx = e.path[1].children.length - 4
        str = e.path[1].children[idx].id
        str = str.split("_")
        parentNode = e.path[1].id
        div = document.getElementById(parentNode).parentNode
        var originPos = formArr[div.lastChild.id].pos
        removeDiv(div.id);
        var tmp = new Forms("POST", "#", originPos, columnCount);
        formArr[tmp.id] = tmp;
    }
}

function initDiv(method, action, pos, columnCount) {
    div = document.createElement('div');
    div.setAttribute("id", 'div_' + formNum);
    form = setForm(method, action, columnCount);
    div.appendChild(form);

    var btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'newForm' + formNum + "_addBtn");
    btn.setAttribute("class", "btn btn-outline-success");
    btn.addEventListener("click", addColumn)
    btn.setAttribute("value", "add");
    div.appendChild(btn);

    div = setDivPos(div, pos);
    //appendClass(div);

    formNum += 1
    document.getElementsByClassName("blog-post")[0].appendChild(div);
}

function removeDiv(parentNodeId) {
    var div = document.getElementById(parentNodeId);
    delete formArr[parentNodeId]
    div.remove();
}

function setForm(method, action, columnCount) {
    var span = document.createElement("span");
    span.setAttribute("id", "newForm_" + formNum + "_moveBtn");
    //span.setAttribute("onclick","moveEvent(e)");

    var icon = document.createElement("i");
    icon.setAttribute("class", "fas fa-arrows-alt fa-2x");
    span.appendChild(icon);
    div.appendChild(span);
    // moveBtn = document.createElement("input");
    // moveBtn.setAttribute("type", "button");
    // moveBtn.setAttribute("value", "move");
    // moveBtn.setAttribute("class", "fas fa-arrows-alt fa-2x");
    // moveBtn.setAttribute("onclick","moveEvent(e)")
    // moveBtn.setAttribute("id", "newForm_" + formNum + "_moveBtn");
    // div.appendChild(moveBtn);

    var tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id", 'newForm' + formNum + "_tblName_" + formNum);
    tmpInput.setAttribute("placeholder", " Table Name");
    div.appendChild(tmpInput);
    // form.appendChild(document.createElement("br"))

    exitBtn = document.createElement("input");
    exitBtn.setAttribute("type", "button");
    exitBtn.setAttribute("id", 'newForm' + formNum + "_exitBtn");
    exitBtn.setAttribute("class", "btn btn-outline-warning");
    exitBtn.setAttribute("style", "float: right;");
    exitBtn.setAttribute("value", "close");
    exitBtn.setAttribute("onclick", "removeDiv('div_" + formNum + "')")
    div.appendChild(exitBtn);
    div.appendChild(document.createElement("hr"));

    form = document.createElement('form');
    form.id = "form_" + formNum;
    form.method = method;
    form.action = action;

    for (i = 0; i < columnCount; i++) {
        var tmpDiv = document.createElement("div");
        tmpDiv.setAttribute("name", "inputDiv");
        tmpDiv.setAttribute("class", "row");
        tmpInput = document.createElement('input');
        tmpInput.setAttribute("type", "text");
        //tmpInput.setAttribute("class", "form-control");
        tmpInput.setAttribute("id", 'newForm' + formNum + "_colName_" + i);
        tmpInput.setAttribute("placeholder", " Column Name_" + i);
        tmpDiv.appendChild(tmpInput);

        tmpInput = document.createElement('input');
        tmpInput.setAttribute("type", "text");
        //tmpInput.setAttribute("class", "form-control");
        tmpInput.setAttribute("id", 'newForm' + formNum + "_colAttribute_" + i);
        tmpInput.setAttribute("placeholder", " Column Attr_" + i);

        tmpDiv.appendChild(tmpInput);

        var btn = document.createElement('input');
        btn.setAttribute("type", "button");
        btn.setAttribute("id", 'newForm' + formNum + "_delBtn_" + i);
        btn.setAttribute("class", "btn btn-outline-danger");
        btn.addEventListener("click", deleteColumn)
        btn.setAttribute("value", "delete");
        tmpDiv.appendChild(btn);
        form.appendChild(tmpDiv);
    }

    //div.appendChild(form);
    //form.appendChild(document.createElement("br"))
    return form;
}

function setDivPos(div, pos) {
    div.style.position = 'absolute';
    div.style.left = pos.x + "px"
    div.style.top = pos.y + "px"
    div.style.border = "2px solid gray"
    div.oncontextmenu = function (e) { e.preventDefault(); };
    return div
}