function Forms(method, action, pos, columnCount) {
    initDiv(method, action, pos, columnCount);
    this.id = "form_" + String(formNum - 1);
    this.method = method;
    this.action = action;
    this.columnCount = columnCount;
    this.pos = JSON.parse(JSON.stringify(pos));
}

function addColumn(e) {
    idx = e.path[1].children.length - 4
    str = e.path[1].children[idx].id
    str = str.split("_")
    parentNode = e.path[1].id
    div = document.getElementById(parentNode).parentNode
    var columnCount = Number(formArr[div.lastChild.id].columnCount) + 1
    var originPos = formArr[div.lastChild.id].pos
    removeDiv(div.id);
    var tmp = new Forms("POST", "#", originPos, columnCount);
    formArr[tmp.id] = tmp;
}

function initDiv(method, action, pos, columnCount) {
    div = document.createElement('div');
    div.setAttribute("id", 'div_' + formNum);
    form = setForm(method, action, columnCount);

    div.appendChild(form);

    div = setDivPos(div, pos);

    formNum += 1
    document.getElementsByClassName("blog-post")[0].appendChild(div);
}

function removeDiv(parentNodeId) {
    var div = document.getElementById(parentNodeId);
    delete formArr[div.lastChild.id]
    div.remove();
}

function setForm(method, action, columnCount) {
    var tmpInput = document.createElement('input');
    tmpInput.setAttribute("type", "text");
    tmpInput.setAttribute("id", 'newForm' + formNum + "_tblName_" + formNum);
    tmpInput.setAttribute("placeholder", " Table Name");
    div.appendChild(tmpInput);
    // form.appendChild(document.createElement("br"))

    exitBtn = document.createElement("input");
    exitBtn.setAttribute("type", "button");
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
        tmpInput = document.createElement('input');
        tmpInput.setAttribute("type", "text");
        tmpInput.setAttribute("id", 'newForm' + formNum + "_colName_" + i);
        tmpInput.setAttribute("placeholder", " Column Name_" + i);

        form.appendChild(tmpInput);
        tmpInput = document.createElement('input');
        tmpInput.setAttribute("type", "text");
        tmpInput.setAttribute("id", 'newForm' + formNum + "_colAttribute_" + i);
        tmpInput.setAttribute("placeholder", " Column Attr_" + i);

        form.appendChild(tmpInput);

        form.appendChild(document.createElement("br"))
    }
    var btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("id", 'newForm' + formNum + "_btn");
    btn.addEventListener("click", addColumn)
    btn.setAttribute("value", "add");
    form.appendChild(btn);
    form.appendChild(document.createElement("br"))
    return form;
}

function setDivPos(div, pos) {
    div.style.position = 'absolute';
    div.style.left = pos.x + "px"
    div.style.top = pos.y + "px"
    div.style.border = "2px solid gray"
    //div.style.width = pos.width + "px";
    //div.style.height = pos.height + "px";
    div.oncontextmenu = function (e) { e.preventDefault(); };
    return div
}